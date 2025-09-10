import React from "react";
import type { ReactNode } from "react";
import "./FormError.scss";

interface FormMessageProps {
  type: string;        
  children: ReactNode; 
}

const FormMessage: React.FC<FormMessageProps> = ({ type, children }) => {
  return (
    <div className={`form-message ${type}`}>
      <p>{children}</p>
    </div>
  );
};

export default FormMessage;
