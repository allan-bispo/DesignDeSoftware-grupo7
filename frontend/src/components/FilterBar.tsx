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

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => onPeriodChange(e.target.value as FilterPeriod)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            {periods.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          
          <select
            value={responsible}
            onChange={(e) => onResponsibleChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            {responsibleOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={18} />
            Filters
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
