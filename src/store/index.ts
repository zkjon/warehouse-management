"use client";
import type { Product, StockMovement } from '@/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AppState {
  products: Product[];
  stockMovements: StockMovement[];
  addProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Product;
  updateProduct: (productId: string, productData: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteProduct: (productId: string) => void;
  addStockMovement: (movementData: Omit<StockMovement, 'id' | 'productName'>) => StockMovement;
  getProductById: (productId: string) => Product | undefined;
}

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      products: [],
      stockMovements: [],
      
      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ products: [...state.products, newProduct].sort((a,b) => a.name.localeCompare(b.name)) }));
        return newProduct;
      },

      updateProduct: (productId, productData) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId
              ? { ...p, ...productData, updatedAt: new Date() }
              : p
          ).sort((a,b) => a.name.localeCompare(b.name)),
        }));
      },

      deleteProduct: (productId) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
          stockMovements: state.stockMovements.filter(m => m.productId !== productId), // Also remove associated movements
        }));
      },
      
      addStockMovement: (movementData) => {
        const product = get().products.find(p => p.id === movementData.productId);
        if (!product) {
          // This case should ideally be prevented by form validation
          console.error("Product not found for stock movement");
          throw new Error("Product not found");
        }

        const newMovement: StockMovement = {
          ...movementData,
          id: generateId(),
          productName: product.name, 
        };
        
        set((state) => ({
          stockMovements: [...state.stockMovements, newMovement].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        }));
        
        // Update product quantity
        const quantityChange = movementData.type === 'entry' ? movementData.quantity : -movementData.quantity;
        set((state) => ({
          products: state.products.map((p) =>
            p.id === movementData.productId
              ? { ...p, quantity: p.quantity + quantityChange, updatedAt: new Date() }
              : p
          ),
        }));
        return newMovement;
      },

      getProductById: (productId: string) => {
        return get().products.find(p => p.id === productId);
      }
    }),
    {
      name: 'almacen-control-storage', 
      storage: createJSONStorage(() => localStorage), 
      // Serialize dates properly
      serialize: (state) => {
        return JSON.stringify({
          ...state,
          state: {
            ...state.state,
            products: state.state.products.map(p => ({...p, createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString()})),
            stockMovements: state.state.stockMovements.map(m => ({...m, date: m.date.toISOString()})),
          }
        });
      },
      // Deserialize dates properly
      deserialize: (str) => {
        const deserialized = JSON.parse(str);
        deserialized.state.products = deserialized.state.products.map((p: any) => ({...p, createdAt: new Date(p.createdAt), updatedAt: new Date(p.updatedAt) }));
        deserialized.state.stockMovements = deserialized.state.stockMovements.map((m: any) => ({...m, date: new Date(m.date) }));
        return deserialized;
      }
    }
  )
);

// Hook to ensure store is hydrated before usage in client components
// This is important when using persist with SSR/SSG frameworks like Next.js
// to avoid hydration mismatches.
export const useIsHydrated = () => {
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => {
    const unsubFinishHydration = useAppStore.persist.onFinishHydration(() => setHydrated(true));
    setHydrated(useAppStore.persist.hasHydrated());
    return () => {
      unsubFinishHydration();
    };
  }, []);
  return hydrated;
};
