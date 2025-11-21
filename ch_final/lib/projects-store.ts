// Simple in-memory store. This persists only while the server process is running
// (suitable for local dev). For production you should use a proper database
// (Supabase, Postgres, MongoDB, Vercel KV, etc.).
import getPrismaClient from "./db"

// keep an in-memory fallback for when DATABASE_URL isn't configured
let projectsCache: any[] = []

export async function getProjects() {
  if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
    const prismaClient = await getPrismaClient();
    return await prismaClient.project.findMany({ include: { files: true } })
  }

  return projectsCache
}

export async function getProjectById(id: string) {
  if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
    const prismaClient = await getPrismaClient();
    return await prismaClient.project.findUnique({ where: { id }, include: { files: true } })
  }

  return projectsCache.find((p) => p.id === id)
}

export async function createProject(data: any) {
  if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
    const prismaClient = await getPrismaClient();
    const created = await prismaClient.project.create({
      data: {
        title: data.title,
        description: data.description,
        fullDescription: data.fullDescription || data.description,
        status: data.status || "Planning",
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        category: data.category || undefined,
        difficultyLevel: data.difficultyLevel || undefined,
        maxTeamSize: data.maxTeamSize || undefined,
        githubUrl: data.githubUrl || undefined,
        demoUrl: data.demoUrl || undefined,
        creator: {
          connect: {
            id: data.creatorId
          }
        }
      },
    })

    // create files if provided
    if (data.files && data.files.length > 0) {
      for (const f of data.files) {
        await prismaClient.projectFile.create({
          data: {
            name: f.name,
            url: f.url || '',
            size: f.size || 0,
            type: f.type || '',
            project: {
              connect: {
                id: created.id
              }
            }
          },
        })
      }
    }

    return await getProjectById(created.id)
  }

  const id = Date.now().toString()
  const createdAt = new Date().toISOString()
  const project: any = {
    id,
    createdAt,
    title: data.title,
    description: data.description,
    fullDescription: data.fullDescription || data.description,
    status: data.status || "Planning",
    statusColor: data.statusColor || "text-muted-foreground",
    isMember: !!data.isMember,
    admin: data.admin || { name: "You", avatar: "YY" },
    members: data.members || [],
    tasks: data.tasks || { todo: 0, inProgress: 0, done: 0 },
    dueDate: data.dueDate,
    skills: data.skills || [],
    teamSize: data.teamSize || 1,
    openPositions: data.openPositions || 0,
    goals: data.goals || [],
    files: data.files || [],
  }

  projectsCache.unshift(project)
  return project
}