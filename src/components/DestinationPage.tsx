import { motion } from "motion/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ProjectCarousel from "./projects/ProjectCarousel";
import CaseStudy from "./projects/CaseStudy";

export default function DestinationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { section, id } = useParams();
  const bgImage = location.state?.fromImage;

  const handleBack = () => {
    // Reverse transition to the launchpad
    navigate('/', { state: { returnFrom: section, fromImage: bgImage } });
  };

  // Direct custom routing for high-fidelity Projects module
  if (section === "projects") {
    if (id) {
      return <CaseStudy />;
    }
    return <ProjectCarousel />;
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-transparent page-enter">
      {/* Full screen background image restored from transition */}
      {bgImage && (
        <div className="fixed inset-0 z-0">
          <img src={bgImage} className="w-full h-full object-cover scale-[1.02]" />
        </div>
      )}

      {/* Fade IN overlay revealing content by dimming the background */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 bg-neutral-950 z-10 pointer-events-none"
      />

      {/* Page Content */}
      <div className="relative z-20 flex flex-col p-8 md:p-16 min-h-screen text-white">
        <button 
          onClick={handleBack}
          className="self-start text-xs font-mono tracking-widest text-white/40 hover:text-white transition-colors uppercase cursor-pointer"
        >
          ← Return to Launchpad
        </button>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 flex flex-col items-start justify-center max-w-4xl"
        >
           <span className="text-xs font-mono tracking-widest text-white/40 uppercase mb-4">Destination Node</span>
           <h1 className="text-6xl md:text-8xl font-medium tracking-tighter uppercase mb-6">{section}</h1>
           <p className="text-neutral-400 font-light text-lg md:text-xl max-w-2xl leading-relaxed">
             This module contains detailed telemetry and archival data regarding the requested subject. Secure connection established.
           </p>
        </motion.div>
      </div>
    </div>
  );
}
