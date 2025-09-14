import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Palette, X } from "lucide-react";
import { Button } from "./ui/button";

const ThemeSwitcher = () => {
  const { theme, changeTheme, themes, currentTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const handleThemeChange = (newTheme) => {
    changeTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <>
      {/* Theme Switcher Button */}
      <button
        onClick={togglePanel}
        className={`fixed top-4 left-4 z-50 bg-${currentTheme.card} backdrop-blur-md border border-${currentTheme.border} rounded-full p-3 shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-110`}
        title="Change Theme"
      >
        <Palette className={`text-${currentTheme.accent}`} size={20} />
      </button>

      {/* Theme Panel Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className={`bg-${currentTheme.card} backdrop-blur-md rounded-3xl p-8 border border-${currentTheme.border} shadow-2xl m-6 max-w-md w-full relative`}>
            {/* Close Button */}
            <button
              onClick={togglePanel}
              className={`absolute top-4 right-4 text-${currentTheme.textSecondary} hover:text-${currentTheme.accent} transition-colors duration-200`}
            >
              <X size={24} />
            </button>

            {/* Panel Header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-2">
                <Palette className={`text-${currentTheme.accent} mr-3`} size={24} />
                <h3 className="text-2xl font-bold">Choose Your Theme</h3>
              </div>
              <p className={`text-${currentTheme.textSecondary}`}>
                Personalize your wedding invitation experience
              </p>
            </div>

            {/* Theme Options */}
            <div className="space-y-3">
              {Object.entries(themes).map(([themeKey, themeData]) => (
                <button
                  key={themeKey}
                  onClick={() => handleThemeChange(themeKey)}
                  className={`w-full p-4 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                    theme === themeKey
                      ? `border-${currentTheme.accent} bg-${currentTheme.accent}/10 shadow-lg`
                      : `border-${currentTheme.border} hover:border-${currentTheme.accent}/50`
                  }`}
                >
                  <div className="flex items-center">
                    {/* Theme Preview */}
                    <div className="flex mr-4">
                      <div className={`w-6 h-6 rounded-l-full bg-gradient-to-r ${themeData.primary}`}></div>
                      <div className={`w-6 h-6 rounded-r-full bg-gradient-to-r ${themeData.secondary}`}></div>
                    </div>
                    
                    {/* Theme Info */}
                    <div className="flex-1 text-left">
                      <h4 className="font-semibold">{themeData.name}</h4>
                      <p className={`text-sm text-${currentTheme.textSecondary}`}>
                        {themeKey === 'elegant-dark' && 'Classic and sophisticated'}
                        {themeKey === 'romantic-blush' && 'Soft and romantic'}
                        {themeKey === 'golden-luxury' && 'Luxurious and warm'}
                        {themeKey === 'forest-green' && 'Natural and elegant'}
                      </p>
                    </div>

                    {/* Selected Indicator */}
                    {theme === themeKey && (
                      <div className={`w-6 h-6 rounded-full bg-${currentTheme.accent} flex items-center justify-center`}>
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-gray-700 text-center">
              <p className={`text-${currentTheme.textSecondary} text-sm`}>
                Your theme preference will be saved for your next visit
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ThemeSwitcher;