import { BundleCreator } from '../components/BundleCreator';
import { Header } from '../components/Header';
import { buyBundle } from '../services/bundle';

export const BundlesPage = () => {
  const handleBuyBundle = async (bundleId: number) => {
    await buyBundle(bundleId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Bundles & Packs</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <BundleCreator />
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Available Bundles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3].map(id => (
                <div key={id} className="border rounded-lg p-4 shadow-sm bg-white">
                  <h3 className="text-lg font-semibold mb-2">Bundle #{id}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Multiple items with discount
                  </p>
                  <button
                    onClick={() => handleBuyBundle(id)}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Buy Bundle
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
