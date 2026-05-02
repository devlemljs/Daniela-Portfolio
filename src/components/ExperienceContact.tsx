import { motion } from 'motion/react';
import { EXPERIENCES_1, EXPERIENCES_2, SOFTWARES } from '../constants';
import { SiGmail, SiWhatsapp } from 'react-icons/si';
import { FaLinkedin, FaFacebook } from 'react-icons/fa';

export default function ExperienceContact() {
  return (
    <section className="relative py-24 px-8 bg-white border-t border-gray-100 overflow-hidden">
      {/* Animated Grid Background */}
      <div className="grid-background opacity-80">
        <div className="grid-pattern" />
        <div className="vignette-mask" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 relative z-10">
        {/* Experience Column 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex flex-col gap-8"
        >
          <h3 className="font-display text-xs font-bold uppercase tracking-[0.3em] text-black">
            EXPERIENCE
          </h3>
          <div className="flex flex-col gap-10">
            {EXPERIENCES_1.map((exp, index) => (
              <div key={index} className="flex flex-col gap-2 group">
                <div className="flex flex-col">
                  <span className="font-display text-sm font-bold text-black group-hover:text-accent-beige transition-colors mb-1">
                    {exp.title}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent-beige font-bold border-l-2 border-accent-beige/30 pl-2">
                    {exp.company}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-muted font-light italic">
                  {exp.period}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Vertical Divider */}
        <div className="hidden md:block w-px bg-gray-100 self-stretch" />

        {/* Experience Column 2 - Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex-1 flex flex-col gap-8"
        >
          <h3 className="font-display text-xs font-bold uppercase tracking-[0.3em] text-black">
            SUMMARY / PROFILE
          </h3>
          <div className="flex flex-col gap-10">
            {EXPERIENCES_2.map((exp, index) => (
              <div key={index} className="flex flex-col gap-2 group">
                <div className="flex flex-col">
                  <span className="font-display text-sm font-bold text-black group-hover:text-accent-beige transition-colors mb-1">
                    {exp.title}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent-beige font-bold border-l-2 border-accent-beige/30 pl-2">
                    {exp.company}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-muted font-light italic">
                  {exp.period}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Vertical Divider */}
        <div className="hidden md:block w-px bg-gray-100 self-stretch" />

        {/* Contact/Software Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 flex flex-col gap-12"
        >
          <div className="flex flex-col gap-8">
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.3em] text-black">
              CONTACT
            </h3>
            <div className="flex flex-col gap-4">
              <a href="https://www.linkedin.com/in/daniela-lacuarin-062780291/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                <div className="w-8 h-8 bg-gray-100 flex items-center justify-center rounded overflow-hidden transition-transform group-hover:scale-110">
                  <FaLinkedin size={18} color="black" />
                </div>
                <span className="text-xs text-muted group-hover:text-black transition-colors truncate max-w-[200px]">Daniela Lacuarin</span>
              </a>
              <a href="https://www.facebook.com/Nyelaaaaa/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                <div className="w-8 h-8 bg-gray-100 flex items-center justify-center rounded overflow-hidden transition-transform group-hover:scale-110">
                  <FaFacebook size={18} color="black" />
                </div>
                <span className="text-xs text-muted group-hover:text-black transition-colors">Daniela Lacuarin</span>
              </a>
              <a href="mailto:lacuarindaniela1@gmail.com" className="flex items-center gap-3 group">
                <div className="w-8 h-8 bg-gray-100 flex items-center justify-center rounded overflow-hidden transition-transform group-hover:scale-110">
                  <SiGmail size={16} color="black" />
                </div>
                <span className="text-xs text-muted group-hover:text-black transition-colors truncate">lacuarindaniela1@gmail.com</span>
              </a>
              <a href="https://wa.me/639938041600" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                <div className="w-8 h-8 bg-gray-100 flex items-center justify-center rounded overflow-hidden transition-transform group-hover:scale-110">
                  <SiWhatsapp size={16} color="black" />
                </div>
                <span className="text-xs text-muted group-hover:text-black transition-colors">09938041600</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.3em] text-black">
              SOFTWARES
            </h3>
            <div className="flex flex-wrap gap-[4px] justify-start content-start">
              {SOFTWARES.map((software, index) => (
                <div key={index} className="flex flex-col items-center group">
                  <div className="w-8 h-8 border border-gray-100 rounded flex items-center justify-center text-xs font-bold text-black group-hover:bg-black group-hover:text-white transition-all overflow-hidden">
                    {typeof software.icon === 'string' ? (
                      <img src={software.icon} alt={software.name} className="w-full h-full object-cover" />
                    ) : software.icon}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
