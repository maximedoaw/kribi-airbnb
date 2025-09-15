import { Apartment } from '@/types';

interface CatalogTabProps {
  apartments: Apartment[];
}

const CatalogTab: React.FC<CatalogTabProps> = ({ apartments }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Catalogue des appartements</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apartments.map(apartment => (
          <div key={apartment.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
              {apartment.images && apartment.images.length > 0 && (
                <img 
                  src={apartment.images[0]} 
                  alt={apartment.title} 
                  className="w-full h-48 object-cover"
                />
              )}
              <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${
                apartment.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {apartment.available ? 'Disponible' : 'Indisponible'}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2">{apartment.title}</h3>
              <p className="text-gray-600 mb-3">{apartment.location}</p>
              <p className="text-xl font-bold text-orange-600 mb-3">{apartment.price} FCFA/nuit</p>
              
              <div className="flex items-center mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(apartment.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-gray-600">({apartment.rating})</span>
              </div>
              
              <button 
                className={`w-full py-2 px-4 rounded-md ${
                  apartment.available 
                    ? 'bg-orange-500 text-white hover:bg-orange-600' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!apartment.available}
              >
                {apartment.available ? 'Réserver' : 'Indisponible'}
              </button>
            </div>
          </div>
        ))}
        
        {apartments.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">Aucun appartement trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogTab;