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
    <div className="container mx-auto px-4 flex flex-col justify-center items-center min-h-screen relative">
      {/* Floating Hearts Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <Heart
            key={i}
            className={`absolute text-${currentTheme.accent} opacity-10 animate-pulse`}
            size={16 + i * 2}
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + i}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className={`text-center z-10 w-full max-w-sm ${animate ? 'animate-fade-in' : 'opacity-0'}`}>
        {/* Wedding Announcement */}
        <div className="mb-6">
          <p className={`text-${currentTheme.textSecondary} text-sm mb-3 font-light tracking-widest uppercase`}>
            The Wedding of
          </p>
          <div className="relative">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent leading-tight">
              Anindias Rahayu
            </h1>
            <div className="flex items-center justify-center my-3">
              <div className={`h-px bg-gradient-to-r ${currentTheme.secondary} flex-1 max-w-12`}></div>
              <Heart className={`mx-3 text-${currentTheme.accent}`} size={16} fill="currentColor" />
              <div className={`h-px bg-gradient-to-l ${currentTheme.secondary} flex-1 max-w-12`}></div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
              Fachry
            </h1>
          </div>
        </div>

        {/* Wedding Date */}
        <div className={`bg-${currentTheme.card} backdrop-blur-md rounded-2xl p-4 border border-${currentTheme.border} shadow-xl mb-6`}>
          <div className="flex items-center justify-center mb-3">
            <CalendarDays className={`text-${currentTheme.accent} mr-2`} size={18} />
            <h2 className="text-lg font-semibold">Save the Date</h2>
          </div>
          <p className="text-xl font-bold mb-1">December 24, 2025</p>
          <p className={`text-${currentTheme.textSecondary} text-sm`}>
            Gedung Serbaguna Komp. Sekneg
          </p>
          <p className={`text-${currentTheme.textSecondary} text-xs`}>
            Tangerang City, Banten
          </p>
        </div>

        {/* Quote */}
        <div className="max-w-xs mx-auto">
          <blockquote className={`text-${currentTheme.textSecondary} italic text-center text-sm leading-relaxed`}>
            "Two souls becoming one, two hearts beating as one, 
            two lives joining together as one."
          </blockquote>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className={`w-5 h-8 border-2 border-${currentTheme.accent} rounded-full flex justify-center`}>
            <div className={`w-1 h-2 bg-${currentTheme.accent} rounded-full mt-1 animate-pulse`}></div>
          </div>
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
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