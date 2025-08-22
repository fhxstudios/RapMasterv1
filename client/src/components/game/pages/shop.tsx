import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useGameState } from "@/hooks/use-game-state";
import { Button } from "@/components/ui/button";
import type { ShopItem } from "@shared/schema";

export default function ShopPage() {
  const { profile } = useGameState();
  const [activeCategory, setActiveCategory] = useState("lifestyle");

  const { data: shopItems, isLoading } = useQuery<ShopItem[]>({
    queryKey: ["/api/game/shop", activeCategory],
  });

  if (!profile) return null;

  const categories = [
    { id: "lifestyle", name: "Lifestyle" },
    { id: "studio", name: "Studio" },
    { id: "fashion", name: "Fashion" },
  ];

  const canAfford = (item: ShopItem) => {
    return profile.money >= item.price;
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold gradient-text text-center">Shop</h2>
      
      {/* Categories */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              activeCategory === category.id 
                ? 'game-electric-gradient text-white' 
                : 'bg-gray-600 text-white hover:bg-gray-500'
            }`}
            data-testid={`category-${category.id}`}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Items */}
      <div className="bg-game-card rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 capitalize">{activeCategory} Items</h3>
        {isLoading ? (
          <div className="text-gray-400 text-center py-4">Loading items...</div>
        ) : !shopItems || shopItems.length === 0 ? (
          <div className="text-gray-400 text-center py-4">No items available</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {shopItems.map((item) => (
              <div key={item.id} className="bg-game-dark rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-semibold flex items-center">
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </h4>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                  <div className="text-game-green text-sm">
                    {(item.reputationBoost || 0) > 0 && `+${item.reputationBoost} Reputation`}
                    {(item.fameBoost || 0) > 0 && ` +${item.fameBoost} Fame`}
                    {(item.fanBoost || 0) > 0 && ` +${item.fanBoost} Fans`}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-game-gold font-bold" data-testid={`price-${item.id}`}>
                    ${item.price}
                  </p>
                  <Button
                    disabled={!canAfford(item)}
                    className={`px-3 py-1 rounded text-white text-sm ${
                      canAfford(item)
                        ? 'game-electric-gradient hover:opacity-90'
                        : 'bg-gray-600 cursor-not-allowed'
                    }`}
                    data-testid={`button-buy-${item.id}`}
                  >
                    {canAfford(item) ? 'Buy' : `Need $${item.price - profile.money}`}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
