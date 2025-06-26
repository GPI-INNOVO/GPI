"use client";

import { useEffect, useState } from "react";
import styles from "../../../styles/rutas.module.css";
import NewsTab from "@/components/News/News_tab";
import { useAuth } from "@/app/AuthContext";
import { URL } from "@/config/config";
import { parseDate } from "@internationalized/date";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { I18nProvider } from "@react-aria/i18n";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DateRangePicker,
} from "@heroui/react";
import { ListFilter, Search } from "lucide-react";
import ATETracker from "@/components/News/ATETracker";

interface Novedad {
  id: string;
  TipoNovedad: string;
  Fotografia: string;
  Lecturacorrecta: number;
  Comentario: string;
  Fecha: string;
  direccion: string;
}
interface TipoNovedad {
  _id: string;
  value: string;
}

export default function Admin_Novedades() {
  const { token, socket } = useAuth();
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [tipoNovedades, setTipoNovedades] = useState<TipoNovedad[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
    new Set(["all"])
  );
  const [dateRange, setDateRange] = useState({
    start: parseDate(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString()
        .split("T")[0]
    ),
    end: parseDate(new Date().toISOString().split("T")[0]),
  });

  const fetchNovedades = async () => {
    try {
      const datos_body = {
        token,
        inicio: dateRange.start.toString(),
        fin: dateRange.end.toString(),
      };
      const response = await fetch(`${URL}/novedad/UltimasNovedadesDia`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos_body),
      });
      const data = await response.json();
      setNovedades(data);
    } catch (error) {
      console.error("Error fetching novedades:", error);
    }
  };

  const fetchType = async () => {
    try {
      const response = await fetch(`${URL}/tiponovedad/obtenerTipoNovedad`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      data.unshift({ _id: "all", value: "Todos" });
      const datos = data.filter((tipo: { value: string }) => tipo.value !== "Atención Especial-Lectura" && tipo.value !== "Atención Especial-Reparto");
      setTipoNovedades(datos);
    } catch (error) {
      console.error("Error fetching novedades:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchType();
    }
  }, [token]);

  useEffect(() => {
    if (socket && token) {
      fetchNovedades();
      socket.on("actualizarNovedad", (newNovedad: Novedad) => {
        setNovedades((prev) => [newNovedad, ...prev]);
      });
    }
  }, [token, dateRange, socket]);

  const handleSelectionChange = (keys: Set<string>) => {
    let newSelectedKeys = new Set(keys);
    if (Array.from(newSelectedKeys).pop()==='all') {
      newSelectedKeys.clear();
      newSelectedKeys.add("all");
    }
    // Si "Todos" está seleccionado y se elige otro, deseleccionar "Todos"
    if (newSelectedKeys.has("all") && newSelectedKeys.size > 1) {
      newSelectedKeys.delete("all");
    }

    // Si todos los elementos están seleccionados, marcar "Todos" y deseleccionar el resto
    const allOtherSelected = tipoNovedades
      .filter((tipo) => tipo._id !== "all")
      .every((tipo) => newSelectedKeys.has(tipo._id));

    if (allOtherSelected) {
      newSelectedKeys.clear();
      newSelectedKeys.add("all");
    }

    // Si no hay ningún elemento seleccionado, activar "Todos" automáticamente
    if (newSelectedKeys.size === 0) {
      newSelectedKeys.add("all");
    }
    
    setSelectedKeys(newSelectedKeys);
  };

  return (
    <div className={styles.RutasDiv}>
      <div className={styles.divTab}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 m-3">
            Administración de Novedades
          </h1>
        </div>

        <div className="flex flex-row mb-4 w-full p-2 justify-between">
          <Input
            variant="bordered"
            placeholder="Buscar novedades..."
            startContent={<Search className="text-gray-700" />}
            className="max-w-[68%]"
            type="search"
            size="lg"
          />
          <I18nProvider locale="es-CL">
            <DateRangePicker
              label="Rango de fechas"
              defaultValue={{
                start: dateRange.start,
                end: dateRange.end,
              }}
              size="sm"
              className="max-w-[20%]"
              onChange={(value) => {
                if (value) {
                  setDateRange({ start: value.start, end: value.end });
                }
              }}
              variant="bordered"
            />
          </I18nProvider>
          <Dropdown className="align-end">
            <DropdownTrigger>
              <Button
                size="lg"
                variant="bordered"
                startContent={<ListFilter size={24} />}
              >
                Tipo
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Filtrar por Tipo"
              selectionMode="multiple"
              selectedKeys={selectedKeys}
              closeOnSelect={false} // Evita que el dropdown se cierre
              onSelectionChange={(keys) =>
                handleSelectionChange(new Set(keys as Set<string>))
              }
            >
              {tipoNovedades.map((tipo) => (
                <DropdownItem key={tipo._id}>{tipo.value}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
        <NewsTab
          novedades={novedades}
          tiponovedad={tipoNovedades}
          selectedKeys={selectedKeys}
        />
      </div>
      <div className={styles.divMenu}>
        <div className={styles.blq}>
          <ATETracker />
        </div>
      </div>
    </div>
  );
}
