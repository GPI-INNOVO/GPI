"use client";
import { useState ,useEffect} from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Input, Textarea, Card, CardBody } from "@heroui/react";
import { Activity, BarChart, MapPin, Phone } from "lucide-react";
import LoginModal from "@/components/LoginModal";
import { useRouter } from "next/navigation";
import {ValidarToken} from "@/api/TokenRequest";
export default function LandingPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [prev_token, setPrevToken] = useState("");
  const router = useRouter();
  const handleAdminClick = () => {
    if (prev_token) {
      ValidarToken(prev_token).then((res) => {
        if (res) {
          router.push("/adm");
        } else {
          setIsLoginModalOpen(true);
        }
      });
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsLoginModalOpen(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setPrevToken(token);
    } else {
      console.log("No token found");
    }
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isBordered>
        <NavbarBrand>
          <p className="font-bold text-inherit">Innovo</p>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link color="foreground" href="#inicio">
              Inicio
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#caracteristicas">
              Características
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#cobertura">
              Cobertura
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#contacto">
              Contacto
            </Link>
          </NavbarItem>
          <Button color="primary" variant='light' size="md" onPress={handleAdminClick}>Login</Button>
        </NavbarContent>
      </Navbar>

      <main className="flex-grow">
        <section id="inicio" className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-20">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="text-4xl font-bold mb-4">Monitoreo de Flujo de Gas en Tiempo Real</h2>
              <p className="text-xl mb-6">Optimiza tus operaciones con nuestros sensores de última generación en la Quinta Región de Chile.</p>
              <Button color="primary" size="lg">Solicitar Demo</Button>
            </div>
            <div className="md:w-1/2">
              a
            </div>
          </div>
        </section>

        <section id="caracteristicas" className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Características Principales</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardBody>
                  <Activity className="h-12 w-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Monitoreo en Tiempo Real</h3>
                  <p>Obtén datos precisos sobre el flujo de gas en todo momento.</p>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <BarChart className="h-12 w-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Análisis Avanzado</h3>
                  <p>Visualiza tendencias y genera informes detallados para optimizar tu consumo.</p>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <Phone className="h-12 w-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Alertas Móviles</h3>
                  <p>Recibe notificaciones instantáneas en tu dispositivo móvil ante cualquier anomalía.</p>
                </CardBody>
              </Card>
            </div>
          </div>
        </section>

        <section id="cobertura" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Cobertura en la Quinta Región</h2>
            <div className="flex flex-col md:flex-row items-center justify-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                a
              </div>
              <div className="md:w-1/2 md:pl-12">
                <ul className="space-y-4">
                  {["Valparaíso", "Viña del Mar", "Quillota", "San Antonio"].map((city) => (
                    <li key={city} className="flex items-center">
                      <MapPin className="h-6 w-6 text-blue-600 mr-2" />
                      <span>{city}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="contacto" className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Contáctanos</h2>
            <form className="max-w-lg mx-auto space-y-4">
              <Input type="text" label="Nombre" placeholder="Ingrese su nombre" />
              <Input type="email" label="Correo electrónico" placeholder="Ingrese su correo electrónico" />
              <Input type="tel" label="Teléfono" placeholder="Ingrese su número de teléfono" />
              <Textarea label="Mensaje" placeholder="Escriba su mensaje aquí" />
              <Button color="primary" className="w-full">Enviar Mensaje</Button>
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">GasFlowSensors</h3>
              <p>Soluciones de monitoreo de flujo de gas para la Quinta Región</p>
            </div>
            <div>
              <p>&copy; 2023 GasFlowSensors. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
      <LoginModal isOpen={isLoginModalOpen} onClose={handleCloseModal} />
    </div>
  );
}