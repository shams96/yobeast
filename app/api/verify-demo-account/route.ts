import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

// API route to mark demo accounts as verified
// This bypasses the email verification requirement for test accounts

const DEMO_EMAILS = [
  'demo@harvard.edu',
  'demo@mit.edu',
  'demo@stanford.edu',
  'demo@yale.edu',
  'demo@princeton.edu',
];

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Only allow demo emails
    if (!DEMO_EMAILS.includes(email)) {
      return NextResponse.json(
        { error: 'Not a demo account' },
        { status: 400 }
      );
    }

    // Get the user by email
    const client = await clerkClient();
    const users = await client.users.getUserList({
      emailAddress: [email],
    });

    if (users.data.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = users.data[0];

    // Mark email as verified
    if (user.emailAddresses && user.emailAddresses.length > 0) {
      const emailAddressId = user.emailAddresses[0].id;

      await client.emailAddresses.updateEmailAddress(emailAddressId, {
        verified: true,
      });

      return NextResponse.json({
        success: true,
        message: `Demo account ${email} marked as verified`,
      });
    }

    return NextResponse.json(
      { error: 'No email address found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error verifying demo account:', error);
    return NextResponse.json(
      { error: 'Failed to verify account' },
      { status: 500 }
    );
  }
}
