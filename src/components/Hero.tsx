import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import React, { useState, useRef, useEffect } from 'react';

const profile = '/images/profilenobg.png';

const ORIGINAL_TEXT = [
  { char: 'P', size: '190px', dy: 15, baseWeight: 900, maxWeight: 1000, dx: 0 },
  { char: 'O', size: '150px', dy: 5, baseWeight: 400, maxWeight: 800, dx: -15 },
  { char: 'R', size: '150px', dy: -5, baseWeight: 700, maxWeight: 900, dx: -20 },
  { char: 't', size: '180px', dy: 15, lower: true, baseWeight: 700, maxWeight: 1000, dx: -25 },
  { char: 'f', size: '115px', dy: -10, lower: true, baseWeight: 800, maxWeight: 1000, dx: -15 },
  { char: 'O', size: '170px', dy: 0, baseWeight: 500, maxWeight: 900, dx: -20 },
  { char: 'L', size: '140px', dy: 5, baseWeight: 900, maxWeight: 1000, dx: -15 },
  { char: 'i', size: '130px', dy: -5, lower: true, baseWeight: 400, maxWeight: 800, dx: -10 },
  { char: 'O', size: '170px', dy: 15, baseWeight: 700, maxWeight: 1000, dx: -15 },
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["25deg", "-25deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-25deg", "25deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white">
      {/* Animated Grid Background */}
      <div className="grid-background opacity-100">
        <div className="grid-pattern" />
        <div className="vignette-mask" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full flex flex-col items-center"
        >
          {/* Curved PORTFOLIO and Name Text */}
          <div className="relative w-full h-[45vw] sm:h-[35vw] max-h-[500px] flex items-center justify-center cursor-default">
            <svg viewBox="0 0 1000 400" className="w-[110%] sm:w-full h-full overflow-visible pointer-events-none">
              {/* Path for PORTFOLIO - Smoother, more natural arch */}
              <path 
                id="portfolioCurve" 
                d="M 50,400 C 150,50 850,50 950,400" 
                fill="transparent" 
              />
              <text className="font-display font-black uppercase tracking-tighter fill-black select-none">
                <textPath href="#portfolioCurve" startOffset="50%" textAnchor="middle">
                  {ORIGINAL_TEXT.map((item, i) => (
                    <ProximityLetter
                      key={i}
                      index={i}
                      item={item}
                      mousePos={mousePos}
                      containerRef={containerRef}
                    />
                  ))}
                </textPath>
              </text>
            </svg>

            <span className="absolute top-[5%] right-[5%] sm:right-[10%] font-display text-4xl sm:text-6xl font-bold text-accent-beige opacity-30">
              '25
            </span>
          </div>
        </motion.div>

        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative mt-[-18vw] sm:mt-[-22vw] w-[calc(45vw+36px)] sm:w-[calc(26vw+16px)] max-w-[336px] aspect-[4/5] z-10 flex flex-col items-center group perspective-800 max-sm:-translate-y-[18px] sm:-translate-y-[10px]"
        >
          {/* Illustration Container - Curved on Top */}
          <motion.div 
            className="w-full h-full bg-transparent rounded-t-full overflow-hidden flex items-end justify-center relative"
            style={{ 
              rotateX,
              rotateY,
              transformStyle: "preserve-3d"
            }}
          >
            <img 
              src= {profile}
              alt="Daniela Lacuarin" 
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
              style={{ transform: "translateZ(50px)" }}
            />
          </motion.div>

          {/* Name - Responsive sizing */}
          <div className="mt-2 sm:mt-4 w-full text-center">
            <span className="font-display text-[12px] sm:text-[15px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-accent-beige">
              DANIELA LACUARIN
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ProximityLetter({ item, mousePos, containerRef }: any) {
  const ref = useRef<SVGTSpanElement>(null);
  const [proximityWeight, setProximityWeight] = useState(0);

  useEffect(() => {
    if (!ref.current || !containerRef.current) return;
    
    const updateWeight = () => {
      if (!ref.current || !containerRef.current) return;
      const rect = ref.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      
      const charX = rect.left - containerRect.left + rect.width / 2;
      const charY = rect.top - containerRect.top + rect.height / 2;

      const dist = Math.sqrt(Math.pow(mousePos.x - charX, 2) + Math.pow(mousePos.y - charY, 2));
      const radius = 150;
      
      let proximity = 0;
      if (dist < radius) {
        proximity = 1 - dist / radius;
      }
      setProximityWeight((item.maxWeight - item.baseWeight) * proximity);
    };

    updateWeight();
  }, [mousePos, containerRef, item.baseWeight, item.maxWeight]);

  const weight = item.baseWeight + proximityWeight;

  return (
    <motion.tspan
      ref={ref}
      fontSize={item.size}
      dy={item.dy}
      dx={item.dx}
      className={item.lower ? 'lowercase' : ''}
      style={{ 
        fontWeight: weight
      }}
    >
      {item.char}
    </motion.tspan>
  );
}
