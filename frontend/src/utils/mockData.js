// Mock data for the wedding invitation app
export const mockRSVPData = {
  rsvps: [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+62 812 3456 7890",
      attendance: "attending",
      guestCount: "2",
      dietaryRestrictions: "Vegetarian",
      message: "So excited to celebrate with you both! Can't wait for this magical day.",
      submittedAt: "2025-11-15T10:30:00Z"
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@email.com", 
      phone: "+62 811 2345 6789",
      attendance: "attending",
      guestCount: "1",
      dietaryRestrictions: "",
      message: "Congratulations! Looking forward to your special day.",
      submittedAt: "2025-11-12T14:20:00Z"
    },
    {
      id: 3,
      name: "Lisa Williams",
      email: "lisa.williams@email.com",
      phone: "+62 813 4567 8901",
      attendance: "not-attending",
      guestCount: "1",
      dietaryRestrictions: "",
      message: "Wishing you both all the happiness in the world! So sorry I can't make it, but I'll be thinking of you.",
      submittedAt: "2025-11-10T09:15:00Z"
    },
    {
      id: 4,
      name: "David Rodriguez",
      email: "david.rodriguez@email.com",
      phone: "+62 814 5678 9012",
      attendance: "maybe",
      guestCount: "2",
      dietaryRestrictions: "Halal",
      message: "Still trying to arrange travel plans. Will confirm soon!",
      submittedAt: "2025-11-08T16:45:00Z"
    },
    {
      id: 5,
      name: "Emma Thompson",
      email: "emma.thompson@email.com",
      phone: "+62 815 6789 0123",
      attendance: "attending",
      guestCount: "3",
      dietaryRestrictions: "No shellfish allergies",
      message: "We're so honored to be part of your celebration. The whole family is excited!",
      submittedAt: "2025-11-05T11:30:00Z"
    }
  ],
  
  // Wedding details for easy reference
  weddingDetails: {
    coupleNames: {
      bride: "Anindias Rahayu Ningtyas",
      groom: "Fachry"
    },
    date: "2025-12-24T15:00:00Z",
    venue: {
      name: "Gedung Serbaguna Komp. Sekneg",
      address: "Komplek Sekretariat Negara, Jl. Komp. Sekneg, North Panunggangan, Pinang, Tangerang City, Banten 15143",
      coordinates: "-6.215443117529896, 106.64077840979753",
      googleMapsUrl: "https://maps.app.goo.gl/q66XoyNxHA2JcG1MA"
    },
    rsvpDeadline: "2025-12-10T23:59:59Z"
  },

  // Sample guest comments/wishes
  guestWishes: [
    {
      id: 1,
      name: "Amanda Liu",
      message: "May your love story be filled with endless joy, laughter, and beautiful memories. Congratulations!",
      timestamp: "2025-11-16T08:20:00Z"
    },
    {
      id: 2,
      name: "Roberto Silva",
      message: "Two hearts becoming one! Wishing you a lifetime of love and happiness together.",
      timestamp: "2025-11-14T19:45:00Z"
    },
    {
      id: 3,
      name: "Priya Sharma",
      message: "Your love is an inspiration to all of us. May your wedding day be everything you've dreamed of!",
      timestamp: "2025-11-13T12:10:00Z"
    }
  ]
};

// Function to get RSVP statistics
export const getRSVPStats = () => {
  const rsvps = mockRSVPData.rsvps;
  return {
    total: rsvps.length,
    attending: rsvps.filter(r => r.attendance === 'attending').length,
    notAttending: rsvps.filter(r => r.attendance === 'not-attending').length,
    maybe: rsvps.filter(r => r.attendance === 'maybe').length,
    totalGuests: rsvps
      .filter(r => r.attendance === 'attending')
      .reduce((sum, r) => sum + parseInt(r.guestCount || 1), 0)
  };
};

// Function to add new RSVP (for frontend mock functionality)
export const addRSVP = (rsvpData) => {
  const newRSVP = {
    id: Date.now(),
    ...rsvpData,
    submittedAt: new Date().toISOString()
  };
  mockRSVPData.rsvps.push(newRSVP);
  return newRSVP;
};