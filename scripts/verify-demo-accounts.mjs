// Script to verify all demo accounts
// Run with: node scripts/verify-demo-accounts.mjs

const DEMO_EMAILS = [
  'demo@harvard.edu',
  'demo@mit.edu',
  'demo@stanford.edu',
  'demo@yale.edu',
  'demo@princeton.edu',
];

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function verifyDemoAccounts() {
  console.log('Verifying demo accounts...\n');

  for (const email of DEMO_EMAILS) {
    try {
      const response = await fetch(`${API_URL}/api/verify-demo-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`✅ ${email}: ${data.message}`);
      } else {
        console.log(`❌ ${email}: ${data.error}`);
      }
    } catch (error) {
      console.log(`❌ ${email}: Failed to verify - ${error.message}`);
    }
  }

  console.log('\nDone!');
}

verifyDemoAccounts();
