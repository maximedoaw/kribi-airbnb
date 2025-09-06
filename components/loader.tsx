

import React from 'react';

const BeachLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-sand-200" style={{
      background: 'linear-gradient(to bottom, #87ceeb 0%, #98d8e8 30%, #b8e6b8 60%, #f4e4bc 100%)'
    }}>
      <div className="relative w-80 h-80">
        
        {/* Soleil animé */}
        <div className="absolute top-4 right-8 w-16 h-16 bg-yellow-400 rounded-full animate-pulse shadow-lg">
          <div className="absolute inset-0 bg-yellow-300 rounded-full animate-ping opacity-75"></div>
          {/* Rayons de soleil */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-8 bg-yellow-400 origin-bottom animate-spin"
                style={{
                  transform: `rotate(${i * 45}deg) translateY(-24px)`,
                  animationDuration: '3s',
                  animationDelay: `${i * 0.1}s`
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Nuages flottants */}
        <div className="absolute top-8 left-4 w-12 h-6 bg-white rounded-full opacity-80 animate-bounce">
          <div className="absolute -left-2 top-1 w-8 h-4 bg-white rounded-full"></div>
          <div className="absolute -right-1 top-0 w-6 h-5 bg-white rounded-full"></div>
        </div>
        
        <div className="absolute top-12 right-16 w-10 h-5 bg-white rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.5s' }}>
          <div className="absolute -left-1 top-0 w-6 h-4 bg-white rounded-full"></div>
        </div>

        {/* Vagues océan (arrière-plan) */}
        <div className="absolute bottom-32 left-0 right-0 h-20 overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-blue-400 to-blue-300 transform origin-bottom">
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
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-yellow-200 via-yellow-100 to-transparent rounded-t-3xl"></div>

        {/* Palmier */}
        <div className="absolute bottom-16 left-8">
          {/* Tronc */}
          <div className="w-3 h-16 bg-amber-600 rounded-sm transform -rotate-3 origin-bottom"></div>
          {/* Feuilles */}
          <div className="absolute -top-2 -left-3 transform -rotate-12 animate-sway">
            <div className="w-8 h-2 bg-green-500 rounded-full transform rotate-45 origin-left"></div>
            <div className="w-6 h-2 bg-green-500 rounded-full transform rotate-12 origin-left mt-1"></div>
            <div className="w-7 h-2 bg-green-500 rounded-full transform -rotate-12 origin-left mt-1"></div>
            <div className="w-5 h-2 bg-green-500 rounded-full transform -rotate-45 origin-left mt-1"></div>
          </div>
        </div>

        {/* Bateau qui navigue */}
        <div className="absolute bottom-24 transform animate-float" style={{
          left: '0%',
          animation: 'sail 4s ease-in-out infinite'
        }}>
          {/* Coque */}
          <div className="w-8 h-3 bg-red-500 rounded-b-lg"></div>
          {/* Mât */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-6 w-0.5 h-6 bg-amber-700"></div>
          {/* Voile */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-6 w-4 h-4 bg-white rounded-r-lg transform animate-sway"></div>
        </div>

        {/* Mouettes */}
        <div className="absolute top-16 left-20 animate-fly">
          <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
          <div className="absolute -left-1 top-0 w-2 h-0.5 border-t-2 border-gray-600 rounded-full transform rotate-12"></div>
          <div className="absolute -right-1 top-0 w-2 h-0.5 border-t-2 border-gray-600 rounded-full transform -rotate-12"></div>
        </div>

        {/* Texte de chargement */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
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

export default BeachLoader