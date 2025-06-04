import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="https://apis.es/_old/wp-content/uploads/2017/01/logo-apis2-footer.png"
      alt="Logo de la Empresa - AlmacenControl"
      width={104} // Ancho deseado para mostrar el logo
      height={40}  // Alto deseado para mostrar el logo
      className={cn(className)}
      priority // Prioriza la carga del logo, ya que es probable que esté en el LCP
    />
  );
}
