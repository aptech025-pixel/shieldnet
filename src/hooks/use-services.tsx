
"use client";

import { useState, createContext, useContext, type ReactNode, useEffect } from 'react';
import { useToast } from './use-toast';

export type MonitoredService = {
  id: string;
  url: string;
  // NOTE: Status is simulated for this prototype. In a real app, this would be fetched.
  status: "Operational" | "Degraded Performance" | "Offline";
  description?: string;
};

interface ServicesContextType {
  services: MonitoredService[];
  addService: (url: string) => void;
  removeService: (id: string) => void;
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

const initialServices: MonitoredService[] = [
    { id: '1', url: 'https://mrfarm.free.nf', status: 'Operational' },
    { id: '2', url: 'https://www.9jadevs.free.nf', status: 'Operational' },
    { id: '3', url: 'https://apojtech.free.nf', status: 'Degraded Performance' },
];

const getInitialState = () => {
    if (typeof window === 'undefined') {
        return initialServices;
    }
    const storedServices = localStorage.getItem('monitoredServices');
    return storedServices ? JSON.parse(storedServices) : initialServices;
};


export const ServicesProvider = ({ children }: { children: ReactNode }) => {
  const [services, setServices] = useState<MonitoredService[]>(getInitialState);
  const { toast } = useToast();
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('monitoredServices', JSON.stringify(services));
    }
  }, [services]);

  const addService = (url: string) => {
    // In a real app, you might fetch status here. We'll just simulate it.
    const statuses: MonitoredService['status'][] = ["Operational", "Degraded Performance", "Offline"];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    const newService: MonitoredService = {
      id: new Date().toISOString(),
      url,
      status: randomStatus,
    };
    setServices(prev => [...prev, newService]);
    toast({
        title: "Website Added",
        description: `${url} is now being monitored.`,
    });
  };

  const removeService = (id: string) => {
    const serviceToRemove = services.find(s => s.id === id);
    setServices(prev => prev.filter(service => service.id !== id));
    if (serviceToRemove) {
        toast({
            title: "Website Removed",
            description: `${serviceToRemove.url} is no longer being monitored.`,
        });
    }
  };

  return (
    <ServicesContext.Provider value={{ services, addService, removeService }}>
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
};
