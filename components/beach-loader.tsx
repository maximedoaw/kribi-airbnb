"use client";

import React from 'react';

interface BeachLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const BeachLoader: React.FC<BeachLoaderProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32', 
    lg: 'w-48 h-48',
    xl: 'w-80 h-80'
  };

  const sunSize = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12', 
    xl: 'w-16 h-16'
  };

  const rayCount = size === 'sm' ? 4 : size === 'md' ? 6 : size === 'lg' ? 8 : 8;
  const rayLength = size === 'sm' ? 'h-4' : size === 'md' ? 'h-6' : size === 'lg' ? 'h-8' : 'h-8';

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Soleil animé */}
        <div className={`absolute top-1 right-2 ${sunSize[size]} bg-orange-400 rounded-full animate-pulse shadow-lg`}>
          <div className={`absolute inset-0 bg-orange-300 rounded-full animate-ping opacity-75`}></div>
          {/* Rayons de soleil */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {[...Array(rayCount)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-0.5 ${rayLength} bg-orange-400 origin-bottom animate-spin`}
                style={{
                  transform: `rotate(${i * (360 / rayCount)}deg) translateY(-${size === 'sm' ? '12px' : size === 'md' ? '18px' : size === 'lg' ? '24px' : '24px'})`,
                  animationDuration: '3s',
                  animationDelay: `${i * 0.1}s`
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Nuages flottants */}
        <div className={`absolute top-2 left-1 ${size === 'sm' ? 'w-3 h-1.5' : size === 'md' ? 'w-6 h-3' : size === 'lg' ? 'w-8 h-4' : 'w-12 h-6'} bg-white rounded-full opacity-80 animate-bounce`}>
          <div className={`absolute -left-1 top-0.5 ${size === 'sm' ? 'w-2 h-1' : size === 'md' ? 'w-4 h-2' : size === 'lg' ? 'w-6 h-3' : 'w-8 h-4'} bg-white rounded-full`}></div>
          <div className={`absolute -right-0.5 top-0 ${size === 'sm' ? 'w-1.5 h-1' : size === 'md' ? 'w-3 h-2.5' : size === 'lg' ? 'w-4 h-3' : 'w-6 h-5'} bg-white rounded-full`}></div>
        </div>
        
        <div className={`absolute top-3 right-4 ${size === 'sm' ? 'w-2.5 h-1.5' : size === 'md' ? 'w-5 h-2.5' : size === 'lg' ? 'w-7 h-3.5' : 'w-10 h-5'} bg-white rounded-full opacity-60 animate-bounce`} style={{ animationDelay: '0.5s' }}>
          <div className={`absolute -left-0.5 top-0 ${size === 'sm' ? 'w-1.5 h-1' : size === 'md' ? 'w-3 h-2' : size === 'lg' ? 'w-4 h-2.5' : 'w-6 h-4'} bg-white rounded-full`}></div>
        </div>

        {/* Vagues océan */}
        <div className={`absolute ${size === 'sm' ? 'bottom-8' : size === 'md' ? 'bottom-16' : size === 'lg' ? 'bottom-20' : 'bottom-32'} left-0 right-0 ${size === 'sm' ? 'h-5' : size === 'md' ? 'h-10' : size === 'lg' ? 'h-15' : 'h-20'} overflow-hidden`}>
          <div className={`absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-blue-400 to-blue-300 transform origin-bottom`}>
            <div className="absolute top-0 left-0 right-0 h-full">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 h-full bg-blue-500 rounded-full opacity-60"
                  style={{
                    left: `${i * 30}%`,
                    width: '60%',
                    transform: 'scaleY(0.3)',
                    animation: `wave 2s ease-in-out infinite ${i * 0.3}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Plage/sable */}
        <div className={`absolute bottom-0 left-0 right-0 ${size === 'sm' ? 'h-8' : size === 'md' ? 'h-16' : size === 'lg' ? 'h-24' : 'h-32'} bg-gradient-to-t from-orange-200 via-orange-100 to-transparent rounded-t-3xl`}></div>

        {/* Palmier */}
        <div className={`absolute ${size === 'sm' ? 'bottom-4 left-2' : size === 'md' ? 'bottom-8 left-4' : size === 'lg' ? 'bottom-12 left-6' : 'bottom-16 left-8'}`}>
          {/* Tronc */}
          <div className={`${size === 'sm' ? 'w-1 h-4' : size === 'md' ? 'w-1.5 h-8' : size === 'lg' ? 'w-2 h-12' : 'w-3 h-16'} bg-amber-600 rounded-sm transform -rotate-3 origin-bottom`}></div>
          {/* Feuilles */}
          <div className={`absolute -top-1 -left-1.5 transform -rotate-12 animate-sway`}>
            <div className={`${size === 'sm' ? 'w-2 h-0.5' : size === 'md' ? 'w-4 h-1' : size === 'lg' ? 'w-6 h-1.5' : 'w-8 h-2'} bg-green-500 rounded-full transform rotate-45 origin-left`}></div>
            <div className={`${size === 'sm' ? 'w-1.5 h-0.5' : size === 'md' ? 'w-3 h-1' : size === 'lg' ? 'w-4.5 h-1.5' : 'w-6 h-2'} bg-green-500 rounded-full transform rotate-12 origin-left mt-0.5`}></div>
            <div className={`${size === 'sm' ? 'w-1.5 h-0.5' : size === 'md' ? 'w-3.5 h-1' : size === 'lg' ? 'w-5 h-1.5' : 'w-7 h-2'} bg-green-500 rounded-full transform -rotate-12 origin-left mt-0.5`}></div>
            <div className={`${size === 'sm' ? 'w-1 h-0.5' : size === 'md' ? 'w-2.5 h-1' : size === 'lg' ? 'w-3.5 h-1.5' : 'w-5 h-2'} bg-green-500 rounded-full transform -rotate-45 origin-left mt-0.5`}></div>
          </div>
        </div>

        {/* Bateau qui navigue */}
        <div className={`absolute ${size === 'sm' ? 'bottom-6' : size === 'md' ? 'bottom-12' : size === 'lg' ? 'bottom-18' : 'bottom-24'} transform animate-float`} style={{
          left: '0%',
          animation: 'sail 4s ease-in-out infinite'
        }}>
          {/* Coque */}
          <div className={`${size === 'sm' ? 'w-2 h-1' : size === 'md' ? 'w-4 h-1.5' : size === 'lg' ? 'w-6 h-2' : 'w-8 h-3'} bg-red-500 rounded-b-lg`}></div>
          {/* Mât */}
          <div className={`absolute left-1/2 -translate-x-1/2 ${size === 'sm' ? '-top-3 w-0.5 h-3' : size === 'md' ? '-top-4 w-0.5 h-4' : size === 'lg' ? '-top-5 w-0.5 h-5' : '-top-6 w-0.5 h-6'} bg-amber-700`}></div>
          {/* Voile */}
          <div className={`absolute left-1/2 -translate-x-1/2 ${size === 'sm' ? '-top-3 w-2 h-2' : size === 'md' ? '-top-4 w-3 h-3' : size === 'lg' ? '-top-5 w-4 h-4' : '-top-6 w-4 h-4'} bg-white rounded-r-lg transform animate-sway`}></div>
        </div>

        {/* Mouettes */}
        <div className={`absolute ${size === 'sm' ? 'top-4 left-5' : size === 'md' ? 'top-8 left-10' : size === 'lg' ? 'top-12 left-15' : 'top-16 left-20'} animate-fly`}>
          <div className={`${size === 'sm' ? 'w-0.5 h-0.5' : size === 'md' ? 'w-1 h-1' : size === 'lg' ? 'w-1 h-1' : 'w-1 h-1'} bg-gray-600 rounded-full`}></div>
          <div className={`absolute -left-0.5 top-0 ${size === 'sm' ? 'w-1 h-0.5' : size === 'md' ? 'w-1 h-0.5' : size === 'lg' ? 'w-1.5 h-0.5' : 'w-2 h-0.5'} border-t-2 border-gray-600 rounded-full transform rotate-12`}></div>
          <div className={`absolute -right-0.5 top-0 ${size === 'sm' ? 'w-1 h-0.5' : size === 'md' ? 'w-1 h-0.5' : size === 'lg' ? 'w-1.5 h-0.5' : 'w-2 h-0.5'} border-t-2 border-gray-600 rounded-full transform -rotate-12`}></div>
        </div>

        {/* Texte de chargement */}
        <div className={`absolute ${size === 'sm' ? 'bottom-2' : size === 'md' ? 'bottom-4' : size === 'lg' ? 'bottom-6' : 'bottom-8'} left-1/2 transform -translate-x-1/2 text-center`}>
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`${size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-1.5 h-1.5' : size === 'lg' ? 'w-2 h-2' : 'w-2 h-2'} bg-blue-500 rounded-full animate-bounce`}
                style={{ animationDelay: `${i * 0.15}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Styles CSS personnalisés */}
      <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(0.3) translateY(0); }
          50% { transform: scaleY(0.5) translateY(-5px); }
        }
        
        @keyframes sway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(3deg); }
        }
        
        @keyframes sail {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          25% { transform: translateX(100px) translateY(-2px); }
          50% { transform: translateX(200px) translateY(0px); }
          75% { transform: translateX(280px) translateY(-1px); }
        }
        
        @keyframes fly {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          25% { transform: translateX(30px) translateY(-10px); }
          50% { transform: translateX(60px) translateY(-5px); }
          75% { transform: translateX(90px) translateY(-15px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
};

export default BeachLoader;
