const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Create some sample users
  const user1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      username: 'alice_dev',
      fullName: 'Alice Johnson',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      username: 'bob_coder',
      fullName: 'Bob Smith',
    },
  })

  const user3 = await prisma.user.create({
    data: {
      email: 'charlie@example.com',
      username: 'charlie_designer',
      fullName: 'Charlie Brown',
    },
  })

  // Create some sample projects
  const project1 = await prisma.project.create({
    data: {
      title: 'E-commerce Platform',
      description: 'Building a full-stack e-commerce platform with Next.js and Stripe',
      fullDescription: 'We\'re building a comprehensive e-commerce platform that includes product management, shopping cart, payment processing with Stripe, order tracking, and an admin dashboard. The platform will support multiple vendors and include features like product reviews, wishlists, and real-time inventory management.',
      status: 'in_progress',
      difficultyLevel: 'advanced',
      maxTeamSize: 5,
      currentTeamSize: 4,
      githubUrl: 'https://github.com/example/ecommerce-platform',
      isRecruiting: true,
      dueDate: new Date('2024-06-30'),
      creator: {
        connect: {
          id: user1.id,
        },
      },
      members: {
        create: [
          {
            user: {
              connect: {
                id: user1.id,
              },
            },
            role: 'Owner',
          },
          {
            user: {
              connect: {
                id: user2.id,
              },
            },
            role: 'Developer',
          },
          {
            user: {
              connect: {
                id: user3.id,
              },
            },
            role: 'Designer',
          },
        ],
      },
    },
  })

  // Create tech stack for project1
  await prisma.projectTech.createMany({
    data: [
      { projectId: project1.id, technology: 'React' },
      { projectId: project1.id, technology: 'Next.js' },
      { projectId: project1.id, technology: 'Stripe' },
      { projectId: project1.id, technology: 'PostgreSQL' },
    ],
  })

  const project2 = await prisma.project.create({
    data: {
      title: 'Mobile App Design',
      description: 'UI/UX design for a fitness tracking mobile application',
      fullDescription: 'Creating a modern, intuitive UI/UX design for a fitness tracking app that helps users monitor their workouts, nutrition, and progress. The design will include onboarding flows, workout tracking screens, progress dashboards, and social features for community engagement.',
      status: 'active',
      difficultyLevel: 'intermediate',
      maxTeamSize: 3,
      currentTeamSize: 2,
      isRecruiting: true,
      dueDate: new Date('2024-05-15'),
      creator: {
        connect: {
          id: user2.id,
        },
      },
      members: {
        create: [
          {
            user: {
              connect: {
                id: user2.id,
              },
            },
            role: 'Owner',
          },
          {
            user: {
              connect: {
                id: user3.id,
              },
            },
            role: 'Designer',
          },
        ],
      },
    },
  })

  // Create tech stack for project2
  await prisma.projectTech.createMany({
    data: [
      { projectId: project2.id, technology: 'Figma' },
      { projectId: project2.id, technology: 'UI Design' },
      { projectId: project2.id, technology: 'Prototyping' },
    ],
  })

  const project3 = await prisma.project.create({
    data: {
      title: 'Data Analysis Project',
      description: 'Analyzing customer behavior data using Python and machine learning',
      fullDescription: 'A comprehensive data analysis project focused on understanding customer behavior patterns using advanced machine learning techniques. We\'ll analyze large datasets, build predictive models, and create visualizations to help businesses make data-driven decisions.',
      status: 'planning',
      difficultyLevel: 'advanced',
      maxTeamSize: 4,
      currentTeamSize: 2,
      isRecruiting: true,
      creator: {
        connect: {
          id: user3.id,
        },
      },
      members: {
        create: [
          {
            user: {
              connect: {
                id: user3.id,
              },
            },
            role: 'Owner',
          },
          {
            user: {
              connect: {
                id: user1.id,
              },
            },
            role: 'Data Scientist',
          },
        ],
      },
    },
  })

  // Create tech stack for project3
  await prisma.projectTech.createMany({
    data: [
      { projectId: project3.id, technology: 'Python' },
      { projectId: project3.id, technology: 'Pandas' },
      { projectId: project3.id, technology: 'Machine Learning' },
      { projectId: project3.id, technology: 'Jupyter' },
    ],
  })

  console.log('Seed data created successfully!')
  console.log(`Created users: ${user1.fullName}, ${user2.fullName}, ${user3.fullName}`)
  console.log(`Created projects: ${project1.title}, ${project2.title}, ${project3.title}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })