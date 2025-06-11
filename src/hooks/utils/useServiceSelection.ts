import { useState, useEffect } from "react";

export const useServiceSelection = (initialServices: string[] = [], onSelectionChange?: (services: string[]) => void) => {
  const [selectedServices, setSelectedServices] = useState<string[]>(initialServices);

  useEffect(() => {
    setSelectedServices(initialServices);
  }, [initialServices]);

  const updateServices = (newServices: string[]) => {
    setSelectedServices(newServices);
    onSelectionChange?.(newServices);
  };

  const handleServiceToggle = (serviceId: string) => {
    const newServices = selectedServices.includes(serviceId)
      ? selectedServices.filter((id) => id !== serviceId)
      : [...selectedServices, serviceId];
    updateServices(newServices);
  };

  const removeService = (serviceId: string) => {
    const newServices = selectedServices.filter((id) => id !== serviceId);
    updateServices(newServices);
  };

  return {
    selectedServices,
    handleServiceToggle,
    removeService,
    setSelectedServices: updateServices,
  };
};