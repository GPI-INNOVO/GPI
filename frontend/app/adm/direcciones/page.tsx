"use client";
import { DireccionProvider } from "./DireccionProvider";
import dynamic from 'next/dynamic';
const Map_Direccion = dynamic(() => import("@/components/Direccion/Map_Direccion"), { ssr: false });
export default function Admin_Direcciones() {
 
  return (
    <DireccionProvider>
        <Map_Direccion />
      </DireccionProvider>
  );
}
