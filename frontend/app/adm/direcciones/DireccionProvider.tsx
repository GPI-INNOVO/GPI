import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Direccion {
    label?: string;
    _id: number;
    LAT: number;
    LNG: number;
    NumeroMedidor: number;
    NumeroSector: number;
    block: string;
    calle: string;
    ciudad: string;
    comuna: string;
    depto: string;
    numero: number;
    region: string;
}
interface DireccionContextProps {
    direcciones: Direccion[];
    setDirecciones: React.Dispatch<React.SetStateAction<Direccion[]>>;
}

const DireccionContext = createContext<DireccionContextProps | undefined>(undefined);

export const DireccionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [direcciones, setDirecciones] = useState<Direccion[]>([]);
    return (
        <DireccionContext.Provider value={{  direcciones, setDirecciones }}>
            {children}
        </DireccionContext.Provider>
    );
};

export const useDireccion = (): DireccionContextProps => {
    const context = useContext(DireccionContext);
    if (!context) {
        throw new Error('useDireccion must be used within a RutaProvider');
    }
    return context;
};