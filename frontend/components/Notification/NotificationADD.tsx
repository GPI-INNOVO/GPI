"use client";

import React, { useEffect, useState } from "react";
import {
  DatePicker,
  Input,
  Select,
  SelectItem,
  Textarea,
  Checkbox,
  Button,
  Card,
  CardHeader,
  Spinner,
} from "@heroui/react";
import { Bell, FileText, Users, Briefcase, FileUp, X } from "lucide-react";
import { now, getLocalTimeZone } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import { useAuth } from "../../app/AuthContext";
import { URL } from "../../config/config";
interface Worker {
  Rut: string;
  Nombre: string;
}
export default function NotificationADD() {
  const [notificationType, setNotificationType] = useState("msg");
  const { token, socket } = useAuth();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(now(getLocalTimeZone()));
  const [destinatarios, setDestinatarios] = useState<string[]>(['all']);
  const [selectRoles, setSelectRoles] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const role = [
    { value: "all", label: "Todos" },
    { value: "administracion", label: "Administración" },
    { value: "lector", label: "Lector" },
    { value: "supervisor", label: "Supervisor" },
    { value: "inspector", label: "Inspector" },
  ];
  const handleWhitoutDocument = async (
    data: any,
    socket: { emit: (arg0: string, arg1: any) => void }
  ) => {
    const response = await fetch(`${URL}/notificaciones/crearNotificacion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      alert("Notificación enviada correctamente");
      socket.emit("notification", data);
      //limpiar las variables
      setTitle("");
      setDescription("");
      setContent("");
      setFile(null);
      setDestinatarios([]);
      setSelectRoles([]);
      setIsScheduled(false);
      setScheduledDate(now(getLocalTimeZone()));
      setNotificationType("msg");
    } else {
      console.log("Error al enviar la notificación");
    }
  };
  const handleSubmit = async () => {
    const missingFields = [];
    if (!title) missingFields.push("Título");
    if (!description) missingFields.push("Descripción");
    if (!content) missingFields.push("Contenido");
    if (notificationType === "document" && !file) missingFields.push("Archivo");
    if (destinatarios.length === 0 && selectRoles.length === 0) missingFields.push("Destinatarios o Cargos/Roles");
    if (missingFields.length > 0) {
      alert(`Por favor, complete los siguientes campos requeridos: ${missingFields.join(", ")}`);
      return;
    }
    if (socket) {
      const data = {
        token,
        objetivo: destinatarios,
        tipo: notificationType,
        titulo: title,
        mensaje: description,
        contenido: content,
        fechaProgramacion: scheduledDate.toString().split(".")[0],
        archivo: file,
        cargo: selectRoles,
      };
      if (notificationType === "document") {
        const formData = new FormData();
        if (token) {
          formData.append("token", token);
        }
        formData.append("objetivo", JSON.stringify(destinatarios));
        formData.append("tipo", notificationType);
        formData.append("titulo", title);
        formData.append("mensaje", description);
        formData.append("contenido", content);
        formData.append(
          "fechaProgramacion",
          scheduledDate.toString().split(".")[0]
        );
        formData.append("file", file as Blob);
        formData.append("cargo", JSON.stringify(selectRoles));
        const response = await fetch(
          `${URL}/notificaciones/crearNotificacionDocumento`,
          {
            method: "POST",
            body: formData,
          }
        );
        if (response.ok) {
          alert("Notificación enviada correctamente");
          socket.emit("notification", data);
          //limpiar las variables
          setTitle("");
          setDescription("");
          setContent("");
          setFile(null);
          setDestinatarios([]);
          setSelectRoles([]);
          setIsScheduled(false);
          setScheduledDate(now(getLocalTimeZone()));
          setNotificationType("msg");
        } else {
          console.log("Error al enviar la notificación");
        }
      } else {
        handleWhitoutDocument(data, socket);
      }
    }
  };
  const fetchWorkers = async () => {
    const res = await fetch(`${URL}/trabajador/listarTrabajadores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
    const json = await res.json();
    setWorkers([{ Rut: "all", Nombre: "Todos" }, ...json]);
  };
  useEffect(() => {
    if (token != null) {
      fetchWorkers();
    }
  }, [token]);
  if (workers.length === 0) {
    return (
      <div className="flex justify-center items-center mt-8">
        {" "}
        <Spinner size="md" />
        Loading...
      </div>
    );
  }

  const handleSelectionChange = (
    keys: Set<string>,
    setKeys: React.Dispatch<React.SetStateAction<string[]>>,
    allKeys: string[],
    relatedSetKeys?: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const updatedKeys = new Set(keys); // Claves seleccionadas actualmente
    const allExceptTodos = allKeys.filter((key) => key !== "all"); // Todas las claves excepto "Todos"
    // 1. Si se selecciona "Todos" y hay allExceptTodos>0, desmarcar todas las demás opciones
    const lastAddedKey = Array.from(updatedKeys).pop();
    if (lastAddedKey === "all") {
      setKeys(["all"]);
      // Limpiar el set relacionado si existe
      if (relatedSetKeys) {
        relatedSetKeys([]);
      }
      return; // Salimos porque hemos activado "Todos"
    }

    // 2. Si se seleccionan todos los elementos específicos, activar automáticamente "Todos"
    if (allExceptTodos.every((key) => updatedKeys.has(key))) {
      setKeys(["all"]);

      // Limpiar el set relacionado si existe
      if (relatedSetKeys) {
        relatedSetKeys([]);
      }
      return; // Salimos porque hemos activado "Todos"
    }

    // 3. Si "Todos" está seleccionado y se selecciona otro elemento, desmarcar "Todos"
    if (updatedKeys.has("all") && updatedKeys.size > 1) {
      updatedKeys.delete("all");
    }

    // 4. Si ninguna de las condiciones anteriores aplica, actualizar normalmente las claves
    setKeys(Array.from(updatedKeys));
  };

  const getSelectedLabels = (
    selectedKeys: string[],
    options: { value: string; label: string }[]
  ) => {
    // Mostrar "Todos" si está seleccionado
    if (selectedKeys.includes("all")) return "Todos";

    // Mostrar los nombres seleccionados o el número total de elementos seleccionados
    const selectedLabels = options
      .filter((option) => selectedKeys.includes(option.value))
      .map((option) => option.label);

    return selectedLabels.length > 2
      ? `${selectedLabels.length} seleccionados`
      : selectedLabels.join(", ");
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log("Archivo seleccionado:", selectedFile);
    }
  };

  const handleDragOver = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      console.log("Archivo arrastrado:", droppedFile);
    }
  };
  return (
    <Card className="w-full h-full p-4">
      <CardHeader>
        <h1 className="text-2xl font-bold">Nueva notificación</h1>
      </CardHeader>
      <div>
        <form className="space-y-2">
          <Input
            label="Título"
            placeholder="Introduce el título de la notificación"
            startContent={<Bell className="text-default-400" />}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="bordered"
            maxLength={70}
          />

          <Textarea
            label="Descripción"
            placeholder="Introduce la descripción de la notificación"
            startContent={<FileText className="text-default-400" />}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="bordered"
            maxLength={120}
          />

          <Select
            label="Tipo de notificación"
            placeholder="Selecciona el tipo de notificación"
            defaultSelectedKeys={["msg"]}
            onChange={(e) => setNotificationType(e.target.value)}
            variant="bordered"
          >
            <SelectItem key="msg" value="msg">
              Mensaje
            </SelectItem>
            <SelectItem key="document" value="document">
              Documento
            </SelectItem>
            <SelectItem key="alert" value="alert">
              Alerta
            </SelectItem>
          </Select>

          <div className="flex space-x-2">
            <Select
              label="Destinatarios"
              className="max-w-[50%]"
              variant="bordered"
              placeholder={getSelectedLabels(
                destinatarios,
                workers.map((worker) => ({
                  value: worker.Rut,
                  label: worker.Nombre,
                }))
              )}
              selectedKeys={new Set(destinatarios)} // Reflejar el estado actual
              selectionMode="multiple"
              startContent={<Users className="text-default-400" />}
              isDisabled={selectRoles.includes("all")} // Deshabilitar si "Todos" está activo en Cargos/Roles
              onSelectionChange={(keys) =>
                handleSelectionChange(
                  new Set(keys as unknown as string[]),
                  setDestinatarios,
                  workers.map((worker) => worker.Rut),
                  setSelectRoles // Limpiar select de Cargos/Roles si "Todos" está seleccionado
                )
              }
            >
              {workers.map((worker) => (
                <SelectItem key={worker.Rut} value={worker.Rut}>
                  {worker.Nombre}
                </SelectItem>
              ))}
            </Select>

            <Select
              label="Destinatarios por grado"
              className="max-w-[50%]"
              variant="bordered"
              placeholder={getSelectedLabels(selectRoles, role)}
              selectedKeys={new Set(selectRoles)} // Reflejar el estado actual
              selectionMode="multiple"
              startContent={<Briefcase className="text-default-400" />}
              isDisabled={destinatarios.includes("all")} // Deshabilitar si "Todos" está activo en Destinatarios
              onSelectionChange={(keys) =>
                handleSelectionChange(
                  new Set(keys as unknown as string[]),
                  setSelectRoles,
                  role.map((rol) => rol.value),
                  setDestinatarios // Limpiar select de Destinatarios si "Todos" está seleccionado
                )
              }
            >
              {role.map((rol) => (
                <SelectItem key={rol.value} value={rol.value}>
                  {rol.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          <Textarea
            label="Contenido"
            placeholder="Introduce el contenido de la notificación"
            startContent={<FileText className="text-default-400" />}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            variant="bordered"
            maxLength={500}
          />

          {notificationType === "document" && (
            <div
              className={`m-4 border-dashed border-2 pt-4 rounded-lg cursor-pointer z-20${
                dragging ? "border-secondary bg-secondary/10" : "border-primary"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".xlsx, .xls, .pdf, .doc, .docx, .jpg, .jpeg, .png"
                className="hidden"
                id="file-input"
                onChange={handleFileSelect}
              />
              <label
                htmlFor="file-input"
                className="flex flex-col items-center justify-center h-40 text-center text-sm text-muted-foreground cursor-pointer"
              >
                {file ? (
                  <div className="flex flex-row gap-4 items-center justify-center space-y-2">
                    <p className="text-primary font-medium text-xl">
                      {file.name}
                    </p>
                    <Button
                      className="relative z-10"
                      size="sm"
                      variant="bordered"
                      color="primary"
                      onPress={() => setFile(null)}
                    >
                      <X size={16} color="red" />
                    </Button>
                  </div>
                ) : dragging ? (
                  <>
                    <FileUp size={48} className="mb-4 text-secondary" />
                    <p>Suelta el archivo aquí</p>
                  </>
                ) : (
                  <>
                    <FileUp size={48} className="mb-4 text-primary" />
                    <p>Arrastra y suelta un archivo aquí</p>
                    <p>o haz clic para seleccionarlo</p>
                  </>
                )}
              </label>
            </div>
          )}

          <Checkbox isSelected={isScheduled} onValueChange={setIsScheduled}>
            Programar notificación
          </Checkbox>

          {isScheduled && (
            <div className="flex justify-start">
              <I18nProvider locale="es-CL">
                <DatePicker
                  className="max-w-sm mb-3"
                  label="Fecha de programación"
                  variant="bordered"
                  hideTimeZone
                  showMonthAndYearPickers
                  defaultValue={scheduledDate}
                  onChange={(date) => {
                    if (date) {
                      setScheduledDate(date);
                    }
                  }}
                />
              </I18nProvider>
            </div>
          )}
        </form>
        <Button
          color="primary"
          type="submit"
          className="mt-2 max-w-xs  text-md"
          onPress={handleSubmit}
          variant="bordered"
        >
          Enviar notificación
        </Button>
      </div>
    </Card>
  );
}
