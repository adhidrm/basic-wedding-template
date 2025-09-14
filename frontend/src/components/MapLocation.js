import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { MapPin, Navigation, Car, Clock, Phone } from "lucide-react";
import { Button } from "./ui/button";

const MapLocation = () => {
  const { currentTheme } = useTheme();

  const venueInfo = {
    name: "Gedung Serbaguna Komp. Sekneg",
    address: "Komplek Sekretariat Negara, Jl. Komp. Sekneg, North Panunggangan, Pinang, Tangerang City, Banten 15143",
    coordinates: "-6.215443117529896, 106.64077840979753",
    googleMapsUrl: "https://maps.app.goo.gl/q66XoyNxHA2JcG1MA",
    phone: "+62 21 1234 5678", // Sample phone number
    parking: "Free parking available",
    accessibility: "Wheelchair accessible"
  };

  const openGoogleMaps = () => {
    window.open(venueInfo.googleMapsUrl, '_blank');
  };

  const openWaze = () => {
    const wazeUrl = `https://waze.com/ul?ll=${venueInfo.coordinates.replace(' ', '')}&navigate=yes`;
    window.open(wazeUrl, '_blank');
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(venueInfo.address);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  return (
    <div className="container mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <MapPin className={`text-${currentTheme.accent} mr-3`} size={32} />
          <h2 className="text-4xl font-bold">Wedding Location</h2>
        </div>
        <p className={`text-${currentTheme.textSecondary} text-lg max-w-md mx-auto`}>
          Join us at this beautiful venue for our special day
        </p>
      </div>

      {/* Venue Card */}
      <div className={`bg-${currentTheme.card} backdrop-blur-md rounded-3xl p-8 border border-${currentTheme.border} shadow-2xl mb-8`}>
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2">{venueInfo.name}</h3>
          <p className={`text-${currentTheme.textSecondary} text-lg leading-relaxed`}>
            {venueInfo.address}
          </p>
        </div>

        {/* Map Placeholder */}
        <div className="relative mb-6 rounded-2xl overflow-hidden shadow-xl">
          <div className="aspect-video bg-gradient-to-br from-green-900 to-blue-900 flex items-center justify-center">
            <div className="text-center">
              <MapPin size={48} className="text-white mx-auto mb-4" />
              <p className="text-white text-lg font-semibold mb-2">Interactive Map</p>
              <p className="text-white/80">Click the buttons below to navigate</p>
            </div>
          </div>
          
          {/* Venue marker overlay */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className={`bg-${currentTheme.accent} text-white rounded-full p-2 shadow-lg animate-pulse`}>
              <MapPin size={24} fill="currentColor" />
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Button
            onClick={openGoogleMaps}
            className={`bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300`}
          >
            <Navigation size={20} className="mr-2" />
            Open in Google Maps
          </Button>
          
          <Button
            onClick={openWaze}
            className={`bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300`}
          >
            <Car size={20} className="mr-2" />
            Navigate with Waze
          </Button>
        </div>

        {/* Venue Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className={`bg-${currentTheme.border}/20 rounded-2xl p-6`}>
            <h4 className="font-semibold mb-4 flex items-center">
              <Car className={`text-${currentTheme.accent} mr-2`} size={20} />
              Parking & Accessibility
            </h4>
            <ul className={`text-${currentTheme.textSecondary} space-y-2`}>
              <li>• {venueInfo.parking}</li>
              <li>• {venueInfo.accessibility}</li>
              <li>• Security available 24/7</li>
              <li>• Valet service provided</li>
            </ul>
          </div>

          <div className={`bg-${currentTheme.border}/20 rounded-2xl p-6`}>
            <h4 className="font-semibold mb-4 flex items-center">
              <Clock className={`text-${currentTheme.accent} mr-2`} size={20} />
              Important Times
            </h4>
            <ul className={`text-${currentTheme.textSecondary} space-y-2`}>
              <li>• Doors open: 2:00 PM</li>
              <li>• Ceremony starts: 3:00 PM</li>
              <li>• Reception: 5:30 PM</li>
              <li>• Event ends: 10:00 PM</li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-6 pt-6 border-t border-gray-700 text-center">
          <p className={`text-${currentTheme.textSecondary} mb-2`}>
            Need directions or have questions?
          </p>
          <div className="flex items-center justify-center">
            <Phone className={`text-${currentTheme.accent} mr-2`} size={16} />
            <a 
              href={`tel:${venueInfo.phone}`}
              className={`text-${currentTheme.accent} hover:underline font-semibold`}
            >
              {venueInfo.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Transportation Tips */}
      <div className={`bg-gradient-to-r ${currentTheme.secondary} rounded-3xl p-8 text-white shadow-2xl`}>
        <h3 className="text-2xl font-bold mb-6 text-center">Getting There</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <Car className="mx-auto mb-3" size={32} />
            <h4 className="font-semibold mb-2">By Car</h4>
            <p className="text-white/90 text-sm">
              30 minutes from Jakarta center. Free parking available with security.
            </p>
          </div>
          
          <div className="text-center">
            <Navigation className="mx-auto mb-3" size={32} />
            <h4 className="font-semibold mb-2">Public Transport</h4>
            <p className="text-white/90 text-sm">
              Take TransJakarta to Pinang Station, then taxi or online transport.
            </p>
          </div>
          
          <div className="text-center">
            <Clock className="mx-auto mb-3" size={32} />
            <h4 className="font-semibold mb-2">Travel Time</h4>
            <p className="text-white/90 text-sm">
              Allow extra time for traffic. We recommend arriving 30 minutes early.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapLocation;