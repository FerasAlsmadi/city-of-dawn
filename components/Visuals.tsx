import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// --- Stars Component ---
export const Stars: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const stars: { x: number; y: number; r: number; alpha: number; speed: number }[] = [];
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5,
        alpha: Math.random(),
        speed: 0.005 + Math.random() * 0.01,
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      stars.forEach((star) => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0.2) star.speed = -star.speed;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [opacity]);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />;
};

// --- City Skyline SVG ---
// Abstract geometric shapes representing a city
interface CitySkylineProps {
  lightsOn: boolean;
  scrollYProgress: any;
}

export const CitySkyline: React.FC<CitySkylineProps> = ({ lightsOn, scrollYProgress }) => {
  // Parallax effect for the city layers
  const yBack = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const yFront = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <div className="absolute bottom-0 left-0 w-full h-[60vh] pointer-events-none overflow-hidden z-0">
      {/* Back Layer - Darker, slower */}
      <motion.div style={{ y: yBack }} className="absolute bottom-0 left-0 w-full h-full flex items-end justify-center opacity-40">
        <svg viewBox="0 0 1440 320" className="w-full h-auto text-slate-900 fill-current" preserveAspectRatio="none">
           <path d="M0,220 L120,200 L240,240 L360,180 L480,260 L600,200 L720,240 L840,160 L960,220 L1080,180 L1200,260 L1320,220 L1440,280 L1440,320 L0,320 Z" />
        </svg>
      </motion.div>

      {/* Middle Layer */}
      <motion.div className="absolute bottom-0 left-0 w-full h-full flex items-end justify-center opacity-70 text-slate-950">
        <svg viewBox="0 0 1440 400" className="w-full h-auto fill-current" preserveAspectRatio="none">
            <path d="M0,160 L80,140 L160,180 L240,120 L320,160 L400,100 L480,180 L560,120 L640,200 L720,100 L800,160 L880,120 L960,180 L1040,100 L1120,160 L1200,120 L1280,180 L1360,140 L1440,180 L1440,400 L0,400 Z" />
            {/* Windows in the middle layer */}
            <g className={`transition-opacity duration-[2000ms] ${lightsOn ? 'opacity-100' : 'opacity-0'}`}>
                <rect x="180" y="200" width="10" height="10" fill="#FCD34D" fillOpacity="0.5" />
                <rect x="200" y="160" width="8" height="15" fill="#FCD34D" fillOpacity="0.7" />
                <rect x="740" y="150" width="12" height="20" fill="#FCD34D" fillOpacity="0.6" />
                <rect x="1220" y="180" width="8" height="8" fill="#FCD34D" fillOpacity="0.4" />
                {/* Random scatters */}
                {Array.from({ length: 20 }).map((_, i) => (
                    <circle key={i} cx={100 + i * 60} cy={200 + (i % 3) * 30} r={1.5} fill="#FCD34D" />
                ))}
            </g>
        </svg>
      </motion.div>

      {/* Front Layer - Detailed */}
      <motion.div style={{ y: yFront }} className="absolute bottom-0 left-0 w-full h-full flex items-end justify-center text-black">
         <svg viewBox="0 0 1440 320" className="w-full h-auto fill-current" preserveAspectRatio="none">
             {/* Abstract buildings */}
            <path d="M0,280 L60,280 L60,180 L120,180 L120,240 L180,240 L180,150 L240,150 L240,260 L300,260 L300,200 L360,200 L360,280 L420,280 L420,160 L480,160 L480,240 L540,240 L540,280 L1440,280 L1440,320 L0,320 Z" />
            
            {/* Windows that light up */}
            <g className={`transition-opacity duration-[3000ms] ${lightsOn ? 'opacity-100' : 'opacity-0'}`}>
              <rect x="70" y="190" width="10" height="10" fill="#FEF08A" />
              <rect x="90" y="210" width="10" height="10" fill="#FEF08A" />
              <rect x="190" y="160" width="10" height="10" fill="#FEF08A" />
              <rect x="430" y="170" width="10" height="10" fill="#FEF08A" />
              <rect x="450" y="190" width="10" height="10" fill="#FEF08A" />
              
               {/* More Windows scattered */}
               {Array.from({ length: 30 }).map((_, i) => (
                   <rect key={i} x={Math.random() * 1440} y={290 + Math.random() * 20} width="4" height="4" fill="#FEF08A" fillOpacity={Math.random()} />
               ))}
            </g>
         </svg>
      </motion.div>
    </div>
  );
};

// --- Particles (Sparks of Hope) ---
export const Particles: React.FC = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-yellow-200 rounded-full blur-[1px]"
                    initial={{
                        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                        y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
                        opacity: 0
                    }}
                    animate={{
                        y: -100,
                        opacity: [0, 0.8, 0],
                        x: `calc(${Math.random() * 100}vw + ${(Math.random() - 0.5) * 50}px)`
                    }}
                    transition={{
                        duration: 5 + Math.random() * 10,
                        repeat: Infinity,
                        delay: Math.random() * 10,
                        ease: "linear"
                    }}
                />
            ))}
        </div>
    )
}

// --- Revolution Flag (Abstract) ---
export const RevolutionFlag: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={`relative w-64 h-40 ${className}`}>
            {/* Green */}
            <div className="absolute top-0 w-full h-1/3 bg-syria-green/80 blur-sm mix-blend-screen animate-pulse-slow"></div>
            {/* White */}
            <div className="absolute top-1/3 w-full h-1/3 bg-white/80 blur-sm flex items-center justify-center gap-4 shadow-[0_0_20px_rgba(255,255,255,0.5)]">
               <StarIcon className="w-4 h-4 text-syria-red drop-shadow-[0_0_5px_rgba(206,17,38,0.8)]" />
               <StarIcon className="w-4 h-4 text-syria-red drop-shadow-[0_0_5px_rgba(206,17,38,0.8)]" />
               <StarIcon className="w-4 h-4 text-syria-red drop-shadow-[0_0_5px_rgba(206,17,38,0.8)]" />
            </div>
            {/* Black */}
            <div className="absolute bottom-0 w-full h-1/3 bg-black/80 blur-sm"></div>
            
            {/* Wave overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full h-full skew-x-12 opacity-30"></div>
        </div>
    )
}

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
)
