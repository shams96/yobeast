'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Major universities with their email domains and locations
const INSTITUTIONS = [
  { name: 'Harvard University', domain: 'harvard.edu', city: 'Cambridge', state: 'MA', zip: '02138' },
  { name: 'MIT', domain: 'mit.edu', city: 'Cambridge', state: 'MA', zip: '02139' },
  { name: 'Stanford University', domain: 'stanford.edu', city: 'Stanford', state: 'CA', zip: '94305' },
  { name: 'UC Berkeley', domain: 'berkeley.edu', city: 'Berkeley', state: 'CA', zip: '94720' },
  { name: 'Yale University', domain: 'yale.edu', city: 'New Haven', state: 'CT', zip: '06520' },
  { name: 'Princeton University', domain: 'princeton.edu', city: 'Princeton', state: 'NJ', zip: '08544' },
  { name: 'Columbia University', domain: 'columbia.edu', city: 'New York', state: 'NY', zip: '10027' },
  { name: 'University of Pennsylvania', domain: 'upenn.edu', city: 'Philadelphia', state: 'PA', zip: '19104' },
  { name: 'Cornell University', domain: 'cornell.edu', city: 'Ithaca', state: 'NY', zip: '14853' },
  { name: 'Brown University', domain: 'brown.edu', city: 'Providence', state: 'RI', zip: '02912' },
  { name: 'Dartmouth College', domain: 'dartmouth.edu', city: 'Hanover', state: 'NH', zip: '03755' },
  { name: 'Duke University', domain: 'duke.edu', city: 'Durham', state: 'NC', zip: '27708' },
  { name: 'Northwestern University', domain: 'northwestern.edu', city: 'Evanston', state: 'IL', zip: '60208' },
  { name: 'Vanderbilt University', domain: 'vanderbilt.edu', city: 'Nashville', state: 'TN', zip: '37240' },
  { name: 'Rice University', domain: 'rice.edu', city: 'Houston', state: 'TX', zip: '77005' },
  { name: 'University of Notre Dame', domain: 'nd.edu', city: 'Notre Dame', state: 'IN', zip: '46556' },
  { name: 'USC', domain: 'usc.edu', city: 'Los Angeles', state: 'CA', zip: '90089' },
  { name: 'UCLA', domain: 'ucla.edu', city: 'Los Angeles', state: 'CA', zip: '90095' },
  { name: 'NYU', domain: 'nyu.edu', city: 'New York', state: 'NY', zip: '10003' },
  { name: 'University of Chicago', domain: 'uchicago.edu', city: 'Chicago', state: 'IL', zip: '60637' },
  { name: 'University of Michigan', domain: 'umich.edu', city: 'Ann Arbor', state: 'MI', zip: '48109' },
  { name: 'University of Virginia', domain: 'virginia.edu', city: 'Charlottesville', state: 'VA', zip: '22904' },
  { name: 'Georgia Tech', domain: 'gatech.edu', city: 'Atlanta', state: 'GA', zip: '30332' },
  { name: 'University of Texas at Austin', domain: 'utexas.edu', city: 'Austin', state: 'TX', zip: '78712' },
];

export default function InstitutionSelectPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState<typeof INSTITUTIONS[0] | null>(null);
  const [userState, setUserState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Auto-detect user location (simplified - you can enhance with IP geolocation API)
  useEffect(() => {
    // Try to get location from browser
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In production, use reverse geocoding API to get state from lat/long
          // For now, just mark as loaded
          setLoading(false);
        },
        (error) => {
          console.log('Location access denied, showing all institutions');
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, []);

  // Filter institutions based on search query
  const filteredInstitutions = INSTITUTIONS.filter((inst) =>
    inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inst.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inst.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort: nearby institutions first (same state), then alphabetically
  const sortedInstitutions = [...filteredInstitutions].sort((a, b) => {
    if (userState) {
      if (a.state === userState && b.state !== userState) return -1;
      if (a.state !== userState && b.state === userState) return 1;
    }
    return a.name.localeCompare(b.name);
  });

  const handleSelectInstitution = (institution: typeof INSTITUTIONS[0]) => {
    setSelectedInstitution(institution);
  };

  const handleContinue = () => {
    if (!selectedInstitution) return;

    // Store selected institution in localStorage
    localStorage.setItem('selectedInstitution', JSON.stringify(selectedInstitution));

    // Redirect to Clerk sign-up
    router.push('/sign-up');
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-nightfall flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🎓</div>
          <p className="text-steel">Finding institutions near you...</p>
        </div>
      </div>
    );
  }

  // Show welcome screen after institution selection
  if (selectedInstitution) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-nightfall flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-digital-grape/20 via-nightfall to-electric-coral/20" />

        <div className="relative z-10 max-w-md w-full space-y-8 text-center">
          {/* Campus Welcome */}
          <div className="space-y-4">
            <div className="text-7xl mb-4">🎓</div>
            <h1 className="text-4xl font-black text-ash">
              Welcome to<br />
              {selectedInstitution.name}!
            </h1>
            <p className="text-xl font-semibold text-signal-lime">
              Join your campus on Yollr Beast
            </p>
          </div>

          {/* Institution Info */}
          <div className="card-elevated p-6 space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-steel/70">You'll sign up with your</p>
              <p className="text-2xl font-bold text-ash">
                @{selectedInstitution.domain}
              </p>
              <p className="text-sm text-steel/70">email address</p>
            </div>

            <div className="pt-4 border-t border-steel/20">
              <p className="text-xs text-steel/70 leading-relaxed">
                We verify you're a real {selectedInstitution.name} student by requiring your campus email. This keeps Yollr Beast exclusive to verified students.
              </p>
            </div>
          </div>

          {/* Campus Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="card-elevated p-3">
              <p className="text-2xl font-bold text-signal-lime">🔥</p>
              <p className="text-xs text-steel/70 mt-1">Weekly<br />Challenges</p>
            </div>
            <div className="card-elevated p-3">
              <p className="text-2xl font-bold text-electric-coral">🗳️</p>
              <p className="text-xs text-steel/70 mt-1">Vote for<br />Champions</p>
            </div>
            <div className="card-elevated p-3">
              <p className="text-2xl font-bold text-digital-grape">💰</p>
              <p className="text-xs text-steel/70 mt-1">Win Real<br />Prizes</p>
            </div>
          </div>

          {/* Continue Button */}
          <div className="space-y-3 pt-4">
            <button
              type="button"
              onClick={handleContinue}
              className="block w-full bg-gradient-to-r from-electric-coral to-signal-lime text-nightfall font-bold text-lg px-8 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-transform shadow-elevated"
            >
              Continue to Sign Up
            </button>

            <button
              type="button"
              onClick={() => setSelectedInstitution(null)}
              className="block w-full bg-carbon/80 text-ash font-semibold px-8 py-3 rounded-2xl hover:bg-carbon transition-colors border border-steel/30"
            >
              ← Choose Different School
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-nightfall p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block text-steel/70 hover:text-ash transition-colors text-sm mb-4">
            ← Back
          </Link>
          <div className="text-6xl mb-4">🎓</div>
          <h1 className="text-3xl font-bold text-ash">
            Select Your Institution
          </h1>
          <p className="text-steel">
            Choose your college or university to get started
          </p>
        </div>

        {/* Search Box */}
        <div className="card-elevated p-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by school name, city, or state..."
              className="w-full px-4 py-3 pl-12 bg-carbon border border-steel/20 rounded-lg text-ash placeholder-steel/70 focus:border-digital-grape focus:ring-2 focus:ring-digital-grape/20 outline-none transition-all"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-steel/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Institutions List */}
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {sortedInstitutions.length === 0 ? (
            <div className="card-elevated p-6 text-center">
              <p className="text-steel">No institutions found matching "{searchQuery}"</p>
              <p className="text-xs text-steel/70 mt-2">
                Try searching by school name, city, or state
              </p>
            </div>
          ) : (
            sortedInstitutions.map((institution) => (
              <button
                key={institution.domain}
                type="button"
                onClick={() => handleSelectInstitution(institution)}
                className="w-full card-elevated p-4 text-left hover:bg-carbon/80 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-ash group-hover:text-signal-lime transition-colors">
                      {institution.name}
                    </h3>
                    <p className="text-sm text-steel mt-1">
                      {institution.city}, {institution.state}
                      {userState === institution.state && (
                        <span className="ml-2 text-xs bg-signal-lime/20 text-signal-lime px-2 py-0.5 rounded-full">
                          Near you
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-steel/70 mt-1">
                      @{institution.domain}
                    </p>
                  </div>
                  <svg
                    className="w-6 h-6 text-steel/50 group-hover:text-signal-lime transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="card-elevated p-4 text-center">
          <p className="text-xs text-steel/70">
            Don't see your institution?{' '}
            <button
              type="button"
              onClick={() => {
                const customName = prompt('Enter your institution name:');
                const customDomain = prompt('Enter your institution email domain (e.g., school.edu):');
                if (customName && customDomain) {
                  const customInstitution = {
                    name: customName,
                    domain: customDomain,
                    city: 'Custom',
                    state: '',
                    zip: '',
                  };
                  handleSelectInstitution(customInstitution);
                }
              }}
              className="text-digital-grape hover:text-signal-lime transition-colors font-semibold"
            >
              Add it manually
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
