import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Clock, MapPin, Users, Utensils, Music, Camera } from "lucide-react";

const WeddingTimeline = () => {
  const { currentTheme } = useTheme();

  const timelineEvents = [
    {
      id: 1,
      time: "14:00",
      title: "Guest Arrival & Reception",
      description: "Welcome drinks and light refreshments while guests arrive",
      location: "Main Hall Entrance",
      icon: Users,
      color: "blue"
    },
    {
      id: 2,
      time: "15:00",
      title: "Wedding Ceremony",
      description: "Exchange of vows and rings in the presence of family and friends",
      location: "Gedung Serbaguna Main Hall",
      icon: Clock,
      color: "rose"
    },
    {
      id: 3,
      time: "16:00",
      title: "Photo Session",
      description: "Couple and family photos with professional photographer",
      location: "Garden Area",
      icon: Camera,
      color: "purple"
    },
    {
      id: 4,
      time: "17:30",
      title: "Cocktail Hour",
      description: "Drinks and appetizers while we prepare for dinner",
      location: "Outdoor Terrace",
      icon: Utensils,
      color: "amber"
    },
    {
      id: 5,
      time: "19:00",
      title: "Wedding Dinner",
      description: "Traditional Indonesian cuisine and international dishes",
      location: "Main Dining Hall",
      icon: Utensils,
      color: "green"
    },
    {
      id: 6,
      time: "21:00",
      title: "Entertainment & Dancing",
      description: "Live music, traditional performances, and dancing",
      location: "Main Hall",
      icon: Music,
      color: "indigo"
    }
  ];

  const colorMap = {
    blue: "from-blue-500 to-cyan-500",
    rose: "from-rose-500 to-pink-500",
    purple: "from-purple-500 to-violet-500",
    amber: "from-amber-500 to-yellow-500",
    green: "from-green-500 to-emerald-500",
    indigo: "from-indigo-500 to-blue-500"
  };

  return (
    <div className="container mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Clock className={`text-${currentTheme.accent} mr-3`} size={32} />
          <h2 className="text-4xl font-bold">Wedding Day Timeline</h2>
        </div>
        <p className={`text-${currentTheme.textSecondary} text-lg max-w-md mx-auto`}>
          December 24, 2025 - A day to remember forever
        </p>
      </div>

      {/* Timeline */}
      <div className="relative max-w-4xl mx-auto">
        {/* Timeline line */}
        <div className={`absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b ${currentTheme.secondary} transform md:-translate-x-1/2`}></div>

        {timelineEvents.map((event, index) => {
          const Icon = event.icon;
          const isEven = index % 2 === 0;
          
          return (
            <div
              key={event.id}
              className={`relative flex items-center mb-12 ${
                isEven ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Timeline dot */}
              <div className={`absolute left-8 md:left-1/2 w-4 h-4 bg-gradient-to-r ${colorMap[event.color]} rounded-full transform md:-translate-x-1/2 z-10 shadow-lg`}></div>
              
              {/* Content */}
              <div className={`ml-20 md:ml-0 md:w-1/2 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
                <div className={`bg-${currentTheme.card} backdrop-blur-md rounded-2xl p-6 border border-${currentTheme.border} shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}>
                  {/* Time badge */}
                  <div className={`inline-flex items-center bg-gradient-to-r ${colorMap[event.color]} text-white px-4 py-1 rounded-full text-sm font-semibold mb-4 shadow-lg`}>
                    <Clock size={14} className="mr-2" />
                    {event.time}
                  </div>

                  {/* Event details */}
                  <div className="flex items-start mb-3">
                    <div className={`bg-gradient-to-r ${colorMap[event.color]} p-2 rounded-xl mr-4 flex-shrink-0`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                      <p className={`text-${currentTheme.textSecondary} mb-3 leading-relaxed`}>
                        {event.description}
                      </p>
                      <div className="flex items-center">
                        <MapPin size={16} className={`text-${currentTheme.accent} mr-2`} />
                        <span className={`text-${currentTheme.textSecondary} text-sm`}>
                          {event.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Important Notes */}
      <div className={`bg-gradient-to-r ${currentTheme.secondary} rounded-3xl p-8 text-center shadow-2xl mt-12`}>
        <h3 className="text-2xl font-bold text-white mb-4">Important Notes</h3>
        <div className="grid md:grid-cols-2 gap-4 text-white/90">
          <div className="text-left">
            <h4 className="font-semibold mb-2">Arrival Time</h4>
            <p className="text-sm">Please arrive by 2:00 PM to ensure you don't miss any special moments</p>
          </div>
          <div className="text-left">
            <h4 className="font-semibold mb-2">Parking</h4>
            <p className="text-sm">Free parking available at the venue with security supervision</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeddingTimeline;