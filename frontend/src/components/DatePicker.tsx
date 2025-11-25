import { forwardRef } from 'react';
import { Calendar } from 'lucide-react';
import { format, parse } from 'date-fns';

interface DatePickerProps {
  label?: string;
  value?: string | Date;
  onChange?: (date: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  minDate?: string;
  maxDate?: string;
  className?: string;
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      label,
      value,
      onChange,
      placeholder = 'Selecione uma data',
      disabled = false,
      error,
      required = false,
      minDate,
      maxDate,
      className = '',
    },
    ref
  ) => {
    const formatDateValue = (date: string | Date | undefined): string => {
      if (!date) return '';

      try {
        if (typeof date === 'string') {
          // Se já está no formato yyyy-MM-dd, retorna direto
          if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return date;
          }
          // Tenta fazer parse de outros formatos
          const parsedDate = parse(date, 'dd/MM/yyyy', new Date());
          return format(parsedDate, 'yyyy-MM-dd');
        }
        return format(date, 'yyyy-MM-dd');
      } catch {
        return '';
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };

    const inputId = label ? label.toLowerCase().replace(/\s+/g, '-') : undefined;

    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type="date"
            value={formatDateValue(value)}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            min={minDate}
            max={maxDate}
            placeholder={placeholder}
            className={`
              w-full px-4 py-2 pr-10
              border rounded-lg
              text-gray-900 text-sm
              transition-colors
              focus:outline-none focus:ring-2 focus:ring-primary-500
              disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
              ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
            `}
          />
          <Calendar
            size={18}
            className={`
              absolute right-3 top-1/2 -translate-y-1/2
              pointer-events-none
              ${disabled ? 'text-gray-400' : 'text-gray-500'}
            `}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;
