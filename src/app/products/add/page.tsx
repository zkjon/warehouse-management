"use client";

import { ProductForm } from '@/components/forms/product-form';
import { PageHeader } from '@/components/page-header';
import type { ProductFormData } from '@/lib/schema';
import { useAppStore, useIsHydrated } from '@/store';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Product } from '@/types';

export default function AddProductPage() {
  const addProduct = useAppStore((state) => state.addProduct);
  const updateProduct = useAppStore((state) => state.updateProduct);
  const getProductById = useAppStore((state) => state.getProductById);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isHydrated = useIsHydrated();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isHydrated) {
      const productId = searchParams.get('edit');
      if (productId) {
        const product = getProductById(productId);
        if (product) {
          setEditingProduct(product);
          setIsEditing(true);
        } else {
          toast({ title: "Error", description: "Producto a editar no encontrado.", variant: "destructive" });
          router.push('/products/add'); // Volver al modo de añadir
        }
      } else {
        setEditingProduct(null);
        setIsEditing(false);
      }
    }
  }, [searchParams, getProductById, toast, router, isHydrated]);


  const handleSubmit = (data: ProductFormData) => {
    try {
      if (isEditing && editingProduct) {
        // Para editar, no actualizamos la cantidad directamente desde este formulario.
        // La cantidad se gestiona mediante movimientos de stock. Solo actualizamos otros detalles.
        const { quantity, ...updateData } = data;
        updateProduct(editingProduct.id, updateData);
        toast({
          title: 'Producto Actualizado',
          description: `${data.name} ha sido actualizado correctamente.`,
        });
      } else {
        addProduct(data);
        toast({
          title: 'Producto Añadido',
          description: `${data.name} ha sido añadido correctamente a tu inventario.`,
        });
      }
      router.push('/'); // Navegar a la página de inventario después del envío
    } catch (error) {
      console.error("Error al enviar el producto:", error);
      toast({
        title: 'Error',
        description: 'Hubo un problema al guardar el producto. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      });
    }
  };
  
  if (!isHydrated && searchParams.get('edit')) {
    // Evitar renderizar el formulario con un estado potencialmente incorrecto si se está editando y no está hidratado
    return <div className="flex justify-center items-center h-screen"><p>Cargando datos del producto...</p></div>;
  }

  return (
    <>
      <PageHeader 
        title={isEditing ? "Editar Producto" : "Añadir Nuevo Producto"}
        description={isEditing ? "Actualiza los detalles del producto." : "Introduce la información para un nuevo producto."}
      />
      <ProductForm onSubmit={handleSubmit} initialData={editingProduct} isEditing={isEditing} />
    </>
  );
}
