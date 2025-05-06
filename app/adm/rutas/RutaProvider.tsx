import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Ruta {
    NumeroRuta: number;
    perimetral: number[][];
}

interface RutaContextProps {
    ruta: Ruta;
    setRuta: React.Dispatch<React.SetStateAction<Ruta>>;
}

const RutaContext = createContext<RutaContextProps | undefined>(undefined);

export const RutaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [ruta, setRuta] = useState<Ruta>({ NumeroRuta: 0, perimetral: [] });

    return (
        <RutaContext.Provider value={{ ruta, setRuta }}>
            {children}
        </RutaContext.Provider>
    );
};

export const useRuta = (): RutaContextProps => {
    const context = useContext(RutaContext);
    if (!context) {
        throw new Error('useRuta must be used within a RutaProvider');
    }
    return context;
};