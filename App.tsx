
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import MenuSection from './components/MenuSection';
import Logo from './components/Logo';
import { MENU_DATA, PIZZA_FATAYER_ADDITIONS, CREPE_ADDITIONS } from './constants';

const AtyabLogo = ({ size = "w-24 h-24" }: { size?: string }) => (
  <div className={`${size} relative flex items-center justify-center overflow-hidden rounded-full border-4 border-[#eab308] shadow-2xl bg-white dark:bg-zinc-900 mb-6 transform hover:rotate-12 transition-all duration-700 hover:scale-110 active:scale-95 cursor-pointer p-2`}>
    <Logo />
  </div>
);

const AdditionsCard = ({ data }: { data: any }) => (
  <section id={data.id} className="scroll-mt-[100px] mb-10 text-right reveal-item">
    <div className="relative aspect-[16/10] md:aspect-[21/9] rounded-[2.5rem] overflow-hidden mb-6 shadow-2xl border border-zinc-200 dark:border-white/5 bg-zinc-200 dark:bg-zinc-900 group">
      <img
        src={data.image}
        alt=""
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-yellow-900/80 via-transparent to-transparent opacity-90"></div>
      <div className="absolute bottom-8 right-8 left-8 text-right">
          <h3 className="text-3xl font-black text-white leading-none flex items-center gap-3">
             <span className="p-2 bg-white/20 backdrop-blur-md rounded-xl animate-emoji">✨</span>
             {data.title}
          </h3>
      </div>
    </div>

    <div className="bg-gradient-to-br from-yellow-100 via-white to-yellow-50 dark:from-yellow-950/20 dark:via-zinc-900 dark:to-yellow-900/10 rounded-[2.5rem] p-8 md:p-10 border-2 border-yellow-600/30 shadow-[0_20px_50px_rgba(234,179,8,0.1)] overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-500"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
        {data.items.map((add: any, idx: number) => (
          <div key={idx} className="flex justify-between items-center bg-white dark:bg-zinc-950/80 backdrop-blur-sm p-4 rounded-3xl border border-yellow-100 dark:border-white/5 shadow-md group hover:border-yellow-600 transition-all duration-300 hover:-translate-y-1">
            <div className="flex flex-col">
              <span className="font-black text-sm text-zinc-800 dark:text-zinc-200 group-hover:text-yellow-600 transition-colors">{add.name}</span>
            </div>
            <div className="flex gap-2">
              {add.prices.map((p: string, pIdx: number) => (
                <div key={pIdx} className="flex flex-col items-center">
                  {add.labels && add.labels[pIdx] && <span className="text-[9px] font-black text-zinc-400 mb-1">{add.labels[pIdx]}</span>}
                  <div className="bg-yellow-600 text-black px-4 py-2 rounded-2xl font-black tabular-nums text-sm shadow-lg shadow-yellow-600/30 min-w-[50px] text-center">
                    {p} <span className="text-[9px]">ج</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-yellow-600/5 rounded-full blur-3xl"></div>
    </div>
  </section>
);

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return true;
  });
  
  const navRef = useRef<HTMLDivElement>(null);
  const isScrollingToRef = useRef<boolean>(false);
  const [showBottomCallMenu, setShowBottomCallMenu] = useState(false);
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const STICKY_OFFSET = 80;

  const triggerHaptic = (pattern: number | number[] = 10) => {
    if (pattern && typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  useEffect(() => {
    setCurrentUrl(window.location.href);
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const checkScroll = () => {
    if (navRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
      const isAtStart = Math.abs(scrollLeft) < 15;
      const isAtEnd = Math.abs(scrollLeft) + clientWidth >= scrollWidth - 15;
      
      setCanScrollRight(!isAtStart);
      setCanScrollLeft(!isAtEnd);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const navItems = [
    ...MENU_DATA.slice(0, 4),
    PIZZA_FATAYER_ADDITIONS,
    ...MENU_DATA.slice(4, 8),
    CREPE_ADDITIONS
  ];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (isScrollingToRef.current) return;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          setActiveSection(id);
          if (navRef.current) {
            const navItem = navRef.current.querySelector(`[data-id="${id}"]`) as HTMLElement;
            if (navItem) {
              const container = navRef.current;
              const scrollTarget = navItem.offsetLeft - (container.offsetWidth / 2) + (navItem.offsetWidth / 2);
              container.scrollTo({ left: scrollTarget, behavior: 'smooth' });
            }
          }
        }
      });
    }, { rootMargin: '-80px 0px -40% 0px' });

    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e: React.MouseEvent | React.TouchEvent, id: string) => {
    e.preventDefault();
    triggerHaptic(15);
    const target = document.getElementById(id);
    if (target) {
      isScrollingToRef.current = true;
      const offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - STICKY_OFFSET;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      setActiveSection(id);
      setShowCategoriesMenu(false);
      setTimeout(() => isScrollingToRef.current = false, 1000);
    }
  };

  const scrollNav = (direction: 'left' | 'right') => {
    if (navRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      navRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      triggerHaptic(5);
    }
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(currentUrl)}&bgcolor=ffffff&color=eab308`;
  const mapsLink = "https://www.google.com/maps/search/R7XC+FC7+برج+أنس+الوجود،+مدينة+البدراشين،+مركز+البدرشين،+محافظة+الجيزة+3367401";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-200 antialiased selection:bg-yellow-500/30 transition-colors duration-500">
      <Header isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} onAction={() => triggerHaptic(10)} />
      
      <nav className="sticky top-0 z-40 bg-white/95 dark:bg-[#050505]/95 backdrop-blur-xl border-b border-zinc-200 dark:border-white/10 py-3 shadow-md transition-all duration-300">
        <div className="relative max-w-2xl mx-auto flex items-center group">
          <button 
            onClick={() => scrollNav('right')}
            className={`absolute right-1.5 z-20 w-8 h-8 flex items-center justify-center bg-white/95 dark:bg-zinc-800/95 rounded-full shadow-lg border border-zinc-200 dark:border-white/10 transition-all duration-300 active:scale-90 ${canScrollRight ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}`}
            aria-label="تمرير لليمين"
          >
            <span className="text-yellow-600 font-bold text-sm">❯</span>
          </button>

          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white dark:from-[#050505] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white dark:from-[#050505] to-transparent z-10 pointer-events-none"></div>

          <div 
            ref={navRef} 
            onScroll={checkScroll} 
            className="flex gap-2 overflow-x-auto no-scrollbar px-10 py-1 scroll-smooth w-full"
          >
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                data-id={item.id}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-2xl text-[12px] font-black border transition-all transform active:scale-95 flex items-center gap-1.5 ${
                  activeSection === item.id 
                  ? 'bg-yellow-600 border-yellow-500 text-black shadow-lg shadow-yellow-600/20 scale-105' 
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10 text-zinc-500 hover:border-yellow-200'
                }`}
              >
                <span className="animate-emoji">{(item as any).emoji || '✨'}</span>
                <span>{item.title}</span>
              </a>
            ))}
          </div>

          <button 
            onClick={() => scrollNav('left')}
            className={`absolute left-1.5 z-20 w-8 h-8 flex items-center justify-center bg-white/95 dark:bg-zinc-800/95 rounded-full shadow-lg border border-zinc-200 dark:border-white/10 transition-all duration-300 active:scale-90 ${canScrollLeft ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}
            aria-label="تمرير لليسار"
          >
            <span className="text-yellow-600 font-bold text-lg">❮</span>
          </button>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-5 py-8 pb-48">
        <div className="mb-12 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-10 relative overflow-hidden text-right shadow-2xl reveal-item">
          <div className="relative z-10">
            <h2 className="text-5xl font-black text-zinc-900 dark:text-white mb-2 leading-none italic uppercase tracking-tighter">ATYAB</h2>
            <p className="text-yellow-600 dark:text-yellow-500 text-sm font-black uppercase mb-4 tracking-widest">فطاطري أطياب</p>
            <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 text-[10px] font-bold">
              <span>📍 البدرشين - برج أنس الوجود</span>
              <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
              <span>شارع آثار سقارة</span>
            </div>
          </div>
          <div className="absolute -left-10 -bottom-12 text-[180px] opacity-[0.04] grayscale select-none pointer-events-none rotate-12 animate-emoji">🥨</div>
          <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-yellow-600/10 to-transparent rounded-bl-full"></div>
        </div>

        {MENU_DATA.slice(0, 4).map((section, idx) => (
          <MenuSection key={section.id} section={section} isFirst={idx === 0} onInteraction={() => triggerHaptic(5)} />
        ))}

        <AdditionsCard data={PIZZA_FATAYER_ADDITIONS} />

        {MENU_DATA.slice(4, 8).map((section) => (
          <MenuSection key={section.id} section={section} onInteraction={() => triggerHaptic(5)} />
        ))}

        <AdditionsCard data={CREPE_ADDITIONS} />

        <div className="mt-4 mb-10 pt-6 text-center reveal-item">
            <p className="text-xs font-black text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 inline-block px-6 py-2 rounded-full shadow-sm">🛵 خدمة التوصيل متوفرة لجميع المناطق</p>
        </div>

        <footer className="mt-24 pb-12 flex flex-col items-center gap-8 reveal-item">
            <div className="w-full bg-white dark:bg-zinc-900 rounded-[3rem] p-12 shadow-2xl border border-zinc-200 dark:border-white/10 flex flex-col items-center gap-8 text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-600/5 blur-3xl -z-10"></div>
               <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-600/5 blur-3xl -z-10"></div>
               
               <AtyabLogo />
               <div className="space-y-2">
                 <h3 className="text-4xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter">ATYAB</h3>
                 <p className="text-yellow-600 dark:text-yellow-500 text-xs font-black uppercase tracking-[0.2em]">الجودة والتميز</p>
               </div>
               
               <div className="relative group">
                 <div className="absolute -inset-2 bg-yellow-600/20 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                 <div className="relative p-6 bg-white rounded-[2.5rem] border-4 border-zinc-100 shadow-inner">
                    <img src={qrUrl} alt="QR Code" className="w-44 h-44" />
                 </div>
               </div>
               
               <p className="text-[11px] text-zinc-400 font-black max-w-[200px] leading-relaxed">
                 امسح الكود بكاميرا هاتفك لمشاركة القائمة مع أصدقائك
               </p>
            </div>

            <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="w-full bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-xl border border-zinc-200 dark:border-white/10 text-right group active:scale-95 transition-all hover:border-yellow-600/40">
               <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-yellow-50 dark:bg-yellow-900/20 rounded-3xl flex items-center justify-center text-3xl border border-yellow-100 dark:border-yellow-900/30 group-hover:bg-yellow-600 group-hover:text-black transition-all duration-500 shadow-sm group-hover:shadow-yellow-600/30 animate-emoji">📍</div>
                    <div className="flex flex-col pt-1">
                       <span className="text-[11px] font-black text-yellow-600 uppercase tracking-tighter mb-1">موقعنا على الخريطة</span>
                       <p className="text-zinc-800 dark:text-zinc-100 text-base font-black leading-snug">برج أنس الوجود - البدرشين</p>
                    </div>
                  </div>
               </div>
            </a>
            
            <div className="flex flex-col items-center gap-3 opacity-80">
               <div className="text-center space-y-1">
                 <p className="text-zinc-500 dark:text-zinc-400 text-[11px] font-bold">تصميم وتنفيذ مهندس / احمد النقيب</p>
                 <a href="tel:01092621367" className="text-yellow-600 text-[11px] font-black hover:underline tabular-nums">للتواصل 01092621367</a>
               </div>
               <div className="flex gap-4 pt-2">
                 <span className="w-2 h-2 rounded-full bg-yellow-600"></span>
                 <span className="w-2 h-2 rounded-full bg-yellow-600/60"></span>
                 <span className="w-2 h-2 rounded-full bg-yellow-600/30"></span>
               </div>
            </div>
        </footer>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-[60] px-4 pb-6 pt-2 md:hidden">
        <div className="max-w-xl mx-auto glass border border-zinc-200 dark:border-white/10 rounded-[2.5rem] p-2 flex items-center justify-around shadow-2xl relative">
          {(showBottomCallMenu || showCategoriesMenu) && (
            <div 
              className="fixed inset-0 bg-black/40 backdrop-blur-[4px] z-[61]" 
              onClick={() => { setShowBottomCallMenu(false); setShowCategoriesMenu(false); }}
            ></div>
          )}

          {showBottomCallMenu && (
            <div className="absolute bottom-[calc(100%+1rem)] left-0 right-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up mx-2 z-[62]">
              <div className="px-6 py-4 bg-zinc-50 dark:bg-white/5 border-b border-zinc-100 text-right">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">تواصل معنا الآن</span>
              </div>
              {[
                { n: "01044168230", l: "رقم 1" },
                { n: "01124005181", l: "رقم 2" }
              ].map((p, i) => (
                <a key={i} href={`tel:${p.n}`} className="flex items-center justify-between px-7 py-4 border-b last:border-0 border-zinc-100 dark:border-white/5 active:bg-yellow-50 transition-colors">
                  <span className="text-[11px] font-black text-zinc-400">{p.l}</span>
                  <span className="text-[17px] font-black tabular-nums tracking-tighter text-yellow-600">{p.n}</span>
                </a>
              ))}
            </div>
          )}

          {showCategoriesMenu && (
            <div className="absolute bottom-[calc(100%+1rem)] left-0 right-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up mx-2 z-[62]">
              <div className="px-6 py-4 bg-zinc-50 dark:bg-white/5 border-b border-zinc-100 text-right flex justify-between items-center">
                <button 
                  onClick={() => setShowCategoriesMenu(false)}
                  className="w-8 h-8 flex items-center justify-center bg-zinc-200 dark:bg-zinc-800 rounded-full text-zinc-500"
                >✕</button>
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">اختر القسم</span>
              </div>
              <div className="max-h-[60vh] overflow-y-auto no-scrollbar">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={`w-full flex items-center justify-between px-7 py-5 border-b last:border-0 border-zinc-100 dark:border-white/5 transition-all text-right ${activeSection === item.id ? 'bg-yellow-50 dark:bg-yellow-500/5' : ''}`}
                  >
                    <span className="text-xl animate-emoji">{(item as any).emoji || '✨'}</span>
                    <span className={`text-[15px] font-black ${activeSection === item.id ? 'text-yellow-600' : 'text-zinc-800 dark:text-zinc-200'}`}>
                      {item.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <a href="https://wa.me/201044168230" className="flex-1 flex flex-col items-center py-2 gap-1 text-zinc-500 dark:text-zinc-400">
            <svg className="w-6 h-6 fill-current animate-emoji" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            <span className="text-[10px] font-black">واتساب</span>
          </a>
          <button 
            onClick={() => { setShowBottomCallMenu(!showBottomCallMenu); setShowCategoriesMenu(false); }} 
            className={`flex-1 flex flex-col items-center py-2 gap-1 ${showBottomCallMenu ? 'text-yellow-600' : 'text-zinc-500 dark:text-zinc-400'}`}
          >
            <span className="text-2xl animate-emoji">📞</span>
            <span className="text-[10px] font-black">اتصال</span>
          </button>
          
          <button 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} 
            className="bg-yellow-600 w-16 h-16 rounded-full flex items-center justify-center text-black shadow-xl -mt-10 border-4 border-white dark:border-[#050505] active:scale-90 transition-all z-[63] yellow-glow"
          >
            <span className="text-xl animate-emoji">🔝</span>
          </button>
          
          <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="flex-1 flex flex-col items-center py-2 gap-1 text-zinc-500 dark:text-zinc-400">
            <span className="text-2xl animate-emoji">📍</span>
            <span className="text-[10px] font-black">الموقع</span>
          </a>
          <button 
            onClick={() => { setShowCategoriesMenu(!showCategoriesMenu); setShowBottomCallMenu(false); }} 
            className={`flex-1 flex flex-col items-center py-2 gap-1 ${showCategoriesMenu ? 'text-yellow-600' : 'text-zinc-500 dark:text-zinc-400'}`}
          >
            <span className="text-2xl animate-emoji">📋</span>
            <span className="text-[10px] font-black">المنيو</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
