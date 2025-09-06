"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface KribiAnimationsProps {
  children: React.ReactNode;
  className?: string;
}

export const KribiAnimations: React.FC<KribiAnimationsProps> = ({ children, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Animation d'entrée avec effet de vague
    gsap.fromTo(container, 
      { 
        opacity: 0, 
        y: 50,
        scale: 0.95
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power2.out"
      }
    );

    // Animation des éléments enfants
    const children = container.querySelectorAll('.animate-on-scroll');
    gsap.fromTo(children,
      { 
        opacity: 0, 
        y: 30,
        rotationX: 15
      },
      { 
        opacity: 1, 
        y: 0,
        rotationX: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)",
        delay: 0.3
      }
    );

    // Effet de vague continue en arrière-plan
    const waveElements = container.querySelectorAll('.wave-effect');
    waveElements.forEach((element, index) => {
      gsap.to(element, {
        x: "100%",
        duration: 3 + index * 0.5,
        repeat: -1,
        ease: "none",
        yoyo: true
      });
    });

    // Animation des bulles
    const bubbles = container.querySelectorAll('.bubble');
    bubbles.forEach((bubble, index) => {
      gsap.to(bubble, {
        y: -20,
        duration: 2 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        delay: index * 0.2
      });
    });

  }, []);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Effet de vague en arrière-plan */}
      <div className="absolute inset-0 opacity-5">
        <div className="wave-effect absolute top-1/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
        <div className="wave-effect absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
        <div className="wave-effect absolute top-3/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
      </div>

      {/* Bulles flottantes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bubble absolute bg-gradient-to-r from-blue-200/30 to-orange-200/30 rounded-full"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {children}
    </div>
  );
};

export default KribiAnimations;
