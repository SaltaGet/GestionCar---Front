// hooks/useServiceSelection.ts
import { useState } from "react";

export const useServiceSelection = (initialServices: string[] = []) => {
  const [selectedServices, setSelectedServices] = useState<string[]>(initialServices);

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const removeService = (serviceId: string) => {
    setSelectedServices((prev) => prev.filter((id) => id !== serviceId));
  };

  return {
    selectedServices,
    handleServiceToggle,
    removeService,
    setSelectedServices,
  };
};