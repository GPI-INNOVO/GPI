"use client";
import { RutaProvider } from "./RutaProvider";
import dynamic from 'next/dynamic';
const Map_Ruta = dynamic(() => import('@/components/Rutas/Map_Ruta'), { ssr: false });
export default function Admin_Rutas() {
 
  return (
    <RutaProvider>
        <Map_Ruta />
      </RutaProvider>
  );
}
