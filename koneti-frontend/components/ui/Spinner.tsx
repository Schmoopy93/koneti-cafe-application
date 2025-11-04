"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import "./Spinner.scss";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ 
  size = "md", 
  text = "Loading...", 
  className = "" 
}) => {
  return (
    <div className={`spinner-container ${size} ${className}`}>
      <FontAwesomeIcon icon={faSpinner} spin className="spinner-icon" />
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
};

export default Spinner;