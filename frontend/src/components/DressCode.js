import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Shirt, Palette, Users, AlertCircle } from "lucide-react";

const DressCode = () => {
  const { currentTheme } = useTheme();

  const dressCodeOptions = [
    {
      id: 1,
      title: "Formal Evening Wear",
      description: "Elegant and sophisticated attire for our special celebration",
      forMen: [
        "Dark suit (black, navy, or charcoal gray)",
        "Dress shirt (white or light colored)",
        "Formal tie or bow tie",
        "Leather dress shoes",
        "Optional: Pocket square or cufflinks"
      ],
      forWomen: [
        "Cocktail dress or evening gown",
        "Midi or floor-length preferred",
        "Elegant blouse with dress pants/skirt",
        "Closed-toe heels or elegant flats",
        "Modest neckline and coverage"
      ],
      colors: {
        preferred: ["Navy blue", "Burgundy", "Emerald green", "Deep purple", "Blush pink"],
        avoid: ["White", "Ivory", "Cream", "Off-white", "Bright neon colors"]
      },
      icon: Shirt,
      gradient: "from-indigo-600 to-purple-600"
    }
  ];

  const colorPalette = {
    preferred: [
      { name: "Navy Blue", color: "bg-blue-900", textColor: "text-white" },
      { name: "Burgundy", color: "bg-red-900", textColor: "text-white" },
      { name: "Emerald", color: "bg-emerald-700", textColor: "text-white" },
      { name: "Deep Purple", color: "bg-purple-800", textColor: "text-white" },
      { name: "Blush Pink", color: "bg-pink-400", textColor: "text-white" }
    ],
    avoid: [
      { name: "White", color: "bg-white", textColor: "text-gray-800" },
      { name: "Ivory", color: "bg-yellow-50", textColor: "text-gray-800" },
      { name: "Cream", color: "bg-yellow-100", textColor: "text-gray-800" },
      { name: "Bright Neon", color: "bg-lime-400", textColor: "text-gray-800" }
    ]
  };

  return (
    <div className="container mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Shirt className={`text-${currentTheme.accent} mr-3`} size={32} />
          <h2 className="text-4xl font-bold">Dress Code</h2>
        </div>
        <p className={`text-${currentTheme.textSecondary} text-lg max-w-2xl mx-auto`}>
          We're excited to celebrate with you! Here's what we recommend wearing to help make our wedding photos beautiful and cohesive.
        </p>
      </div>

      {/* Main Dress Code Section */}
      {dressCodeOptions.map((option) => {
        const Icon = option.icon;
        return (
          <div
            key={option.id}
            className={`bg-${currentTheme.card} backdrop-blur-md rounded-3xl p-8 border border-${currentTheme.border} shadow-2xl mb-8`}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className={`inline-flex items-center bg-gradient-to-r ${option.gradient} text-white px-6 py-3 rounded-2xl shadow-lg mb-4`}>
                <Icon size={24} className="mr-3" />
                <h3 className="text-xl font-bold">{option.title}</h3>
              </div>
              <p className={`text-${currentTheme.textSecondary} text-lg max-w-xl mx-auto`}>
                {option.description}
              </p>
            </div>

            {/* Dress Code Details */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* For Men */}
              <div className={`bg-${currentTheme.border}/20 rounded-2xl p-6`}>
                <div className="flex items-center mb-4">
                  <Users className={`text-${currentTheme.accent} mr-3`} size={20} />
                  <h4 className="text-xl font-semibold">For Men</h4>
                </div>
                <ul className={`text-${currentTheme.textSecondary} space-y-3`}>
                  {option.forMen.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className={`w-2 h-2 bg-${currentTheme.accent} rounded-full mt-2 mr-3 flex-shrink-0`}></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* For Women */}
              <div className={`bg-${currentTheme.border}/20 rounded-2xl p-6`}>
                <div className="flex items-center mb-4">
                  <Users className={`text-${currentTheme.accent} mr-3`} size={20} />
                  <h4 className="text-xl font-semibold">For Women</h4>
                </div>
                <ul className={`text-${currentTheme.textSecondary} space-y-3`}>
                  {option.forWomen.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className={`w-2 h-2 bg-${currentTheme.accent} rounded-full mt-2 mr-3 flex-shrink-0`}></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}

      {/* Color Palette Guide */}
      <div className={`bg-${currentTheme.card} backdrop-blur-md rounded-3xl p-8 border border-${currentTheme.border} shadow-2xl mb-8`}>
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Palette className={`text-${currentTheme.accent} mr-3`} size={24} />
            <h3 className="text-2xl font-bold">Color Palette Guide</h3>
          </div>
          <p className={`text-${currentTheme.textSecondary}`}>
            Help us create beautiful, cohesive wedding photos
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Preferred Colors */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-400">✓ Preferred Colors</h4>
            <div className="grid grid-cols-2 gap-3">
              {colorPalette.preferred.map((color, index) => (
                <div
                  key={index}
                  className={`${color.color} ${color.textColor} rounded-xl p-4 text-center font-medium shadow-lg`}
                >
                  {color.name}
                </div>
              ))}
            </div>
          </div>

          {/* Colors to Avoid */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-red-400">✗ Please Avoid</h4>
            <div className="grid grid-cols-2 gap-3">
              {colorPalette.avoid.map((color, index) => (
                <div
                  key={index}
                  className={`${color.color} ${color.textColor} rounded-xl p-4 text-center font-medium shadow-lg border-2 border-red-400`}
                >
                  {color.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Guidelines */}
      <div className={`bg-gradient-to-r ${currentTheme.secondary} rounded-3xl p-8 text-white shadow-2xl mb-8`}>
        <div className="text-center mb-6">
          <AlertCircle className="mx-auto mb-3" size={32} />
          <h3 className="text-2xl font-bold mb-2">Important Notes</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-semibold mb-3">Weather Considerations</h4>
            <ul className="space-y-2 text-white/90">
              <li>• December weather can be warm and humid</li>
              <li>• Some activities may be outdoors</li>
              <li>• Bring a light jacket for air-conditioned areas</li>
              <li>• Comfortable shoes recommended</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Cultural Considerations</h4>
            <ul className="space-y-2 text-white/90">
              <li>• Modest attire is appreciated</li>
              <li>• Avoid overly revealing clothing</li>
              <li>• Traditional Indonesian attire welcome</li>
              <li>• Respect religious customs</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Fashion Inspiration */}
      <div className={`bg-${currentTheme.card} backdrop-blur-md rounded-2xl p-6 border border-${currentTheme.border} shadow-xl text-center`}>
        <h4 className="font-semibold mb-4">Need Fashion Inspiration?</h4>
        <p className={`text-${currentTheme.textSecondary} mb-4`}>
          Still unsure about what to wear? Feel free to reach out to us for suggestions or send us a photo of your outfit choice!
        </p>
        <p className={`text-${currentTheme.accent} font-medium`}>
          Contact: anindias.fachry@wedding.com
        </p>
      </div>
    </div>
  );
};

export default DressCode;