import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'outline' | 'white' | 'glass' | 'secondary';
  icon?: React.ReactNode;
}

export const Button = ({ children, variant = 'primary', icon, className = '', ...props }: ButtonProps) => {
  const baseClasses = "relative px-8 py-3.5 rounded-full font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group";

  const variants = {
    primary: "bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:bg-primary-dark",
    outline: "border border-primary text-primary hover:bg-primary hover:text-white",
    white: "bg-white text-background-dark shadow-xl hover:bg-gray-100",
    glass: "bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20",
    secondary: "bg-gray-100 text-background-dark hover:bg-gray-200"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {icon && <span className="text-xl">{icon}</span>}
        {children as React.ReactNode}
      </span>
      {variant === 'primary' && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
      )}
    </motion.button>
  );
};
