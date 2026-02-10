import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Service, Testimonial } from '../types';
import { PROJECTS as INITIAL_PROJECTS, SERVICES as INITIAL_SERVICES, TESTIMONIALS as INITIAL_TESTIMONIALS } from '../constants';

interface DataContextType {
  projects: Project[];
  services: Service[];
  testimonials: Testimonial[];
  addProject: (project: Project) => void;
  removeProject: (id: string) => void;
  addTestimonial: (testimonial: Testimonial) => void;
  removeTestimonial: (id: string) => void;
  resetData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicializa o estado com dados do LocalStorage ou usa os dados iniciais do constants.ts
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('vinity_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('vinity_testimonials');
    return saved ? JSON.parse(saved) : INITIAL_TESTIMONIALS;
  });

  const [services] = useState<Service[]>(INITIAL_SERVICES); // Serviços geralmente são estáticos, mas podem ser tornados dinâmicos

  // Salva no LocalStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('vinity_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('vinity_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  const addProject = (project: Project) => {
    setProjects(prev => [project, ...prev]);
  };

  const removeProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const addTestimonial = (testimonial: Testimonial) => {
    setTestimonials(prev => [testimonial, ...prev]);
  };

  const removeTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  const resetData = () => {
    setProjects(INITIAL_PROJECTS);
    setTestimonials(INITIAL_TESTIMONIALS);
    localStorage.removeItem('vinity_projects');
    localStorage.removeItem('vinity_testimonials');
  };

  return (
    <DataContext.Provider value={{ 
      projects, 
      services, 
      testimonials, 
      addProject, 
      removeProject, 
      addTestimonial, 
      removeTestimonial,
      resetData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
