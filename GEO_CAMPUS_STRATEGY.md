# Geo-Based Campus Verification Strategy

## 🌍 Model: Hyperlocal Campus Communities

**Concept:** Campuses are **geographic zones**, not just universities. Users access campus content based on their **physical location** (ZIP code).

### Examples:
- **Harvard Square** (ZIP: 02138) → "Harvard Campus"
- **Downtown Boston** (ZIP: 02110-02199) → "Boston Campus"
- **Stanford Area** (ZIP: 94305) → "Stanford Campus"
- **Any neighborhood** → Can be a "Campus"

**This is more inclusive than .edu verification:**
- ✅ College students at that campus
- ✅ High school students nearby
- ✅ Young professionals in the area
- ✅ Anyone in that geographic community

## 🔧 Implementation Options

### Option 1: ZIP Code Entry (Simplest - 30 min)

**Onboarding Flow:**
1. Ask user to enter ZIP code
2. Look up campus(es) for that ZIP
3. User selects from available campuses in their area
4. Validate ZIP is real (API or local database)

**Pros:**
- ✅ Simple to implement
- ✅ Works without location permissions
- ✅ No privacy concerns

**Cons:**
- ⚠️ Users can lie about ZIP
- ⚠️ Need to maintain ZIP → Campus mapping

**Code:**
```javascript
// ZIP to Campus mapping
const ZIP_TO_CAMPUS = {
  '02138': ['Harvard University', 'Cambridge Community'],
  '02139': ['MIT', 'Cambridge Community'],
  '94305': ['Stanford University'],
  '02116': ['Boston University', 'Boston Community'],
  // ... etc
};

// Validate ZIP and show available campuses
const availableCampuses = ZIP_TO_CAMPUS[zipCode] || [];
```

### Option 2: Browser Geolocation (Recommended - 1 hour)

**Onboarding Flow:**
1. Request location permission
2. Get user's coordinates (lat/long)
3. Calculate distance to known campus centers
4. Show campuses within X miles
5. User confirms their campus

**Pros:**
- ✅ Accurate and hard to fake
- ✅ Auto-detects campus
- ✅ Great UX (one-click verification)
- ✅ Can set radius (e.g., "within 10 miles")

**Cons:**
- ⚠️ Requires location permission
- ⚠️ Privacy-sensitive
- ⚠️ Doesn't work if user denies permission

**Code:**
```javascript
// Get user location
navigator.geolocation.getCurrentPosition((position) => {
  const userLat = position.coords.latitude;
  const userLng = position.coords.longitude;

  // Find nearest campuses
  const nearbyCampuses = CAMPUS_LOCATIONS.filter(campus => {
    const distance = calculateDistance(userLat, userLng, campus.lat, campus.lng);
    return distance <= campus.radiusMiles;
  });
});
```

### Option 3: Reverse Geocoding (Advanced - 2 hours)

**Onboarding Flow:**
1. Get user coordinates (browser geolocation)
2. Call reverse geocoding API (Google Maps, Mapbox)
3. Extract ZIP code from coordinates
4. Map ZIP → Campus automatically
5. User just confirms

**Pros:**
- ✅ Most accurate
- ✅ Best UX (fully automated)
- ✅ Hard to fake
- ✅ Gets actual ZIP from location

**Cons:**
- ⚠️ Requires API key (Google Maps, Mapbox)
- ⚠️ Costs money (after free tier)
- ⚠️ API dependency

**Services:**
- **Google Maps Geocoding API** - Free: 200/day, $5/1000 after
- **Mapbox Geocoding API** - Free: 100k/month
- **OpenCage Geocoding** - Free: 2500/day

### Option 4: IP Geolocation (Fallback - 30 min)

**Onboarding Flow:**
1. Detect user's IP address (server-side)
2. Look up IP location (city/ZIP)
3. Suggest campuses in that area
4. User confirms

**Pros:**
- ✅ Works without user permission
- ✅ No client-side code needed
- ✅ Privacy-friendly

**Cons:**
- ⚠️ Less accurate (city-level, not street-level)
- ⚠️ VPNs can trick it
- ⚠️ Not reliable for small geographic areas

**Services:**
- **IPinfo.io** - Free: 50k/month
- **IP2Location** - Free: 500/day
- **ipapi** - Free: 1000/month

## 🎯 Recommended Hybrid Approach

**Phase 1: Onboarding**
1. **Try browser geolocation** first (Option 2)
2. **If denied**, fall back to ZIP entry (Option 1)
3. **Validate ZIP** with simple regex or API
4. **Show available campuses** within radius

**Phase 2: Ongoing Verification**
- **Periodic location checks** (once per week)
- **Geo-fence content** (only show campus content if user is near campus)
- **Flag suspicious behavior** (user suddenly in different city)

**Phase 3: Advanced**
- **Reverse geocoding** for precise campus detection
- **Multiple campus membership** (live between two campuses)
- **Travel mode** (visiting another campus temporarily)

## 📊 Campus Data Structure

```typescript
interface Campus {
  id: string;
  name: string;

  // Geographic data
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    state: string;
    zipCodes: string[]; // All ZIPs served by this campus
  };

  // Geo-fencing
  radiusMiles: number; // How far from center users can be

  // Verification
  requiresProximity: boolean; // Must be physically near to join?
  allowRemote: boolean; // Alumni/remote members allowed?

  // Stats
  memberCount: number;
  isActive: boolean;
}
```

## 🔒 Security Considerations

### 1. Location Spoofing Prevention

**Problem:** Users can fake GPS coordinates with browser extensions

**Solutions:**
- ✅ **IP + GPS cross-check** - IP location should roughly match GPS
- ✅ **Periodic re-verification** - Check location weekly
- ✅ **Behavior analysis** - Flag sudden location jumps
- ✅ **Device fingerprinting** - Detect if using emulator/VPN

### 2. Multi-Campus Gaming

**Problem:** User signs up from one ZIP, then accesses from anywhere

**Solutions:**
- ✅ **Active proximity check** - Must be near campus to post/vote
- ✅ **View-only mode** - Can view content from anywhere, but can't interact unless nearby
- ✅ **Travel mode** - Temporary access to other campuses (visitor badge)

### 3. Privacy Protection

**Problem:** Storing user locations is privacy-sensitive

**Solutions:**
- ✅ **Store ZIP only, not exact coordinates**
- ✅ **Don't track historical locations**
- ✅ **Let users opt out** (but with reduced features)
- ✅ **Clear privacy policy** about location usage

## 🚀 Implementation Plan

### Immediate (1 hour):

**Update Onboarding Flow:**
```javascript
// app/onboarding/page.tsx

// Step 1: Get location
const [location, setLocation] = useState(null);
const [zipCode, setZipCode] = useState('');

// Try browser geolocation first
const requestLocation = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
      // Find nearby campuses
      findNearbyCampuses(position.coords);
    },
    (error) => {
      // Fallback to ZIP entry
      setLocationDenied(true);
    }
  );
};

// Fallback: ZIP code entry
const handleZipEntry = (zip) => {
  // Validate ZIP
  if (!/^\d{5}$/.test(zip)) {
    setError('Please enter a valid 5-digit ZIP code');
    return;
  }

  // Find campuses for this ZIP
  const campuses = ZIP_TO_CAMPUS[zip] || [];
  setAvailableCampuses(campuses);
};
```

### Short Term (2 hours):

1. **Create campus location database** (Firebase collection)
2. **Build ZIP → Campus mapping**
3. **Add distance calculation** (Haversine formula)
4. **Implement proximity verification**

### Medium Term (4 hours):

1. **Integrate reverse geocoding API** (Mapbox/Google)
2. **Add periodic location re-verification**
3. **Build geo-fenced content delivery**
4. **Create admin dashboard** for campus management

## 📋 Data We Need

### Campus Setup:
```json
{
  "id": "harvard",
  "name": "Harvard University",
  "location": {
    "lat": 42.3770,
    "lng": -71.1167,
    "address": "Cambridge, MA 02138",
    "zipCodes": ["02138", "02139"]
  },
  "radiusMiles": 5,
  "requiresProximity": true,
  "allowRemote": false
}
```

### User Profile:
```json
{
  "id": "user123",
  "campus": "Harvard University",
  "campusId": "harvard",
  "verifiedAt": "2025-12-14",
  "zipCode": "02138",
  "isVerified": true,
  "lastLocationCheck": "2025-12-14"
}
```

---

## 🎯 Next Steps

**I can implement any of these options. Which approach do you prefer?**

1. **Simple ZIP entry** (30 min) - Good for MVP, easy to game
2. **Browser geolocation** (1 hour) - Best balance, recommended
3. **Full reverse geocoding** (2 hours) - Most accurate, costs money
4. **Hybrid approach** (1.5 hours) - Geo first, ZIP fallback

**Or should I implement the recommended hybrid approach now?**
