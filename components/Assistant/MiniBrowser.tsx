import React, { useState, useEffect } from 'react';

interface MiniBrowserProps {
  url: string; // URL a abrir en la miniventana
  onCookiesReceived: (cookies: string) => void; // Callback para manejar las cookies obtenidas
}

const MiniBrowser: React.FC<MiniBrowserProps> = ({ url, onCookiesReceived }) => {
  const [miniWindow, setMiniWindow] = useState<Window | null>(null);

  useEffect(() => {
    // Abrir la miniventana al cargar el componente
    const openWindow = () => {
      const newWindow = window.open(
        url,
        'miniBrowser',
        'width=600,height=400,scrollbars=yes'
      );
      setMiniWindow(newWindow);
    };

    openWindow();

    // Verificar periódicamente si la ventana está cerrada o si podemos obtener cookies
    const interval = setInterval(() => {
      if (miniWindow && miniWindow.closed) {
        clearInterval(interval);
        setMiniWindow(null);
        return;
      }

      if (miniWindow && miniWindow.document) {
        try {
          const cookies = miniWindow.document.cookie;
          if (cookies) {
            onCookiesReceived(cookies);
            clearInterval(interval); // Detener la verificación al obtener cookies
            miniWindow.close(); // Cerrar la miniventana automáticamente
            setMiniWindow(null);
          }
        } catch (error) {
          // Captura errores de CORS si la URL es de un dominio diferente
          console.error('Error accediendo a cookies:', error);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      miniWindow?.close(); // Asegurarse de cerrar la ventana si el componente se desmonta
    };
  }, [url, miniWindow, onCookiesReceived]);

  return (
    <div>
      <p>La miniventana está {miniWindow ? 'abierta' : 'cerrada'}.</p>
    </div>
  );
};

export default MiniBrowser;
