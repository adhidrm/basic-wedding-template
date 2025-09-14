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
    <div className="container mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Clock className={`text-${currentTheme.accent} mr-3`} size={32} />
          <h2 className="text-4xl font-bold">Countdown to Forever</h2>
        </div>
        <p className={`text-${currentTheme.textSecondary} text-lg max-w-md mx-auto`}>
          Every second brings us closer to our special day
        </p>
      </div>

      {/* Countdown Display */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div
            key={unit}
            className={`bg-${currentTheme.card} backdrop-blur-md rounded-2xl p-6 border border-${currentTheme.border} shadow-xl text-center transform hover:scale-105 transition-all duration-300`}
          >
            <div className={`text-4xl font-bold text-${currentTheme.accent} mb-2`}>
              {value.toString().padStart(2, '0')}
            </div>
            <div className={`text-${currentTheme.textSecondary} text-sm uppercase tracking-wider`}>
              {unit}
            </div>
          </div>
        ))}
      </div>

      {/* Wedding Date Card */}
      <div className={`bg-gradient-to-r ${currentTheme.secondary} rounded-3xl p-8 text-center shadow-2xl mb-8`}>
        <Calendar className="text-white mx-auto mb-4" size={48} />
        <h3 className="text-3xl font-bold text-white mb-2">December 24, 2025</h3>
        <p className="text-white/80 text-lg mb-4">Christmas Eve Wedding</p>
        <p className="text-white/70">
          Join us as we celebrate love, unity, and the beginning of our forever
        </p>
      </div>

      {/* RSVP Reminder */}
      <div className={`${isRSVPOpen ? 'bg-green-900/30 border-green-500' : 'bg-red-900/30 border-red-500'} border rounded-2xl p-6 text-center`}>
        <h4 className="text-xl font-semibold mb-2">
          {isRSVPOpen ? 'RSVP Still Open!' : 'RSVP Deadline Passed'}
        </h4>
        <p className={`text-${currentTheme.textSecondary} mb-2`}>
          Please respond by December 10, 2025
        </p>
        {isRSVPOpen && (
          <div className="flex justify-center">
            {Object.entries({
              days: Math.floor((rsvpDeadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
              hours: Math.floor(((rsvpDeadline.getTime() - new Date().getTime()) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            }).map(([unit, value]) => (
              <div key={unit} className="mx-2">
                <span className="text-2xl font-bold text-green-400">{value}</span>
                <span className={`text-${currentTheme.textSecondary} text-sm ml-1`}>{unit}</span>
              </div>
            ))}
            <span className={`text-${currentTheme.textSecondary} ml-2`}>left to RSVP</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountdownTimer;