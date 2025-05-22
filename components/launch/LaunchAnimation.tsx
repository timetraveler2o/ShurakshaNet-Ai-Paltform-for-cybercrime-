import React, { useEffect, useState, useMemo } from 'react';

interface LaunchAnimationProps {
  appName: string;
}

const DataStreamBackground: React.FC = () => {
  const chars = useMemo(() => Array.from("0123456789ABCDEF").concat(Array(20).fill(' ')), []); // More spaces for sparsity
  const streamCount = 50; // Number of vertical streams

  return (
    <div className="absolute inset-0 overflow-hidden z-0 opacity-30">
      {Array.from({ length: streamCount }).map((_, i) => (
        <div
          key={i}
          className="absolute data-stream-char"
          style={{
            left: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 10 + 8}px`, // Smaller font size for subtlety
            animationDuration: `${Math.random() * 5 + 8}s`, // Slower, varied speeds
            animationDelay: `-${Math.random() * 10}s`, // Staggered start times
          }}
        >
          {Array.from({ length: 30 + Math.floor(Math.random() * 20) }).map((_c, charIndex) => ( // Varied stream length
            <div key={charIndex} style={{ opacity: Math.max(0.1, 1 - (charIndex / (30 + Math.floor(Math.random()*20)))) }}> {/* Fade out effect */}
              {chars[Math.floor(Math.random() * chars.length)]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};


export const LaunchAnimation: React.FC<LaunchAnimationProps> = ({ appName }) => {
  const [progress, setProgress] = useState(0);
  const [typedAppName, setTypedAppName] = useState('');
  const [showTagline, setShowTagline] = useState(false);
  const [showAccessGranted, setShowAccessGranted] = useState(false);

  const tagline = "Initializing SurakshaNet Protocol // Unified Cybercrime & Public Safety Platform";

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    let charIndex = 0;
    
    const typingTimer = setTimeout(() => {
        const typingInterval = setInterval(() => {
          if (charIndex < appName.length) {
            setTypedAppName(prev => prev + appName[charIndex]);
            charIndex++;
          } else {
            clearInterval(typingInterval);
            setShowTagline(true);
          }
        }, 120); // Typing speed for app name
        return () => clearInterval(typingInterval);
    }, 500); // Initial delay before typing starts

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setShowAccessGranted(true);
          return 100;
        }
        return prev + 1; // Progress speed
      });
    }, 35); // Progress update frequency (total duration approx 3.5s for progress)

    return () => {
      clearTimeout(typingTimer);
      clearInterval(progressInterval);
      // App.tsx will handle restoring body overflow
    };
  }, [appName]);

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-[1000] selection:bg-sky-500 selection:text-white scanlines-bg">
      <DataStreamBackground />
      <div className="text-center relative z-10">
        <div 
            className="font-major-mono text-6xl md:text-8xl font-black text-sky-300 tracking-wider relative mb-3 glitch-text-container"
            data-text={typedAppName || appName} // For CSS glitch effect
        >
          <span className="glitch-base">{typedAppName || <span className="opacity-0">{appName}</span>}</span>
          <span className="glitch-layer" aria-hidden="true">{typedAppName || <span className="opacity-0">{appName}</span>}</span>
          <span className="glitch-layer" aria-hidden="true">{typedAppName || <span className="opacity-0">{appName}</span>}</span>
           {typedAppName.length < appName.length && <span className="animate-pulse text-sky-400">_</span>}
        </div>

        {showTagline && (
          <p className="font-major-mono text-slate-400 text-xs md:text-sm mt-3 animate-fadeInUpSlight tracking-widest">
            {tagline.split('//').map((part, index) => (
                <span key={index} className="block opacity-0" style={{animationDelay: `${index * 0.2 + 0.2}s`, animationFillMode: 'forwards', animationName: 'fadeInUpSlightAnim'}}>{part.trim()}</span>
            ))}
          </p>
        )}
      </div>

      <div className="w-4/5 md:w-1/2 max-w-lg mt-12 relative z-10">
        <div className="h-1.5 bg-sky-500/20 rounded-full overflow-hidden border border-sky-500/30 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-teal-400 rounded-full transition-all duration-100 ease-linear shadow-md shadow-cyan-500/50"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        {showAccessGranted ? (
             <p className="font-major-mono text-sm text-green-400 text-center mt-3 animate-pulseFast tracking-wider">
                ACCESS GRANTED
            </p>
        ) : (
            <p className="font-major-mono text-xs text-sky-400 text-center mt-2 animate-pulse tracking-wider">
            SYSTEM INITIALIZATION... {progress}%
            </p>
        )}
      </div>
      
      <style>{`
        .glitch-text-container {
          position: relative;
          min-height: 1.2em; /* Ensure space for text */
        }
        .glitch-base {
          opacity: 1;
          position: relative;
          z-index: 1;
        }
        .glitch-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          color: #0ea5e9; /* sky-500 */
        }
        .glitch-layer:nth-child(2) {
          color: #fb7185; /* rose-400 */
          animation: glitch-anim-1 1.5s infinite linear alternate-reverse;
        }
        .glitch-layer:nth-child(3) {
          color: #67e8f9; /* cyan-300 */
          animation: glitch-anim-2 1.5s infinite linear alternate-reverse;
        }

        @keyframes glitch-anim-1 {
          0%, 100% { clip-path: inset(20% 0 70% 0); transform: translate(-2px, 1px) skew(5deg); opacity: 0.6; }
          50% { clip-path: inset(80% 0 10% 0); transform: translate(2px, -1px) skew(-5deg); opacity: 0.8; }
        }
        @keyframes glitch-anim-2 {
          0%, 100% { clip-path: inset(60% 0 30% 0); transform: translate(1px, -2px) skew(-3deg); opacity: 0.7; }
          50% { clip-path: inset(10% 0 85% 0); transform: translate(-1px, 2px) skew(3deg); opacity: 0.5; }
        }
        
        @keyframes fadeInUpSlightAnim { /* Renamed to avoid conflict */
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUpSlight { /* Class for general use if needed elsewhere */
            opacity: 0; /* Start hidden */
            animation: fadeInUpSlightAnim 0.8s ease-out forwards;
         }
         @keyframes pulseFast {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
         }
        .animate-pulseFast { animation: pulseFast 1s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>
    </div>
  );
};
