import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Home, MapPin, Phone, Star, Wifi, Car, Utensils, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

const Accommodation = () => {
  const { currentTheme } = useTheme();

  const hotels = [
    {
      id: 1,
      name: "Swiss-Belhotel Serpong",
      category: "Luxury Hotel",
      distance: "5 minutes from venue",
      rating: 4.5,
      priceRange: "IDR 800,000 - 1,200,000",
      address: "Jl. MH Thamrin No.1101, Serpong, Tangerang Selatan",
      phone: "+62 21 5315 8888",
      website: "https://www.swiss-belhotel.com/serpong",
      amenities: ["Free WiFi", "Pool", "Restaurant", "Gym", "Free Parking"],
      description: "Elegant 4-star hotel with modern amenities, perfect for wedding guests seeking luxury and comfort.",
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
      color: "blue"
    },
    {
      id: 2,
      name: "ASTON Serpong Hotel",
      category: "Business Hotel",
      distance: "8 minutes from venue",
      rating: 4.2,
      priceRange: "IDR 600,000 - 900,000",
      address: "Jl. Cisauk Lapan, Serpong Utara, Tangerang Selatan",
      phone: "+62 21 5315 7777",
      website: "https://www.astonhotels.com/serpong",
      amenities: ["Free WiFi", "Restaurant", "Meeting Room", "Free Parking", "24hr Service"],
      description: "Contemporary hotel offering comfortable accommodations with excellent service for business and leisure travelers.",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
      color: "green"
    },
    {
      id: 3,
      name: "RedDoorz Premium Near Summarecon",
      category: "Budget-Friendly",
      distance: "12 minutes from venue",
      rating: 4.0,
      priceRange: "IDR 300,000 - 500,000",
      address: "Jl. Gading Serpong Boulevard, Summarecon Serpong",
      phone: "+62 21 5000 3373",
      website: "https://www.reddoorz.com",
      amenities: ["Free WiFi", "AC", "TV", "24hr Security", "Near Mall"],
      description: "Clean and comfortable budget accommodation with modern amenities, close to shopping and dining options.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      color: "orange"
    }
  ];

  const colorMap = {
    blue: "from-blue-500 to-cyan-500",
    green: "from-green-500 to-emerald-500", 
    orange: "from-orange-500 to-red-500"
  };

  const openWebsite = (url) => {
    window.open(url, '_blank');
  };

  const callHotel = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };

  const openMaps = (address) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank');
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={16} className="text-yellow-400 fill-current" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" size={16} className="text-yellow-400 fill-current opacity-50" />);
    }

    return stars;
  };

  return (
    <div className="container mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Home className={`text-${currentTheme.accent} mr-3`} size={32} />
          <h2 className="text-4xl font-bold">Where to Stay</h2>
        </div>
        <p className={`text-${currentTheme.textSecondary} text-lg max-w-2xl mx-auto`}>
          We've selected some wonderful accommodation options near our wedding venue. Book early to secure your preferred choice!
        </p>
      </div>

      {/* Hotel Cards */}
      <div className="space-y-8 max-w-6xl mx-auto">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className={`bg-${currentTheme.card} backdrop-blur-md rounded-3xl overflow-hidden border border-${currentTheme.border} shadow-2xl hover:shadow-3xl transition-all duration-300`}
          >
            <div className="flex flex-col lg:flex-row">
              {/* Hotel Image */}
              <div className="lg:w-1/3 relative">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-64 lg:h-full object-cover"
                />
                <div className={`absolute top-4 left-4 bg-gradient-to-r ${colorMap[hotel.color]} text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg`}>
                  {hotel.category}
                </div>
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  {hotel.distance}
                </div>
              </div>

              {/* Hotel Details */}
              <div className="lg:w-2/3 p8">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold mb-2">{hotel.name}</h3>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center mr-4">
                        {renderStars(hotel.rating)}
                        <span className={`ml-2 text-${currentTheme.textSecondary} text-sm`}>
                          {hotel.rating}/5
                        </span>
                      </div>
                      <span className={`text-${currentTheme.accent} font-semibold`}>
                        {hotel.priceRange}
                      </span>
                    </div>
                    <p className={`text-${currentTheme.textSecondary} leading-relaxed`}>
                      {hotel.description}
                    </p>
                  </div>

                  {/* Address */}
                  <div className="mb-4">
                    <div className="flex items-start mb-2">
                      <MapPin className={`text-${currentTheme.accent} mr-2 mt-1 flex-shrink-0`} size={16} />
                      <span className={`text-${currentTheme.textSecondary} text-sm`}>
                        {hotel.address}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Phone className={`text-${currentTheme.accent} mr-2`} size={16} />
                      <button
                        onClick={() => callHotel(hotel.phone)}
                        className={`text-${currentTheme.accent} hover:underline text-sm font-medium`}
                      >
                        {hotel.phone}
                      </button>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {hotel.amenities.map((amenity, index) => {
                        const getAmenityIcon = (amenity) => {
                          if (amenity.includes('WiFi')) return <Wifi size={14} />;
                          if (amenity.includes('Parking')) return <Car size={14} />;
                          if (amenity.includes('Restaurant')) return <Utensils size={14} />;
                          return <Star size={14} />;
                        };

                        return (
                          <span
                            key={index}
                            className={`bg-${currentTheme.border}/30 text-${currentTheme.textSecondary} px-3 py-1 rounded-full text-sm flex items-center`}
                          >
                            <span className={`text-${currentTheme.accent} mr-1`}>
                              {getAmenityIcon(amenity)}
                            </span>
                            {amenity}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                    <Button
                      onClick={() => openWebsite(hotel.website)}
                      className={`flex-1 bg-gradient-to-r ${colorMap[hotel.color]} hover:opacity-90 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300`}
                    >
                      <ExternalLink size={16} className="mr-2" />
                      Book Now
                    </Button>
                    
                    <Button
                      onClick={() => openMaps(hotel.address)}
                      variant="outline"
                      className={`flex-1 border-${currentTheme.border} hover:bg-${currentTheme.border}/20`}
                    >
                      <MapPin size={16} className="mr-2" />
                      View on Map
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Transportation Info */}
      <div className={`bg-gradient-to-r ${currentTheme.secondary} rounded-3xl p-8 text-white shadow-2xl mt-12`}>
        <h3 className="text-2xl font-bold mb-6 text-center">Transportation Tips</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <Car className="mx-auto mb-3" size={32} />
            <h4 className="font-semibold mb-2">From Airport</h4>
            <p className="text-white/90 text-sm">
              Soekarno-Hatta Airport is 45 minutes away. We recommend booking airport transfer or ride-sharing services.
            </p>
          </div>
          
          <div className="text-center">
            <MapPin className="mx-auto mb-3" size={32} />
            <h4 className="font-semibold mb-2">Local Transport</h4>
            <p className="text-white/90 text-sm">
              Grab, Gojek, and Blue Bird taxis are readily available. Most hotels also offer shuttle services.
            </p>
          </div>
          
          <div className="text-center">
            <Phone className="mx-auto mb-3" size={32} />
            <h4 className="font-semibold mb-2">Need Help?</h4>
            <p className="text-white/90 text-sm">
              Contact us for assistance with bookings or transportation arrangements. We're happy to help!
            </p>
          </div>
        </div>
      </div>

      {/* Booking Tips */}
      <div className={`bg-${currentTheme.card} backdrop-blur-md rounded-2xl p-6 border border-${currentTheme.border} shadow-xl mt-8 max-w-2xl mx-auto`}>
        <h4 className="font-semibold mb-4 text-center">Booking Tips</h4>
        <ul className={`text-${currentTheme.textSecondary} space-y-2 text-sm`}>
          <li>• Book as early as possible for better rates and availability</li>
          <li>• Mention you're attending the Anindias & Fachry wedding for potential group discounts</li>
          <li>• Check cancellation policies in case plans change</li>
          <li>• Consider booking 2 nights (December 23-25) to avoid rush</li>
          <li>• Contact hotels directly for the best rates and special requests</li>
        </ul>
      </div>
    </div>
  );
};

export default Accommodation;