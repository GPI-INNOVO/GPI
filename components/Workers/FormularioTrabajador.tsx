"use client";

import type React from "react";
import { useState } from "react";
import {
  Input,
  Select,
  SelectItem,
  Button,
} from "@heroui/react";
import { User, Mail, Lock } from "lucide-react";
import { useRut } from "react-rut-formatter";
import { crearTrabajador } from "@/api/adm/api";
import { useAuth } from '@/app/AuthContext';
type FormData = {
  Rut: string;
  Nombre: string;
  cargo: string;
  correo: string;
  clave: string;
};

type FormErrors = {
  [K in keyof FormData]?: string;
};

export function FormularioTrabajador() {
  const { rut, updateRut, isValid } = useRut();
  const { token, socket} = useAuth();
  const [formData, setFormData] = useState<FormData>({
    Rut: "",
    Nombre: "",
    cargo: "",
    correo: "",
    clave: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!isValid) newErrors.Rut = "El Rut es requerido";
    if (!formData.Nombre) newErrors.Nombre = "El Nombre es requerido";
    if (
      !["administracion", "lector", "supervisor", "inspector"].includes(
        formData.cargo
      )
    ) {
      newErrors.cargo = "Por favor seleccione un cargo válido";
    }
    if (!formData.correo) {
      newErrors.correo = "El correo electrónico es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = "Correo electrónico inválido";
    }
    if (formData.clave.length < 6)
      newErrors.clave = "La clave debe tener al menos 6 caracteres";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, cargo: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
        console.log("Formulario válido");
        crearTrabajador(rut.raw,formData.Nombre, formData.cargo, formData.correo, formData.clave);
    } else {
      console.log("Formulario inválido");
    }
  };
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-8">Agregar Trabajador</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="Rut"
          label="Rut"
          placeholder="Ingrese el Rut"
          value={rut.formatted}
          onChange={(e) => {
            updateRut(e.target.value);
          }}
          startContent={<User size={16} />}
          isInvalid={!isValid}
          errorMessage={errors.Rut}
          maxLength={12}
        />

        <Input
          name="Nombre"
          label="Nombre"
          placeholder="Ingrese el primer nombre y primer apellido"
          value={formData.Nombre}
          onChange={handleInputChange}
          startContent={<User size={16} />}
          isInvalid={!!errors.Nombre}
          errorMessage={errors.Nombre}
        />

        <Select
          label="Cargo"
          placeholder="Seleccione un cargo"
          value={formData.cargo}
          onChange={handleSelectChange}
          isInvalid={!!errors.cargo}
          errorMessage={errors.cargo}
        >
          <SelectItem key="administracion" value="administracion">
            Administración
          </SelectItem>
          <SelectItem key="lector" value="lector">
            Lector
          </SelectItem>
          <SelectItem key="supervisor" value="supervisor">
            Supervisor
          </SelectItem>
          <SelectItem key="inspector" value="inspector">
            Inspector
          </SelectItem>
        </Select>

        <Input
          name="correo"
          type="email"
          label="Correo electrónico"
          placeholder="Ingrese el correo electrónico"
          value={formData.correo}
          onChange={handleInputChange}
          startContent={<Mail size={16} />}
          isInvalid={!!errors.correo}
          errorMessage={errors.correo}
        />

        <Input
          name="clave"
          type="password"
          label="Clave"
          placeholder="Ingrese la clave provisoria"
          value={formData.clave}
          onChange={handleInputChange}
          startContent={<Lock size={16} />}
          isInvalid={!!errors.clave}
          errorMessage={errors.clave}
        />

        <Button type="submit" color="primary">
          Agregar Trabajador
        </Button>
      </form>
    </div>
  );
}
