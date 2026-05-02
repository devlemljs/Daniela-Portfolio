import { motion } from 'motion/react';
import { PROJECTS } from '../constants';

export default function ProjectContent() {
  return (
    <section className="pb-12 pt-0 px-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative mb-8 sm:mb-12 flex items-center justify-center w-full"
        >
          <h2 className="font-display text-[21vw] sm:text-[calc(15vw+32px)] font-black uppercase tracking-tighter text-outline opacity-40 select-none whitespace-nowrap leading-none">
            CONTENT
          </h2>
          
          {/* Staggered Numbers in Latte Brown - Larger and Bolder */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <span className="absolute top-[calc(15%+2px)] left-[5%] sm:left-[10%] font-display text-[7vw] sm:text-[5vw] font-black text-latte">01</span>
            <span className="absolute bottom-[15%] left-[20%] sm:left-[25%] font-display text-[7vw] sm:text-[5vw] font-black text-latte">02</span>
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[7vw] sm:text-[5vw] font-black text-latte">03</span>
            <span className="absolute bottom-[calc(15%+10px)] right-[20%] sm:right-[25%] font-display text-[7vw] sm:text-[5vw] font-black text-latte">04</span>
            <span className="absolute top-[15%] right-[5%] sm:right-[10%] font-display text-[7vw] sm:text-[5vw] font-black text-latte">05</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full max-w-5xl mx-auto">
          {PROJECTS.map((project, index) => (
            <motion.a
              key={project.id}
              href={project.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="flex flex-col group cursor-pointer"
            >
              <div className="relative group perspect-1000">
                {/* Premium Smartphone Frame */}
                <div className="relative aspect-[9/19] w-full max-w-[220px] mx-auto bg-zinc-900 rounded-[3rem] p-[3px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-zinc-800 ring-1 ring-white/10 group-hover:scale-[1.02] transform-gpu transition-all duration-700 ease-out z-20">
                  
                  {/* Metallic Highlight Edge effect */}
                  <div className="absolute inset-0 rounded-[3rem] border border-white/5 pointer-events-none z-50"></div>
                  
                  {/* Subtle Metallic Gradient Frame */}
                  <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-tr from-zinc-800 via-zinc-900 to-zinc-800 pointer-events-none"></div>

                  {/* Inner Bezel (Screen Area) */}
                  <div className="relative w-full h-full bg-black rounded-[2.8rem] overflow-hidden">
                    
                    {/* Dynamic Island Cutout */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-zinc-900 rounded-full z-40 flex items-center justify-center border border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 ml-auto mr-2"></div>
                    </div>

                    {/* Image / Screen Content */}
                    <div className="w-full h-full relative">
                      <img 
                        src={project.imageUrl} 
                        alt={project.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                        referrerPolicy="no-referrer"
                      />
                      {/* Screen Glare Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-30 opacity-50 group-hover:opacity-30 transition-opacity"></div>
                    </div>
                  </div>

                  {/* Redesigned Shadow for Numbers inward */}
                  <div className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 font-display text-[28vw] sm:text-[8vw] font-black text-white/30 select-none drop-shadow-2xl z-30 leading-none pointer-events-none">
                    {project.number}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col gap-2 px-2">
                <h3 className="font-display text-base font-bold text-black uppercase tracking-tight">
                  {project.title}
                </h3>
                <p className="text-[10px] leading-relaxed text-muted font-light uppercase tracking-widest">
                  {project.description}
                </p>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-20 text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-muted text-center font-light max-w-2xl px-4"
        >
          Unauthorized use or duplication of these works without express permission is strictly prohibited.
        </motion.p>
      </div>
    </section>
  );
}
