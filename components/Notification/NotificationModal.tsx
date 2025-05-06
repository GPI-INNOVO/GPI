import React, { use, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  CircularProgress,
  Card,
  CardBody,
  Divider,
} from "@heroui/react";
import {
  Bell,
  Calendar,
  Clock,
  Users,
  UserRoundCheck,
  UserRoundX,
} from "lucide-react";
import { useEffect } from "react";
import { URL } from "@/config/config";
import { useAuth } from "@/app/AuthContext";
interface Notification {
  id: number | string;
  titulo: string;
  mensaje: string;
  contenido: string;
  fecha: string;
}

interface NotificationModalProps {
  isOpen: boolean;
  notification: Notification | null;
  onClose: () => void;
}
interface Follow {
  rut: string;
  nombre: string;
}
export default function NotificationModal({
  isOpen,
  notification,
  onClose,
}: NotificationModalProps) {
  if (!notification) return null;
  const { token } = useAuth();
  const [check, setCheck] = useState<Follow[]>([]);
  const [noCheck, setNoCheck] = useState<Follow[]>([]);
  const [porcent, setPorcecnt] = useState(0);
  useEffect(() => {
    if (token && notification) {
      const fetchNotificationDetails = async () => {
        const data = {
          token,
          idNotificacion: notification.id,
        };
        try {
          const response = await fetch(
            `${URL}/notificaciones/detallesNotificacion`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            }
          );
          const res = await response.json();
          console.log(res);
          setCheck(res.vista);
          setNoCheck(res.no_vista);
          const total = res.vista.length + res.no_vista.length;
            const porcent = total > 0 ? Number(((res.vista.length / total) * 100).toFixed(1)) : 0;
          setPorcecnt(porcent);
        } catch (error) {
          console.error("Error fetching notification details:", error);
        }
      };
      fetchNotificationDetails();
    }
  }, [token, notification]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary" />
            <span className="text-xl">{notification.titulo}</span>
          </div>
        </ModalHeader>
        <ModalBody>
            <div className="flex flex-row mt-4 bg-white p-4 rounded-lg shadow-md">
            <div className="w-[70%]">
              <h3 className="text-lg font-semibold mb-2">Mensaje:</h3>
              <p className="text-gray-600">{notification.mensaje}</p>
              <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Contenido:</h3>
              <p>{notification.contenido}</p>
              </div>
            </div>
            <div className="w-[30%] flex justify-center items-center">
              <CircularProgress
              aria-label="Porcentaje de visualización"
              classNames={{
                svg: "w-36 h-36 drop-shadow-md",
                indicator: "stroke-blue-500",
                track: "stroke-gray-400/10",
                value: "text-3xl font-semibold",
              }}
              value={porcent}
              strokeWidth={4}
              showValueLabel={true}
              valueLabel={
                <span
                style={{
                  color: `rgb(
            ${Math.round(122 + (102 - 122) * (porcent / 100))},
            ${Math.round(9 + (144 - 9) * (porcent / 100))},
            ${Math.round(48 + (255 - 48) * (porcent / 100))}
          )`,
                }}
                >
                {porcent}%
                </span>
              }
              />
            </div>
            </div>

          <div className="flex justify-between mt-4">
            <Card>
              <CardBody className="flex flex-row items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span>{notification.fecha.split("T")[0]}</span>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="flex flex-row items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span>{notification.fecha.split("T")[1].split(".")[0]}</span>
              </CardBody>
            </Card>
          </div>
          <div className="mt-4 flex flex-row justify-center gap-8 ">
            <Card className="flex flex-col items-center gap-2 w-[50%]">
              <CardBody className="flex flex-col items-center gap-2">
                <UserRoundCheck className="w-8 text-primary" />
                <span>Visualizado</span>
                <Divider />
                <ul className="list-disc pl-5">
                  {check.map((item, index) => (
                    <li key={index}>{item.nombre}</li>
                  ))}
                </ul>
              </CardBody>
            </Card>
            <Card className="flex flex-col items-center gap-2 w-[50%]">
              <CardBody className="flex flex-col items-center gap-2">
                <UserRoundX className="w-8 text-danger" />
                <span>Sin visualizaar</span>
                <Divider />
                <ul className="list-disc pl-5">
                  {noCheck.map((item, index) => (
                    <li key={index}>{item.nombre}</li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
