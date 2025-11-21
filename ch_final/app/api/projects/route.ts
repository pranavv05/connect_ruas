import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { getUserDisplayInfo } from '@/lib/user-utils'
import getPrismaClient from '@/lib/db'
import { ensureUserExists } from '@/lib/user-creation'
import { updateUserWithRealData } from '@/lib/user-data-updater'

// GET /api/projects - Get projects the user is part of or can discover
export async function GET(req: Request) {
  try {
    // Get the authenticated user
    const { userId } = getAuth(req as any);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the prisma client
    const prisma = await getPrismaClient();
    
    // Get the limit and type parameters from the query string
    const url = new URL(req.url);
    const limit = url.searchParams.get('limit');
    const type = url.searchParams.get('type') || 'member'; // 'member' or 'discover'
    
    // Reduce caching for discover projects to ensure new projects appear quickly
    // Member projects can be cached longer since they change less frequently
    const cacheDuration = type === 'member' ? 60 : 0; // 1 min for member, no cache for discover
    const cacheHeaders = {
      'Cache-Control': `no-cache, no-store, must-revalidate`,
      'CDN-Cache-Control': `no-cache`,
      'Pragma': 'no-cache',
      'Expires': '0'
    };
    
    console.log('Cache headers for type', type, ':', cacheHeaders);
    
    if (type === 'member') {
      console.log('Fetching member projects for user:', userId);
      // Fetch projects where the user is either the creator or a member
      const [projectMemberships, createdProjects] = await Promise.all([
        prisma.projectMember.findMany({
          where: {
            userId: userId
          },
          include: {
            project: {
              include: {
                creator: true,
                files: true,
              }
            },
            user: true // Include the user data for each membership
          },
          take: limit ? Math.min(parseInt(limit), 10) : undefined
        }),
        prisma.project.findMany({
          where: {
            creatorId: userId
          },
          include: {
            creator: true,
            files: true,
          },
          take: limit ? Math.min(parseInt(limit), 10) : undefined
        })
      ]);
      
      console.log('Project memberships found:', projectMemberships.length);
      console.log('Created projects found:', createdProjects.length);
      
      // Log details of project memberships
      projectMemberships.forEach(pm => {
        console.log('Project membership details:', {
          projectId: pm.project.id,
          projectName: pm.project.title,
          userId: pm.userId,
          role: pm.role
        });
      });
      
      // Log details of created projects
      createdProjects.forEach(project => {
        console.log('Created project details:', {
          projectId: project.id,
          projectName: project.title,
          creatorId: project.creatorId
        });
      });
      
      // Combine and deduplicate projects
      const allProjectsMap = new Map();
      
      // Add projects from memberships
      projectMemberships.forEach(pm => {
        console.log('Adding project from membership:', pm.project.id, 'for user:', userId);
        allProjectsMap.set(pm.project.id, pm.project);
      });
      
      // Add created projects (these should also be considered as member projects)
      createdProjects.forEach(project => {
        console.log('Adding created project as member project:', project.id, 'by user:', userId);
        // Make sure created projects are also in the map
        if (!allProjectsMap.has(project.id)) {
          allProjectsMap.set(project.id, project);
        }
      });
      
      // Convert map back to array
      const allProjects = Array.from(allProjectsMap.values());
      console.log('Total unique projects for user:', userId, 'count:', allProjects.length);
      
      // For each project, fetch its tech stack separately
      const projectsWithTech = await Promise.all(
        allProjects.map(async (project: any) => {
          // Use Prisma's findMany instead of raw query to avoid SQLite uuid() function issues
          const techStack = await prisma.projectTech.findMany({
            where: {
              projectId: project.id
            }
          });
          return { ...project, techStack };
        })
      );
      
      // Transform the data to match the frontend expectations
      const transformedProjects = projectsWithTech.map((project: any) => {
        // Extract skills from techStack
        const skills = project.techStack.map((tech: any) => tech.technology);
        
        // Get admin display info
        const adminInfo = getUserDisplayInfo(project.creator);
        
        // Get project members
        const members: { name: string; avatar: string }[] = projectMemberships
          .filter(pm => pm.project.id === project.id)
          .map(pm => {
            const memberInfo = getUserDisplayInfo(pm.user);
            return {
              name: memberInfo.name,
              avatar: memberInfo.avatarUrl || memberInfo.initials,
            }
          });
        
        // Log members for debugging
        console.log(`Members for project ${project.id}:`, members);
        
        // Add creator as a member if not already included
        const creatorInfo = getUserDisplayInfo(project.creator);
        if (!members.some(m => m.name === creatorInfo.name)) {
          members.unshift({
            name: creatorInfo.name,
            avatar: creatorInfo.avatarUrl || creatorInfo.initials,
          });
        }
        
        return {
          id: project.id,
          title: project.title,
          description: project.description || '',
          fullDescription: project.fullDescription || project.description || '',
          status: project.status,
          statusColor: getStatusColor(project.status),
          isMember: true, // User is definitely a member since we filtered for that
          admin: {
            id: project.creatorId,
            name: adminInfo.name,
            avatar: adminInfo.avatarUrl || adminInfo.initials,
          },
          members: members,
          dueDate: project.dueDate ? project.dueDate.toISOString() : undefined,
          createdAt: project.createdAt.toISOString(),
          skills: skills,
          teamSize: project.currentTeamSize,
          openPositions: Math.max(0, (project.maxTeamSize || 0) - project.currentTeamSize),
          goals: [], // These would come from project goals in the database
          files: project.files.map((file: any) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            url: file.url,
          })) || [],
        }
      })
      
      console.log('Returning transformed projects for user:', userId, 'count:', transformedProjects.length);
      return NextResponse.json(transformedProjects, { 
        status: 200,
        headers: cacheHeaders
      })
    } else {
      console.log('Fetching discover projects for user:', userId);
      // Discover projects - get projects where the user is NOT a member or creator
      // First, get all projects the user is a member of
      const [projectMemberships, createdProjects] = await Promise.all([
        prisma.projectMember.findMany({
          where: {
            userId: userId
          },
          select: {
            projectId: true
          }
        }),
        prisma.project.findMany({
          where: {
            creatorId: userId
          },
          select: {
            id: true
          }
        })
      ]);
      
      console.log('Raw project memberships:', projectMemberships);
      console.log('Raw created projects:', createdProjects);
      
      const memberProjectIds = new Set<string>();
      
      // Get projects where user is a member
      projectMemberships.forEach(pm => {
        console.log('Adding membership project ID:', pm.projectId);
        memberProjectIds.add(pm.projectId);
      });
      
      // Get projects where user is the creator
      createdProjects.forEach(p => {
        console.log('Adding created project ID:', p.id);
        memberProjectIds.add(p.id);
      });
      
      console.log('Member project IDs set:', Array.from(memberProjectIds));
      
      console.log('User', userId, 'is member of projects:', Array.from(memberProjectIds));
      console.log('Project memberships found:', projectMemberships.length);
      console.log('Created projects found:', createdProjects.length);
      
      // Log details for debugging
      console.log('Project membership IDs:', projectMemberships.map(pm => pm.projectId));
      console.log('Created project IDs:', createdProjects.map(p => p.id));
      
      // Also get all projects to compare
      const allProjectsInDb = await prisma.project.findMany({
        where: {
          isRecruiting: true
        },
        select: {
          id: true,
          creatorId: true
        }
      });
      
      console.log('All projects in DB (before filtering):', await prisma.project.findMany({
        select: {
          id: true,
          title: true,
          creatorId: true,
          isRecruiting: true
        }
      }));
      
      console.log('Current user ID:', userId);
      
      console.log('All recruiting projects in DB:', allProjectsInDb.length);
      console.log('All recruiting project details:', allProjectsInDb);
      
      // Filter out projects where user is member or creator
      const excludedProjects = allProjectsInDb.filter(p => {
        const isMember = memberProjectIds.has(p.id);
        const isCreator = p.creatorId === userId;
        console.log(`Excluding project ${p.id}: isMember=${isMember}, isCreator=${isCreator}`);
        return isMember || isCreator;
      });
      
      const discoverableProjects = allProjectsInDb.filter(p => {
        const isMember = memberProjectIds.has(p.id);
        const isCreator = p.creatorId === userId;
        console.log(`Project ${p.id}: isMember=${isMember}, isCreator=${isCreator}`);
        return !isMember && !isCreator;
      });
      
      const discoverableProjectIds = discoverableProjects.map(p => p.id);
      
      console.log('Excluded project IDs:', excludedProjects.map(p => p.id));
      console.log('Discoverable project IDs:', discoverableProjectIds);
      
      // Now get the actual project data for discoverable projects
      console.log('Querying for discoverable projects with IDs:', discoverableProjectIds);
      const allProjects = await prisma.project.findMany({
        where: {
          id: {
            in: discoverableProjectIds
          }
        },
        include: {
          creator: true,
          files: true,
        },
        take: limit ? Math.min(parseInt(limit), 50) : 50,
        orderBy: {
          createdAt: 'desc' // Order by creation date, newest first
        }
      });
      console.log('Found projects:', allProjects);
      
      console.log('Found', allProjects.length, 'discover projects for user:', userId);
      console.log('All projects in database:', await prisma.project.count());
      console.log('Recruiting projects in database:', await prisma.project.count({ where: { isRecruiting: true } }));
      
      // For each project, fetch its tech stack and members separately
      const projectsWithTechAndMembers = await Promise.all(
        allProjects.map(async (project: any) => {
          // Use Prisma's findMany instead of raw query to avoid SQLite uuid() function issues
          const [techStack, projectMembers] = await Promise.all([
            prisma.projectTech.findMany({
              where: {
                projectId: project.id
              }
            }),
            prisma.projectMember.findMany({
              where: {
                projectId: project.id
              },
              include: {
                user: true
              },
              take: 4 // Limit to first 4 members for display
            })
          ]);
          return { ...project, techStack, projectMembers };
        })
      );
      
      // Transform the data to match the frontend expectations
      const transformedProjects = projectsWithTechAndMembers.map((project: any) => {
        // Extract skills from techStack
        const skills = project.techStack.map((tech: any) => tech.technology);
        
        // Get admin display info
        const adminInfo = getUserDisplayInfo(project.creator);
        
        // Get project members for display (first few members with avatars)
        const members: { name: string; avatar: string }[] = project.projectMembers.map((pm: any) => {
          const memberInfo = getUserDisplayInfo(pm.user);
          return {
            name: memberInfo.name,
            avatar: memberInfo.avatarUrl || memberInfo.initials,
          };
        });
        
        // Add creator as a member if not already included
        const creatorInfo = getUserDisplayInfo(project.creator);
        if (!members.some(m => m.name === creatorInfo.name)) {
          members.unshift({
            name: creatorInfo.name,
            avatar: creatorInfo.avatarUrl || creatorInfo.initials,
          });
          // Limit to 4 members total
          if (members.length > 4) {
            members.pop();
          }
        }
        
        return {
          id: project.id,
          title: project.title,
          description: project.description || '',
          fullDescription: project.fullDescription || project.description || '',
          status: project.status,
          statusColor: getStatusColor(project.status),
          isMember: false, // User is NOT a member of these projects
          admin: {
            id: project.creatorId,
            name: adminInfo.name,
            avatar: adminInfo.avatarUrl || adminInfo.initials,
          },
          members: members,
          dueDate: project.dueDate ? project.dueDate.toISOString() : undefined,
          createdAt: project.createdAt.toISOString(),
          skills: skills,
          teamSize: project.currentTeamSize,
          openPositions: Math.max(0, (project.maxTeamSize || 0) - project.currentTeamSize),
          goals: [], // These would come from project goals in the database
          files: project.files.map((file: any) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            url: file.url,
          })) || [],
        }
      })
      
      console.log('Returning discover projects for user:', userId, 'count:', transformedProjects.length);
      return NextResponse.json(transformedProjects, { 
        status: 200,
        headers: cacheHeaders
      })
    }
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

// POST /api/projects - Create a new project
export async function POST(req: Request) {
  try {
    // Get the authenticated user
    const { userId } = getAuth(req as any);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the prisma client
    const prisma = await getPrismaClient();
    
    const body = await req.json()
    const { title, description, skills, teamSize, dueDate, files } = body
    
    // Parse team size
    let maxTeamSize = 5
    if (teamSize) {
      if (typeof teamSize === 'string' && teamSize.includes('-')) {
        const parts = teamSize.split('-')
        maxTeamSize = parseInt(parts[1]) || 5
      } else if (typeof teamSize === 'string') {
        maxTeamSize = parseInt(teamSize) || 5
      } else {
        maxTeamSize = teamSize
      }
    }
    
    // Get user info from Clerk session claims
    const { sessionClaims } = getAuth(req as any);
    console.log('Clerk session claims:', sessionClaims);
    
    // Try to get real email and name from Clerk session
    let email = (sessionClaims?.email as string);
    let fullName = (sessionClaims?.fullName as string);
    
    // Log if we're missing session data
    if (!email || !fullName) {
      console.warn('Missing session data for user creation:', { 
        userId, 
        hasEmail: !!email, 
        hasFullName: !!fullName,
        sessionClaims
      });
    }
    
    // Use fallbacks only if absolutely necessary
    email = email || `${userId}@example.com`;
    fullName = fullName || 'User';
    
    console.log('Creating project with user data:', { userId, email, fullName });
    
    // Ensure user exists with proper data
    const creator = await ensureUserExists(prisma, userId, email, fullName);
    
    // Try to update user with real data if they have placeholder data
    await updateUserWithRealData(prisma, userId, email, fullName);
    
    // Create the project
    console.log('Creating project with data:', {
      title,
      description,
      fullDescription: description,
      status: 'planning',
      difficultyLevel: 'intermediate',
      maxTeamSize,
      currentTeamSize: 1,
      creatorId: creator.id,
      isRecruiting: true
    });
    
    const project: any = await prisma.project.create({
      data: {
        title,
        description,
        fullDescription: description,
        status: 'planning',
        difficultyLevel: 'intermediate',
        maxTeamSize,
        currentTeamSize: 1,
        creatorId: creator.id,
        isRecruiting: true, // New projects are recruiting by default
      },
    })
    
    console.log('Project created successfully:', project.id);
    
    // Add creator as project member
    console.log('Adding creator as project member:', {
      projectId: project.id,
      userId: creator.id,
      role: 'Owner'
    });
    const projectMember = await prisma.projectMember.create({
      data: {
        projectId: project.id,
        userId: creator.id,
        role: 'Owner',
      },
    });
    console.log('Project member created:', projectMember);
    
    // Create tech stack items
    if (skills && skills.length > 0) {
      // Create tech stack items using Prisma client instead of raw queries
      for (const skill of skills) {
        await prisma.projectTech.create({
          data: {
            projectId: project.id,
            technology: skill,
          }
        });
      }
    }
    
    // Create project files if provided
    if (files && files.length > 0) {
      for (const file of files) {
        await prisma.projectFile.create({
          data: {
            name: file.name,
            url: file.dataUrl, // In a real app, you'd upload to storage and get a URL
            size: file.size,
            type: file.type,
            projectId: project.id,
          },
        })
      }
    }
    
    // Transform the project to match frontend expectations
    const transformedProject = {
      id: project.id,
      title: project.title,
      description: project.description || '',
      fullDescription: project.fullDescription || project.description || '',
      status: project.status,
      statusColor: getStatusColor(project.status),
      isMember: true, // Creator is automatically a member
      admin: {
        id: creator.id,
        name: creator.fullName || creator.username || 'Unknown User',
        avatar: creator.avatarUrl || getInitials(creator.fullName || creator.username || 'Unknown User'),
      },
      members: [{
        name: creator.fullName || creator.username || 'Unknown User',
        avatar: creator.avatarUrl || getInitials(creator.fullName || creator.username || 'Unknown User'),
      }],
      dueDate: project.dueDate ? project.dueDate.toISOString() : undefined,
      createdAt: project.createdAt.toISOString(),
      skills: skills || [],
      teamSize: project.currentTeamSize,
      openPositions: Math.max(0, (project.maxTeamSize || 0) - project.currentTeamSize),
      goals: [],
      files: files ? files.map((file: any) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        url: file.dataUrl,
      })) : [],
    }
    
    console.log('Created new project:', transformedProject.id, 'by user:', creator.id, 'name:', creator.fullName);
    return NextResponse.json(transformedProject)
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Failed to create project: ' + (error as Error).message }, { status: 500 })
  }
}

// Helper functions
function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
    case 'in progress':
      return 'text-success'
    case 'planning':
      return 'text-muted-foreground'
    case 'review':
      return 'text-primary'
    case 'completed':
      return 'text-success'
    case 'on hold':
      return 'text-warning'
    default:
      return 'text-muted-foreground'
  }
}

function getInitials(name: string): string {
  if (!name) return 'UU';
  
  // Remove any non-printable characters
  const cleanName = name.replace(/[^\x20-\x7E]/g, '');
  
  if (!cleanName.trim()) return 'UU';
  
  return cleanName
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}