import React, { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Heart, CalendarDays } from "lucide-react";

const HeroSection = () => {
  const { currentTheme } = useTheme();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="container mx-auto px-6 flex flex-col justify-center items-center min-h-screen relative">
      {/* Floating Hearts Animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <Heart
            key={i}
            className={`absolute text-${currentTheme.accent} opacity-20 animate-pulse`}
            size={20 + i * 4}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className={`text-center z-10 ${animate ? 'animate-fade-in' : 'opacity-0'}`}>
        {/* Wedding Announcement */}
        <div className="mb-8">
          <p className={`text-${currentTheme.textSecondary} text-lg mb-2 font-light tracking-wider`}>
            The Wedding of
          </p>
          <div className="relative">
            <h1 className="text-4xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
              Anindias Rahayu
            </h1>
            <div className="flex items-center justify-center my-4">
              <div className={`h-px bg-gradient-to-r ${currentTheme.secondary} flex-1 max-w-16`}></div>
              <Heart className={`mx-4 text-${currentTheme.accent}`} size={24} fill="currentColor" />
              <div className={`h-px bg-gradient-to-l ${currentTheme.secondary} flex-1 max-w-16`}></div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Fachry
            </h1>
          </div>
        </div>

        {/* Wedding Date */}
        <div className={`bg-${currentTheme.card} backdrop-blur-md rounded-3xl p-8 border border-${currentTheme.border} shadow-2xl mb-8`}>
          <div className="flex items-center justify-center mb-4">
            <CalendarDays className={`text-${currentTheme.accent} mr-3`} size={24} />
            <h2 className="text-2xl font-semibold">Save the Date</h2>
          </div>
          <p className="text-3xl font-bold mb-2">December 24, 2025</p>
          <p className={`text-${currentTheme.textSecondary} text-lg`}>
            Gedung Serbaguna Komp. Sekneg
          </p>
          <p className={`text-${currentTheme.textSecondary}`}>
            Tangerang City, Banten
          </p>
        </div>

        {/* Quote */}
        <div className="max-w-md mx-auto">
          <blockquote className={`text-${currentTheme.textSecondary} italic text-center leading-relaxed`}>
            "Two souls becoming one, two hearts beating as one, 
            two lives joining together as one."
          </blockquote>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className={`w-6 h-10 border-2 border-${currentTheme.accent} rounded-full flex justify-center`}>
            <div className={`w-1 h-3 bg-${currentTheme.accent} rounded-full mt-2 animate-pulse`}></div>
          </div>
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;