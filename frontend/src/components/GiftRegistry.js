import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Gift, ExternalLink, Heart } from "lucide-react";
import { Button } from "./ui/button";

const GiftRegistry = () => {
  const { currentTheme } = useTheme();

  const giftRegistries = [
    {
      id: 1,
      name: "Tokopedia Wedding Registry",
      description: "Home essentials and appliances for our new life together",
      url: "https://www.tokopedia.com/registry/anindias-fachry",
      logo: "https://images.tokopedia.net/img/cache/100-square/tOtlHD/2021/1/25/b12ac99f-4509-4b20-b6c6-36c50169e1f6.png",
      color: "green",
      items: ["Kitchen appliances", "Bedroom essentials", "Home decor"]
    },
    {
      id: 2,
      name: "Shopee Wishlist",
      description: "Personal items and lifestyle products we love",
      url: "https://shopee.co.id/wishlist/anindias-fachry-wedding",
      logo: "https://logos-world.net/wp-content/uploads/2020/11/Shopee-Logo.png",
      color: "orange",
      items: ["Fashion accessories", "Beauty products", "Tech gadgets"]
    },
    {
      id: 3,
      name: "Bank Transfer",
      description: "For those who prefer to give monetary gifts",
      bankInfo: {
        bankName: "Bank Central Asia (BCA)",
        accountNumber: "1234567890",
        accountName: "Anindias Rahayu Ningtyas"
      },
      color: "blue",
      items: ["Honeymoon fund", "New home fund", "Future savings"]
    }
  ];

  const openRegistry = (url) => {
    window.open(url, '_blank');
  };

  const copyBankInfo = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const colorMap = {
    green: "from-green-500 to-emerald-500",
    orange: "from-orange-500 to-red-500",
    blue: "from-blue-500 to-cyan-500"
  };

  return (
    <div className="container mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Gift className={`text-${currentTheme.accent} mr-3`} size={32} />
          <h2 className="text-4xl font-bold">Gift Registry</h2>
        </div>
        <p className={`text-${currentTheme.textSecondary} text-lg max-w-2xl mx-auto`}>
          Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a gift, we've created a registry to help us start our new life together.
        </p>
      </div>

      {/* Gift Options */}
      <div className="space-y-8 max-w-4xl mx-auto">
        {giftRegistries.map((registry) => (
          <div
            key={registry.id}
            className={`bg-${currentTheme.card} backdrop-blur-md rounded-3xl p-8 border border-${currentTheme.border} shadow-xl hover:shadow-2xl transition-all duration-300`}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Registry Info */}
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  {registry.logo ? (
                    <img 
                      src={registry.logo} 
                      alt={registry.name}
                      className="w-12 h-12 object-contain rounded-lg mr-4"
                    />
                  ) : (
                    <div className={`w-12 h-12 bg-gradient-to-r ${colorMap[registry.color]} rounded-lg flex items-center justify-center mr-4`}>
                      <Gift className="text-white" size={24} />
                    </div>
                  )}
                  <h3 className="text-2xl font-bold">{registry.name}</h3>
                </div>

                <p className={`text-${currentTheme.textSecondary} mb-4 leading-relaxed`}>
                  {registry.description}
                </p>

                {/* Items List */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {registry.items.map((item, index) => (
                    <span
                      key={index}
                      className={`bg-gradient-to-r ${colorMap[registry.color]} text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg`}
                    >
                      {item}
                    </span>
                  ))}
                </div>

                {/* Bank Info (if applicable) */}
                {registry.bankInfo && (
                  <div className={`bg-${currentTheme.border}/20 rounded-2xl p-4 mb-4`}>
                    <h4 className="font-semibold mb-3">Bank Transfer Details:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className={`text-${currentTheme.textSecondary}`}>Bank:</span>
                        <span className="font-medium">{registry.bankInfo.bankName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-${currentTheme.textSecondary}`}>Account Number:</span>
                        <button
                          onClick={() => copyBankInfo(registry.bankInfo.accountNumber)}
                          className={`font-mono font-medium text-${currentTheme.accent} hover:underline`}
                        >
                          {registry.bankInfo.accountNumber}
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-${currentTheme.textSecondary}`}>Account Name:</span>
                        <span className="font-medium">{registry.bankInfo.accountName}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="w-full md:w-auto">
                {registry.url ? (
                  <Button
                    onClick={() => openRegistry(registry.url)}
                    className={`w-full md:w-auto bg-gradient-to-r ${colorMap[registry.color]} hover:opacity-90 text-white font-semibold py-3 px-8 shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    <ExternalLink size={20} className="mr-2" />
                    Visit Registry
                  </Button>
                ) : (
                  <div className={`bg-gradient-to-r ${colorMap[registry.color]} text-white rounded-2xl p-4 text-center`}>
                    <Gift size={24} className="mx-auto mb-2" />
                    <p className="text-sm font-medium">Bank Transfer</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Thank You Message */}
      <div className={`bg-gradient-to-r ${currentTheme.secondary} rounded-3xl p-8 text-center shadow-2xl mt-12 max-w-2xl mx-auto`}>
        <Heart className="text-white mx-auto mb-4" size={48} fill="currentColor" />
        <h3 className="text-2xl font-bold text-white mb-4">Thank You</h3>
        <p className="text-white/90 leading-relaxed">
          Your love, support, and presence mean the world to us. Whether you choose to give a gift or simply celebrate with us, we are grateful for your part in our love story.
        </p>
        <p className="text-white/80 mt-4 italic">
          With love and gratitude,<br />
          Anindias & Fachry
        </p>
      </div>

      {/* Gift Guidelines */}
      <div className={`bg-${currentTheme.card} backdrop-blur-md rounded-2xl p-6 border border-${currentTheme.border} shadow-xl mt-8 max-w-2xl mx-auto`}>
        <h4 className="font-semibold mb-4 text-center">Gift Guidelines</h4>
        <ul className={`text-${currentTheme.textSecondary} space-y-2 text-sm`}>
          <li>• Gifts can be sent directly to our address or brought to the wedding</li>
          <li>• For monetary gifts, bank transfer is preferred for security</li>
          <li>• Please include your name when making transfers</li>
          <li>• Gift receipts can be sent to our email for thank you notes</li>
        </ul>
      </div>
    </div>
  );
};

export default GiftRegistry;