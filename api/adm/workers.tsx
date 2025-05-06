"use client";
import React, { useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Spinner } from "@heroui/react";
import { useAsyncList } from "@react-stately/data";
import { URL } from "../../config/config";
interface TablaRutasProps {
  token: string;
}

export default function TablaRutas({ token }: TablaRutasProps) {
  const [isLoading, setIsLoading] = useState(true);

  interface Worker {
    _id: string;
    Rut: string;
    Nombre: string;
    cargo: string;
    correo: string;
  }

  let list = useAsyncList<Worker>({
    async load({ signal }) {
      let res = await fetch(`${URL}/solicitud/AllSolicitudesSec/trabajador/listarTrabajadores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token }), // Ajuste de la petición con rut y token
        signal,
      });

      let json = await res.json();
      setIsLoading(false);

      return {
        items: json, // Asignar los resultados a items directamente
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          let first = (a as any)[sortDescriptor.column as keyof typeof a];
          let second = sortDescriptor.column ? (b as any)[sortDescriptor.column] : undefined;
          let cmp = (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }

          return cmp;
        }),
      };
    },
  });

  return (
    <Table
      aria-label="Tabla de trabajadores con ordenación"
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
      classNames={{
        table: "min-h-[400px] max-h-[93.5vh]", 
        wrapper: "bg-[transparent]"
      }}
      shadow="none"
    >
      <TableHeader>
        <TableColumn key="Rut" allowsSorting>
          RUT
        </TableColumn>
        <TableColumn key="Nombre" allowsSorting>
          Nombre
        </TableColumn>
        <TableColumn key="cargo" allowsSorting>
          Cargo
        </TableColumn>
        <TableColumn key="correo" allowsSorting>
          Correo
        </TableColumn>
      </TableHeader>
      <TableBody 
        items={list.items} 
        isLoading={isLoading}
        loadingContent={<Spinner label="Cargando trabajadores..." />}
      >
        {(item) => (
          <TableRow key={item._id}>
            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
