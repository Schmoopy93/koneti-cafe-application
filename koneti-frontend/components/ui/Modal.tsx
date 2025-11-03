"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "./Modal.scss";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  title?: string;
  emoji?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, title, emoji, children }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-category-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

        {title && (
          <h2 data-emoji={emoji || ""}>
            {title}
          </h2>
        )}

        {children}
      </div>
    </div>
  );
};

export default Modal;
