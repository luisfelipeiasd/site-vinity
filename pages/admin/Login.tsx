import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Reveal } from '../../components/ui/Reveal';
import { Button } from '../../components/ui/Button';
import { LogIn, Mail, Lock, Gem, AlertCircle } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            navigate('/admin');
        } catch (err: any) {
            setError(err.message || 'Erro ao realizar login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5F3] flex items-center justify-center px-6 py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,53,0.08),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,77,77,0.05),transparent_50%)]" />

            <div className="w-full max-w-md relative z-10">
                <Reveal direction="down">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white shadow-xl shadow-primary/10 text-primary mb-6">
                            <Gem size={40} strokeWidth={1.5} />
                        </div>
                        <h1 className="font-serif text-3xl font-bold text-background-dark">Acesso Restrito</h1>
                        <p className="text-gray-400 mt-2 text-sm">Entre com suas credenciais para gerenciar a Vinity.</p>
                    </div>
                </Reveal>

                <Reveal delay={0.2}>
                    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-white shadow-primary/5">
                        <form onSubmit={handleLogin} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-fade-in">
                                    <AlertCircle size={20} />
                                    <span className="text-xs font-medium">{error}</span>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-4">E-mail</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="exemplo@vinity.com"
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-4">Senha</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full py-4 rounded-2xl text-base shadow-xl shadow-primary/20"
                                disabled={loading}
                            >
                                {loading ? 'Verificando...' : <><LogIn size={20} /> Acessar Painel</>}
                            </Button>
                        </form>
                    </div>
                </Reveal>

                <Reveal delay={0.4}>
                    <div className="text-center mt-8">
                        <a href="/" className="text-gray-400 hover:text-primary text-xs font-bold uppercase tracking-widest transition-colors">
                            Voltar para o site
                        </a>
                    </div>
                </Reveal>
            </div>
        </div>
    );
};

export default Login;
