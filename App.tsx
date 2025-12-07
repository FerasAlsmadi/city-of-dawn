import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { 
    SECTION_1, SECTION_2, RIVER_WORDS, SECTION_4_QUOTES, 
    PATH_STEPS, VICTORY_TEXT, FUTURE_VALUES, PROMISE_TEXT, FINAL_TEXT 
} from './constants';
import { Stars, CitySkyline, Particles, RevolutionFlag } from './components/Visuals';

// --- Helper Components ---

const FadeInSection: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 1, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// --- Main App ---

export default function App() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Smooth background transition from Night -> Dawn
    const backgroundColor = useTransform(
        scrollYProgress,
        [0, 0.2, 0.5, 0.8, 1],
        ["#020617", "#0f172a", "#1e1b4b", "#312e81", "#FFF8E1"] // Slate 950 -> 900 -> Indigo 950 -> 900 -> Warm White
    );
    
    // City Skyline Opacity fade out at the very end (Victory/Future) to reveal the "New City" concept or just brighten
    const skylineOpacity = useTransform(scrollYProgress, [0.8, 1], [1, 0.2]);

    // Track "First Light" trigger
    const [lightsOn, setLightsOn] = useState(false);
    useTransform(scrollYProgress, (value) => {
        if (value > 0.15 && !lightsOn) setLightsOn(true);
    });

    return (
        <motion.div 
            ref={containerRef}
            className="relative w-full min-h-screen font-serif text-white overflow-x-hidden"
            style={{ backgroundColor }}
        >
            {/* Global Fixed Background Elements */}
            <div className="fixed inset-0 z-0">
                <Stars opacity={0.8} />
                <motion.div style={{ opacity: skylineOpacity }}>
                   <CitySkyline lightsOn={lightsOn} scrollYProgress={scrollYProgress} />
                </motion.div>
                {/* Dawn Glow Gradient Overlay that becomes stronger */}
                <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-orange-500/10 via-transparent to-transparent pointer-events-none"
                    style={{ opacity: useTransform(scrollYProgress, [0.1, 0.8], [0, 0.8]) }}
                />
            </div>

            {/* --- SECTION 1: THE SLEEPING CITY --- */}
            <section className="relative h-screen flex flex-col items-center justify-center z-10 p-8 text-center">
                <motion.h1 
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 2 }}
                    className="text-5xl md:text-7xl font-bold mb-6 font-sans tracking-wide text-gray-100"
                >
                    {SECTION_1.title}
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1.5 }}
                    className="text-2xl md:text-3xl text-gray-400 font-light"
                >
                    {SECTION_1.subtitle}
                </motion.p>
                
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: [0, 10, 0] }}
                    transition={{ delay: 4, duration: 2, repeat: Infinity }}
                    className="absolute bottom-10 text-gray-500 text-sm"
                >
                    <span className="block mb-2 text-center">اسحب للأسفل لبدء الحكاية</span>
                    <svg className="w-6 h-6 mx-auto animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                </motion.div>
            </section>

            {/* --- SECTION 2: FIRST LIGHT --- */}
            <section className="relative h-[80vh] flex flex-col items-center justify-center z-10 p-8 text-center">
                <FadeInSection>
                    <div className="space-y-6">
                        {SECTION_2.lines.map((line, idx) => (
                            <p key={idx} className="text-2xl md:text-4xl text-amber-100/90 font-light leading-relaxed drop-shadow-md">
                                {line}
                            </p>
                        ))}
                    </div>
                </FadeInSection>
                {/* Particles start appearing here */}
                {lightsOn && <Particles />}
            </section>

            {/* --- SECTION 3: RIVER OF VOICES --- */}
            <section className="relative py-32 z-10 overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-syria-green/5 to-transparent blur-3xl"></div>
                 <h2 className="text-center text-3xl font-sans font-bold text-emerald-100 mb-12 opacity-80">أصواتنا نهر لا يتوقف</h2>
                 
                 <div className="relative w-full flex overflow-hidden group">
                     <motion.div 
                        className="flex gap-8 whitespace-nowrap px-4"
                        animate={{ x: [0, -1000] }}
                        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                     >
                         {[...RIVER_WORDS, ...RIVER_WORDS, ...RIVER_WORDS].map((word, i) => (
                             <div 
                                key={i} 
                                className="relative group/orb cursor-pointer"
                             >
                                 <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all duration-500 group-hover/orb:bg-emerald-500/20 group-hover/orb:scale-110 group-hover/orb:border-emerald-400/50 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                                    <span className="text-sm md:text-lg text-emerald-50 font-serif opacity-70 group-hover/orb:opacity-100">{word}</span>
                                 </div>
                             </div>
                         ))}
                     </motion.div>
                     
                     {/* Duplicate for seamless loop */}
                     <motion.div 
                        className="flex gap-8 whitespace-nowrap px-4 absolute top-0 left-full"
                        animate={{ x: [0, -1000] }}
                        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                     >
                        {[...RIVER_WORDS, ...RIVER_WORDS, ...RIVER_WORDS].map((word, i) => (
                             <div 
                                key={`dup-${i}`} 
                                className="relative group/orb cursor-pointer"
                             >
                                 <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all duration-500 group-hover/orb:bg-emerald-500/20 group-hover/orb:scale-110 group-hover/orb:border-emerald-400/50 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                                    <span className="text-sm md:text-lg text-emerald-50 font-serif opacity-70 group-hover/orb:opacity-100">{word}</span>
                                 </div>
                             </div>
                         ))}
                     </motion.div>
                 </div>
            </section>

            {/* --- SECTION 4: SQUARE OF DIGNITY --- */}
            <section className="relative min-h-screen flex flex-col items-center justify-center z-10 p-8">
                 <FadeInSection className="mb-12">
                     <RevolutionFlag className="scale-150 transform hover:scale-155 transition-transform duration-700" />
                 </FadeInSection>
                 
                 <div className="mt-12 h-32 relative w-full max-w-2xl text-center">
                    {SECTION_4_QUOTES.map((quote, idx) => (
                        <RotatingText key={idx} text={quote} index={idx} total={SECTION_4_QUOTES.length} />
                    ))}
                 </div>
            </section>

            {/* --- SECTION 5: PATH OF SACRIFICE --- */}
            <section className="relative py-24 z-10 max-w-3xl mx-auto px-6">
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-500/30 to-transparent -translate-x-1/2"></div>
                
                {PATH_STEPS.map((step, idx) => (
                    <LanternStep key={idx} text={step} index={idx} />
                ))}
            </section>

            {/* --- SECTION 6: MOMENT OF VICTORY --- */}
            <section className="relative min-h-screen flex flex-col items-center justify-center z-10 text-center px-4">
                 {/* This section coincides with bg becoming warm white/gold via scrollYProgress */}
                 <div className="absolute inset-0 bg-gradient-to-b from-transparent to-amber-100/20 pointer-events-none"></div>
                 
                 <FadeInSection>
                     <motion.div 
                        className="text-6xl md:text-8xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)] font-sans font-black"
                     >
                        نصر
                     </motion.div>
                     <h2 className="text-3xl md:text-5xl font-bold text-amber-50 mb-8 font-serif leading-tight">
                        {VICTORY_TEXT.main}
                     </h2>
                     <p className="text-xl md:text-2xl text-amber-100/80 font-light max-w-2xl mx-auto">
                        {VICTORY_TEXT.sub}
                     </p>
                 </FadeInSection>
            </section>

            {/* --- SECTION 7: FUTURE STREETS --- */}
            <section className="relative py-24 z-20 px-4 md:px-12 bg-white/5 backdrop-blur-lg rounded-t-[3rem] -mt-20 border-t border-white/20 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
                <div className="text-center mb-16">
                    <h3 className="text-3xl font-bold text-syria-black font-sans mb-2">شوارع المستقبل</h3>
                    <p className="text-gray-600">قيمٌ نبني بها وطناً للجميع</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {FUTURE_VALUES.map((item, idx) => (
                        <FutureCard key={idx} title={item.title} desc={item.desc} index={idx} />
                    ))}
                </div>
            </section>

            {/* --- SECTION 8 & FINAL: PROMISE --- */}
            <section className="relative min-h-[80vh] flex flex-col items-center justify-center z-10 text-syria-black bg-gradient-to-b from-transparent to-amber-50 pt-20">
                <FadeInSection className="text-center space-y-8">
                     <h2 className="text-4xl font-bold font-serif text-syria-green">{PROMISE_TEXT.main}</h2>
                     <div className="space-y-4">
                        {PROMISE_TEXT.lines.map((line, i) => (
                            <p key={i} className="text-2xl text-gray-800">{line}</p>
                        ))}
                     </div>
                </FadeInSection>

                <div className="mt-32 mb-20 text-center">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5 }}
                        className="p-8 border-2 border-syria-gold/30 rounded-2xl relative"
                    >
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-50 px-4 text-syria-gold">
                            <StarIcon className="w-6 h-6 inline-block" />
                        </div>
                        <h3 className="text-3xl md:text-5xl font-bold text-syria-black mb-4 font-serif">{FINAL_TEXT.line1}</h3>
                        <p className="text-xl text-gray-600">{FINAL_TEXT.line2}</p>
                    </motion.div>
                </div>
                
                <footer className="pb-10 opacity-60">
                    <p className="text-sm font-sans tracking-widest uppercase">{FINAL_TEXT.footer}</p>
                </footer>
            </section>
        </motion.div>
    );
}

// --- Sub-components within App scope for simplicity ---

const RotatingText: React.FC<{ text: string, index: number, total: number }> = ({ text, index, total }) => {
    // A simple timer-based fade could work, but using pure CSS animation for infinite loop is smoother for "handful of files" constraint
    // Or we use Framer Motion with a delayed repeat.
    // Let's keep it static but distinct for now, or simple fade in stagger.
    // Actually, prompt asked for "rotate with slow crossfade".
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent(prev => (prev + 1) % total);
        }, 4000);
        return () => clearInterval(interval);
    }, [total]);

    return (
        <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: current === index ? 1 : 0, scale: current === index ? 1 : 0.95 }}
            transition={{ duration: 1 }}
        >
            <p className="text-2xl md:text-3xl font-light text-white drop-shadow-lg italic font-serif">"{text}"</p>
        </motion.div>
    );
};

const LanternStep: React.FC<{ text: string, index: number }> = ({ text, index }) => {
    return (
        <motion.div 
            className={`flex items-center gap-6 mb-24 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ margin: "-100px" }}
            transition={{ duration: 0.8 }}
        >
            {/* Lantern Icon */}
            <div className="relative shrink-0">
                <div className="w-4 h-4 rounded-full bg-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.8)] z-10 relative animate-pulse-slow"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-amber-500/20 rounded-full blur-md"></div>
            </div>
            
            <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                <p className="text-xl md:text-2xl text-amber-50/90 font-serif border-b border-amber-500/30 pb-2 inline-block">
                    {text}
                </p>
            </div>
        </motion.div>
    );
}

const FutureCard: React.FC<{ title: string, desc: string, index: number }> = ({ title, desc, index }) => {
    return (
        <motion.div
            className="bg-white border border-gray-100 p-8 rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 group cursor-default"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <h4 className="text-2xl font-bold text-syria-green mb-3 font-serif group-hover:text-syria-red transition-colors">{title}</h4>
            <p className="text-gray-600 font-sans leading-relaxed">{desc}</p>
        </motion.div>
    )
}

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
)
