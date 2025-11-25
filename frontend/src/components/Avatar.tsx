import { User } from 'lucide-react';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallbackColor?: string;
  onClick?: () => void;
}

const Avatar = ({
  src,
  alt,
  name,
  size = 'md',
  className = '',
  fallbackColor = 'bg-primary-100',
  onClick,
}: AvatarProps) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };

  const iconSizes = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  };

  const getInitials = (name?: string): string => {
    if (!name) return '';

    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);

  const baseClasses = `
    ${sizeClasses[size]}
    rounded-full
    flex items-center justify-center
    font-semibold
    overflow-hidden
    ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
    ${className}
  `;

  if (src) {
    return (
      <div
        className={baseClasses}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Se a imagem falhar ao carregar, esconde ela
            e.currentTarget.style.display = 'none';
          }}
        />
        {/* Fallback caso a imagem não carregue */}
        {initials && (
          <div className={`w-full h-full ${fallbackColor} flex items-center justify-center text-primary-600`}>
            {initials}
          </div>
        )}
      </div>
    );
  }

  if (initials) {
    return (
      <div
        className={`${baseClasses} ${fallbackColor} text-primary-600`}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        title={name}
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${fallbackColor} text-primary-600`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <User size={iconSizes[size]} />
    </div>
  );
};

export default Avatar;
