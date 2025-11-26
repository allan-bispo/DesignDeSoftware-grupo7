import { X } from 'lucide-react';

export type TagVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'purple'
  | 'pink'
  | 'orange';

export type TagSize = 'sm' | 'md' | 'lg';

interface TagProps {
  children: React.ReactNode;
  variant?: TagVariant;
  size?: TagSize;
  outlined?: boolean;
  rounded?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

const Tag = ({
  children,
  variant = 'default',
  size = 'md',
  outlined = false,
  rounded = false,
  removable = false,
  onRemove,
  onClick,
  className = '',
  icon,
}: TagProps) => {
  const variantClasses = {
    default: outlined
      ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
      : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200',
    primary: outlined
      ? 'bg-white border-primary-500 text-primary-700 hover:bg-primary-50'
      : 'bg-primary-100 text-primary-700 border-primary-200 hover:bg-primary-200',
    success: outlined
      ? 'bg-white border-green-500 text-green-700 hover:bg-green-50'
      : 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200',
    warning: outlined
      ? 'bg-white border-yellow-500 text-yellow-700 hover:bg-yellow-50'
      : 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200',
    danger: outlined
      ? 'bg-white border-red-500 text-red-700 hover:bg-red-50'
      : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200',
    info: outlined
      ? 'bg-white border-blue-500 text-blue-700 hover:bg-blue-50'
      : 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200',
    purple: outlined
      ? 'bg-white border-purple-500 text-purple-700 hover:bg-purple-50'
      : 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200',
    pink: outlined
      ? 'bg-white border-pink-500 text-pink-700 hover:bg-pink-50'
      : 'bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200',
    orange: outlined
      ? 'bg-white border-orange-500 text-orange-700 hover:bg-orange-50'
      : 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  const baseClasses = `
    inline-flex items-center
    font-medium
    border
    transition-colors
    ${rounded ? 'rounded-full' : 'rounded-md'}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  return (
    <span
      className={baseClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {icon && (
        <span className="flex-shrink-0">
          {icon}
        </span>
      )}
      <span className="truncate">{children}</span>
      {removable && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="flex-shrink-0 hover:opacity-70 transition-opacity ml-0.5"
          aria-label="Remover tag"
        >
          <X size={iconSizes[size]} />
        </button>
      )}
    </span>
  );
};

export default Tag;

// Helper components para casos de uso específicos

interface StatusTagProps {
  status: 'pending' | 'in_progress' | 'completed' | 'paused' | 'cancelled';
  size?: TagSize;
  outlined?: boolean;
}

export const StatusTag = ({ status, size = 'md', outlined = false }: StatusTagProps) => {
  const statusConfig = {
    pending: { label: 'Pendente', variant: 'default' as TagVariant },
    in_progress: { label: 'Em Andamento', variant: 'info' as TagVariant },
    completed: { label: 'Concluído', variant: 'success' as TagVariant },
    paused: { label: 'Pausado', variant: 'warning' as TagVariant },
    cancelled: { label: 'Cancelado', variant: 'danger' as TagVariant },
  };

  const config = statusConfig[status];

  return (
    <Tag variant={config.variant} size={size} outlined={outlined}>
      {config.label}
    </Tag>
  );
};

interface PriorityTagProps {
  priority: 'low' | 'medium' | 'high' | 'urgent';
  size?: TagSize;
  outlined?: boolean;
}

export const PriorityTag = ({ priority, size = 'md', outlined = false }: PriorityTagProps) => {
  const priorityConfig = {
    low: { label: 'Baixa', variant: 'default' as TagVariant },
    medium: { label: 'Média', variant: 'warning' as TagVariant },
    high: { label: 'Alta', variant: 'orange' as TagVariant },
    urgent: { label: 'Urgente', variant: 'danger' as TagVariant },
  };

  const config = priorityConfig[priority];

  return (
    <Tag variant={config.variant} size={size} outlined={outlined}>
      {config.label}
    </Tag>
  );
};

interface CategoryTagProps {
  category: string;
  variant?: TagVariant;
  size?: TagSize;
  outlined?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const CategoryTag = ({
  category,
  variant = 'primary',
  size = 'md',
  outlined = false,
  removable = false,
  onRemove,
  onClick,
  icon,
  className,
}: CategoryTagProps) => {
  return (
    <Tag
      variant={variant}
      size={size}
      outlined={outlined}
      removable={removable}
      onRemove={onRemove}
      onClick={onClick}
      icon={icon}
      className={className}
    >
      {category}
    </Tag>
  );
};
