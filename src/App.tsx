import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, PenTool, BookOpen, Share2, Info, RefreshCw, Feather, Download, LayoutGrid, ExternalLink, Menu, X } from 'lucide-react';
import { HEXAGRAMS, Hexagram } from './hexagrams';

interface TattooOption {
  chinese: string;
  traditional: string;
  pinyin: string;
  literal: string;
  meaning: string;
  calligraphy: string;
}

const FONTS = [
  { name: 'Traditional', value: 'font-serif' },
  { name: 'Brush Script', value: 'font-["Zhi_Mang_Xing"]' },
  { name: 'Formal Brush', value: 'font-["Ma_Shan_Zheng"]' },
  { name: 'Slender', value: 'font-["Long_Cang"]' },
  { name: 'Modern', value: 'font-sans' },
];

export default function App() {
  const [view, setView] = useState<'translate' | 'hexagrams'>('translate');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TattooOption[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeFont, setActiveFont] = useState(FONTS[1]);
  const [inspiration, setInspiration] = useState<{ chinese: string; pinyin: string; meaning: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchInspiration();
  }, []);

  const fetchInspiration = async () => {
    try {
      const res = await fetch('/api/inspiration');
      const data = await res.json();
      setInspiration(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setResults([]);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      setResults(data.options || []);
      setSelectedIdx(0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const downloadSVG = (text: string, fontName: string, type: 'tattoo' | 'hexagram') => {
    let svgContent = '';
    if (type === 'tattoo') {
      svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <rect width="100%" height="100%" fill="#f5f2ed" />
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="${fontName}, serif" font-size="120" fill="#1a1a1a">${text}</text>
</svg>`;
    } else {
      // Hexagram dynamic SVG generation
      const hex = HEXAGRAMS.find(h => h.name === text);
      if (!hex) return;
      const lines = hex.binary.split('').reverse();
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 40 60">
        <rect width="100%" height="100%" fill="#f5f2ed" />
        ${lines.map((bit, i) => bit === '1' 
          ? `<rect x="5" y="${5 + i * 8}" width="30" height="4" fill="#1a1a1a" />` 
          : `<rect x="5" y="${5 + i * 8}" width="12" height="4" fill="#1a1a1a" /><rect x="23" y="${5 + i * 8}" width="12" height="4" fill="#1a1a1a" />`
        ).join('')}
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

  const selectedOption = results[selectedIdx];

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
    <div className="min-h-screen flex flex-col items-center max-w-7xl mx-auto px-4 relative overflow-hidden">
      {/* Background Texture */}
      <img 
        src="/src/assets/images/chinese_ink_wash_bg_1779089776813.png" 
        alt="" 
        className="fixed inset-0 w-full h-full object-cover opacity-10 pointer-events-none -z-10"
        referrerPolicy="no-referrer"
      />

      {/* Navigation */}
      <nav className="w-full flex items-center justify-between py-6 mb-8 border-b border-ink/5">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setView('translate')}
        >
          <Feather className="text-crimson w-6 h-6 group-hover:rotate-12 transition-transform" />
          <span className="font-serif text-xl tracking-wider">Tattoo CCWU</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => setView('translate')}
            className={`text-sm uppercase tracking-widest font-medium transition-colors ${view === 'translate' ? 'text-crimson' : 'text-ink/60 hover:text-ink'}`}
          >
            Design Generator
          </button>
          <button 
            onClick={() => setView('hexagrams')}
            className={`text-sm uppercase tracking-widest font-medium transition-colors ${view === 'hexagrams' ? 'text-crimson' : 'text-ink/60 hover:text-ink'}`}
          >
            I Ching 64 Hexagrams
          </button>
          <a 
            href="https://sadtuwart69-code.github.io/Oriental-Oracle/" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm uppercase tracking-widest font-medium text-ink/60 hover:text-ink transition-colors"
          >
            Oriental Oracle <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
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
            <button onClick={() => { setView('translate'); setMobileMenuOpen(false); }} className="text-2xl font-serif">Design Generator</button>
            <button onClick={() => { setView('hexagrams'); setMobileMenuOpen(false); }} className="text-2xl font-serif">I Ching 64 Hexagrams</button>
            <a href="https://sadtuwart69-code.github.io/Oriental-Oracle/" target="_blank" className="text-2xl font-serif flex items-center gap-2">Oriental Oracle <ExternalLink /></a>
            <button onClick={() => setMobileMenuOpen(false)} className="mt-8 p-4 bg-ink text-paper rounded-full"><X /></button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {view === 'translate' ? (
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
              <p className="text-ink/60 max-w-xl mx-auto text-lg font-light">
                Discover real meanings, deep cultural roots, and exquisite calligraphy for your next permanent art.
              </p>
            </motion.div>
          </header>

          <div className="adsense-placeholder w-full h-24 mb-12">Google AdSense - Horizontal Leaderboard</div>

          {/* Main Search */}
          <div className="w-full max-w-2xl mb-16 relative z-10">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="concept (e.g. 'Strength', 'Wisdom')"
                className="w-full bg-white border border-ink/10 rounded-full py-6 px-10 pr-20 text-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-crimson/5 focus:border-crimson/30 transition-all placeholder:text-ink/20 font-light"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-ink text-paper p-4 rounded-full hover:bg-crimson transition-colors disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-7 h-7 animate-spin" /> : <Search className="w-7 h-7" />}
              </button>
            </form>
            
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
                <p className="font-serif text-3xl mb-1">{inspiration.chinese} <span className="text-sm text-ink/40 italic font-sans">({inspiration.pinyin})</span></p>
                <p className="text-sm text-ink/60 italic font-light">{inspiration.meaning}</p>
              </motion.div>
            )}
          </div>

          {/* Results Section */}
          <AnimatePresence mode="wait">
            {results.length > 0 && (
              <motion.div
                key="results"
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
                      className={`flex-shrink-0 p-5 rounded-3xl border text-left transition-all ${
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
                <div className="lg:col-span-9 bg-white border border-ink/5 rounded-[56px] p-8 md:p-16 shadow-2xl relative overflow-hidden calligraphy-box">
                  {/* Font Toggles */}
                  <div className="absolute top-8 right-8 flex gap-2">
                    {FONTS.map(f => (
                      <button
                        key={f.name}
                        onClick={() => setActiveFont(f)}
                        className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest border transition-all ${
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
                      className="mb-8"
                    >
                      <h2 className={`text-[120px] md:text-[220px] leading-none text-ink drop-shadow-xl select-all ${activeFont.value}`}>
                        {selectedOption.chinese}
                      </h2>
                      <p className="text-crimson font-serif text-3xl mt-6 italic">{selectedOption.pinyin}</p>
                    </motion.div>

                    <div className="flex gap-4 mb-12">
                      <div className="px-4 py-2 bg-paper rounded-full text-xs font-mono text-ink/40">TRAD: {selectedOption.traditional}</div>
                      <button 
                        onClick={() => downloadSVG(selectedOption.chinese, activeFont.name, 'tattoo')}
                        className="flex items-center gap-2 px-6 py-2 bg-crimson text-paper rounded-full text-xs uppercase tracking-widest font-bold hover:bg-ink transition-colors shadow-lg"
                      >
                        <Download className="w-4 h-4" /> Download SVG
                      </button>
                    </div>

                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 text-left border-t border-ink/5 pt-12">
                      <section>
                        <div className="flex items-center gap-2 mb-4 text-crimson">
                          <BookOpen className="w-4 h-4" />
                          <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold">Deep Context</h3>
                        </div>
                        <p className="text-ink/80 leading-relaxed font-light text-lg">
                          <span className="font-serif italic text-2xl text-ink block mb-2 underline decoration-crimson/20 underline-offset-8">"{selectedOption.literal}"</span>
                          {selectedOption.meaning}
                        </p>
                      </section>
                      <section>
                        <div className="flex items-center gap-2 mb-4 text-ink/40">
                          <PenTool className="w-4 h-4" />
                          <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold">Artist's Recommendation</h3>
                        </div>
                        <p className="text-ink/50 leading-relaxed font-light italic">
                          {selectedOption.calligraphy}
                        </p>
                      </section>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full mb-24"
        >
          <header className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-serif mb-4 leading-tight">The <span className="text-crimson">64 Hexagrams</span></h2>
            <p className="text-ink/50 max-w-2xl mx-auto font-light">Archetypes of constant change. Download these sacred symbols for permanent ink or spiritual study.</p>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {HEXAGRAMS.map((hex) => (
              <motion.div
                key={hex.id}
                whileHover={{ y: -5 }}
                className="bg-white border border-ink/5 rounded-3xl p-5 flex flex-col items-center text-center shadow-sm group hover:shadow-xl transition-all"
              >
                <HexagramIcon binary={hex.binary} className="text-ink mb-4 group-hover:text-crimson transition-colors" />
                <h3 className="text-2xl font-serif mb-1">{hex.name}</h3>
                <p className="text-[10px] uppercase font-bold text-ink/40 tracking-widest mb-3">{hex.meaning}</p>
                
                <div className="mt-auto flex gap-2">
                   {/* Tooltip-like popup on hover could go here, for now keeping it clean */}
                   <button 
                    onClick={() => downloadSVG(hex.name, '', 'hexagram')}
                    className="p-2 bg-paper rounded-full text-ink/40 hover:text-crimson transition-colors" title="Download SVG"
                   >
                     <Download className="w-4 h-4" />
                   </button>
                </div>
                
                {/* Mobile version of text details */}
                <div className="hidden group-hover:block absolute bg-ink text-paper text-[10px] p-4 rounded-2xl z-50 pointer-events-none mt-12 w-48 shadow-2xl">
                  {hex.shortDesc}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* AdSense Footer */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-24 px-4">
        <div className="adsense-placeholder h-64">AdSense Sidebar Style</div>
        <div className="adsense-placeholder h-64">AdSense Sidebar Style</div>
        <div className="adsense-placeholder h-64">AdSense Sidebar Style</div>
      </div>

      {/* Feature Grid */}
      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-12 mb-32 border-t border-ink/5 pt-16">
        <div>
          <div className="bg-crimson/5 w-14 h-14 rounded-3xl flex items-center justify-center mb-6">
            <Info className="text-crimson w-7 h-7" />
          </div>
          <h4 className="text-2xl mb-3 font-serif italic">Cultural Integrity</h4>
          <p className="text-sm text-ink/50 leading-relaxed font-light">Stop using machine translations. We consult philosophical roots and historical contexts to ensure your body art is respectful and accurate.</p>
        </div>
        <div>
          <div className="bg-ink/5 w-14 h-14 rounded-3xl flex items-center justify-center mb-6">
            <LayoutGrid className="text-ink w-7 h-7" />
          </div>
          <h4 className="text-2xl mb-3 font-serif italic">Vecto Ready Designs</h4>
          <p className="text-sm text-ink/50 leading-relaxed font-light">Every symbol and character can be downloaded as a high-quality SVG, perfect for tattoo artists to stencil and scale perfectly.</p>
        </div>
        <div>
          <div className="bg-ink/5 w-14 h-14 rounded-3xl flex items-center justify-center mb-6">
            <Share2 className="text-ink w-7 h-7" />
          </div>
          <h4 className="text-2xl mb-3 font-serif italic">Global Community</h4>
          <p className="text-sm text-ink/50 leading-relaxed font-light">Join thousands who have used our tools to verify their ink designs. Part of the Oriental Oracle network of metaphysical tools.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-ink/10 pt-12 pb-16 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
           <Feather className="text-crimson w-5 h-5" />
           <p className="text-xs uppercase tracking-[0.5em] text-ink/60 font-bold">Established MMXVI</p>
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-ink/30 mb-8 px-4">
          Powered by <a href="http://tattoo.ccwu.cc" className="text-crimson hover:underline">CCWU Network</a> 
          &bull; Partnered with <a href="https://sadtuwart69-code.github.io/Oriental-Oracle/" className="hover:text-ink">Oriental Oracle</a>
        </p>
        <div className="flex justify-center gap-12 text-ink/40 text-[10px] uppercase tracking-[0.1em] font-bold">
          <a href="#" className="hover:text-crimson transition-colors">Privacy</a>
          <a href="#" className="hover:text-crimson transition-colors">Terms</a>
          <a href="#" className="hover:text-crimson transition-colors">Security</a>
        </div>
        <p className="mt-12 text-ink/10 text-[10px]">DESIGNED IN CHINATOWN. DEVELOPED GLOBALLY.</p>
      </footer>
    </div>
  );
}


