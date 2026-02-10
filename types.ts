export interface Project {
  id: string;
  title: string;
  category: string;
  image_url: string;
  type: 'video' | 'image';
  description?: string;
  tag?: string;
  aspect: 'vertical' | 'horizontal' | 'square';
  created_at?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
  span?: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  image_url: string;
  created_at?: string;
}
