import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const WhatsAppWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const phoneNumber = "5562984077910";
    const message = "Olá! Gostaria de saber mais sobre os serviços da Vinity.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    const handleOpen = () => {
        window.open(whatsappUrl, '_blank');
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-2xl w-[300px] overflow-hidden border border-gray-100 mb-2"
                    >
                        <div className="bg-[#00a884] p-4 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <MessageCircle size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Vinity</h3>
                                    <p className="text-xs opacity-90">Responde rápido</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-4 bg-[#e5ddd5] min-h-[150px] relative">
                            <div className="bg-white p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-sm max-w-[85%] text-sm text-gray-800 mb-2">
                                Olá! 👋 <br />
                                Como podemos ajudar a transformar sua clínica em uma marca de desejo hoje?
                                <span className="text-[10px] text-gray-400 block text-right mt-1">Agora</span>
                            </div>
                        </div>

                        <div className="p-3 bg-white border-t border-gray-100">
                            <button
                                onClick={handleOpen}
                                className="w-full bg-[#00a884] hover:bg-[#008f6f] text-white py-2.5 rounded-full font-medium text-sm transition-colors flex items-center justify-center gap-2"
                            >
                                <Send size={16} />
                                Iniciar Conversa
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#25D366]/30 hover:shadow-xl transition-all relative group"
            >
                <MessageCircle size={30} strokeWidth={2} />
                {/* Pulsing effect */}
                <span className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping group-hover:hidden"></span>
            </motion.button>
        </div>
    );
};
