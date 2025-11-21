import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import getPrismaClient from '@/lib/db'
import { ensureUserExists } from '@/lib/user-creation'

export async function POST(req: Request) {
  // You can find this in your Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }
  
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");
  
  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }
  
  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);
  
  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);
  
  let evt: WebhookEvent
  
  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }
  
  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;
  
  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log('Webhook body:', body);
  
  // Handle the event
  if (eventType === 'user.created') {
    try {
      // Get the prisma client
      const prisma = await getPrismaClient();
      
      // Extract user data from the webhook payload
      const { email_addresses, first_name, last_name, id: userId } = evt.data;
      
      // Get the primary email address
      const primaryEmail = email_addresses.find(email => email.id === evt.data.primary_email_address_id);
      const email = primaryEmail?.email_address || `${userId}@example.com`;
      
      // Construct full name
      const fullName = first_name && last_name 
        ? `${first_name} ${last_name}`
        : first_name || last_name || 'User';
      
      console.log('Creating user with data:', { userId, email, fullName });
      
      // Ensure user exists with proper data
      const user = await ensureUserExists(prisma, userId, email, fullName);
      
      console.log('User created/updated via webhook:', user);
      
      return NextResponse.json({ success: true, user }, { status: 200 });
    } catch (error) {
      console.error('Error creating user from webhook:', error);
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
  }
  
  if (eventType === 'user.updated') {
    try {
      // Get the prisma client
      const prisma = await getPrismaClient();
      
      // Extract user data from the webhook payload
      const { email_addresses, first_name, last_name, id: userId } = evt.data;
      
      // Get the primary email address
      const primaryEmail = email_addresses.find(email => email.id === evt.data.primary_email_address_id);
      const email = primaryEmail?.email_address || `${userId}@example.com`;
      
      // Construct full name
      const fullName = first_name && last_name 
        ? `${first_name} ${last_name}`
        : first_name || last_name || 'User';
      
      console.log('Updating user with data:', { userId, email, fullName });
      
      // Ensure user exists with proper data
      const user = await ensureUserExists(prisma, userId, email, fullName);
      
      console.log('User updated via webhook:', user);
      
      return NextResponse.json({ success: true, user }, { status: 200 });
    } catch (error) {
      console.error('Error updating user from webhook:', error);
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
  }
  
  return new Response('', { status: 200 })
}