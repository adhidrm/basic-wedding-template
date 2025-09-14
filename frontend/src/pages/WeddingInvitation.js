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
import MusicPlayer from "../components/MusicPlayer";
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
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      {/* Theme Switcher */}
      <ThemeSwitcher />

      {/* Music Player */}
      <MusicPlayer />

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 p-4">
        <div className={`bg-${currentTheme.card} backdrop-blur-md rounded-full border border-${currentTheme.border} shadow-2xl max-w-sm mx-auto`}>
          <div className="flex justify-around items-center py-2 px-2">
            {sections.slice(0, 5).map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    activeSection === section.id
                      ? `bg-gradient-to-r ${currentTheme.secondary} text-white shadow-lg scale-110`
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

      {/* Secondary Navigation */}
      <nav className="fixed top-4 right-4 z-50">
        <div className={`bg-${currentTheme.card} backdrop-blur-md rounded-2xl border border-${currentTheme.border} shadow-2xl`}>
          <div className="flex flex-col gap-1 p-1">
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
                  <Icon size={14} />
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

      <section id="gallery" className="min-h-screen flex items-center">
        <PhotoGallery />
      </section>

      <section id="timeline" className="min-h-screen flex items-center">
        <WeddingTimeline />
      </section>

      <section id="rsvp" className="min-h-screen flex items-center">
        <RSVPForm />
      </section>

      <section id="location" className="min-h-screen flex items-center">
        <MapLocation />
      </section>

      <section id="gifts" className="min-h-screen flex items-center">
        <GiftRegistry />
      </section>

      <section id="dress" className="min-h-screen flex items-center">
        <DressCode />
      </section>

      <section id="stay" className="min-h-screen flex items-center">
        <Accommodation />
      </section>
    </div>
  );
};

export default WeddingInvitation;