import { motion } from 'motion/react';

export default function Footer() {
  return (
    <footer className="py-12 px-8 bg-white border-t border-gray-100 flex flex-col items-center gap-4">
      <motion.span 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="font-display text-sm font-bold uppercase tracking-[0.3em] text-accent-beige"
      >
        DANIELA LACUARIN
      </motion.span>
      <p className="text-[10px] text-muted uppercase tracking-widest font-light">
        © 2026 | All rights reserved
      </p>
    </footer>
  );
}
