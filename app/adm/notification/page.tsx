"use client";
import {useState } from "react";
import styles from "../../../styles/rutas.module.css";
import NotificationTable from "@/components/Notification/NotificationTable";
import NotificationADD from "@/components/Notification/NotificationADD";
import NotificationModal from "@/components/Notification/NotificationModal";
export default function Admin_Notification() {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (notification:any) => {
    console.log(notification);
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };
    return (
    <div className={styles.RutasDiv}>
      {selectedNotification && (
        <NotificationModal
          isOpen={isModalOpen}
          notification={selectedNotification}
          onClose={handleCloseModal}
        />
      )}
      <div className={styles.divTab}>
        <NotificationTable onRowClick={handleRowClick} />
      </div>
      <div className={styles.divMenu}>
        <div className={styles.blq}>
          <NotificationADD />
        </div>
      </div>
    </div>
  );
}
