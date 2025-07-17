import { ScrollShadow, Button, Chip, Avatar} from "@heroui/react";
import { useState } from "react";
import { MapPin} from "lucide-react";

interface Cluster {
  id: number;
  direccion: string;
  lat: number;
  lng: number;
}

interface Tab_ClusterProps {
  cluster: Cluster[];
}

export default function Tab_Cluster({ cluster }: Tab_ClusterProps) {
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-md">
      <div className="flex flex-row gap-4 items-center">
        <h2 className="text-xl font-bold text-black">Direcciones del grupo</h2>
        <Chip color="success" variant="flat" className="mb-4">
          {cluster.length}
        </Chip>
      </div>

      <ScrollShadow className="max-h-[450px] min-h-[0px] overflow-y-auto" hideScrollBar>
        <ul className="space-y-2">
          {cluster.map(({ id, direccion }) => (
            <li key={id} className="flex items-center space-x-2">
              <Button
                onPress={() => setSelectedCluster(id)}
                className={`w-full py-3 justify-start ${
                  selectedCluster === id ? "bg-blue-100" : ""
                }`}
                variant="light"
              >
                
                  <Avatar
                    icon={<MapPin size={24} />}
                    classNames={{
                      base: "bg-gradient-to-br from-[#4285F4] to-[#34A853]",
                      icon: "text-white/90",
                    }}
                  />

                <span className="ml-2">{direccion}</span>
              </Button>
            </li>
          ))}
        </ul>
      </ScrollShadow>
    </div>
  );
}
