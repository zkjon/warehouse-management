import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="https://placehold.co/104x40.png" // Reemplaza esto con la ruta a tu logo real
      alt="Logo de la Empresa - AlmacenControl"
      width={104} // Ancho deseado para mostrar el logo
      height={40}  // Alto deseado para mostrar el logo
      className={cn(className)}
      data-ai-hint="company logo apis" // Indicador para el reemplazo de imagen
      priority // Prioriza la carga del logo, ya que es probable que esté en el LCP
    />
  );
}
