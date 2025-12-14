export interface CO2Data {
  category: string;
  items: {
    [key: string]: {
      co2PerUnit: number; // grams of CO2 equivalent
      unit: string;
      impactLevel: 'low' | 'medium' | 'high';
      description: string;
      ecoTip: string;
      points: number;
    };
  };
}

export const co2Database: { [category: string]: CO2Data } = {
  food: {
    category: 'Food Items',
    items: {
      // Fruits and Vegetables (Low Impact)
      apple: {
        co2PerUnit: 12,
        unit: 'per piece',
        impactLevel: 'low',
        description: 'Fresh fruit with minimal processing and packaging',
        ecoTip: 'Choose local, seasonal apples to reduce transport emissions',
        points: 25
      },
      banana: {
        co2PerUnit: 18,
        unit: 'per piece',
        impactLevel: 'low',
        description: 'Tropical fruit with moderate transport impact',
        ecoTip: 'Look for fair-trade bananas to support sustainable farming',
        points: 25
      },
      orange: {
        co2PerUnit: 15,
        unit: 'per piece',
        impactLevel: 'low',
        description: 'Citrus fruit with low environmental impact',
        ecoTip: 'Buy organic oranges to avoid pesticide-related emissions',
        points: 25
      },
      lettuce: {
        co2PerUnit: 8,
        unit: 'per 100g',
        impactLevel: 'low',
        description: 'Leafy green with very low carbon footprint',
        ecoTip: 'Grow your own lettuce to achieve near-zero emissions',
        points: 30
      },
      tomato: {
        co2PerUnit: 22,
        unit: 'per 100g',
        impactLevel: 'low',
        description: 'Fresh vegetable with minimal environmental impact',
        ecoTip: 'Choose locally grown tomatoes to reduce transport emissions',
        points: 25
      },

      // Grains and Legumes (Low-Medium Impact)
      bread: {
        co2PerUnit: 340,
        unit: 'per loaf',
        impactLevel: 'medium',
        description: 'Processed grain product with moderate impact',
        ecoTip: 'Choose whole grain bread from local bakeries',
        points: 20
      },
      rice: {
        co2PerUnit: 150,
        unit: 'per 100g cooked',
        impactLevel: 'medium',
        description: 'Staple grain with methane emissions from cultivation',
        ecoTip: 'Try quinoa or other grains with lower water requirements',
        points: 20
      },

      // Dairy (Medium-High Impact)
      milk: {
        co2PerUnit: 320,
        unit: 'per 250ml',
        impactLevel: 'medium',
        description: 'Dairy product with significant livestock emissions',
        ecoTip: 'Try plant-based milk alternatives like oat or almond milk',
        points: 15
      },
      cheese: {
        co2PerUnit: 850,
        unit: 'per 100g',
        impactLevel: 'high',
        description: 'Dairy product with high processing and livestock emissions',
        ecoTip: 'Reduce cheese consumption or try plant-based alternatives',
        points: 10
      },

      // Meat (High Impact)
      beef: {
        co2PerUnit: 6100,
        unit: 'per 100g',
        impactLevel: 'high',
        description: 'Red meat with highest carbon footprint among foods',
        ecoTip: 'Replace with plant-based proteins to reduce emissions by 90%',
        points: 5
      },
      chicken: {
        co2PerUnit: 690,
        unit: 'per 100g',
        impactLevel: 'medium',
        description: 'Poultry with moderate livestock emissions',
        ecoTip: 'Choose free-range chicken or plant-based alternatives',
        points: 15
      },
      pork: {
        co2PerUnit: 1200,
        unit: 'per 100g',
        impactLevel: 'high',
        description: 'Red meat with significant environmental impact',
        ecoTip: 'Try plant-based meat substitutes for similar taste',
        points: 10
      },
      fish: {
        co2PerUnit: 280,
        unit: 'per 100g',
        impactLevel: 'medium',
        description: 'Seafood with variable impact depending on fishing method',
        ecoTip: 'Choose sustainably caught fish with MSC certification',
        points: 20
      }
    }
  },

  clothing: {
    category: 'Clothing',
    items: {
      cotton_tshirt: {
        co2PerUnit: 2100,
        unit: 'per item',
        impactLevel: 'medium',
        description: 'Cotton garment with water-intensive production',
        ecoTip: 'Choose organic cotton or recycled materials',
        points: 20
      },
      polyester_shirt: {
        co2PerUnit: 3200,
        unit: 'per item',
        impactLevel: 'high',
        description: 'Synthetic fabric with petroleum-based production',
        ecoTip: 'Look for recycled polyester or natural fiber alternatives',
        points: 15
      },
      jeans: {
        co2PerUnit: 3300,
        unit: 'per pair',
        impactLevel: 'high',
        description: 'Denim with water and chemical-intensive production',
        ecoTip: 'Buy quality jeans that last longer and wash less frequently',
        points: 15
      },
      wool_sweater: {
        co2PerUnit: 4500,
        unit: 'per item',
        impactLevel: 'high',
        description: 'Wool garment with livestock and processing emissions',
        ecoTip: 'Choose recycled wool or plant-based alternatives',
        points: 15
      },
      leather_shoes: {
        co2PerUnit: 8500,
        unit: 'per pair',
        impactLevel: 'high',
        description: 'Leather product with high livestock and tanning emissions',
        ecoTip: 'Consider vegan leather or recycled material shoes',
        points: 10
      },
      synthetic_shoes: {
        co2PerUnit: 4200,
        unit: 'per pair',
        impactLevel: 'medium',
        description: 'Synthetic footwear with petroleum-based materials',
        ecoTip: 'Look for shoes made from recycled or bio-based materials',
        points: 18
      }
    }
  },

  plastic: {
    category: 'Plastic & Waste',
    items: {
      plastic_bottle: {
        co2PerUnit: 82,
        unit: 'per 500ml bottle',
        impactLevel: 'high',
        description: 'Single-use plastic with high production and disposal impact',
        ecoTip: 'Use a reusable water bottle to save 1,460 bottles per year',
        points: 15
      },
      plastic_bag: {
        co2PerUnit: 6,
        unit: 'per bag',
        impactLevel: 'medium',
        description: 'Single-use plastic bag with pollution concerns',
        ecoTip: 'Bring reusable bags to eliminate plastic bag waste',
        points: 20
      },
      plastic_cup: {
        co2PerUnit: 25,
        unit: 'per cup',
        impactLevel: 'medium',
        description: 'Disposable plastic cup with single-use waste',
        ecoTip: 'Use a reusable cup or mug for beverages',
        points: 20
      },
      plastic_straw: {
        co2PerUnit: 2,
        unit: 'per straw',
        impactLevel: 'medium',
        description: 'Single-use plastic with marine pollution impact',
        ecoTip: 'Use metal, bamboo, or paper straws instead',
        points: 25
      },
      plastic_container: {
        co2PerUnit: 45,
        unit: 'per container',
        impactLevel: 'medium',
        description: 'Food packaging with recycling potential',
        ecoTip: 'Reuse containers or choose products with minimal packaging',
        points: 18
      }
    }
  },

  appliances: {
    category: 'Appliances',
    items: {
      refrigerator: {
        co2PerUnit: 1200,
        unit: 'per day (kWh)',
        impactLevel: 'high',
        description: 'Large appliance with continuous energy consumption',
        ecoTip: 'Choose Energy Star models and maintain proper temperature settings',
        points: 15
      },
      washing_machine: {
        co2PerUnit: 800,
        unit: 'per load',
        impactLevel: 'medium',
        description: 'Appliance with water and energy consumption',
        ecoTip: 'Wash in cold water and run full loads to reduce impact',
        points: 20
      },
      dishwasher: {
        co2PerUnit: 600,
        unit: 'per load',
        impactLevel: 'medium',
        description: 'Kitchen appliance with water and energy use',
        ecoTip: 'Run full loads and use eco mode to save energy',
        points: 20
      },
      air_conditioner: {
        co2PerUnit: 2500,
        unit: 'per day',
        impactLevel: 'high',
        description: 'High-energy appliance with significant emissions',
        ecoTip: 'Set temperature to 78°F and use fans to reduce usage',
        points: 10
      },
      television: {
        co2PerUnit: 150,
        unit: 'per day (8 hours)',
        impactLevel: 'medium',
        description: 'Entertainment device with moderate energy consumption',
        ecoTip: 'Turn off when not in use and choose energy-efficient models',
        points: 20
      },
      laptop: {
        co2PerUnit: 65,
        unit: 'per day (8 hours)',
        impactLevel: 'low',
        description: 'Computing device with relatively low energy use',
        ecoTip: 'Use power saving mode and unplug when fully charged',
        points: 25
      }
    }
  },

  transportation: {
    category: 'Transportation',
    items: {
      car_gasoline: {
        co2PerUnit: 250,
        unit: 'per km',
        impactLevel: 'high',
        description: 'Fossil fuel vehicle with direct emissions',
        ecoTip: 'Consider electric vehicles, public transport, or cycling',
        points: 10
      },
      car_electric: {
        co2PerUnit: 50,
        unit: 'per km',
        impactLevel: 'medium',
        description: 'Electric vehicle with grid electricity emissions',
        ecoTip: 'Charge with renewable energy for even lower impact',
        points: 20
      },
      bus: {
        co2PerUnit: 80,
        unit: 'per km per passenger',
        impactLevel: 'medium',
        description: 'Public transport with shared emissions',
        ecoTip: 'Excellent choice for reducing individual transport emissions',
        points: 25
      },
      train: {
        co2PerUnit: 45,
        unit: 'per km per passenger',
        impactLevel: 'low',
        description: 'Rail transport with efficient mass transit',
        ecoTip: 'One of the most efficient forms of long-distance travel',
        points: 28
      },
      bicycle: {
        co2PerUnit: 0,
        unit: 'per km',
        impactLevel: 'low',
        description: 'Zero-emission human-powered transport',
        ecoTip: 'Perfect choice! Cycling produces no emissions and improves health',
        points: 30
      },
      airplane: {
        co2PerUnit: 285,
        unit: 'per km per passenger',
        impactLevel: 'high',
        description: 'Aviation with high altitude emissions impact',
        ecoTip: 'Consider train travel for shorter distances or offset flights',
        points: 5
      },
      motorcycle: {
        co2PerUnit: 120,
        unit: 'per km',
        impactLevel: 'medium',
        description: 'Two-wheeler with moderate fuel consumption',
        ecoTip: 'Consider electric motorcycles or scooters',
        points: 18
      }
    }
  }
};

export function getCO2Data(category: string, item: string) {
  const categoryData = co2Database[category.toLowerCase()];
  if (!categoryData) return null;
  
  const itemData = categoryData.items[item.toLowerCase().replace(/\s+/g, '_')];
  return itemData || null;
}

export function searchCO2Data(searchTerm: string) {
  const results = [];
  const term = searchTerm.toLowerCase();
  
  for (const category of Object.values(co2Database)) {
    for (const [itemKey, itemData] of Object.entries(category.items)) {
      if (itemKey.includes(term) || itemData.description.toLowerCase().includes(term)) {
        results.push({
          key: itemKey,
          category: category.category,
          ...itemData
        });
      }
    }
  }
  
  return results;
}

export function getRandomCO2Fact(): string {
  const facts = [
    "Beef production generates 60x more CO₂ than vegetables per gram of protein",
    "A single plastic bottle takes 450 years to decompose in the environment",
    "Washing clothes in cold water reduces energy use by 90%",
    "Taking the train instead of flying reduces emissions by 80% for the same distance",
    "Food waste accounts for 8% of global greenhouse gas emissions",
    "Cycling 10km to work instead of driving saves 2.6kg CO₂ daily",
    "LED bulbs use 75% less energy than incandescent bulbs",
    "Eating plant-based one day per week saves 1,900 lbs CO₂ annually"
  ];
  
  return facts[Math.floor(Math.random() * facts.length)];
}