const io = require("socket.io-client");
const jwt = require("jsonwebtoken");
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
});
const key = process.env.JWT_SECRET;

// Configuración
const SERVER_URL = process.env.SOCKET_SERVER || "http://localhost:3001";
const NUM_CLIENTS = 10; // Número de dispositivos simulados
const INTERVALO_ENVIO = 2000; // Frecuencia de actualización en ms (2 segundos)
const SIMULACION_DURACION = 120000; // Duración total en ms (2 minutos)

// Simulación de tokens de trabajadores
const trabajadores = [
  { rut: "11111111-1", nombre: "Kara Stoltenberg" },
  { rut: "9735449-9", nombre: "LUIS ROBERTO ROBALCABA BRUNA" },
  { rut: "11990783-7", nombre: "GONZALO JAVIER PINO ÁLVAREZ" },
  { rut: "13432441-4", nombre: "PAOLA ANDREA OLIVARES CERECEDA" },
  { rut: "14376073-1", nombre: "EDUARDO GABRIEL MORENO VALENZUELA" },
  { rut: "10663665-6", nombre: "MAURICIO NUMA NARANJO HERRERA" },
  { rut: "10330357-5", nombre: "CARLOS ALFREDO MONDACA ABARCA" },
  { rut: "14541140-8", nombre: "LUIS ALVARO MARIN ARENAS" },
  { rut: "10050737-4", nombre: "JUAN DANIEL LATORRE PACHECO" },
  { rut: "13878405-3", nombre: "RAUL EDUARDO GONZALEZ CARCAMO" },
];

// Simulación de generación de tokens JWT
const generarToken = (rut) => {
  return jwt.sign({ rut }, key, { expiresIn: "2h" });
};

// Función para generar coordenadas aleatorias dentro de un rango
const generarUbicacion = () => {
  const latBase = -33.04116788332225;
  const lngBase = -71.63417458936436;
  const desvio = 0.01; // Margen de variación

  return {
    lat: latBase + (Math.random() * desvio * 2 - desvio),
    lng: lngBase + (Math.random() * desvio * 2 - desvio),
  };
};

// Crear clientes simulados
const clientes = trabajadores.slice(0, NUM_CLIENTS).map(({ rut, nombre }) => {
  const token = generarToken(rut); // Generar token
  const socket = io(SERVER_URL, {
    transports: ["websocket"],
    query: { token },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
  });

  let intervaloEnvio;

  socket.on("connect", () => {
    console.log(`✅ Cliente conectado: ${nombre} (${rut})`);

    // Registrar trabajador en el sistema
    socket.emit("registrarTrabajador", { token, ubicacion: generarUbicacion() });

    // Enviar ubicación periódicamente
    intervaloEnvio = setInterval(() => {
      const nuevaUbicacion = generarUbicacion();
      console.log(`📡 ${nombre} -> ${JSON.stringify(nuevaUbicacion)}`);
      socket.emit("actualizarUbicacion", { token, ubicacion: nuevaUbicacion });
    }, INTERVALO_ENVIO);
  });

  socket.on("disconnect", (reason) => {
    console.log(`❌ Cliente desconectado: ${nombre} (${rut}) - Motivo: ${reason}`);
    clearInterval(intervaloEnvio); // Limpiar intervalo para evitar procesos zombis
  });

  return { socket, intervaloEnvio };
});

// Finalizar la simulación después de `SIMULACION_DURACION`
setTimeout(() => {
  clientes.forEach(({ socket, intervaloEnvio }) => {
    clearInterval(intervaloEnvio);
    socket.disconnect();
  });
  console.log("🛑 Simulación terminada");
  process.exit(0);
}, SIMULACION_DURACION);
