"use client";
import React, { useState} from "react";
import styles from "../../../styles/workers.module.css";
import TablaWorkers from "@/components/Workers/TablaWorkers";
import { FormularioTrabajador } from "@/components/Workers/FormularioTrabajador";
export default function Admin_Workers() {
  
  return (
    <div className={styles.RutasDiv}>
      <div className={styles.divTab}>
        <TablaWorkers/>
      </div>
      <div className={styles.divMenu}>
        <div className={styles.blq}>
          <FormularioTrabajador />
        </div>
      </div>
    </div>
  );
}