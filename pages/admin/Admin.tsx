import React, { useState, useEffect, useCallback } from 'react';
import {
    Image as ImageIcon,
    Video,
    Users,
    Settings as SettingsIcon,
    LogOut,
    Plus,
    Trash2,
    Edit2,
    ChevronRight,
    Save,
    CheckCircle,
    XCircle,
    Upload,
    Link as LinkIcon,
    FolderOpen,
    Info,
    Layers,
    Star,
    Palette,
    Globe,
    TrendingUp,
    Diamond
} from 'lucide-react';
import { Reveal } from '../../components/ui/Reveal';
import { Button } from '../../components/ui/Button';
import { uploadFile, getGalleryFiles } from '../../lib/storage';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../lib/imageUtils';
import 'react-easy-crop/react-easy-crop.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('settings');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const { settings, updateSetting } = useSettings();
    const { signOut } = useAuth();

    const tabs = [
        { id: 'settings', label: 'Configurações', icon: <SettingsIcon size={20} /> },
        { id: 'services', label: 'Serviços', icon: <Layers size={20} /> },
        { id: 'portfolio', label: 'Portfólio', icon: <ImageIcon size={20} /> },
        { id: 'uploads', label: 'Uploads', icon: <FolderOpen size={20} /> },
        { id: 'partners', label: 'Parceiros', icon: <Star size={20} /> },
        { id: 'testimonials', label: 'Depoimentos', icon: <Users size={20} /> },
    ];

    const handleSave = async () => {
        setIsSaving(true);
        try {
            setMessage({ type: 'success', text: 'Todas as alterações foram sincronizadas!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Erro ao salvar alterações.' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5F3] pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-8">

                    <aside className="w-full md:w-64 space-y-2">
                        <Reveal direction="right" width="100%">
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                <h2 className="font-serif text-xl font-bold text-background-dark mb-6 px-2">Painel de Controle</h2>
                                <nav className="space-y-1">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            aria-label={`Ir para aba ${tab.label}`}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                                : 'text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            {tab.icon}
                                            {tab.label}
                                            {activeTab === tab.id && <ChevronRight size={16} className="ml-auto" />}
                                        </button>
                                    ))}
                                </nav>
                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <button
                                        onClick={() => signOut()}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                                    >
                                        <LogOut size={20} />
                                        Sair do Painel
                                    </button>
                                </div>
                            </div>
                        </Reveal>
                    </aside>

                    <main className="flex-grow">
                        <Reveal direction="up" width="100%">
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[600px]">

                                <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
                                    <div>
                                        <h1 className="font-serif text-3xl font-bold text-background-dark">
                                            {tabs.find(t => t.id === activeTab)?.label}
                                        </h1>
                                        <p className="text-gray-400 text-sm mt-1">Gerencie a aparência e os arquivos do seu site.</p>
                                    </div>
                                    <Button variant="primary" onClick={handleSave} disabled={isSaving}>
                                        {isSaving ? 'Salvando...' : <><Save size={18} /> Salvar Tudo</>}
                                    </Button>
                                </div>

                                {message && (
                                    <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 animate-fade-in ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                                        }`}>
                                        {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                                        <span className="text-sm font-medium">{message.text}</span>
                                    </div>
                                )}

                                <div className="space-y-8">
                                    {activeTab === 'settings' && <SettingsSection settings={settings} updateSetting={updateSetting} />}
                                    {activeTab === 'services' && <ServicesSection />}
                                    {activeTab === 'portfolio' && <PortfolioSection />}
                                    {activeTab === 'uploads' && <UploadsGallery />}
                                    {activeTab === 'partners' && <PartnersSection />}
                                    {activeTab === 'testimonials' && <TestimonialsSection />}
                                </div>

                            </div>
                        </Reveal>
                    </main>

                </div>
            </div>
        </div>
    );
};

// --- COMPONENTE DE UPLOAD 3-EM-1 ---
interface SmartUploadProps {
    label: string;
    value: string;
    onChange: (url: string) => void;
    hint?: string;
    type?: 'image' | 'video';
}

const SmartUpload: React.FC<SmartUploadProps> = ({ label, value, onChange, hint, type = 'image' }) => {
    const [mode, setMode] = useState<'link' | 'upload' | 'gallery'>('link');
    const [isUploading, setIsUploading] = useState(false);
    const [gallery, setGallery] = useState<any[]>([]);

    // Crop State
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    useEffect(() => {
        if (mode === 'gallery') {
            getGalleryFiles().then(setGallery);
        }
    }, [mode]);

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const readFile = (file: File) => {
        return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => resolve(reader.result as string), false);
            reader.readAsDataURL(file);
        });
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (type === 'video') {
                // Direct upload for video
                handleFileUpload(file);
            } else {
                // Crop flow for image
                const imageDataUrl = await readFile(file);
                setImageSrc(imageDataUrl);
                setCrop({ x: 0, y: 0 });
                setZoom(1);
            }
        }
    };

    const handleFileUpload = async (file: File) => {
        setIsUploading(true);
        try {
            const url = await uploadFile(file);
            onChange(url);
            setMode('link');
        } catch (err) {
            alert(`Erro no upload: ${(err as any).message || JSON.stringify(err)}`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSaveCrop = async () => {
        if (!imageSrc) return;
        setIsUploading(true);
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            if (croppedImage) {
                await handleFileUpload(croppedImage);
                setImageSrc(null); // Close cropper
            }
        } catch (e) {
            console.error(e);
            alert('Erro ao processar o corte da imagem.');
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-end">
                <label className="text-xs font-bold text-background-dark uppercase tracking-wider">{label}</label>
                {hint && (
                    <div className="flex items-center gap-1 text-[10px] text-primary bg-primary/5 px-2 py-1 rounded-md font-medium">
                        <Info size={12} /> {hint}
                    </div>
                )}
            </div>

            <div className="bg-gray-50 rounded-2xl p-1.5 flex gap-1 mb-2">
                <button
                    type="button"
                    onClick={() => setMode('link')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-bold uppercase tracking-tight transition-all ${mode === 'link' ? 'bg-white shadow-sm text-primary' : 'text-gray-400 opacity-60'}`}
                >
                    <LinkIcon size={14} /> Link
                </button>
                <button
                    type="button"
                    onClick={() => setMode('upload')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-bold uppercase tracking-tight transition-all ${mode === 'upload' ? 'bg-white shadow-sm text-primary' : 'text-gray-400 opacity-60'}`}
                >
                    <Upload size={14} /> PC
                </button>
                <button
                    type="button"
                    onClick={() => setMode('gallery')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-bold uppercase tracking-tight transition-all ${mode === 'gallery' ? 'bg-white shadow-sm text-primary' : 'text-gray-400 opacity-60'}`}
                >
                    <FolderOpen size={14} /> Uploads
                </button>
            </div>

            <div className="min-h-[80px] border border-gray-100 rounded-2xl bg-white p-3 relative">
                {mode === 'link' && (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-primary/20 outline-none text-xs"
                        placeholder="Cole o link aqui..."
                    />
                )}

                {mode === 'upload' && (
                    <div className="text-center py-2">
                        <input
                            type="file"
                            id={`upload-${label}`}
                            className="hidden"
                            onChange={handleFileSelect}
                            accept={type === 'video' ? 'video/*' : 'image/*'}
                        />
                        <label
                            htmlFor={`upload-${label}`}
                            className="cursor-pointer inline-flex items-center gap-2 text-primary font-bold text-xs bg-primary/5 px-5 py-2.5 rounded-xl hover:bg-primary/10 transition-all"
                        >
                            {isUploading ? 'Processando...' : <><Upload size={16} /> Selecionar Arquivo</>}
                        </label>
                    </div>
                )}

                {mode === 'gallery' && (
                    <div className="grid grid-cols-5 gap-2 max-h-[150px] overflow-y-auto p-1">
                        {gallery.map((file) => (
                            <button
                                type="button"
                                key={file.id}
                                onClick={() => onChange(file.url)}
                                className={`aspect-square rounded-lg border-2 overflow-hidden hover:border-primary transition-all ${value === file.url ? 'border-primary' : 'border-transparent'}`}
                            >
                                {file.type?.includes('video') ? (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400"><Video size={16} /></div>
                                ) : (
                                    <img src={file.url} className="w-full h-full object-cover" alt="" />
                                )}
                            </button>
                        ))}
                        {gallery.length === 0 && <p className="col-span-5 text-center text-[10px] text-gray-400 py-4">Vazio.</p>}
                    </div>
                )}

                {value && !imageSrc && (
                    <div className="mt-3 p-2 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white overflow-hidden border border-gray-200 flex items-center justify-center">
                            {type === 'video' ? <Video size={16} className="text-primary" /> : <img src={value} className="w-full h-full object-cover" alt="" />}
                        </div>
                        <div className="flex-grow overflow-hidden">
                            <p className="text-[10px] text-gray-400 truncate">{value}</p>
                        </div>
                        <button type="button" onClick={() => onChange('')} className="text-red-400 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                    </div>
                )}
            </div>

            {/* CROPPER MODAL / OVERLAY */}
            {imageSrc && (
                <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4">
                    <div className="bg-white rounded-3xl overflow-hidden w-full max-w-2xl flex flex-col max-h-[90vh]">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-background-dark">Ajustar Imagem</h3>
                            <button onClick={() => setImageSrc(null)} className="p-2 hover:bg-gray-100 rounded-full"><XCircle size={20} /></button>
                        </div>
                        <div className="relative h-[400px] w-full bg-gray-900">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-bold text-gray-500">Zoom</span>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>
                            <div className="flex gap-4">
                                <Button onClick={handleSaveCrop} className="flex-1" disabled={isUploading}>
                                    {isUploading ? 'Processando...' : <><CheckCircle size={18} /> Confirmar Corte</>}
                                </Button>
                                <Button variant="secondary" onClick={() => setImageSrc(null)} className="flex-1" disabled={isUploading}>
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- SEÇÕES ---

const ServicesSection = () => {
    const [services, setServices] = useState<any[]>([]);
    const [editingService, setEditingService] = useState<any>(null);
    const icons = ['Video', 'Palette', 'Globe', 'TrendingUp', 'Diamond', 'Star', 'User'];

    const fetchServices = async () => {
        const { data } = await supabase.from('services').select('*').order('order_index', { ascending: true });
        if (data) setServices(data);
    };

    useEffect(() => { fetchServices(); }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.from('services').upsert(editingService);
        if (!error) {
            setEditingService(null);
            fetchServices();
        }
    };

    const deleteService = async (id: string) => {
        if (confirm('Deseja excluir este serviço?')) {
            await supabase.from('services').delete().eq('id', id);
            fetchServices();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-background-dark text-xl">Gestão de Serviços</h3>
                {!editingService && (
                    <Button variant="secondary" onClick={() => setEditingService({ title: '', description: '', icon: 'Video', image_url: '', span: false, order_index: services.length })} className="text-xs py-2 h-auto flex items-center gap-2" aria-label="Adicionar novo serviço">
                        <Plus size={14} /> Novo Serviço
                    </Button>
                )}
            </div>

            {editingService && (
                <form onSubmit={handleSave} className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 space-y-6 animate-fade-in shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-5">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-2 block ml-4">Título do Serviço</label>
                                <input
                                    required
                                    value={editingService.title}
                                    onChange={e => setEditingService({ ...editingService, title: e.target.value })}
                                    className="w-full px-5 py-3 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-2 block ml-4">Ícone</label>
                                <div className="flex flex-wrap gap-2">
                                    {icons.map(icon => (
                                        <button
                                            key={icon}
                                            type="button"
                                            onClick={() => setEditingService({ ...editingService, icon })}
                                            className={`p-3 rounded-xl border transition-all ${editingService.icon === icon ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-gray-400 border-gray-100 hover:border-primary/30'}`}
                                        >
                                            {icon === 'Video' && <Video size={18} />}
                                            {icon === 'Palette' && <Palette size={18} />}
                                            {icon === 'Globe' && <Globe size={18} />}
                                            {icon === 'TrendingUp' && <TrendingUp size={18} />}
                                            {icon === 'Diamond' && <Diamond size={18} />}
                                            {icon === 'Star' && <Star size={18} />}
                                            {icon === 'User' && <Users size={18} />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100">
                                <label className="flex items-center gap-3 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={editingService.span}
                                        onChange={e => setEditingService({ ...editingService, span: e.target.checked })}
                                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer"
                                    />
                                    <span className="text-sm font-medium text-gray-600">Card de Destaque (Largo)</span>
                                </label>
                            </div>
                        </div>
                        <div className="space-y-5">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-2 block ml-4">Descrição curta</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={editingService.description}
                                    onChange={e => setEditingService({ ...editingService, description: e.target.value })}
                                    className="w-full px-5 py-3 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20 bg-white text-sm"
                                />
                            </div>
                            <SmartUpload
                                label="Imagem de Fundo (Opcional)"
                                value={editingService.image_url}
                                onChange={(val) => setEditingService({ ...editingService, image_url: val })}
                                hint="Recomendado para cards de destaque"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <Button type="submit" className="flex-1 py-4 text-sm tracking-widest">Salvar Alterações</Button>
                        <Button variant="secondary" onClick={() => setEditingService(null)} className="flex-1 py-4 text-sm tracking-widest">Cancelar</Button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 gap-4">
                {services.map((service, index) => (
                    <div key={service.id} className="flex items-center gap-6 p-5 bg-white rounded-3xl border border-gray-100 group hover:shadow-xl hover:shadow-primary/5 transition-all">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${service.image_url ? 'bg-primary/10 text-primary' : 'bg-gray-50 text-gray-400'}`}>
                            {service.icon === 'Video' && <Video size={24} />}
                            {service.icon === 'Palette' && <Palette size={24} />}
                            {service.icon === 'Globe' && <Globe size={24} />}
                            {service.icon === 'TrendingUp' && <TrendingUp size={24} />}
                            {service.icon === 'Diamond' && <Diamond size={24} />}
                            {service.icon === 'Star' && <Star size={24} />}
                            {service.icon === 'User' && <Users size={24} />}
                        </div>
                        <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-background-dark">{service.title}</h4>
                                {service.span && <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Destaque</span>}
                            </div>
                            <p className="text-xs text-gray-400 line-clamp-1">{service.description}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setEditingService(service)} aria-label={`Editar serviço ${service.title}`} className="p-3 bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"><Edit2 size={18} /></button>
                            <button onClick={() => deleteService(service.id)} aria-label={`Excluir serviço ${service.title}`} className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SettingsSection = ({ settings, updateSetting }: any) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-8">
            <SmartUpload
                label="Logo do Topo"
                value={settings.header_logo}
                onChange={(val) => updateSetting('header_logo', val)}
                hint="250x80px PNG Transparente"
            />
            <SmartUpload
                label="Logo do Rodapé"
                value={settings.footer_logo}
                onChange={(val) => updateSetting('footer_logo', val)}
                hint="200x60px PNG ou SVG"
            />
        </div>
        <div className="space-y-8">
            <SmartUpload
                label="Banner Principal (Hero)"
                value={settings.hero_banner}
                onChange={(val) => updateSetting('hero_banner', val)}
                hint="1920x1080px (Alta Qualidade)"
            />
            <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                <h4 className="font-bold text-primary flex items-center gap-2 mb-2">
                    <Info size={18} /> Dica Visual
                </h4>
                <p className="text-xs text-background-dark/70 leading-relaxed">
                    O banner é o primeiro contato. Use imagens que transmitam luxo e calma.
                </p>
            </div>
        </div>
    </div>
);

const PortfolioSection = () => {
    const [items, setItems] = useState<any[]>([]);
    const [editingItem, setEditingItem] = useState<any>(null);
    const categories = [
        "Todos", "Vídeos Institucionais", "Fotografia Editorial", "Reels & Social", "Branding & Design", "Websites"
    ];

    const fetchItems = async () => {
        const { data } = await supabase.from('portfolio').select('*').order('created_at', { ascending: false });
        if (data) setItems(data);
    };

    useEffect(() => { fetchItems(); }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.from('portfolio').upsert(editingItem);
        if (!error) {
            setEditingItem(null);
            fetchItems();
        }
    };

    const deleteItem = async (id: string) => {
        if (confirm('Tem certeza?')) {
            await supabase.from('portfolio').delete().eq('id', id);
            fetchItems();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-background-dark">Itens do Portfólio</h3>
                {!editingItem && (
                    <Button variant="secondary" onClick={() => setEditingItem({ title: '', category: 'Vídeos Institucionais', image_url: '', type: 'video', aspect: 'vertical' })} className="text-xs py-2 h-auto flex items-center gap-2">
                        <Plus size={14} /> Adicionar Obra
                    </Button>
                )}
            </div>

            {editingItem && (
                <form onSubmit={handleSave} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold uppercase text-gray-400 mb-2 block">Título do Projeto</label>
                                <input
                                    required
                                    value={editingItem.title}
                                    onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-gray-400 mb-2 block">Categoria</label>
                                <select
                                    value={editingItem.category}
                                    onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    {categories.filter(c => c !== 'Todos').map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-400 mb-2 block">Tipo</label>
                                    <select
                                        value={editingItem.type}
                                        onChange={e => setEditingItem({ ...editingItem, type: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="video">Vídeo</option>
                                        <option value="image">Imagem</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-400 mb-2 block">Formato</label>
                                    <select
                                        value={editingItem.aspect}
                                        onChange={e => setEditingItem({ ...editingItem, aspect: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="vertical">Vertical (Reels)</option>
                                        <option value="horizontal">Horizontal (Institucional)</option>
                                        <option value="square">Quadrado</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <SmartUpload
                            label="Arquivo de Mídia"
                            value={editingItem.image_url}
                            onChange={(val) => setEditingItem({ ...editingItem, image_url: val })}
                            type={editingItem.type}
                            hint="Vídeos: MP4/MOV | Imagens: JPG/PNG"
                        />
                    </div>
                    <div className="flex gap-4">
                        <Button type="submit" className="flex-1">Salvar Projeto</Button>
                        <Button variant="secondary" onClick={() => setEditingItem(null)} className="flex-1">Cancelar</Button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 group hover:shadow-md transition-all">
                        <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden relative">
                            {item.type === 'video' ? (
                                <video
                                    src={item.image_url}
                                    className="w-full h-full object-cover"
                                    muted
                                    loop
                                    playsInline
                                    onMouseOver={e => e.currentTarget.play()}
                                    onMouseOut={e => e.currentTarget.pause()}
                                />
                            ) : (
                                <img
                                    src={item.image_url}
                                    className="w-full h-full object-cover"
                                    alt=""
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Erro';
                                    }}
                                />
                            )}
                        </div>
                        <div className="flex-grow">
                            <h4 className="font-bold text-sm text-background-dark">{item.title}</h4>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest">{item.category}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setEditingItem(item)} className="p-2 text-gray-400 hover:text-primary transition-colors"><Edit2 size={18} /></button>
                            <button onClick={() => deleteItem(item.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
                {items.length === 0 && <p className="col-span-2 text-center text-sm text-gray-400 py-10">Nenhum projeto cadastrado.</p>}
            </div>
        </div>
    );
};

const PartnersSection = () => {
    const [partners, setPartners] = useState<any[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newUrl, setNewUrl] = useState('');

    const fetchItems = async () => {
        const { data } = await supabase.from('site_settings').select('value').eq('key', 'partners_logos');
        if (data?.[0]) setPartners(JSON.parse(data[0].value));
    };

    useEffect(() => { fetchItems(); }, []);

    const savePartners = async (updated: any[]) => {
        await supabase.from('site_settings').upsert({ key: 'partners_logos', value: JSON.stringify(updated) }, { onConflict: 'key' });
        setPartners(updated);
        setIsAdding(false);
        setNewUrl('');
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {partners.map((url, i) => (
                    <div key={i} className="group relative aspect-square bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center p-6">
                        <img src={url} className="w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all opacity-40 group-hover:opacity-100" alt="" />
                        <div className="absolute inset-0 bg-background-dark/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                            <button onClick={() => savePartners(partners.filter((_, idx) => idx !== i))} className="text-white hover:text-red-400"><Trash2 size={20} /></button>
                        </div>
                    </div>
                ))}
                {!isAdding ? (
                    <button onClick={() => setIsAdding(true)} className="aspect-square bg-white border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-all gap-2">
                        <Plus size={24} />
                        <span className="text-xs font-bold">Nova Logo</span>
                    </button>
                ) : (
                    <div className="col-span-2 bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-4">
                        <SmartUpload label="Logo do Parceiro" value={newUrl} onChange={setNewUrl} hint="Recomendado: PNG Transparente" />
                        <div className="flex gap-2">
                            <Button onClick={() => savePartners([...partners, newUrl])} className="flex-1 py-2 text-xs">Adicionar</Button>
                            <Button variant="secondary" onClick={() => setIsAdding(false)} className="flex-1 py-2 text-xs">Cancelar</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const TestimonialsSection = () => {
    const [items, setItems] = useState<any[]>([]);
    const [editingItem, setEditingItem] = useState<any>(null);

    const fetchItems = async () => {
        const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
        if (data) setItems(data);
    };

    useEffect(() => { fetchItems(); }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.from('testimonials').upsert(editingItem);
        if (!error) {
            setEditingItem(null);
            fetchItems();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-background-dark">Gerenciar Depoimentos</h3>
                {!editingItem && (
                    <Button variant="secondary" onClick={() => setEditingItem({ author: '', role: '', quote: '', image_url: '' })} className="text-xs py-2 h-auto flex items-center gap-2">
                        <Plus size={14} /> Novo Depoimento
                    </Button>
                )}
            </div>

            {editingItem && (
                <form onSubmit={handleSave} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-400 mb-2 block">Nome</label>
                                    <input required value={editingItem.author} onChange={e => setEditingItem({ ...editingItem, author: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-400 mb-2 block">Função/Clínica</label>
                                    <input value={editingItem.role} onChange={e => setEditingItem({ ...editingItem, role: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-gray-400 mb-2 block">Depoimento</label>
                                <textarea required rows={4} value={editingItem.quote} onChange={e => setEditingItem({ ...editingItem, quote: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
                            </div>
                        </div>
                        <SmartUpload label="Avatar do Cliente" value={editingItem.image_url} onChange={(val) => setEditingItem({ ...editingItem, image_url: val })} hint="Dimensão: 200x200px (Quadrado)" />
                    </div>
                    <div className="flex gap-4">
                        <Button type="submit" className="flex-1">Salvar Depoimento</Button>
                        <Button variant="secondary" onClick={() => setEditingItem(null)} className="flex-1">Cancelar</Button>
                    </div>
                </form>
            )}

            {items.map(item => (
                <div key={item.id} className="p-6 bg-white rounded-2xl border border-gray-100 space-y-4 group hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-100">
                                <img src={item.image_url} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div>
                                <h4 className="font-bold text-background-dark text-sm">{item.author}</h4>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest">{item.role}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setEditingItem(item)} className="p-2 text-gray-400 hover:text-primary transition-colors"><Edit2 size={18} /></button>
                            <button onClick={async () => { if (confirm('Excluir?')) { await supabase.from('testimonials').delete().eq('id', item.id); fetchItems(); } }} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 italic leading-relaxed">"{item.quote}"</p>
                </div>
            ))}
        </div>
    );
};

const UploadsGallery = () => {
    const [files, setFiles] = useState<any[]>([]);

    useEffect(() => {
        getGalleryFiles().then(setFiles);
    }, []);

    const deleteFile = async (id: string) => {
        if (confirm('Excluir este arquivo da galeria?')) {
            await supabase.from('uploads_gallery').delete().eq('id', id);
            getGalleryFiles().then(setFiles);
        }
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {files.map((file) => (
                <div key={file.id} className="group relative aspect-square bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    {file.type?.includes('video') ? (
                        <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary"><Video size={32} /></div>
                    ) : (
                        <img src={file.url} className="w-full h-full object-cover" alt="" />
                    )}
                    <div className="absolute inset-0 bg-background-dark/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-center">
                        <p className="text-[10px] text-white font-bold truncate w-full mb-3">{file.name}</p>
                        <div className="flex gap-3">
                            <button onClick={() => window.open(file.url, '_blank')} className="text-white hover:text-primary"><FolderOpen size={18} /></button>
                            <button onClick={() => deleteFile(file.id)} className="text-white hover:text-red-400"><Trash2 size={18} /></button>
                        </div>
                    </div>
                </div>
            ))}
            <div className="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                <Upload size={24} className="mb-2" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Use o SmartUpload em outras abas</span>
            </div>
        </div>
    );
};

export default AdminDashboard;
