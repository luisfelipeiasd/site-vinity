import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Settings {
    header_logo: string;
    footer_logo: string;
    hero_banner: string;
}

interface SettingsContextType {
    settings: Settings;
    loading: boolean;
    updateSetting: (key: keyof Settings, value: string) => Promise<void>;
    refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>({
        header_logo: '',
        footer_logo: '',
        hero_banner: ''
    });
    const [loading, setLoading] = useState(true);

    const refreshSettings = async () => {
        try {
            const { data, error } = await supabase.from('site_settings').select('key, value');
            if (error) throw error;

            const newSettings = { ...settings };
            data?.forEach((item: { key: string, value: string }) => {
                if (item.key in newSettings) {
                    // @ts-ignore
                    newSettings[item.key] = item.value;
                }
            });
            setSettings(newSettings);
        } catch (err) {
            console.error('Erro ao carregar configurações:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateSetting = async (key: keyof Settings, value: string) => {
        try {
            const { error } = await supabase
                .from('site_settings')
                .upsert({ key, value }, { onConflict: 'key' });

            if (error) throw error;
            setSettings(prev => ({ ...prev, [key]: value }));
        } catch (err) {
            console.error('Erro ao atualizar configuração:', err);
            throw err;
        }
    };

    useEffect(() => {
        refreshSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, loading, updateSetting, refreshSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error('useSettings deve ser usado dentro de um SettingsProvider');
    return context;
};
