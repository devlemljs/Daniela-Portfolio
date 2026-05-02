import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink } from 'lucide-react';

const about = '/images/profile.webp';
const cv = '/files/CV.pdf';

export default function Intro() {
  const name = "Daniela";
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(150);
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

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
    const handleTyping = () => {
      if (!isDeleting) {
        setDisplayText(name.substring(0, displayText.length + 1));
        if (displayText.length === name.length) {
          setTimeout(() => setIsDeleting(true), 2000);
          setSpeed(100);
        }
      } else {
        setDisplayText(name.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setSpeed(150);
        }
      }
    };

    const timer = setTimeout(handleTyping, speed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, speed]);

  return (
    <section className="py-24 px-8 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[300px] md:max-w-none md:w-1/3 aspect-[3/4] mx-auto md:mx-0 translate-x-[5px] perspective-1000"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          ref={cardRef}
        >
          {/* ID Badge with 3D Tilt Effect and Base Slant */}
          <motion.div 
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            animate={{ rotate: 5 }}
            whileHover={{ rotate: 0, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative w-full h-full bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-100 p-4 flex flex-col items-center z-10 cursor-pointer"
          >
            <div className="w-full h-2/3 bg-gray-100 rounded-lg overflow-hidden mt-6" style={{ transform: "translateZ(30px)" }}>
              <img 
                src= {about}
                alt="Daniela Lacuarin ID" 
                className="w-full h-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="mt-4 w-full flex flex-col gap-2 items-center" style={{ transform: "translateZ(50px)" }}>
              <div className="font-display text-lg font-bold text-black uppercase tracking-tight">DANIELA LACUARIN</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-latte font-bold text-center px-4">Digital Marketing Specialist • Content Creator • Social Media Manager</div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-6 md:w-2/3"
        >
          <h2 className="font-display text-[46px] sm:text-5xl font-bold text-black leading-tight">
            HI, I'm <span className="text-accent-beige inline-block min-w-[180px]">{displayText}<span className="animate-pulse">|</span></span>
          </h2>
          <p className="text-base sm:text-lg leading-relaxed font-light text-muted max-w-2xl">
            I am a <span className="font-bold text-black">Digital Marketing Specialist</span> focused on transforming ideas into campaigns that connect and convert. 
            With experience in social media management, <span className="font-medium text-black">Facebook Ads</span>, influencer collaborations, 
            content creation, and market research, I specialize in building brand presence and engaging audiences. 
            My focus is on <span className="font-medium text-black">driving measurable results</span> and turning engagement into 
            conversions through meaningful content.
          </p>

          <motion.a
            href= {cv}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, backgroundColor: '#d4c3b3' }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-display text-xs font-bold uppercase tracking-[0.2em] rounded-full w-fit group"
          >
            View CV
            <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
