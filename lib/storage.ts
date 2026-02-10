import { supabase } from './supabase';

export const uploadFile = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
        .from('assets')
        .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);

    // Registrar na tabela de uploads para a galeria do admin
    await supabase.from('uploads_gallery').insert({
        name: file.name,
        url: publicUrl,
        size: file.size,
        type: file.type
    });

    return publicUrl;
};

export const getGalleryFiles = async () => {
    const { data, error } = await supabase
        .from('uploads_gallery')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};
