import { Project, Service, Testimonial } from './types';

// Images from the provided HTML
export const IMAGES = {
  HERO: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxqEcIPZD59G6Fy4SqFkXSrIgoLaVMI3m1IuiuFAhKDjmvcZXfcCPLhxX8nieHTC2nz_S3MkK13pI_ifE4WoRiMehyQd8WhnzUYPcwP98gy3wnpl9voXowV5tI-A8uP0bvBuhoBjstckNiUZRryifJboSBqlG3dtgXmVDZRLppHiybAwHBb1pjXqjwTGQA-ePPF-arMQTGStCD8jdVZ6I0qiFhXmnk4-0s_1Nwaymej3BCW9zEPqoq28IpfktSLT0_peCC8XQ0BL8",
  SERVICE_VIDEO: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfmMYEJu4fnS1A2AHit1_G6uaAZXHrLXJ-7KkCBIXJB1v1luZUgw-mLiPYYcf6nr5DHcS-QWMz59gEaoki-YisiXzRbuxcXr_BS5GktLk_fH1t7YGH7wk1gTgbH4ICFBgJ7I1533Tb3PmEpkMA1LX6PtzqQskw8mPQyw5AqjoIyXbyidEDnBBfS0pFCovqhAQVl369zF_472e3BYWlapYv9MfvluZlET4S0ZpFRbbBdFwho4_TEfDqv4VFH0B-v9NSWkgAxVhmkwA",
  SERVICE_STRATEGY: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3YyDtAM4UAQyFWVihELcsd2SbtASB2jkaS0RpsKJy_RsVMAKQXCN3odVw-i6RZ5Nq4y5Skn7mZHGhg9HmzA-KI69QmxckIAfLuY0Q3o8At8nK8ebgGVCkV1JdY4H6p7X-uPtbEojXPZom3yjZPfLsWmiFuCkt_qSAJwu8vu1taS8K9mXIsx-erAYN2QaUTlvQx_LyOOYVmYvOsVLco8j1FfeJTxjdvMLbIyx8LNl3TAvTPp0Ujy7Z8ghiAIP1hddY3eeN-Z1xirE",
  PORTFOLIO_CLINIC: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5VZqtVeKbd82tEaM_5KynPlQB8HinXWtE24QmewQVCzplKUbde6Z27tBe5BtB_noTLgBfqVTJNxZgcLuyt5G4XTGMKj883vbYwjzlPuxwPCB0BkZJOtK50elk_tFsnTUO6EGg6arSfpLrVrH6aGgd7JsgSOEqzvEDW39YxJbcnp7KiMOSQZR5TjfVMb9D06bsQHauw9d1E9Z56x8jpedmC6viOqQHK02HY_AgC2hGLGZaKkxJ7Q4dkX8ivqpjgUe-kKTyK4Dwf6I",
  PORTFOLIO_RECEPTION: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZjzIK2QfSq_kVX0MXa6zPthhkFcpZ1syU5wHWnttaGf9gBySQDfjWVVVVNr97gDRlHU1mnP4jiks9ahzB2rEWBDj350QR0-AaaFIMPEIkGSc4jtn279LUPeMzYW-2Z_F8HdzRF2uQ0BwCqgfZ8kGgktJSfs7sN5cZGO7otBLSLrUIzzB8FTC-bRMuMRFrsz5N2or-FkwNBQITs2A6PwGAdSc7XR2Xg1Yet_Vig77oYBeMYNIN2IpIn9HCd160hR4vhVuddBR7FFw",
  PORTFOLIO_DOCTOR: "https://lh3.googleusercontent.com/aida-public/AB6AXuD34WhE1Eo9-NGFuPo_UJx5NgT3ZHPwRctIXEFb2ef77RaDqcK8js8mxH4D71r_GW68P9e7TS9-0ZNjwdSn9JIjz8EAJ_eMfhUNkgZiGlRBoYxR_ELkaasr9N5qAeDw89hy4V1MF7do2UYZWgSjvB7Uqgp216uqOv0gLHKlUVF-_AxG4fgqVorruPh-kX9nuQ8XrkuNdNNeDNBRceHco8V06mlkmeNPJbbfWDQKtXdAMnVtqNrnLKuMFmAB6Gk60UKs9kl6gWZ93js",
  PORTFOLIO_LAPTOP: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaWVf03eowEZja_D5J4pKjE2MYqW3bXo7xrdH7oXBFrup1DBSY0lF6E0HV-73xj2pHNOTjhGFdFFGg1uUy349EWYuOFSxk1wyvFJ18yirjxqQyxZfQk6eAgX8r4eCjTjxhm8xqq4qUvjrMTPwnxSBzwbbbk32nphcutc-__PrMhRpOJPR8DNGayUioSTBrpo8jNPKeXSIMPM5u6ZiEOFNUJEOGXnvQSyGnUU5lAN5kiOe110bVcTXSOejIPjYg_oOMu-uuQVNFMkQ",
  PORTFOLIO_PRODUCT: "https://lh3.googleusercontent.com/aida-public/AB6AXuDx14PfghzfjWlxxdG0gy1Dr6LUzrv8M45rOvGb08FmMuKOlpqGfsJWEqb8E_3mJ4gje2s91SntWBKig34YtAdl3VW2LF0cG5JJP3WPNSvrGIFy7HA0kdyHlo8vCXjnMUw1ns9WuYsJDiS2A7A1-wZRYi-7mlLDzUDonsJGEltJbhjy5gdZCMZwDAAJ40_Kszrct_GgRTK9QD77GDpoWNVZPhoFggXO4Z8eNjj7vK98li8CQFgdyob01638a_UxnyfTlGsvFFN7DAk",
  TESTIMONIAL_USER: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLgM2oox_Ku6JvGB6jRLG_gxfH78R24jyJJsRVfRE_jwom532QNWX2zTOqUOSpoUlBO7ODnqDatjZget5JJ27VPDq43CTkzL-hEwsNtdM_gDn2MH6kocbRQKMquNbfqqxF4Zl9vNMBtmDZlJMuhQDleF5-A2ER2Vrg5kTzDBijpytEieW3SR9EyyKbQXesN0cXMkLivrzFMwl5wJKpgTiYK7pvt8DM5P5m42J47kF6OR2Ru3c1thKJ-NNHmliDUBxBwlsWlNzKqT0"
};

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Clínica Lumini',
    category: 'Vídeos Institucionais',
    tag: 'Cinematic Tour',
    image: IMAGES.PORTFOLIO_CLINIC,
    type: 'video',
    aspect: 'vertical'
  },
  {
    id: '2',
    title: 'Dr. Ricardo Silva',
    category: 'Fotografia Editorial',
    tag: 'Editorial',
    image: IMAGES.PORTFOLIO_DOCTOR,
    type: 'image',
    aspect: 'horizontal'
  },
  {
    id: '3',
    title: 'Laser Lavieen',
    category: 'Reels & Social',
    tag: 'Reels Estratégico',
    image: IMAGES.PORTFOLIO_PRODUCT,
    type: 'video',
    aspect: 'vertical'
  },
  {
    id: '4',
    title: 'Espaço Vitalis',
    category: 'Branding & Design',
    tag: 'Arquitetura',
    image: IMAGES.PORTFOLIO_RECEPTION,
    type: 'image',
    aspect: 'square'
  },
  {
    id: '5',
    title: 'Hospital Santa Clara',
    category: 'Vídeos Institucionais',
    tag: 'Institucional',
    image: IMAGES.SERVICE_VIDEO,
    type: 'video',
    aspect: 'horizontal'
  },
  {
    id: '6',
    title: 'Harmonização Facial',
    category: 'Reels & Social',
    tag: 'Reels Viral',
    image: IMAGES.PORTFOLIO_LAPTOP,
    type: 'video',
    aspect: 'vertical'
  },
  // Extra data for filter demo
  {
    id: '7',
    title: 'Web Design Moderno',
    category: 'Websites',
    tag: 'UX/UI',
    image: IMAGES.SERVICE_STRATEGY,
    type: 'image',
    aspect: 'horizontal'
  }
];

export const SERVICES: Service[] = [
  {
    id: '1',
    title: 'Produção Audiovisual Cinematic',
    description: 'Filmes institucionais, reels e documentários com qualidade de cinema para sua clínica.',
    icon: 'Video',
    image: IMAGES.SERVICE_VIDEO,
    span: true
  },
  {
    id: '2',
    title: 'Design & Identidade Visual',
    description: 'Branding que exala sofisticação. Logotipos, paletas de cores e materiais gráficos que transmitem confiança.',
    icon: 'Palette',
    span: false
  },
  {
    id: '3',
    title: 'Websites de Alta Conversão',
    description: 'Experiência digital fluida, rápida e persuasiva, otimizada para captar leads qualificados.',
    icon: 'Globe',
    span: false
  },
  {
    id: '4',
    title: 'Estratégia de Conteúdo Digital',
    description: 'Planejamento editorial inteligente para manter sua audiência engajada e desejando seus serviços.',
    icon: 'TrendingUp',
    image: IMAGES.SERVICE_STRATEGY,
    span: true
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    quote: "O trabalho da Vinity foi um divisor de águas para minha clínica. O vídeo institucional capturou a essência do nosso atendimento de uma forma que eu nunca imaginei ser possível.",
    author: "Dra. Juliana Mendes",
    role: "Dermatologista - Clínica Luminé",
    image: IMAGES.TESTIMONIAL_USER
  }
];
