
"use client";

import { useState, createContext, useContext, type ReactNode, useEffect } from 'react';
import { useToast } from './use-toast';
import { useAuth } from './use-auth';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export type MonitoredService = {
  id: string;
  url: string;
  userId: string;
  // NOTE: Status is simulated for this prototype. In a real app, this would be fetched.
  status: "Operational" | "Degraded Performance" | "Offline";
  description?: string;
};

interface ServicesContextType {
  services: MonitoredService[];
  addService: (url: string) => Promise<void>;
  removeService: (id: string) => Promise<void>;
  loading: boolean;
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export const ServicesProvider = ({ children }: { children: ReactNode }) => {
  const [services, setServices] = useState<MonitoredService[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setLoading(true);
      const q = query(collection(db, "monitoredServices"), where("userId", "==", user.uid));
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const servicesData: MonitoredService[] = [];
        querySnapshot.forEach((doc) => {
          servicesData.push({ id: doc.id, ...doc.data() } as MonitoredService);
        });
        setServices(servicesData);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching services: ", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not fetch monitored websites.",
        });
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // No user, clear services and stop loading
      setServices([]);
      setLoading(false);
    }
  }, [user, toast]);

  const addService = async (url: string) => {
    if (!user) {
        toast({ variant: "destructive", title: "Not Authenticated", description: "You must be logged in to add a service." });
        return;
    }

    // In a real app, you might fetch status here. We'll just simulate it.
    const statuses: MonitoredService['status'][] = ["Operational", "Degraded Performance", "Offline"];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    try {
        await addDoc(collection(db, "monitoredServices"), {
            url,
            userId: user.uid,
            status: randomStatus,
            createdAt: new Date(),
        });

        toast({
            title: "Website Added",
            description: `${url} is now being monitored.`,
        });
    } catch (error) {
        console.error("Error adding service: ", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not add the website to be monitored.",
        });
    }
  };

  const removeService = async (id: string) => {
    if (!user) {
        toast({ variant: "destructive", title: "Not Authenticated", description: "You must be logged in to remove a service." });
        return;
    }

    const serviceToRemove = services.find(s => s.id === id);
    try {
        await deleteDoc(doc(db, "monitoredServices", id));
        if (serviceToRemove) {
            toast({
                title: "Website Removed",
                description: `${serviceToRemove.url} is no longer being monitored.`,
            });
        }
    } catch (error) {
        console.error("Error removing service: ", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not remove the monitored website.",
        });
    }
  };
  
  const contextValue = { services, addService, removeService, loading };

  return (
    <ServicesContext.Provider value={contextValue}>
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
