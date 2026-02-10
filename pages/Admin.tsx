import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Button } from '../components/ui/Button';
import { Trash2, Plus, LogOut, LayoutGrid, MessageSquare, RotateCcw, ArrowLeft, Gem } from 'lucide-react';
import { Project, Testimonial } from '../types';
import { Link } from 'react-router-dom';

const Admin = () => {
  const { projects, testimonials, addProject, removeProject, addTestimonial, removeTestimonial, resetData } = useData();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'projects' | 'testimonials'>('projects');

  // Form States
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '', category: '', image: '', type: 'image', tag: '', aspect: 'vertical'
  });
  const [newTestimonial, setNewTestimonial] = useState<Partial<Testimonial>>({
    author: '', role: '', quote: '', image: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Senha simples para demonstração
      setIsAuthenticated(true);
    } else {
      alert('Senha incorreta');
    }
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.image) return;
    
    addProject({
      id: Date.now().toString(),
      title: newProject.title!,
      category: newProject.category || 'Geral',
      image: newProject.image!,
      type: newProject.type as 'image' | 'video',
      tag: newProject.tag || 'Novo',
      aspect: newProject.aspect as 'vertical' | 'horizontal' | 'square',
    });
    
    setNewProject({ title: '', category: '', image: '', type: 'image', tag: '', aspect: 'vertical' });
    alert('Projeto adicionado com sucesso!');
  };

  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonial.author || !newTestimonial.quote) return;

    addTestimonial({
      id: Date.now().toString(),
      author: newTestimonial.author!,
      role: newTestimonial.role || '',
      quote: newTestimonial.quote!,
      image: newTestimonial.image || 'https://via.placeholder.com/150',
    });

    setNewTestimonial({ author: '', role: '', quote: '', image: '' });
    alert('Depoimento adicionado com sucesso!');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-6 relative">
        <div className="absolute top-6 left-6">
             <Link to="/" className="text-white/60 hover:text-primary flex items-center gap-2 transition-colors">
                <ArrowLeft size={20} /> Voltar para o Site
             </Link>
        </div>

        <div className="bg-white p-10 rounded-3xl w-full max-w-md shadow-2xl animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <Gem size={24} />
            </div>
            <h2 className="text-3xl font-serif font-bold text-background-dark">Vinity Admin</h2>
            <p className="text-gray-500 mt-2 text-sm">Área restrita para gestão de conteúdo</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Senha de Acesso</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                autoFocus
              />
            </div>
            <Button type="submit" variant="primary" className="w-full py-4 text-base">Acessar Painel</Button>
          </form>
          
          <p className="text-center text-xs text-gray-400 mt-6">
            Dica: A senha é <strong>admin123</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold text-background-dark">Painel Administrativo</h1>
            <p className="text-gray-500 mt-2">Gerencie o conteúdo do seu portfólio e depoimentos.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={resetData} icon={<RotateCcw size={16} />}>Restaurar Padrão</Button>
            <Button variant="white" onClick={() => setIsAuthenticated(false)} icon={<LogOut size={16} />}>Sair</Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`pb-4 px-4 flex items-center gap-2 font-medium transition-colors ${activeTab === 'projects' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <LayoutGrid size={20} /> Projetos / Portfólio
          </button>
          <button 
            onClick={() => setActiveTab('testimonials')}
            className={`pb-4 px-4 flex items-center gap-2 font-medium transition-colors ${activeTab === 'testimonials' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <MessageSquare size={20} /> Depoimentos
          </button>
        </div>

        {/* Projects Management */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-32">
                <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><Plus size={20} /> Adicionar Novo Projeto</h3>
                <form onSubmit={handleAddProject} className="flex flex-col gap-4">
                  <input 
                    type="text" 
                    placeholder="Título do Projeto" 
                    className="p-3 bg-gray-50 border border-gray-200 rounded-lg w-full"
                    value={newProject.title}
                    onChange={e => setNewProject({...newProject, title: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="Categoria (ex: Vídeos Institucionais)" 
                    className="p-3 bg-gray-50 border border-gray-200 rounded-lg w-full"
                    value={newProject.category}
                    onChange={e => setNewProject({...newProject, category: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="URL da Imagem/Thumbnail" 
                    className="p-3 bg-gray-50 border border-gray-200 rounded-lg w-full"
                    value={newProject.image}
                    onChange={e => setNewProject({...newProject, image: e.target.value})}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <select 
                      className="p-3 bg-gray-50 border border-gray-200 rounded-lg w-full"
                      value={newProject.type}
                      onChange={e => setNewProject({...newProject, type: e.target.value as any})}
                    >
                      <option value="image">Imagem</option>
                      <option value="video">Vídeo</option>
                    </select>
                    <select 
                      className="p-3 bg-gray-50 border border-gray-200 rounded-lg w-full"
                      value={newProject.aspect}
                      onChange={e => setNewProject({...newProject, aspect: e.target.value as any})}
                    >
                      <option value="vertical">Vertical</option>
                      <option value="horizontal">Horizontal</option>
                      <option value="square">Quadrado</option>
                    </select>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Tag (ex: Cinematic Tour)" 
                    className="p-3 bg-gray-50 border border-gray-200 rounded-lg w-full"
                    value={newProject.tag}
                    onChange={e => setNewProject({...newProject, tag: e.target.value})}
                  />
                  <Button type="submit" variant="primary" className="w-full mt-2">Adicionar Projeto</Button>
                </form>
              </div>
            </div>

            {/* List */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map(project => (
                <div key={project.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 group">
                  <img src={project.image} alt={project.title} className="w-24 h-24 object-cover rounded-lg bg-gray-100" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-background-dark">{project.title}</h4>
                      <span className="text-xs text-primary uppercase font-semibold">{project.category}</span>
                    </div>
                    <button 
                      onClick={() => removeProject(project.id)}
                      className="self-start text-red-500 text-sm flex items-center gap-1 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                    >
                      <Trash2 size={14} /> Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Testimonials Management */}
        {activeTab === 'testimonials' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-32">
                 <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><Plus size={20} /> Adicionar Depoimento</h3>
                 <form onSubmit={handleAddTestimonial} className="flex flex-col gap-4">
                    <input 
                      type="text" 
                      placeholder="Nome do Cliente" 
                      className="p-3 bg-gray-50 border border-gray-200 rounded-lg w-full"
                      value={newTestimonial.author}
                      onChange={e => setNewTestimonial({...newTestimonial, author: e.target.value})}
                    />
                    <input 
                      type="text" 
                      placeholder="Cargo / Empresa" 
                      className="p-3 bg-gray-50 border border-gray-200 rounded-lg w-full"
                      value={newTestimonial.role}
                      onChange={e => setNewTestimonial({...newTestimonial, role: e.target.value})}
                    />
                    <textarea 
                      placeholder="O depoimento..." 
                      className="p-3 bg-gray-50 border border-gray-200 rounded-lg w-full h-32 resize-none"
                      value={newTestimonial.quote}
                      onChange={e => setNewTestimonial({...newTestimonial, quote: e.target.value})}
                    />
                    <input 
                      type="text" 
                      placeholder="URL da Foto do Cliente" 
                      className="p-3 bg-gray-50 border border-gray-200 rounded-lg w-full"
                      value={newTestimonial.image}
                      onChange={e => setNewTestimonial({...newTestimonial, image: e.target.value})}
                    />
                    <Button type="submit" variant="primary" className="w-full mt-2">Salvar Depoimento</Button>
                 </form>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-4">
               {testimonials.map(t => (
                 <div key={t.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-600 italic mb-4">"{t.quote}"</p>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <img src={t.image} alt={t.author} className="w-10 h-10 rounded-full object-cover" />
                          <div>
                             <h4 className="font-bold text-sm">{t.author}</h4>
                             <p className="text-xs text-gray-400">{t.role}</p>
                          </div>
                       </div>
                       <button 
                          onClick={() => removeTestimonial(t.id)}
                          className="text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;