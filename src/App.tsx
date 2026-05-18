import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}
import { Search, PenTool, BookOpen, Share2, Info, RefreshCw, Feather, Download, LayoutGrid, ExternalLink, Menu, X, Sparkles } from 'lucide-react';
import { HEXAGRAMS, Hexagram } from './hexagrams';
import { ZODIAC_ANIMALS, ZodiacAnimal } from './zodiac';

interface TattooOption {
  chinese: string;
  traditional: string;
  pinyin: string;
  literal: string;
  meaning: string;
  calligraphy: string;
}

const FONTS = [
  { name: 'Regular 楷书', value: 'font-["Ma_Shan_Zheng"]', family: 'Ma Shan Zheng' },
  { name: 'Clerical 隶书', value: 'font-["ZCOOL_XiaoWei"]', family: 'ZCOOL XiaoWei' },
  { name: 'Cursive 草书', value: 'font-["Zhi_Mang_Xing"]', family: 'Zhi Mang Xing' },
  { name: 'Modern 黑体', value: 'font-["Noto_Sans_SC"]', family: 'Noto Sans SC' },
];

const ORNAMENT_STYLES = [
  'minimal',
  'mandala',
  'tribal',
  'zen-burst',
  'geometric-pulse',
  'cloud'
];

const STATIC_FALLBACKS: Record<string, TattooOption[]> = {
  "strength": [
    { chinese: "力", traditional: "力", pinyin: "lì", literal: "Power / Strength", meaning: "The fundamental character for power, physical force, and inner strength.", calligraphy: "Best in bold, thick strokes like Modern or Regular script." },
    { chinese: "强", traditional: "強", pinyin: "qiáng", literal: "Strong / Powerful", meaning: "Represents durability, mental fortitude, and being superior in capability.", calligraphy: "Suits a slightly cursive or semi-cursive style." }
  ],
  "peace": [
    { chinese: "和", traditional: "和", pinyin: "hé", literal: "Harmony", meaning: "A profound concept of balance and peaceful coexistence within oneself and the world.", calligraphy: "Requires a balanced, elegant style like Clerical script." },
    { chinese: "安", traditional: "安", pinyin: "ān", literal: "Peace / Calm", meaning: "Depicts a woman under a roof, symbolizing safety, stillness, and domestic peace.", calligraphy: "Very beautiful in regular script." }
  ],
  "love": [
    { chinese: "爱", traditional: "愛", pinyin: "ài", literal: "Love / Affection", meaning: "The universal character for love, encompassing romantic, familial, and compassionate affection.", calligraphy: "Most expressive in Cursive or Semi-cursive scripts." },
    { chinese: "仁", traditional: "仁", pinyin: "rén", literal: "Benevolence", meaning: "Confucian concept of human-heartedness and compassionate love for others.", calligraphy: "Suits an archival, traditional Regular script." }
  ],
  "wisdom": [
    { chinese: "智", traditional: "智", pinyin: "zhì", literal: "Wisdom", meaning: "Combining 'knowledge' and 'sun', it represents the brightness of mind and deep understanding.", calligraphy: "Excellent for Clerical or Regular scripts." },
    { chinese: "慧", traditional: "慧", pinyin: "huì", literal: "Insight", meaning: "Focuses on the purity of thought and intuitive wisdom.", calligraphy: "Suits a delicate, balanced brush style." }
  ],
  "courage": [
    { chinese: "勇", traditional: "勇", pinyin: "yǒng", literal: "Brave / Courage", meaning: "Combining 'strength' with a symbol of readiness, it represents valor and fearlessness.", calligraphy: "Needs a dynamic, energetic brush style." }
  ],
  "freedom": [
    { chinese: "自", traditional: "自", pinyin: "zì", literal: "Self", meaning: "The starting point of freedom - the self or origin.", calligraphy: "Suits any strong, independent script." },
    { chinese: "由", traditional: "由", pinyin: "yóu", literal: "Origin / Cause", meaning: "Used with 'Zì' to form 'Zìyóu' (Freedom). It implies flow and spontaneity.", calligraphy: "Modern script looks great." }
  ],
  "faith": [
    { chinese: "信", traditional: "信", pinyin: "xìn", literal: "Faith / Trust", meaning: "Combining 'person' and 'word', it signifies being true to one's word and having trust.", calligraphy: "Excellent in Regular script." },
    { chinese: "念", traditional: "念", pinyin: "niàn", literal: "Idea / Belief", meaning: "Represents the present heart/mind, often used for spiritual faith or recurring thought.", calligraphy: "Suits a modern, clean brush style." }
  ],
  "dragon": [
    { chinese: "龙", traditional: "龍", pinyin: "lóng", literal: "Dragon", meaning: "The symbol of imperial power, strength, and good fortune.", calligraphy: "Historically powerful in Seal script or very expressive Cursive." }
  ],
  "spirit": [
    { chinese: "灵", traditional: "靈", pinyin: "líng", literal: "Spirit / Soul", meaning: "Refers to the ethereal soul, intelligence, or the magical/spiritual essence of things.", calligraphy: "Beautiful in Traditional Regular script." }
  ],
  "family": [
    { chinese: "家", traditional: "家", pinyin: "jiā", literal: "Family / Home", meaning: "A roof over a pig (ancient symbol of wealth), representing the core of one's life and belonging.", calligraphy: "Very iconic in any classic brush style." }
  ],
  "warrior": [
    { chinese: "武", traditional: "武", pinyin: "wǔ", literal: "Martial / Warrior", meaning: "Literally 'to stop a spear', representing the true essence of a warrior: the strength to bring peace.", calligraphy: "Strength-focused scripts like Northern Wei look best." }
  ],
  "infinity": [
    { chinese: "恒", traditional: "恆", pinyin: "héng", literal: "Eternal / Constant", meaning: "Constant movement of the heart, representing infinity, endurance, and eternity.", calligraphy: "Suits a horizontal, balanced Clerical script." }
  ],
  "loyalty": [
    { chinese: "忠", traditional: "忠", pinyin: "zhōng", literal: "Loyalty / Devotion", meaning: "The heart centered and unwavering. Ancient virtue of faithfulness to one's center.", calligraphy: "Requires a solid, upright Regular script." }
  ],
  "respect": [
    { chinese: "敬", traditional: "敬", pinyin: "jìng", literal: "Respect", meaning: "Showing reverence and honor through alert attention and care.", calligraphy: "Best in formal, structured scripts." }
  ],
  "hope": [
    { chinese: "望", traditional: "望", pinyin: "wàng", literal: "Hope / Gaze", meaning: "To look towards the distance with expectation and desire.", calligraphy: "Suits a semi-cursive, forward-moving style." }
  ],
  "grace": [
    { chinese: "雅", traditional: "雅", pinyin: "yǎ", literal: "Elegance / Grace", meaning: "Refinement, correct standard, and polished beauty.", calligraphy: "Beautiful in thin-stroke Regular script." }
  ],
  "destiny": [
    { chinese: "缘", traditional: "緣", pinyin: "yuán", literal: "Fated Chance", meaning: "The invisible thread that brings people and events together; predestined relationship.", calligraphy: "Most romantic in Cursive scripts." }
  ],
  "dream": [
    { chinese: "梦", traditional: "夢", pinyin: "mèng", literal: "Dream", meaning: "Vision of the night, or a profound ambition and aspiration for the future.", calligraphy: "Dreamlike in abstract Cursive styles." }
  ],
  "truth": [
    { chinese: "真", traditional: "真", pinyin: "zhēn", literal: "Truth / Reality", meaning: "That which is genuine, sincere, and perfectly real.", calligraphy: "Suits direct, unadorned Regular script." }
  ],
  "power": [
    { chinese: "力", traditional: "力", pinyin: "lì", literal: "Power", meaning: "Physical strength and energy.", calligraphy: "Bold strokes." },
    { chinese: "权", traditional: "權", pinyin: "quán", literal: "Authority", meaning: "Power to rule or influence.", calligraphy: "Formal style." }
  ],
  "tranquility": [
    { chinese: "静", traditional: "靜", pinyin: "jìng", literal: "Tranquility", meaning: "Stillness of heart and mind.", calligraphy: "Delicate style." }
  ],
  "bravery": [
    { chinese: "勇", traditional: "勇", pinyin: "yǒng", literal: "Bravery", meaning: "Acts of valor.", calligraphy: "Dynamic style." }
  ],
  "eternal": [
    { chinese: "永", traditional: "永", pinyin: "yǒng", literal: "Eternal", meaning: "Forever; without end. A classic calligraphy character.", calligraphy: "The 'Eight Principles of Yong' character." }
  ],
  "fate": [
    { chinese: "命", traditional: "命", pinyin: "mìng", literal: "Life / Destiny", meaning: "The command of heaven; one's lot in life.", calligraphy: "Solemn style." }
  ],
  "cat": [
    { chinese: "猫", traditional: "貓", pinyin: "māo", literal: "Cat", meaning: "A symbol of agility, curiosity, and mystery in many cultures; in China, also a guardian of homes.", calligraphy: "Playful Semi-cursive style." }
  ],
  "猫": [
    { chinese: "猫", traditional: "貓", pinyin: "māo", literal: "Cat", meaning: "The Chinese character for 'cat'. Symbol of luck and agility.", calligraphy: "Classic Clerical or Regular script." }
  ],
  "dog": [
    { chinese: "犬", traditional: "犬", pinyin: "quǎn", literal: "Dog", meaning: "Symbol of loyalty, protection, and faithfulness.", calligraphy: "Strong Regular script." },
    { chinese: "狗", traditional: "狗", pinyin: "gǒu", literal: "Dog", meaning: "The common character for dog, often meaning fidelity.", calligraphy: "Any legible script." }
  ],
  "狗": [
    { chinese: "狗", traditional: "狗", pinyin: "gǒu", literal: "Dog", meaning: "Common character for dog.", calligraphy: "Regular script." }
  ],
  "tiger": [
    { chinese: "虎", traditional: "虎", pinyin: "hǔ", literal: "Tiger", meaning: "King of beasts in China, symbol of courage, protection from evil, and kingly power.", calligraphy: "Needs aggressive, powerful brushwork." }
  ],
  "虎": [
    { chinese: "虎", traditional: "虎", pinyin: "hǔ", literal: "Tiger", meaning: "The character for Tiger.", calligraphy: "Seal script is very popular for this." }
  ],
  "phoenix": [
    { chinese: "凤", traditional: "鳳", pinyin: "fèng", literal: "Phoenix", meaning: "Symbol of high virtue, grace, and rebirth; representing the feminine aspect (dual with Dragon).", calligraphy: "Sleek, refined strokes." }
  ],
  "sun": [
    { chinese: "日", traditional: "日", pinyin: "rì", literal: "Sun", meaning: "The source of light, life, and the yang principle.", calligraphy: "Ancient Seal script looks very cosmic." }
  ],
  "moon": [
    { chinese: "月", traditional: "月", pinyin: "yuè", literal: "Moon", meaning: "Symbol of beauty, change, and the yin principle.", calligraphy: "Elegant Regular script." }
  ]
};

function GoogleAd() {
  const adRef = useRef<HTMLModElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    
    try {
      if (window.adsbygoogle && adRef.current && !adRef.current.getAttribute('data-adsbygoogle-status')) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        initialized.current = true;
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className="w-full h-32 mb-20 flex items-center justify-center bg-paper/30 border border-ink/5 rounded-3xl overflow-hidden relative">
      <ins 
           ref={adRef}
           className="adsbygoogle"
           style={{ display: 'block', width: '100%', height: '100%' }}
           data-ad-client="ca-pub-4000152233223084"
           data-ad-slot=""
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      <span className="absolute inset-0 flex items-center justify-center -z-10 text-[10px] uppercase tracking-widest font-bold text-ink/5 italic">
        Advertisement
      </span>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<'translate' | 'hexagrams' | 'zodiac'>('translate');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<TattooOption[]>([]);
  const [currentSearch, setCurrentSearch] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeFont, setActiveFont] = useState(FONTS[0]);
  const [inspiration, setInspiration] = useState<{ chinese: string; pinyin: string; meaning: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [zodiacStyles, setZodiacStyles] = useState<Record<string, { style: string, seed: number, mode: 'calligraphy' | 'totem' }>>({});
  const [birthDate, setBirthDate] = useState("");
  const [foundZodiac, setFoundZodiac] = useState<string | null>(null);

  useEffect(() => {
    fetchInspiration();
    const initialStyles: Record<string, { style: string, seed: number, mode: 'calligraphy' | 'totem' }> = {};
    ZODIAC_ANIMALS.forEach(a => {
      initialStyles[a.name] = { style: 'minimal', seed: Math.random(), mode: 'calligraphy' };
    });
    setZodiacStyles(initialStyles);
  }, []);

  const calculateZodiac = (dateStr: string) => {
    if (!dateStr) return;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return;
    
    // Yearly offset: 1924 is Rat
    const year = date.getFullYear();
    const zodiacs = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
    const index = (year - 1924) % 12;
    const result = zodiacs[index < 0 ? index + 12 : index];
    setFoundZodiac(result);
    
    // Scroll to the element
    setTimeout(() => {
      const el = document.getElementById(`zodiac-${result}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const fetchInspiration = async () => {
    // Check cache first
    const cached = localStorage.getItem('inspiration_cache');
    const cachedTime = localStorage.getItem('inspiration_time');
    const now = new Date().getTime();
    
    if (cached && cachedTime && (now - parseInt(cachedTime)) < 1000 * 60 * 60 * 12) { // 12 hour cache
      try {
        setInspiration(JSON.parse(cached));
        return;
      } catch (e) {
        localStorage.removeItem('inspiration_cache');
      }
    }

    try {
      const res = await fetch('/api/inspiration');
      const contentType = res.headers.get("content-type");
      
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Inspiration API returned non-JSON");
      }

      const data = await res.json();
      
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to fetch inspiration");
      }

      setInspiration(data);
      localStorage.setItem('inspiration_cache', JSON.stringify(data));
      localStorage.setItem('inspiration_time', now.toString());
    } catch (e) {
      console.error("Inspiration fetch failed:", e);
      // Random Fallbacks for better variation when quota is hit
      const fallbacks = [
        { chinese: "定", pinyin: "dìng", meaning: "To decide, to settle, to be calm and steady." },
        { chinese: "悟", pinyin: "wù", meaning: "Enlightenment, to realize, to perceive the truth." },
        { chinese: "勇", pinyin: "yǒng", meaning: "Courage, valor, the strength to face fear." },
        { chinese: "宁", pinyin: "níng", meaning: "Peace, tranquility, serenity in the heart." },
        { chinese: "志", pinyin: "zhì", meaning: "Ambition, will, purpose in life." }
      ];
      setInspiration(fallbacks[Math.floor(Math.random() * fallbacks.length)]);
    }
  };

  const handleSearch = async (targetInput?: string, e?: React.FormEvent) => {
    e?.preventDefault();
    const finalInput = targetInput || input;
    if (!finalInput.trim()) return;

    const query = finalInput.trim().toLowerCase();
    
    // For UI feedback, sync input state if it came from a button
    if (targetInput) setInput(targetInput);
    setCurrentSearch(query);
    
    // Check static fallbacks first (to save quota for everyone)
    if (STATIC_FALLBACKS[query]) {
      setResults(STATIC_FALLBACKS[query]);
      setSelectedIdx(0);
      setError(null);
      setLoading(false);
      return;
    }
    
    // Check cache next
    const cached = localStorage.getItem(`cache_${query}`);
    if (cached) {
      try {
        const data = JSON.parse(cached);
        setResults(data);
        setSelectedIdx(0);
        setError(null);
        setLoading(false);
        return;
      } catch (err) {
        localStorage.removeItem(`cache_${query}`);
      }
    }

    setLoading(true);
    setError(null);
    setResults([]);
    console.log("Searching for:", query);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: query }),
      });
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Non-JSON response:", text);
        throw new Error(`Server returned non-JSON response (${res.status}). Expected JSON.`);
      }

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || `Server error: ${res.status}`);
      }
      
      console.log("Translation results:", data);
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setResults(data.options || []);
      setSelectedIdx(0);
      
      // Save to cache
      if (data.options && data.options.length > 0) {
        localStorage.setItem(`cache_${query}`, JSON.stringify(data.options));
      }
    } catch (e: any) {
      console.error("Search failed:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const getZodiacTotem = (animal: string, seed: number) => {
    const s = Math.floor(seed * 1000);
    const r = (val: number, range: number = 60) => val + (s % (range * 2)) - range;
    const strokeWidth = 3 + (s % 18);
    const opacity = 0.15 + ((s % 50) / 100);
    const rot = (s % 360);
    const scale = 0.75 + ((s % 50) / 100);
    const dash = (s % 3) === 0 ? "none" : `${(s%30)+5} ${(s%20)+5}`;

    const totems: Record<string, string> = {
      Rat: `
        <g transform="translate(400 400) rotate(${s % 40 - 20}) scale(${scale}) translate(-400 -400)">
          <circle cx="400" cy="400" r="${r(180, 100)}" opacity="${opacity / 2}" fill="${(s%2===0)?'currentColor':'none'}" stroke="${(s%2===0)?'none':'currentColor'}" stroke-width="2"/>
          <path d="M400 ${r(250, 60)} Q${r(600, 80)} ${r(250, 80)} ${r(550, 60)} 400 T400 ${r(550, 60)} T${r(250, 60)} 400 T400 250" stroke-width="${strokeWidth/2}" stroke-dasharray="${dash}"/>
          <circle cx="${r(380, 50)}" cy="${r(380, 50)}" r="${5+s%10}" fill="currentColor"/>
        </g>
      `,
      Ox: `
        <g transform="rotate(${s % 10 - 5} 400 400)">
          <path d="M${r(300, 50)} ${r(200, 50)} L400 400 L${r(500, 50)} ${r(200, 50)} M${r(350,40)} ${r(450,40)} Q400 ${r(650,80)} ${r(450,40)} 450" stroke-width="${strokeWidth}" stroke-linecap="round"/>
          <path d="M250 ${r(250, 30)} Q400 ${r(150, 50)} 550 250" stroke-width="${strokeWidth/3}"/>
        </g>
      `,
      Tiger: `
        <g transform="rotate(${s % 45} 400 400)">
          <path d="M250 ${r(300, 20)} H550 M250 ${r(350, 20)} H550 M250 ${r(400, 20)} H550" stroke-width="${strokeWidth*2.2}" opacity="0.6"/>
          <path d="M400 ${r(150, 50)} V650 M320 ${r(250, 30)} H480" stroke-width="${strokeWidth/1.5}"/>
          <circle cx="400" cy="400" r="${r(360,60)}" stroke-dasharray="20 40" opacity="${opacity}"/>
        </g>
      `,
      Dragon: `
        <path d="M150 400 C150 ${r(50,80)} 650 ${r(50,80)} 650 400 S150 ${r(750,80)} 150 400" stroke-width="${strokeWidth*2}" stroke-dasharray="${20+s%50} 15" opacity="0.7"/>
        <circle cx="400" cy="400" r="${r(120,40)}" opacity="${opacity}"/>
        <path d="M400 300 Q${r(400,100)} 400 400 500" stroke-width="4" opacity="0.2"/>
      `,
      Snake: `
        <g transform="rotate(${rot} 400 400)">
           <path d="M400 ${r(80, 50)} C${r(650, 100)} 100 650 400 400 400 S150 ${r(720, 100)} 400 720" stroke-width="${strokeWidth}"/>
           <path d="M400 ${r(380, 10)} L${r(440, 20)} ${r(440, 20)} M400 380 L${r(360, 20)} ${r(440, 20)}" stroke-width="${strokeWidth/1.8}"/>
        </g>
      `,
      Horse: `
        <path d="M${r(250, 60)} ${r(650, 60)} Q300 300 650 150 M300 650 Q300 400 600 250" stroke-width="${strokeWidth*1.2}" stroke-linecap="round"/>
        <circle cx="400" cy="400" r="${r(380,40)}" stroke-dasharray="2 ${r(30, 20)}" opacity="${opacity}"/>
      `,
      Goat: `
        <path d="M${r(250, 50)} ${r(250, 50)} Q400 ${r(400, 80)} 550 250 M320 250 L320 650 M480 250 L480 650" stroke-width="${strokeWidth}"/>
        <rect x="${r(340, 20)}" y="${r(280, 20)}" width="120" height="${r(120, 40)}" opacity="${opacity}" fill="currentColor"/>
      `,
      Monkey: `
        <circle cx="400" cy="400" r="${r(280,70)}" stroke-width="3" stroke-dasharray="10 10" opacity="0.2"/>
        <path d="M${r(320, 30)} ${r(320, 30)} Q400 ${r(200, 50)} 480 320 T400 480 T320 320" stroke-width="${strokeWidth*1.5}"/>
      `,
      Rooster: `
        <path d="M400 ${r(150, 40)} L${r(480, 30)} 400 L400 ${r(650, 40)} L${r(320, 30)} 400 Z" opacity="${opacity*2.5}" fill="currentColor"/>
        <circle cx="400" cy="400" r="390" stroke-dasharray="1 ${r(60,30)}" stroke-width="${strokeWidth*3}"/>
      `,
      Dog: `
        <path d="M${r(250, 50)} ${r(250, 50)} L400 ${r(550, 50)} L${r(550, 50)} 250" stroke-width="${strokeWidth*2.5}"/>
        <path d="M${r(350, 20)} ${r(150, 50)} V450 M${r(450, 20)} 150 V450" stroke-width="${strokeWidth/2}" opacity="${opacity}"/>
      `,
      Pig: `
        <circle cx="400" cy="400" r="${r(220,50)}" stroke-dasharray="${r(15,10)} ${r(8,4)}" stroke-width="2"/>
        <circle cx="${r(360,10)}" cy="${r(370,10)}" r="${r(12,6)}"/>
        <circle cx="${r(440,10)}" cy="${r(370,10)}" r="${r(12,6)}"/>
        <path d="M300 450 Q400 550 500 450" stroke-width="1" opacity="0.1"/>
      `
    };
    return totems[animal] || totems['Rat'];
  };

  const getZodiacOrnament = (style: string, seed: number) => {
    const s = Math.floor(seed * 1000);
    if (style === 'mandala') {
      return `
        <circle cx="400" cy="400" r="380" stroke-dasharray="4 12" opacity="0.3"/>
        <circle cx="400" cy="400" r="320" stroke-width="0.5"/>
        <path d="M400 20 Q450 150 400 280 Q350 150 400 20" fill="currentColor" opacity="0.1"/>
        <path d="M400 780 Q450 650 400 520 Q350 650 400 780" fill="currentColor" opacity="0.1"/>
        <path d="M20 400 Q150 450 280 400 Q150 350 20 400" fill="currentColor" opacity="0.1"/>
        <path d="M780 400 Q650 450 520 400 Q650 350 780 400" fill="currentColor" opacity="0.1"/>
        ${Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45) * (Math.PI / 180);
          const x = 400 + Math.cos(angle) * 220;
          const y = 400 + Math.sin(angle) * 220;
          return `<circle cx="${x}" cy="${y}" r="40" stroke-width="1" fill="none" opacity="0.4"/>`;
        }).join('')}
      `;
    }
    if (style === 'tribal') {
      return `
        <path d="M400 50 C400 200 ${200 + (s%400)} 300 400 400 S${600 - (s%400)} 600 400 750" stroke-width="8" stroke-linecap="round" opacity="0.6"/>
        <path d="M50 400 C200 400 300 ${200 + (s%400)} 400 400 S600 ${600 - (s%400)} 750 400" stroke-width="8" stroke-linecap="round" opacity="0.6"/>
        <circle cx="400" cy="400" r="360" stroke-dasharray="30 20" stroke-width="4" />
        <path d="M250 250 Q400 100 550 250 T250 250" fill="currentColor" opacity="0.2"/>
        <path d="M250 550 Q400 700 550 550 T250 550" fill="currentColor" opacity="0.2"/>
      `;
    }
    if (style === 'zen-burst') {
      return `
        <circle cx="400" cy="400" r="300" stroke-width="20" stroke-dasharray="1 40" opacity="0.2"/>
        ${Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 15 + (s % 15)) * (Math.PI / 180);
          const x2 = 400 + Math.cos(angle) * (350 + (s % 50));
          const y2 = 400 + Math.sin(angle) * (350 + (s % 50));
          return `<line x1="400" y1="400" x2="${x2}" y2="${y2}" opacity="0.4" stroke-width="${i % 2 === 0 ? 2 : 0.5}"/>`;
        }).join('')}
        <circle cx="400" cy="400" r="380" stroke-width="1" opacity="0.1"/>
      `;
    }
    if (style === 'geometric-pulse') {
      const rot = s % 360;
      return `
        <rect x="100" y="100" width="600" height="600" transform="rotate(${rot} 400 400)" stroke-width="1" opacity="0.2"/>
        <rect x="150" y="150" width="500" height="500" transform="rotate(${rot + 45} 400 400)" stroke-width="2" opacity="0.3"/>
        <rect x="200" y="200" width="400" height="400" transform="rotate(${rot + 22} 400 400)" stroke-width="4" opacity="0.4"/>
        <circle cx="400" cy="400" r="350" stroke-width="1" stroke-dasharray="5 5" />
      `;
    }
    return `
      <path d="M100 300 Q150 250 200 300 T300 300 T400 300 T500 300 T600 300 T700 300" stroke-width="2" opacity="0.3"/>
      <path d="M100 500 Q150 450 200 500 T300 500 T400 500 T500 500 T600 500 T700 500" stroke-width="2" opacity="0.3"/>
      <circle cx="400" cy="400" r="330" fill="none" stroke-width="40" stroke-dasharray="1 60" opacity="0.1"/>
      <path d="M400 200 A200 200 0 0 1 400 600 A200 200 0 0 1 400 200" stroke-width="1" stroke-dasharray="10 10"/>
    `;
  };

  const ZodiacSVGPreview = ({ animal, text, fontFamily, style, seed, mode, className = "" }: { animal: string, text: string, fontFamily: string, style: string, seed: number, mode: 'calligraphy' | 'totem', className?: string }) => {
    return (
      <svg viewBox="0 0 800 800" className={`w-full h-full ${className}`} xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="800" fill="#f5f2ed" opacity="0.05" />
        <g stroke="currentColor" fill="none" strokeWidth="2" className="text-crimson">
          {mode === 'calligraphy' ? (
            <>
              <g dangerouslySetInnerHTML={{ __html: getZodiacOrnament(style, seed) }} />
              <text 
                x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" 
                fontFamily={`'${fontFamily}', serif`} fontSize="380" fill="currentColor" className="text-ink"
              >
                {text}
              </text>
            </>
          ) : (
             <g className="text-ink">
               <g dangerouslySetInnerHTML={{ __html: getZodiacTotem(animal, seed) }} />
               <text 
                x="50%" y="90%" dominantBaseline="middle" textAnchor="middle" 
                fontFamily={`'${fontFamily}', serif`} fontSize="60" fill="currentColor" opacity="0.8"
              >
                {text}
              </text>
             </g>
          )}
        </g>
        <text x="50%" y="97%" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#1a1a1a" opacity="0.2">STENCIL READY &bull; TATTOO.CCWU.CC</text>
      </svg>
    );
  };

  const downloadSVG = (text: string, fontFamily: string, type: 'tattoo' | 'hexagram' | 'zodiac', extra?: any) => {
    let svgContent = '';
    if (type === 'tattoo') {
      svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <style type="text/css">
      @import url('https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}&amp;display=swap');
    </style>
  </defs>
  <rect width="100%" height="100%" fill="#f5f2ed" />
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="'${fontFamily}', serif" font-size="200" fill="#1a1a1a">${text}</text>
  <text x="50%" y="85%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="#a01c1c" opacity="0.3">Authentic Tattoo Design - CCWU.CC</text>
</svg>`;
    } else if (type === 'hexagram') {
      const hex = HEXAGRAMS.find(h => h.name === text);
      if (!hex) return;
      const lines = hex.binary.split('').reverse();
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 100 100">
        <rect width="100%" height="100%" fill="#f5f2ed" />
        <g transform="translate(10, 15)">
        ${lines.map((bit, i) => bit === '1' 
          ? `<rect x="0" y="${i * 12}" width="80" height="6" fill="#1a1a1a" />` 
          : `<rect x="0" y="${i * 12}" width="35" height="6" fill="#1a1a1a" /><rect x="45" y="${i * 12}" width="35" height="6" fill="#1a1a1a" />`
        ).join('')}
        </g>
        <text x="50" y="95" font-family="serif" font-size="6" text-anchor="middle" fill="#a01c1c">${hex.name} - ${hex.meaning}</text>
      </svg>`;
    } else if (type === 'zodiac') {
      const { style, seed, mode, animal } = extra || { style: 'minimal', seed: 0, mode: 'calligraphy', animal: 'Tiger' };
      const ornament = mode === 'calligraphy' ? getZodiacOrnament(style, seed) : getZodiacTotem(animal, seed);
      const mainContent = mode === 'calligraphy' 
        ? `<text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="'${fontFamily}', serif" font-size="320" fill="#1a1a1a">${text}</text>`
        : `<g stroke="#1a1a1a" fill="none" stroke-width="2">${getZodiacTotem(animal, seed)}</g><text x="50%" y="90%" text-anchor="middle" font-family="'${fontFamily}', serif" font-size="60" fill="#1a1a1a">${text}</text>`;
      
      svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <style type="text/css">
      @import url('https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}&amp;display=swap');
    </style>
  </defs>
  <rect width="100%" height="100%" fill="#f5f2ed" />
  <g stroke="#a01c1c" fill="none" stroke-width="2" opacity="0.4">
    ${ornament}
  </g>
  ${mainContent}
  <text x="50%" y="95%" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#1a1a1a" opacity="0.2">STENCIL READY DESIGN &bull; TATTOO.CCWU.CC</text>
</svg>`;
    }

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${text.replace(/\s+/g, '_')}_design.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedOption = results[selectedIdx] || (results.length > 0 ? results[0] : null);

  const HexagramIcon = ({ binary, className = "" }: { binary: string, className?: string }) => {
    const lines = binary.split('').reverse(); 
    return (
      <svg width="40" height="60" viewBox="0 0 40 60" className={`inline-block ${className}`}>
        {lines.map((bit, i) => (
          <React.Fragment key={i}>
            {bit === '1' ? (
              <rect x="5" y={5 + i * 8} width="30" height="4" fill="currentColor" />
            ) : (
              <>
                <rect x="5" y={5 + i * 8} width="12" height="4" fill="currentColor" />
                <rect x="23" y={5 + i * 8} width="12" height="4" fill="currentColor" />
              </>
            )}
          </React.Fragment>
        ))}
      </svg>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center max-w-7xl mx-auto px-4 relative overflow-hidden select-none">
      {/* Background Texture */}
      <img 
        src="/src/assets/images/chinese_ink_wash_bg_1779089776813.png" 
        alt="" 
        className="fixed inset-0 w-full h-full object-cover opacity-10 pointer-events-none -z-10"
        referrerPolicy="no-referrer"
      />
      
      {/* Navigation */}
      <nav className="w-full flex items-center justify-between py-6 mb-8 border-b border-ink/5 relative z-20">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => { setView('translate'); setMobileMenuOpen(false); }}
        >
          <Feather className="text-crimson w-6 h-6 group-hover:rotate-12 transition-transform" />
          <span className="font-serif text-xl tracking-wider">Tattoo CCWU</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => setView('translate')}
            className={`text-sm uppercase tracking-widest font-medium transition-colors cursor-pointer ${view === 'translate' ? 'text-crimson' : 'text-ink/60 hover:text-ink'}`}
          >
            Design Generator
          </button>
          <button 
            onClick={() => setView('hexagrams')}
            className={`text-sm uppercase tracking-widest font-medium transition-colors cursor-pointer ${view === 'hexagrams' ? 'text-crimson' : 'text-ink/60 hover:text-ink'}`}
          >
            64 Hexagrams
          </button>
          <button 
            onClick={() => setView('zodiac')}
            className={`text-sm uppercase tracking-widest font-medium transition-colors cursor-pointer ${view === 'zodiac' ? 'text-crimson' : 'text-ink/60 hover:text-ink'}`}
          >
            Zodiac Signs
          </button>
          <a 
            href="https://sadtuwart69-code.github.io/Oriental-Oracle/" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm uppercase tracking-widest font-medium text-ink/60 hover:text-ink transition-colors cursor-pointer"
          >
            Oriental Oracle <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="cursor-pointer">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 z-50 bg-paper flex flex-col items-center justify-center gap-8 p-8"
          >
            <button onClick={() => { setView('translate'); setMobileMenuOpen(false); }} className="text-2xl font-serif cursor-pointer">Design Generator</button>
            <button onClick={() => { setView('hexagrams'); setMobileMenuOpen(false); }} className="text-2xl font-serif cursor-pointer">I Ching 64 Hexagrams</button>
            <button onClick={() => { setView('zodiac'); setMobileMenuOpen(false); }} className="text-2xl font-serif cursor-pointer">Zodiac Signs</button>
            <a href="https://sadtuwart69-code.github.io/Oriental-Oracle/" target="_blank" className="text-2xl font-serif flex items-center gap-2 cursor-pointer">Oriental Oracle <ExternalLink /></a>
            <a href="mailto:dyjgs001@gmail.com" className="text-lg font-serif text-crimson cursor-pointer mt-4 italic">Contact: dyjgs001@gmail.com</a>
            <button onClick={() => setMobileMenuOpen(false)} className="mt-8 p-4 bg-ink text-paper rounded-full cursor-pointer"><X /></button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {view === 'translate' && (
        <>
          {/* Header */}
          <header className="w-full text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-ink/40">Premium Calligraphy Engine</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-serif mb-4 leading-tight">Chinese Tattoo <br /><span className="text-crimson italic">Generator</span></h1>
              <p className="text-ink/60 max-w-xl mx-auto text-lg font-light select-text">
                Discover real meanings, deep cultural roots, and exquisite calligraphy for your next permanent art.
              </p>
            </motion.div>
          </header>

          <div className="adsense-placeholder w-full h-24 mb-12">Google AdSense - Horizontal Leaderboard</div>

          {/* Main Search */}
          <div className="w-full max-w-2xl mb-16 relative z-10">
            <form onSubmit={(e) => handleSearch(undefined, e)} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="concept (e.g. 'Strength', 'Wisdom')"
                className="w-full bg-white border border-ink/10 rounded-full py-6 px-10 pr-20 text-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-crimson/5 focus:border-crimson/30 transition-all placeholder:text-ink/20 font-light select-text"
              />
              <button
                id="search-trigger"
                type="submit"
                disabled={loading}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-ink text-paper p-4 rounded-full hover:bg-crimson transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? <RefreshCw className="w-7 h-7 animate-spin" /> : <Search className="w-7 h-7" />}
              </button>
            </form>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-2xl bg-crimson/5 border border-crimson/10 text-crimson text-sm text-center"
              >
                {error}
                <p className="mt-2 text-xs opacity-70">
                  {error.includes("quota") || error.includes("配额")
                    ? "Daily limit reached. Try the popular concepts below or come back tomorrow." 
                    : "If this persists, please contact support."}
                </p>
                <div className="mt-2 text-[10px] font-mono opacity-50">
                  Support: dyjgs001@gmail.com
                </div>
              </motion.div>
            )}
            
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {["Strength", "Dragon", "Peace", "Love", "Family", "Spirit", "Warrior", "Loyalty", "Wisdom", "Dream", "Cat", "Fate"].map(term => (
                <button
                  key={term}
                  onClick={() => handleSearch(term)}
                  className="px-4 py-2 rounded-full bg-paper border border-ink/5 text-[10px] uppercase tracking-widest font-bold text-ink/40 hover:text-crimson hover:border-crimson/30 transition-all cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
            
            {!results.length && !loading && inspiration && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 p-6 rounded-[32px] bg-white border border-ink/5 text-center shadow-sm"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <BookOpen className="text-crimson w-3 h-3" />
                  <span className="text-[10px] uppercase tracking-widest text-crimson font-bold">Daily Inspo</span>
                </div>
                <p className="font-serif text-3xl mb-1 select-text">{inspiration.chinese} <span className="text-sm text-ink/40 italic font-sans select-text">({inspiration.pinyin})</span></p>
                <p className="text-sm text-ink/60 italic font-light select-text">{inspiration.meaning}</p>
              </motion.div>
            )}
          </div>

          {/* Results Section */}
          <AnimatePresence mode="wait">
            {results.length > 0 && (
              <motion.div
                key={`results-${currentSearch}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24"
              >
                {/* Options List */}
                <div className="lg:col-span-3 flex lg:flex-col gap-4 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
                  {results.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedIdx(i)}
                      className={`flex-shrink-0 p-5 rounded-3xl border text-left transition-all cursor-pointer ${
                        selectedIdx === i 
                          ? 'bg-ink text-paper border-ink shadow-xl -translate-y-1 lg:translate-x-2' 
                          : 'bg-white border-ink/5 hover:border-crimson/30'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-3xl font-serif">{opt.chinese}</span>
                      </div>
                      <p className={`text-[10px] uppercase tracking-widest ${selectedIdx === i ? 'text-paper/40' : 'text-ink/30'}`}>Style {i + 1}</p>
                    </button>
                  ))}
                </div>

                {/* Focus Area */}
                <div className="lg:col-span-9 bg-white border border-ink/5 rounded-[44px] md:rounded-[56px] p-6 md:p-16 shadow-2xl relative overflow-hidden calligraphy-box">
                  {!selectedOption ? (
                    <div className="flex flex-col items-center justify-center h-full text-ink/20 italic">
                      No option selected
                    </div>
                  ) : (
                    <>
                      {/* Font Toggles */}
                      <div className="absolute top-4 right-4 md:top-8 md:right-8 flex flex-wrap justify-end gap-1 md:gap-2 max-w-[200px] md:max-w-none">
                        {FONTS.map(f => (
                          <button
                            key={f.name}
                            onClick={() => setActiveFont(f)}
                            className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest border transition-all cursor-pointer ${
                              activeFont.name === f.name ? 'bg-ink text-paper border-ink' : 'bg-paper text-ink/60 border-ink/5 hover:border-ink/20'
                            }`}
                          >
                            {f.name}
                          </button>
                        ))}
                      </div>

                      <div className="flex flex-col items-center text-center">
                        <motion.div
                          key={`${selectedOption.chinese}-${activeFont.name}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: 'spring', damping: 20 }}
                          className="mb-8 mt-12 md:mt-0"
                        >
                          <h2 className="text-[100px] sm:text-[140px] md:text-[220px] leading-none text-ink drop-shadow-xl select-all">
                            <span className={activeFont.value}>{selectedOption.chinese}</span>
                          </h2>
                          <p className="text-crimson font-serif text-3xl mt-6 italic select-text">{selectedOption.pinyin}</p>
                        </motion.div>

                        <div className="flex gap-4 mb-12">
                          <div className="px-4 py-2 bg-paper rounded-full text-xs font-mono text-ink/40 select-text">TRAD: {selectedOption.traditional}</div>
                          <button 
                            onClick={() => downloadSVG(selectedOption.chinese, activeFont.family!, 'tattoo')}
                            className="flex items-center gap-2 px-6 py-2 bg-crimson text-paper rounded-full text-xs uppercase tracking-widest font-bold hover:bg-ink transition-colors shadow-lg cursor-pointer"
                          >
                            <Download className="w-4 h-4" /> Download SVG
                          </button>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 mb-12">
                           <p className="w-full text-[8px] uppercase tracking-widest font-bold text-ink/20">External Inspiration</p>
                           {[
                             { name: 'Google', url: `https://www.google.com/search?q=${selectedOption.chinese}+tattoo+design&tbm=isch` },
                             { name: 'Baidu', url: `https://image.baidu.com/search/index?tn=baiduimage&word=${selectedOption.chinese}纹身` },
                             { name: 'Pixabay', url: `https://pixabay.com/images/search/${selectedOption.chinese}/` }
                           ].map(site => (
                             <a 
                               key={site.name}
                               href={site.url} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="text-[10px] uppercase tracking-widest font-bold text-ink/40 hover:text-crimson transition-colors border-b border-ink/10"
                             >
                               {site.name} ↗
                             </a>
                           ))}
                        </div>

                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 text-left border-t border-ink/5 pt-12">
                          <section>
                            <div className="flex items-center gap-2 mb-4 text-crimson">
                              <BookOpen className="w-4 h-4" />
                              <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold">Deep Context</h3>
                            </div>
                            <div className="text-ink/80 leading-relaxed font-light text-lg select-text">
                              <span className="font-serif italic text-2xl text-ink block mb-2 underline decoration-crimson/20 underline-offset-8 select-text">"{selectedOption.literal}"</span>
                              {selectedOption.meaning}
                            </div>
                          </section>
                          <section>
                            <div className="flex items-center gap-2 mb-4 text-ink/40">
                              <PenTool className="w-4 h-4" />
                              <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold">Artist's Recommendation</h3>
                            </div>
                            <p className="text-ink/50 leading-relaxed font-light italic select-text">
                              {selectedOption.calligraphy}
                            </p>
                          </section>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {view === 'hexagrams' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full mb-24"
        >
          <header className="text-center mb-16 px-4">
            <h2 className="text-5xl md:text-7xl font-serif mb-4 leading-tight">The <span className="text-crimson">64 Hexagrams</span></h2>
            <p className="text-ink/50 max-w-2xl mx-auto font-light select-text italic">Archetypes of constant change. Click any symbol to download its high-resolution SVG or study its core essence.</p>
          </header>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
            {HEXAGRAMS.map((hex) => (
              <motion.div
                key={hex.id}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => downloadSVG(hex.name, '', 'hexagram')}
                className="bg-white border border-ink/5 rounded-[32px] p-6 flex flex-col items-center text-center shadow-sm group hover:shadow-2xl transition-all cursor-pointer relative"
              >
                <HexagramIcon binary={hex.binary} className="text-ink mb-6 group-hover:text-crimson transition-colors" />
                <h3 className="text-3xl font-serif mb-1 group-hover:text-crimson transition-colors">{hex.name}</h3>
                <p className="text-[9px] uppercase font-bold text-ink/30 tracking-widest mb-3">{hex.pinyin}</p>
                <div className="mt-2 pt-2 border-t border-ink/5 w-full">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-crimson mb-1">{hex.meaning}</p>
                </div>
                
                {/* Descriptive tooltip on desktop hover */}
                <div className="hidden lg:group-hover:block absolute -bottom-2 translate-y-full left-1/2 -translate-x-1/2 bg-ink text-paper text-[10px] p-4 rounded-2xl z-50 pointer-events-none w-56 shadow-2xl transition-all opacity-0 group-hover:opacity-100 italic leading-relaxed">
                  {hex.shortDesc}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {view === 'zodiac' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full mb-24"
        >
          <header className="text-center mb-12 px-4">
            <h2 className="text-5xl md:text-7xl font-serif mb-4 leading-tight">Zodiac <span className="text-crimson italic">Spirit Animals</span></h2>
            <p className="text-ink/50 max-w-2xl mx-auto font-light select-text italic mb-8">Decoding the eastern archetypes for a modern, hardcore tattoo aesthetic. Find your totem based on your birth year.</p>
            
            {/* Zodiac Finder */}
            <div className="max-w-md mx-auto relative group">
              <input 
                type="date" 
                value={birthDate}
                onChange={(e) => {
                  setBirthDate(e.target.value);
                  calculateZodiac(e.target.value);
                }}
                className="w-full bg-white border border-ink/10 rounded-2xl py-4 px-6 text-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-crimson/5 focus:border-crimson/30 transition-all font-light"
              />
              <div className="absolute top-1/2 -translate-y-1/2 right-4 text-ink/20 group-hover:text-crimson/40 transition-colors pointer-events-none">
                <Search className="w-5 h-5" />
              </div>
              <p className="text-[10px] uppercase tracking-widest mt-2 font-bold text-ink/30 italic">Select your birthday to find your sign</p>
            </div>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {ZODIAC_ANIMALS.map((animal) => (
              <motion.div
                key={animal.name}
                id={`zodiac-${animal.name}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  scale: foundZodiac === animal.name ? 1.05 : 1,
                  boxShadow: foundZodiac === animal.name ? "0 20px 40px -10px rgba(160, 28, 28, 0.2)" : "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
                }}
                whileHover={{ y: -10 }}
                className={`bg-white border rounded-[44px] p-0 transition-all group overflow-hidden flex flex-col ${foundZodiac === animal.name ? 'border-crimson shadow-2xl ring-2 ring-crimson/10' : 'border-ink/5 shadow-sm'}`}
              >
                {/* Mode Switcher */}
                <div className="absolute top-4 right-4 z-20 flex bg-paper/50 backdrop-blur-sm p-1 rounded-full border border-ink/5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setZodiacStyles(prev => ({ ...prev, [animal.name]: { ...prev[animal.name], mode: 'calligraphy' } }))}
                    className={`px-3 py-1 rounded-full text-[8px] uppercase tracking-widest font-bold transition-all ${zodiacStyles[animal.name]?.mode === 'calligraphy' ? 'bg-ink text-paper' : 'text-ink/40 hover:text-ink'}`}
                  >Text</button>
                  <button 
                    onClick={() => setZodiacStyles(prev => ({ ...prev, [animal.name]: { ...prev[animal.name], mode: 'totem' } }))}
                    className={`px-3 py-1 rounded-full text-[8px] uppercase tracking-widest font-bold transition-all ${zodiacStyles[animal.name]?.mode === 'totem' ? 'bg-ink text-paper' : 'text-ink/40 hover:text-ink'}`}
                  >Image</button>
                </div>

                {/* Main WYSIWYG Preview Area */}
                <div className="aspect-square w-full bg-[#fcfbf9] relative border-b border-ink/5 group-hover:bg-[#f8f5f0] transition-colors overflow-hidden">
                  <div className="absolute inset-0 p-4 sm:p-8 transform group-hover:scale-105 transition-transform duration-500">
                    <ZodiacSVGPreview 
                      animal={animal.name}
                      text={zodiacStyles[animal.name]?.mode === 'totem' ? animal.chinese : animal.chinese} 
                      fontFamily={activeFont.family!} 
                      style={zodiacStyles[animal.name]?.style || 'minimal'} 
                      seed={zodiacStyles[animal.name]?.seed || 0}
                      mode={zodiacStyles[animal.name]?.mode || 'calligraphy'}
                    />
                  </div>
                  
                  {/* Overlay for seed info */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-1">
                       <span className="text-[8px] font-bold uppercase tracking-widest text-crimson bg-crimson/5 px-1.5 py-0.5 rounded">
                         {zodiacStyles[animal.name]?.mode === 'calligraphy' ? zodiacStyles[animal.name]?.style : 'Totem Mode'}
                       </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-5 sm:p-8 pb-8 sm:pb-10 flex-grow">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-paper rounded-full flex items-center justify-center font-serif text-lg sm:text-xl border border-ink/5 group-hover:bg-crimson group-hover:text-paper transition-all shrink-0">{animal.chinese}</div>
                    <div className="min-w-0">
                      <h3 className="font-serif text-xl sm:text-2xl mb-0.5 truncate">{animal.name}</h3>
                      <p className="text-[8px] sm:text-[10px] uppercase font-bold text-ink/30 tracking-widest italic leading-none">{animal.pinyin} &bull; {animal.element}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      <span className="text-[9px] font-bold text-crimson uppercase tracking-widest px-2 py-0.5 bg-crimson/5 rounded border border-crimson/10">{animal.spiritMeaning}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-ink/60 font-light leading-relaxed italic mb-4 line-clamp-2 md:line-clamp-none">"{animal.personality}"</p>
                    
                    <div className="p-3 sm:p-4 bg-paper rounded-2xl border border-ink/5 space-y-3">
                      <div>
                        <div className="text-[8px] uppercase tracking-widest font-bold text-ink/30 mb-1">Spirit Combo</div>
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-xl sm:text-2xl text-ink">{animal.recommendedHanzi}</span>
                          <span className="text-[8px] sm:text-[10px] font-light italic text-ink/50">{animal.recommendedHanziMeaning}</span>
                        </div>
                      </div>
                      <div className="h-px bg-ink/5 w-full" />
                      <div>
                        <p className="text-[8px] font-bold text-ink/30 uppercase tracking-widest mb-1">Style Ref</p>
                        <p className="text-[9px] sm:text-[10px] text-crimson font-medium">{animal.styleTip}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* External Search Links */}
                  <div className="mb-6 flex flex-wrap gap-x-3 gap-y-2">
                    <p className="w-full text-[8px] uppercase tracking-widest font-bold text-ink/20">Search Gallery</p>
                    {[
                      { name: 'Google', url: `https://www.google.com/search?q=${animal.name}+Chinese+Zodiac+Tattoo+Design+Stitched&tbm=isch` },
                      { name: 'Pixabay', url: `https://pixabay.com/images/search/${animal.name.toLowerCase()}%20tattoo/` },
                      { name: 'Baidu', url: `https://image.baidu.com/search/index?tn=baiduimage&word=${animal.chinese}纹身设计图` }
                    ].map(site => (
                      <a 
                        key={site.name}
                        href={site.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[9px] font-bold text-ink/40 hover:text-crimson transition-colors border-b border-ink/10 hover:border-crimson"
                      >
                        {site.name} ↗
                      </a>
                    ))}
                  </div>
                  
                  <div className="mb-6 h-8 overflow-y-auto pr-2 scrollbar-hide">
                    <p className="text-[8px] text-ink/20 uppercase tracking-[0.2em] font-bold leading-relaxed">{animal.years}</p>
                  </div>

                  <div className="mt-auto flex gap-2">
                    <button 
                      onClick={() => setZodiacStyles(prev => ({ 
                        ...prev, 
                        [animal.name]: { 
                          ...prev[animal.name],
                          style: ORNAMENT_STYLES[Math.floor(Math.random() * ORNAMENT_STYLES.length)],
                          seed: Math.random()
                        } 
                      }))}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-3 bg-paper hover:bg-crimson/5 text-ink/60 hover:text-crimson rounded-2xl text-[9px] uppercase tracking-widest font-bold transition-all border border-ink/5 cursor-pointer active:scale-95"
                    >
                      <Sparkles className="w-3 h-3" /> Random
                    </button>
                    <button 
                      onClick={() => downloadSVG(animal.chinese, activeFont.family!, 'zodiac', { ...zodiacStyles[animal.name], animal: animal.name })}
                      className="w-12 h-12 bg-ink text-paper rounded-2xl flex items-center justify-center hover:bg-crimson transition-colors shadow-md cursor-pointer active:scale-95"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* AdSense Row */}
      <GoogleAd />

      {/* Feature Grid */}
      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-12 mb-32 border-t border-ink/5 pt-16 relative z-10">
        <div>
          <div className="bg-crimson/5 w-14 h-14 rounded-3xl flex items-center justify-center mb-6">
            <Info className="text-crimson w-7 h-7" />
          </div>
          <h4 className="text-2xl mb-3 font-serif italic select-text">Cultural Integrity</h4>
          <p className="text-sm text-ink/50 leading-relaxed font-light select-text">Stop using machine translations. We consult philosophical roots and historical contexts to ensure your body art is respectful and accurate.</p>
        </div>
        <div>
          <div className="bg-ink/5 w-14 h-14 rounded-3xl flex items-center justify-center mb-6">
            <LayoutGrid className="text-ink w-7 h-7" />
          </div>
          <h4 className="text-2xl mb-3 font-serif italic select-text">Vector Ready Designs</h4>
          <p className="text-sm text-ink/50 leading-relaxed font-light select-text">Every symbol and character can be downloaded as a high-quality SVG, perfect for tattoo artists to stencil and scale perfectly.</p>
        </div>
        <div>
          <div className="bg-ink/5 w-14 h-14 rounded-3xl flex items-center justify-center mb-6">
            <Share2 className="text-ink w-7 h-7" />
          </div>
          <h4 className="text-2xl mb-3 font-serif italic select-text">Global Community</h4>
          <p className="text-sm text-ink/50 leading-relaxed font-light select-text">Join thousands who have used our tools to verify their ink designs. Part of the Oriental Oracle network of metaphysical tools.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-ink/10 pt-12 pb-16 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
           <Feather className="text-crimson w-5 h-5" />
           <p className="text-xs uppercase tracking-[0.5em] text-ink/60 font-bold select-text">Established MMXVI</p>
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-ink/30 mb-8 px-4 select-text">
          Powered by <a href="http://tattoo.ccwu.cc" className="text-crimson hover:underline cursor-pointer">CCWU Network</a> 
          &bull; Partnered with <a href="https://sadtuwart69-code.github.io/Oriental-Oracle/" className="hover:text-ink cursor-pointer">Oriental Oracle</a>
        </p>
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-ink/40 text-[10px] uppercase tracking-[0.1em] font-bold">
          <a href="#" className="hover:text-crimson transition-colors cursor-pointer">Privacy</a>
          <a href="#" className="hover:text-crimson transition-colors cursor-pointer">Terms</a>
          <a href="mailto:dyjgs001@gmail.com" className="hover:text-crimson transition-colors cursor-pointer">Contact: dyjgs001@gmail.com</a>
        </div>
        <p className="mt-12 text-ink/10 text-[10px] select-text">DESIGNED IN CHINATOWN. DEVELOPED GLOBALLY.</p>
      </footer>
    </div>
  );
}


