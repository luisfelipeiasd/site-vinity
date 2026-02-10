import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Diamond, CheckCircle2, BookOpen, ChevronLeft, ChevronRight, Video, Palette, Globe, TrendingUp, Play, ArrowRight, MessageCircle } from 'lucide-react';
import { Reveal } from '../components/ui/Reveal';
import { Button } from '../components/ui/Button';
import { IMAGES, PROJECTS, SERVICES, TESTIMONIALS } from '../constants';
import { useSettings } from '../context/SettingsContext';
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';

const Home = () => {
  const { settings } = useSettings();
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);
  const [mainTestimonial, setMainTestimonial] = useState<any>(null);
  const [dynamicServices, setDynamicServices] = useState<any[]>([]);

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/5562984077910?text=${encodeURIComponent("Olá! Gostaria de agendar uma consultoria.")}`, '_blank');
  };

  const handleScrollToPortfolio = () => {
    const element = document.getElementById('portfolio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: projData } = await supabase.from('portfolio').select('*').limit(5).order('created_at', { ascending: false });
      const { data: testData } = await supabase.from('testimonials').select('*').limit(1).order('created_at', { ascending: false });
      const { data: servData } = await supabase.from('services').select('*').order('order_index', { ascending: true });

      if (projData) setFeaturedProjects(projData);
      if (testData?.[0]) setMainTestimonial(testData[0]);
      if (servData) setDynamicServices(servData);
    };
    fetchData();
  }, []);

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="relative w-full h-[95vh] min-h-[600px] md:min-h-[850px] flex items-center justify-center overflow-hidden bg-background-dark pb-20 md:pb-40">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-60 scale-105 animate-[kenburns_20s_infinite_alternate]"
          style={{ backgroundImage: `url('${settings.hero_banner || IMAGES.HERO}')` }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-background-dark/90 via-background-dark/40 to-black/30" />

        <div className="relative z-20 container mx-auto px-6 text-center text-white flex flex-col items-center gap-8 max-w-5xl pt-20">

          <Reveal delay={0.4}>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium leading-[1.1] mb-6 tracking-tight">
              Vinity: Transformando sua Clínica em uma <span className="italic text-primary font-serif">Marca de Desejo</span>
            </h1>
          </Reveal>

          <Reveal delay={0.6}>
            <p className="text-lg md:text-xl font-light text-white/80 max-w-2xl mx-auto leading-relaxed mb-10">
              Especialistas em produção audiovisual e branding estratégico para o mercado de saúde de alto padrão. Elevamos sua autoridade através de narrativas cinematográficas.
            </p>
          </Reveal>

          <Reveal delay={0.8} direction="up">
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button variant="white" onClick={handleScrollToPortfolio}>Ver Nossos Resultados</Button>
              <Button variant="glass" icon={<MessageCircle size={20} />} onClick={handleWhatsAppClick}>Entrar em Contato</Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Floating Cards (Pain Points) */}
      <section className="relative z-30 -mt-10 md:-mt-20 px-6 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Diamond size={24} />,
              title: "Atraia Pacientes Qualificados",
              desc: "Deixe de competir por preço. Posicione-se como a única escolha lógica para o público high-ticket."
            },
            {
              icon: <CheckCircle2 size={24} />,
              title: "Autoridade Instantânea",
              desc: "Sua presença digital deve refletir a excelência do seu atendimento presencial. Criamos percepção de valor."
            },
            {
              icon: <BookOpen size={24} />,
              title: "Storytelling que Conecta",
              desc: "Transformamos casos clínicos em narrativas emocionantes que geram desejo e confiança."
            }
          ].map((item, index) => (
            <Reveal key={index} delay={0.2 * index} direction="up" width="100%">
              <div className="h-full group bg-white/90 backdrop-blur-xl border border-white/50 p-8 md:p-10 rounded-3xl shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {item.icon}
                </div>
                <h3 className="font-serif text-2xl font-bold text-background-dark mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Services Bento Grid */}
      <section id="servicos" className="py-32 bg-warm-beige px-6 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-16 text-center w-full" width="100%">
            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">Nossas Soluções</span>
            <h2 className="font-serif text-4xl md:text-6xl font-medium text-background-dark">Excelência em Cada Detalhe</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-auto md:auto-rows-[350px]">
            {(dynamicServices.length > 0 ? dynamicServices : SERVICES).map((service, index) => (
              <Reveal
                key={service.id}
                delay={index * 0.1}
                className={`${service.span ? 'md:col-span-2' : ''} h-full w-full`}
                width="100%"
              >
                <a href="#servicos" className="block h-full group">
                  {service.image_url || service.image ? (
                    <div className="relative h-[300px] md:h-full w-full rounded-3xl overflow-hidden shadow-lg cursor-pointer">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url('${service.image_url || service.image}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-10 text-white">
                        <div className="mb-4 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                          {service.icon === 'Video' && <Video size={20} />}
                          {service.icon === 'TrendingUp' && <TrendingUp size={20} />}
                          {service.icon === 'Palette' && <Palette size={20} />}
                          {service.icon === 'Globe' && <Globe size={20} />}
                          {service.icon === 'Diamond' && <Diamond size={20} />}
                        </div>
                        <h3 className="font-serif text-3xl font-bold mb-2">{service.title}</h3>
                        <p className="text-white/80 text-sm max-w-md">{service.description}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-[#e4e3dc] flex flex-col justify-between group-hover:border-primary/50 transition-colors py-12 md:py-10">
                      <div className="w-14 h-14 rounded-full bg-background-light flex items-center justify-center text-background-dark group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                        {service.icon === 'Palette' && <Palette size={24} />}
                        {service.icon === 'Globe' && <Globe size={24} />}
                        {service.icon === 'TrendingUp' && <TrendingUp size={24} />}
                        {service.icon === 'Video' && <Video size={24} />}
                        {service.icon === 'Diamond' && <Diamond size={24} />}
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl font-bold text-background-dark mb-4">{service.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                      </div>
                    </div>
                  )}
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section id="portfolio" className="py-32 bg-porcelain px-6 scroll-mt-24">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="flex flex-col items-center mb-16 text-center">
            <Reveal width="100%" className="flex flex-col items-center">
              <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">Portfólio</span>
              <h2 className="font-serif text-4xl md:text-6xl font-medium text-background-dark">Nossas Obras-Primas</h2>
            </Reveal>
          </div>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 w-full">
            {featuredProjects.map((project, index) => (
              <Reveal key={project.id} delay={index * 0.1} width="100%">
                <Link to="/portfolio" className="relative group block break-inside-avoid rounded-3xl overflow-hidden shadow-lg cursor-pointer">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transform scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                      <Play size={32} fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                    <span className="text-primary text-xs font-bold tracking-wider uppercase">{project.tag}</span>
                    <h3 className="text-white font-serif text-2xl mt-1">{project.title}</h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="flex justify-center mt-16">
            <Reveal delay={0.2} width="100%" className="flex justify-center">
              <Link
                to="/portfolio"
                className="group flex items-center gap-2 text-background-dark font-bold border-b-2 border-primary pb-1 hover:text-primary transition-colors"
                onClick={() => window.scrollTo(0, 0)}
              >
                Ver Portfólio Completo
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="depoimentos" className="py-32 bg-warm-beige border-t border-[#e4e3dc] scroll-mt-24">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal className="text-center mb-12 w-full" width="100%">
            <p className="text-background-dark/60 font-semibold uppercase tracking-widest text-sm">Clínicas que confiam na Vinity</p>
          </Reveal>

          <div className="flex flex-wrap justify-center gap-10 md:gap-20 opacity-40 mb-24 grayscale">
            {['LUMINÉ', 'DERMA+', 'VITALIS', 'ORAL ART'].map((brand, i) => (
              <div key={i} className="flex items-center gap-2 text-2xl font-serif font-bold text-background-dark">
                <Diamond size={20} className="text-background-dark" /> {brand}
              </div>
            ))}
          </div>

          {mainTestimonial && (
            <Reveal width="100%">
              <div className="relative bg-white p-8 md:p-20 rounded-3xl shadow-2xl text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
                  <span className="text-4xl font-serif">"</span>
                </div>

                <p className="font-serif text-xl md:text-3xl italic text-background-dark leading-relaxed mb-10">
                  {mainTestimonial.quote}
                </p>

                <div className="flex items-center justify-center gap-5">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20">
                    <img src={mainTestimonial.image_url} alt={mainTestimonial.author} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-background-dark text-base">{mainTestimonial.author}</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">{mainTestimonial.role}</p>
                  </div>
                </div>

                {/* Slider Controls (Visual Only for now since we just show the first one) */}
                <button aria-label="Depoimento anterior" className="absolute top-1/2 -left-6 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg hidden md:flex items-center justify-center text-background-dark hover:bg-primary hover:text-white transition-colors cursor-pointer">
                  <ChevronLeft size={24} />
                </button>
                <button aria-label="Próximo depoimento" className="absolute top-1/2 -right-6 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg hidden md:flex items-center justify-center text-background-dark hover:bg-primary hover:text-white transition-colors cursor-pointer">
                  <ChevronRight size={24} />
                </button>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 bg-deep-teal overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#006666] to-transparent opacity-30" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary rounded-full blur-[150px] opacity-20" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <Reveal width="100%">
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Pronto para elevar o padrão da sua clínica?
            </h2>
          </Reveal>
          <Reveal delay={0.2} width="100%">
            <p className="text-white/80 text-xl mb-12 max-w-2xl mx-auto font-light">
              Não seja apenas mais uma opção no mercado. Torne-se a referência incontestável em sua especialidade.
            </p>
          </Reveal>
          <Reveal delay={0.4} width="100%" className="flex justify-center">
            <Button variant="primary" className="text-lg px-12 py-5" onClick={handleWhatsAppClick}>Quero Ser Uma Autoridade Digital</Button>
          </Reveal>
        </div>
      </section>
    </main>
  );
};

export default Home;