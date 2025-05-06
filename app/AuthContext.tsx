"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import {URL} from "@/config/config";
import { io, Socket } from "socket.io-client";
// Define el contexto de autenticación con el token
interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  socket: Socket | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const [socket, setSocket] = useState<Socket | null>(null);
  // Cargar el token desde localStorage al montar el contexto
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      const ws = io(URL, {
        auth: { token: storedToken },
        autoConnect: true, // Reconexión automática
        reconnectionAttempts: 5, // Número de intentos
        reconnectionDelay: 1000, // Tiempo entre intentos
      });
      ws.on("connect", () => {
        console.log("WebSocket conectado");
      });
      
      ws.on("disconnect", () => {
        console.log("WebSocket desconectado");
      });
      ws.on("error", (error) => {
        console.log("Error en WebSocket:", error);
      });

      setSocket(ws);
      return () => {
        ws.close();
      };
    }
    else{
      router.push("/")
    }
  }, []);
  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("token");
      setToken(newToken);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  return (
    <AuthContext.Provider value={{ token, setToken, socket}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
