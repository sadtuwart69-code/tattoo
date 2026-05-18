export interface ZodiacAnimal {
  name: string;
  chinese: string;
  pinyin: string;
  years: string;
  meaning: string;
  personality: string;
  element: string;
  spiritMeaning: string;
  recommendedHanzi: string;
  recommendedHanziMeaning: string;
  styleTip: string;
}

export const ZODIAC_ANIMALS: ZodiacAnimal[] = [
  { 
    name: "Rat", 
    chinese: "鼠", 
    pinyin: "Shǔ", 
    years: "1924, 1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020", 
    meaning: "Intelligence & Vitality", 
    personality: "Quick-witted, resourceful, versatile, and kind.", 
    element: "Water",
    spiritMeaning: "Wisdom, Agility & The Survivor",
    recommendedHanzi: "睿智",
    recommendedHanziMeaning: "Acute Wisdom",
    styleTip: "Geometric lines or micro-tattoo focus."
  },
  { 
    name: "Ox", 
    chinese: "牛", 
    pinyin: "Niú", 
    years: "1925, 1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021", 
    meaning: "Diligence & Strength", 
    personality: "Diligent, dependable, strong, and determined.", 
    element: "Earth",
    spiritMeaning: "Unshakeable Strength & Resilience",
    recommendedHanzi: "坚韧",
    recommendedHanziMeaning: "Tenacity",
    styleTip: "Hardcore Blackwork with emphasis on muscle and horns."
  },
  { 
    name: "Tiger", 
    chinese: "虎", 
    pinyin: "Hǔ", 
    years: "1926, 1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022", 
    meaning: "Bravery & Power", 
    personality: "Brave, confident, competitive, and charming.", 
    element: "Wood",
    spiritMeaning: "Fearless, Solitude & Royalty",
    recommendedHanzi: "孤勇",
    recommendedHanziMeaning: "Lone Bravery",
    styleTip: "Ink Wash (Sui-boku) or Traditional Japanese style."
  },
  { 
    name: "Rabbit", 
    chinese: "兔", 
    pinyin: "Tù", 
    years: "1927, 1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023", 
    meaning: "Grace & Longevity", 
    personality: "Quiet, elegant, kind, and responsible.", 
    element: "Wood",
    spiritMeaning: "Elegance, Intuition & Vigilance",
    recommendedHanzi: "逸",
    recommendedHanziMeaning: "Hidden Transcendence",
    styleTip: "Minimalist single-needle or fine-line work."
  },
  { 
    name: "Dragon", 
    chinese: "龙", 
    pinyin: "Lóng", 
    years: "1928, 1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024", 
    meaning: "Luck & Authority", 
    personality: "Confident, intelligent, enthusiastic, and powerful.", 
    element: "Earth",
    spiritMeaning: "Divine Ruler & The Storm",
    recommendedHanzi: "潜龙",
    recommendedHanziMeaning: "Hidden Dragon (Power in reserve)",
    styleTip: "Cyberpunk neon or Dark Industrial heavy ink."
  },
  { 
    name: "Snake", 
    chinese: "蛇", 
    pinyin: "Shé", 
    years: "1929, 1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025", 
    meaning: "Wisdom & Mystery", 
    personality: "Enigmatic, intelligent, wise, and intuitive.", 
    element: "Fire",
    spiritMeaning: "Transformation, Mystery & Rebirth",
    recommendedHanzi: "蜕变",
    recommendedHanziMeaning: "Metamorphosis",
    styleTip: "Ouroboros shape or dotwork entwined with Hanzi."
  },
  { 
    name: "Horse", 
    chinese: "马", 
    pinyin: "Mǎ", 
    years: "1930, 1942, 1954, 1966, 1978, 1990, 2002, 2014, 2026", 
    meaning: "Freedom & Spirit", 
    personality: "Animated, active, energetic, and independent.", 
    element: "Fire",
    spiritMeaning: "Absolute Freedom & Wild Spirit",
    recommendedHanzi: "天马行空",
    recommendedHanziMeaning: "Boundless Imagination",
    styleTip: "Dynamic Ink splash, emphasizing running motion."
  },
  { 
    name: "Goat", 
    chinese: "羊", 
    pinyin: "Yáng", 
    years: "1931, 1943, 1955, 1967, 1979, 1991, 2003, 2015, 2027", 
    meaning: "Harmony & Peace", 
    personality: "Gentle, shy, stable, and sympathetic.", 
    element: "Earth",
    spiritMeaning: "The Climber & Calm Solitude",
    recommendedHanzi: "泰然",
    recommendedHanziMeaning: "Poise & Composure",
    styleTip: "Clean architectural lines or realist sketch."
  },
  { 
    name: "Monkey", 
    chinese: "猴", 
    pinyin: "Hóu", 
    years: "1932, 1944, 1956, 1968, 1980, 1992, 2004, 2016, 2028", 
    meaning: "Wits & Innovation", 
    personality: "Sharp, smart, curious, and mischievous.", 
    element: "Metal",
    spiritMeaning: "The Rebel & Immortal Power",
    recommendedHanzi: "齐天",
    recommendedHanziMeaning: "Equal to Heaven",
    styleTip: "Neo-traditional or Sage Wukong mask totem."
  },
  { 
    name: "Rooster", 
    chinese: "鸡", 
    pinyin: "Jī", 
    years: "1933, 1945, 1957, 1969, 1981, 1993, 2005, 2017, 2029", 
    meaning: "Fidelity & Punctuality", 
    personality: "Observant, hardworking, courageous, and talented.", 
    element: "Metal",
    spiritMeaning: "The Awakener & Bringer of Light",
    recommendedHanzi: "向阳",
    recommendedHanziMeaning: "Facing the Sun",
    styleTip: "Geometric sun totem integration."
  },
  { 
    name: "Dog", 
    chinese: "狗", 
    pinyin: "Gǒu", 
    years: "1934, 1946, 1958, 1970, 1982, 1994, 2006, 2018, 2030", 
    meaning: "Loyalty & Honesty", 
    personality: "Loyal, honest, amiable, and cautious.", 
    element: "Earth",
    spiritMeaning: "Absolute Loyalty & The Guardian",
    recommendedHanzi: "忠义",
    recommendedHanziMeaning: "Loyalty & Justice",
    styleTip: "Hard black/grey wolf-like guardian style."
  },
  { 
    name: "Pig", 
    chinese: "猪", 
    pinyin: "Zhū", 
    years: "1935, 1947, 1959, 1971, 1983, 1995, 2007, 2019, 2031", 
    meaning: "Wealth & Fortune", 
    personality: "Compassionate, generous, diligent, and calm.", 
    element: "Water",
    spiritMeaning: "Abundance & Hidden Wisdom",
    recommendedHanzi: "大智若愚",
    recommendedHanziMeaning: "Hidden Genius",
    styleTip: "Fine-line minimalist, avoiding bulky shapes."
  }
];
