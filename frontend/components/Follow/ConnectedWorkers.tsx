import { Avatar, Badge, Chip, ScrollShadow, Button } from "@heroui/react";
import { User } from "lucide-react";

interface Worker {
  nombre: string;
  ubicacion: [number, number];
}

interface ConnectedWorkersProps {
  workers: Record<string, Worker>;
  onSelectWorker: (workerId: string | null) => void;
  selectedWorker: string | null;
  fix?: boolean;
}

export default function ConnectedWorkers({
  workers,
  onSelectWorker,
  selectedWorker,
}: ConnectedWorkersProps) {
  const workerCount = Object.keys(workers).length;

  const handleWorkerClick = (id: string) => {
    if (selectedWorker === id) {
      onSelectWorker(null); // Deseleccionar si ya está seleccionado
    } else {
      onSelectWorker(id); // Seleccionar nuevo trabajador
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-row gap-4">
        <h2 className="text-xl font-bold mb-2">Trabajadores Conectados</h2>
        <Chip color="success" variant="flat" className="mb-4">
          {workerCount}
        </Chip>
      </div>

      {selectedWorker && (
        <Chip color="warning" variant="flat" className="mb-4">
          Fijado en {workers[selectedWorker].nombre}
        </Chip>
      )}

      <ScrollShadow
        className="max-h-[450px] min-h-[0px] overflow-y-auto"
        hideScrollBar
      >
        <ul className="space-y-2">
          {Object.entries(workers).map(([id, { nombre }]) => (
            <li key={id} className="flex items-center space-x-2">
              <Button
                onPress={() => handleWorkerClick(id)}
                className={`w-full py-6 justify-start ${
                  selectedWorker === id ? "bg-blue-100" : ""
                }`}
                variant="light"
              >
                <Badge content="" color="success" placement="bottom-right">
                  <Avatar
                    icon={<User size={24} />}
                    classNames={{
                      base: "bg-gradient-to-br from-[#4285F4] to-[#34A853]",
                      icon: "text-white/90",
                    }}
                  />
                </Badge>
                <span className="ml-2">{nombre}</span>
              </Button>
            </li>
          ))}
        </ul>
      </ScrollShadow>
    </div>
  );
}
