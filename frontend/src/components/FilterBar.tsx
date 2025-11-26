import { Search, Filter, Download } from 'lucide-react';
import { FilterPeriod } from '../types';
import { responsibleOptions } from '../data/mockData';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  period: FilterPeriod;
  onPeriodChange: (value: FilterPeriod) => void;
  responsible: string;
  onResponsibleChange: (value: string) => void;
}

export default function FilterBar({
  searchTerm,
  onSearchChange,
  period,
  onPeriodChange,
  responsible,
  onResponsibleChange,
}: FilterBarProps) {
  const periods: FilterPeriod[] = ['Week', 'Month', 'Quarter', 'Year'];
  const periodLabels: Record<FilterPeriod, string> = {
    Week: 'Semana',
    Month: 'Mês',
    Quarter: 'Trimestre',
    Year: 'Ano',
  };

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar cursos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field pl-11 w-full"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => onPeriodChange(e.target.value as FilterPeriod)}
            className="input-field cursor-pointer"
          >
            {periods.map((p) => (
              <option key={p} value={p}>
                {periodLabels[p]}
              </option>
            ))}
          </select>

          <select
            value={responsible}
            onChange={(e) => onResponsibleChange(e.target.value)}
            className="input-field cursor-pointer"
          >
            {responsibleOptions.map((option) => (
              <option key={option} value={option}>
                {option === 'All' ? 'Todos' : option}
              </option>
            ))}
          </select>

          <button className="btn-secondary flex items-center gap-2">
            <Filter size={18} />
            <span>Filtros</span>
          </button>

          <button className="btn-secondary flex items-center gap-2">
            <Download size={18} />
            <span>Exportar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
