import React, { useState, useEffect } from 'react';
import { Play, X, Diamond, ArrowDown } from 'lucide-react';
import { Reveal } from '../components/ui/Reveal';
import { Button } from '../components/ui/Button';
import { Project } from '../types';
import { supabase } from '../lib/supabase';

const Portfolio = () => {
  const [filter, setFilter] = useState('Todos');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setProjects(data);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  // Dynamically extract categories from projects
  const availableCategories = Array.from(new Set(projects.map(p => p.category)));
  const categories = ['Todos', ...availableCategories];

  const filteredProjects = filter === 'Todos'
    ? projects
    : projects.filter(p => p.category === filter);

  return (
    <main className="flex-grow pt-[80px]">
      {/* Header */}
      <section className="relative w-full py-24 md:py-36 bg-warm-beige flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,53,0.05),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,77,77,0.03),transparent_40%)]" />

        <div className="relative z-20 container mx-auto px-6 text-center text-background-dark flex flex-col items-center gap-6 max-w-4xl">
          <Reveal>
            <span className="inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-white/50 backdrop-blur-sm text-primary text-xs font-bold tracking-widest uppercase mb-6">
              Portfólio Exclusivo
            </span>
            <h1 className="font-serif text-5xl md:text-7xl font-medium leading-[1.1] mb-6 tracking-tight text-background-dark">
              Nossas <span className="italic text-primary font-serif">Obras-Primas</span>
            </h1>
            <p className="text-lg md:text-xl font-light text-background-dark/70 max-w-2xl mx-auto leading-relaxed">
              Mergulhe em nossa curadoria de narrativas visuais. Cada projeto é uma fusão de técnica cinematográfica e sensibilidade estética.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Filter & Grid */}
      <section className="py-12 bg-porcelain px-6 min-h-screen">
        <div className="max-w-[1280px] mx-auto">
          {/* Filters */}
          <Reveal className="mb-16 w-full" width="100%">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  aria-label={`Filtrar por ${cat}`}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${filter === cat
                    ? 'bg-background-dark text-white shadow-lg scale-105'
                    : 'bg-white border border-[#e4e3dc] text-background-dark/70 hover:text-primary hover:border-primary hover:scale-105'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Masonry Layout */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredProjects.map((project, index) => (
              <Reveal key={project.id} width="100%" delay={index * 0.05}>
                <div
                  className="relative group break-inside-avoid rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 bg-gray-100"
                  onClick={() => setSelectedProject(project)}
                  aria-label={`Ver detalhes do projeto ${project.title}`}
                >
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="absolute inset-0 flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 text-white hover:bg-primary transition-colors">
                        <Play size={20} fill="currentColor" />
                      </div>
                      <span className="text-xs font-bold tracking-widest text-white/80 uppercase mb-1 block">
                        {project.tag}
                      </span>
                      <h3 className="font-serif text-2xl text-white font-medium">{project.title}</h3>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-20 text-center">
            <Button variant="outline" className="px-10" icon={<ArrowDown size={18} />} aria-label="Carregar mais projetos">
              Carregar Mais Projetos
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 bg-deep-teal overflow-hidden text-center">
        <Reveal>
          <h2 className="font-serif text-4xl font-bold text-white mb-6">Deseja um portfólio como este?</h2>
          <Button variant="primary" aria-label="Solicitar orçamento agora">Solicitar Orçamento</Button>
        </Reveal>
      </section>

      {/* Modal / Lightbox */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
          <div
            className="absolute inset-0 cursor-default"
            onClick={() => setSelectedProject(null)}
          />
          <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
            <button
              className="absolute top-4 right-4 z-50 text-white bg-black/50 p-2 rounded-full hover:bg-white/20 transition cursor-pointer"
              onClick={() => setSelectedProject(null)}
              aria-label="Fechar visualização"
            >
              <X size={24} />
            </button>

            {/* Media Area */}
            <div className={`relative ${selectedProject.aspect === 'vertical' ? 'w-full md:w-1/2 aspect-[9/16]' : 'w-full aspect-video'} bg-gray-900`}>
              <img
                src={selectedProject.image_url}
                alt={selectedProject.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button aria-label="Reproduzir vídeo do projeto" className="w-20 h-20 bg-white/10 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:scale-110 hover:bg-primary transition-all duration-300 group shadow-2xl cursor-pointer">
                  <Play size={32} fill="currentColor" className="ml-1" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-gradient-to-b from-[#1a1a1a] to-black p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/20 rounded-full text-primary border border-primary/50">
                  <Diamond size={20} />
                </div>
                <span className="text-primary font-bold tracking-wider uppercase text-xs">{selectedProject.category}</span>
              </div>

              <h3 className="text-white font-serif text-3xl md:text-4xl leading-tight mb-4">{selectedProject.title}</h3>
              <p className="text-white/60 leading-relaxed mb-8">
                Este projeto foi desenvolvido com foco em elevar a percepção de valor da marca, utilizando técnicas de cinema e color grading avançado. O resultado foi um aumento de 40% na conversão de leads qualificados.
              </p>

              <Button variant="primary" className="w-full justify-between group">
                Ver Estudo de Caso
                <Play size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Portfolio;
