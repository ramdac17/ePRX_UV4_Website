import { useState } from "react";
import axios from "axios";

export const useRegister = (
  apiUrl: string | undefined,
  onSuccess: () => void,
) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    mobile: "",
  });
  const [toast, setToast] = useState({
    show: false,
    msg: "",
    type: "error" as "success" | "error",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const sanitizedData = {
        ...formData,
        email: formData.email.trim().toLowerCase(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
      };
      await axios.post(`${apiUrl}/auth/register`, sanitizedData);
      setToast({
        show: true,
        msg: "RECRUIT SYNC: SUCCESS. OTP DISPATCHED.",
        type: "success",
      });
      setTimeout(() => setIsVerifying(true), 1500);
    } catch (error: any) {
      const rawMsg = error.response?.data?.message || "REGISTRATION FAILED";
      setToast({
        show: true,
        msg: (Array.isArray(rawMsg) ? rawMsg[0] : rawMsg).toUpperCase(),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    isVerifying,
    loading,
    toast,
    handleChange,
    handleSubmit,
    setToast,
  };
};
