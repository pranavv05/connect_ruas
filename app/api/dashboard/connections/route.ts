import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import getPrismaClient from '@/lib/db'

// GET /api/dashboard/connections - Get user connections for the dashboard
export async function GET(req: Request) {
  try {
    // Get the authenticated user
    const { userId } = getAuth(req as any)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get the prisma client
    const prisma: any = await getPrismaClient()
    
    // Add caching headers for 5 minutes
    const cacheHeaders = {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      'CDN-Cache-Control': 'public, s-maxage=300',
    }
    
    // Get user's connections
    const connections = await prisma.connection.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        connectedAt: 'desc'
      },
      take: 5 // Limit to 5 for dashboard
    })
    
    // Transform the data to match the frontend expectations
    const transformedConnections = connections.map((connection: any) => ({
      id: connection.id,
      platform: connection.platform,
      platformUsername: connection.platformUsername,
      profileUrl: connection.profileUrl,
      isVerified: connection.isVerified,
      connectedAt: connection.connectedAt.toISOString(),
    }))
    
    return NextResponse.json(transformedConnections, { 
      status: 200,
      headers: cacheHeaders
    })
  } catch (error) {
    console.error('Error fetching dashboard connections:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard connections' }, { status: 500 })
  }
}

// POST /api/dashboard/connections - Add or update a social connection for the authenticated user
export async function POST(req: Request) {
  try {
    // Get the authenticated user
    const { userId } = getAuth(req as any)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get the prisma client
    const prisma: any = await getPrismaClient()
    
    const body = await req.json()
    const { platform, platformUsername, profileUrl } = body
    
    // Create or update connection
    const connection = await prisma.connection.upsert({
      where: {
        userId_platform: {
          userId: userId,
          platform: platform
        }
      },
      update: {
        platformUsername: platformUsername,
        profileUrl: profileUrl,
        isVerified: true,
        connectedAt: new Date()
      },
      create: {
        userId: userId,
        platform: platform,
        platformUsername: platformUsername,
        profileUrl: profileUrl,
        isVerified: true
      }
    })
    
    return NextResponse.json({ 
      message: 'Connection updated successfully',
      connection: {
        id: connection.id,
        platform: connection.platform,
        connected: connection.isVerified,
        username: connection.platformUsername
      }
    })
  } catch (error) {
    console.error('Error updating dashboard connection:', error)
    return NextResponse.json({ error: 'Failed to update dashboard connection' }, { status: 500 })
  }
}

// DELETE /api/dashboard/connections/[id] - Remove a social connection for the authenticated user
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Get the authenticated user
    const { userId } = getAuth(req as any)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get the prisma client
    const prisma: any = await getPrismaClient()
    
    // Delete connection
    await prisma.connection.delete({
      where: {
        id: id,
        userId: userId
      }
    })
    
    return NextResponse.json({ message: 'Connection removed successfully' })
  } catch (error) {
    console.error('Error removing dashboard connection:', error)
    return NextResponse.json({ error: 'Failed to remove dashboard connection' }, { status: 500 })
  }
}