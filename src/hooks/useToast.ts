//useToast hook
import { useState } from "react";

export const useToast = () => {
  const [toast, setToast] = useState("");

  const success = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast("");
    }, 3000);
  };

  const error = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast("");
    }, 3000);
  };

  return { toast, success, error };
};
