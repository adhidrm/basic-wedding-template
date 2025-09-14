import React, { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import HeroSection from "../components/HeroSection";
import CountdownTimer from "../components/CountdownTimer";
import PhotoGallery from "../components/PhotoGallery";
import WeddingTimeline from "../components/WeddingTimeline";
import RSVPForm from "../components/RSVPForm";
import MapLocation from "../components/MapLocation";
import GiftRegistry from "../components/GiftRegistry";
import DressCode from "../components/DressCode";
import Accommodation from "../components/Accommodation";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { Heart, Calendar, MapPin, Camera, Clock, Gift, Shirt, Home } from "lucide-react";

const WeddingInvitation = () => {
  const { currentTheme } = useTheme();
  const [activeSection, setActiveSection] = useState("hero");

  const sections = [
    { id: "hero", icon: Heart, label: "Home" },
    { id: "countdown", icon: Calendar, label: "Countdown" },
    { id: "gallery", icon: Camera, label: "Gallery" },
    { id: "timeline", icon: Clock, label: "Timeline" },
    { id: "rsvp", icon: MapPin, label: "RSVP" },
    { id: "location", icon: MapPin, label: "Location" },
    { id: "gifts", icon: Gift, label: "Gifts" },
    { id: "dress", icon: Shirt, label: "Dress Code" },
    { id: "stay", icon: Home, label: "Stay" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      const windowHeight = window.innerHeight;
      
      sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.primary} text-${currentTheme.text} relative overflow-x-hidden`}>
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      {/* Theme Switcher */}
      <ThemeSwitcher />

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 mx-4 mb-4">
        <div className={`bg-${currentTheme.card} backdrop-blur-md rounded-2xl border border-${currentTheme.border} shadow-2xl`}>
          <div className="flex justify-around items-center py-2">
            {sections.slice(0, 5).map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    activeSection === section.id
                      ? `bg-gradient-to-r ${currentTheme.secondary} text-white shadow-lg scale-110`
                      : `text-${currentTheme.textSecondary} hover:text-${currentTheme.accent} hover:scale-105`
                  }`}
                >
                  <Icon size={20} />
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Secondary Navigation */}
      <nav className="fixed top-4 right-4 z-50">
        <div className={`bg-${currentTheme.card} backdrop-blur-md rounded-2xl border border-${currentTheme.border} shadow-2xl`}>
          <div className="flex flex-col gap-1 p-2">
            {sections.slice(5).map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    activeSection === section.id
                      ? `bg-gradient-to-r ${currentTheme.secondary} text-white shadow-lg`
                      : `text-${currentTheme.textSecondary} hover:text-${currentTheme.accent} hover:scale-105`
                  }`}
                  title={section.label}
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Sections */}
      <section id="hero" className="min-h-screen">
        <HeroSection />
      </section>

      <section id="countdown" className="min-h-screen flex items-center">
        <CountdownTimer />
      </section>

      <section id="gallery" className="min-h-screen">
        <PhotoGallery />
      </section>

      <section id="timeline" className="min-h-screen">
        <WeddingTimeline />
      </section>

      <section id="rsvp" className="min-h-screen">
        <RSVPForm />
      </section>

      <section id="location" className="min-h-screen">
        <MapLocation />
      </section>

      <section id="gifts" className="min-h-screen">
        <GiftRegistry />
      </section>

      <section id="dress" className="min-h-screen">
        <DressCode />
      </section>

      <section id="stay" className="min-h-screen">
        <Accommodation />
      </section>
    </div>
  );
};

export default WeddingInvitation;