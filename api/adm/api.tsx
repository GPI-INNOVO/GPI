"use client";
import { URL } from "../../config/config";
export const crearTrabajador = async (rut: string, nombre: string, cargo: string, correo: string, clave: string) => {
    const res = await fetch(`${URL}/trabajador/crearTrabajador`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rut, nombre, cargo, correo, clave }),
    });
    return res;
  };
  export const uploadAsignacion = async (file: File, token: string) => {
    // Validar que el archivo sea un Excel
    const validExtensions = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"];
    if (!validExtensions.includes(file.type)) {
        alert("Archivo invalido");
    }
    else {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("token", token);

    const res = await fetch(`${URL}/asignacion/uploadAsignacion`, {
      method: "POST",
      body: formData,
    });return res;
    }
    
};
