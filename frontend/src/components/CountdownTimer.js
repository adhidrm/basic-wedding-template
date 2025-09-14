import React, { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Calendar, Clock } from "lucide-react";

const CountdownTimer = () => {
  const { currentTheme } = useTheme();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const weddingDate = new Date("2025-12-24T00:00:00");
  const rsvpDeadline = new Date("2025-12-10T23:59:59");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isRSVPOpen = new Date() <= rsvpDeadline;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-3">
          <Clock className={`text-${currentTheme.accent} mr-2`} size={24} />
          <h2 className="text-2xl font-bold">Countdown to Forever</h2>
        </div>
        <p className={`text-${currentTheme.textSecondary} text-sm max-w-xs mx-auto`}>
          Every second brings us closer to our special day
        </p>
      </div>

      {/* Countdown Display */}
      <div className="grid grid-cols-4 gap-2 mb-8 max-w-sm mx-auto">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div
            key={unit}
            className={`bg-${currentTheme.card} backdrop-blur-md rounded-xl p-3 border border-${currentTheme.border} shadow-lg text-center transform hover:scale-105 transition-all duration-300`}
          >
            <div className={`text-2xl font-bold text-${currentTheme.accent} mb-1`}>
              {value.toString().padStart(2, '0')}
            </div>
            <div className={`text-${currentTheme.textSecondary} text-xs uppercase tracking-wider`}>
              {unit}
            </div>
          </div>
        ))}
      </div>

      {/* Wedding Date Card */}
      <div className={`bg-gradient-to-r ${currentTheme.secondary} rounded-2xl p-6 text-center shadow-xl mb-6 max-w-sm mx-auto`}>
        <Calendar className="text-white mx-auto mb-3" size={32} />
        <h3 className="text-xl font-bold text-white mb-1">December 24, 2025</h3>
        <p className="text-white/80 text-sm mb-3">Christmas Eve Wedding</p>
        <p className="text-white/70 text-xs leading-relaxed">
          Join us as we celebrate love, unity, and the beginning of our forever
        </p>
      </div>

      {/* RSVP Reminder */}
      <div className={`${isRSVPOpen ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'} border rounded-xl p-4 text-center max-w-sm mx-auto`}>
        <h4 className="text-lg font-semibold mb-2">
          {isRSVPOpen ? 'RSVP Still Open!' : 'RSVP Deadline Passed'}
        </h4>
        <p className={`text-${currentTheme.textSecondary} text-sm mb-2`}>
          Please respond by December 10, 2025
        </p>
        {isRSVPOpen && (
          <div className="flex justify-center items-center space-x-4 text-sm">
            {Object.entries({
              days: Math.floor((rsvpDeadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
              hours: Math.floor(((rsvpDeadline.getTime() - new Date().getTime()) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            }).map(([unit, value]) => (
              <div key={unit} className="text-center">
                <span className="text-lg font-bold text-green-400">{value}</span>
                <span className={`text-${currentTheme.textSecondary} text-xs block`}>{unit}</span>
              </div>
            ))}
            <span className={`text-${currentTheme.textSecondary} text-xs`}>left to RSVP</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountdownTimer;