import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { ExternalLink, User, Calendar as CalendarIcon, ArrowUpDown, ArrowUp, ArrowDown, X, Check } from 'lucide-react';
import Header from '../components/Header';
import FilterBar from '../components/FilterBar';
import CourseDetailsModal from '../components/CourseDetailsModal';
import { mockCourses, responsibleOptions } from '../data/mockData';
import { Course, FilterPeriod } from '../types';

type SortField = 'deliveryDate' | 'completion' | 'responsible' | null;
type SortOrder = 'asc' | 'desc';
type EditingField = { courseId: string; field: 'responsible' | 'deliveryDate' } | null;

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [period, setPeriod] = useState<FilterPeriod>('Week');
  const [responsible, setResponsible] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [editingField, setEditingField] = useState<EditingField>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [filteredResponsibles, setFilteredResponsibles] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const editRef = useRef<HTMLDivElement>(null);

  const handleOpenDetails = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const handleUpdateCourse = (updatedCourse: Course) => {
    setCourses(courses.map(course =>
      course.id === updatedCourse.id ? updatedCourse : course
    ));
    setSelectedCourse(updatedCourse);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleStartEdit = (courseId: string, field: 'responsible' | 'deliveryDate', currentValue: string | Date) => {
    setEditingField({ courseId, field });

    if (field === 'deliveryDate' && currentValue instanceof Date) {
      setEditValue(format(currentValue, 'yyyy-MM-dd'));
    } else {
      setEditValue(String(currentValue));
    }

    // Initialize filtered responsibles for autocomplete
    if (field === 'responsible') {
      setFilteredResponsibles(responsibleOptions.filter(opt => opt !== 'All'));
      setShowDropdown(true);
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue('');
    setFilteredResponsibles([]);
    setShowDropdown(false);
  };

  const handleResponsibleSearch = (searchText: string) => {
    setEditValue(searchText);

    // Filter responsibles based on search text
    const filtered = responsibleOptions
      .filter(opt => opt !== 'All')
      .filter(opt => opt.toLowerCase().includes(searchText.toLowerCase()));

    setFilteredResponsibles(filtered);
    setShowDropdown(true);
  };

  const handleSelectResponsible = (responsible: string) => {
    setEditValue(responsible);
    setShowDropdown(false);
  };

  const calculateCompletion = (course: Course): number => {
    if (!course.checklist || course.checklist.length === 0) return 0;
    const completedCount = course.checklist.filter(item => item.completed).length;
    return Math.round((completedCount / course.checklist.length) * 100);
  };

  const handleSaveEdit = () => {
    if (!editingField) return;

    setCourses(courses.map(course => {
      if (course.id === editingField.courseId) {
        const updatedCourse = { ...course };

        switch (editingField.field) {
          case 'responsible':
            updatedCourse.responsible = editValue;
            break;
          case 'deliveryDate':
            const newDate = new Date(editValue);
            if (!isNaN(newDate.getTime())) {
              updatedCourse.deliveryDate = newDate;
            }
            break;
        }

        return updatedCourse;
      }
      return course;
    }));

    handleCancelEdit();
  };

  // Close edit modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editRef.current && !editRef.current.contains(event.target as Node)) {
        handleCancelEdit();
      }
    };

    if (editingField) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [editingField]);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesResponsible = responsible === 'All' || course.responsible === responsible;

    return matchesSearch && matchesResponsible;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (!sortField) return 0;

    let comparison = 0;

    switch (sortField) {
      case 'deliveryDate':
        comparison = a.deliveryDate.getTime() - b.deliveryDate.getTime();
        break;
      case 'completion':
        comparison = calculateCompletion(a) - calculateCompletion(b);
        break;
      case 'responsible':
        comparison = a.responsible.localeCompare(b.responsible);
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const getCompletionColor = (completion: number) => {
    if (completion >= 80) return 'bg-green-500';
    if (completion >= 50) return 'bg-blue-500';
    if (completion >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTrainingTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Frontend: 'bg-blue-100 text-blue-700',
      Backend: 'bg-green-100 text-green-700',
      Fullstack: 'bg-purple-100 text-purple-700',
      DevOps: 'bg-orange-100 text-orange-700',
      Mobile: 'bg-pink-100 text-pink-700',
      'Data Science': 'bg-cyan-100 text-cyan-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const renderEditModal = (courseId: string, field: 'responsible' | 'deliveryDate') => {
    if (!editingField || editingField.courseId !== courseId || editingField.field !== field) {
      return null;
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <div ref={editRef} className="bg-white rounded-lg shadow-xl p-6 w-96">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {field === 'responsible' && 'Edit Responsible'}
              {field === 'deliveryDate' && 'Edit Delivery Date'}
            </h3>
            <button onClick={handleCancelEdit} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <div className="mb-6">
            {field === 'responsible' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Responsible
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => handleResponsibleSearch(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Type to search..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  {showDropdown && filteredResponsibles.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredResponsibles.map(option => (
                        <button
                          key={option}
                          onClick={() => handleSelectResponsible(option)}
                          className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors flex items-center gap-2"
                        >
                          <User size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-900">{option}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {showDropdown && filteredResponsibles.length === 0 && editValue && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg px-4 py-3">
                      <p className="text-sm text-gray-500">No results found</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {field === 'deliveryDate' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Date
                </label>
                <input
                  type="date"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Check size={16} />
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-gray-50">
      <Header />
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        period={period}
        onPeriodChange={setPeriod}
        responsible={responsible}
        onResponsibleChange={setResponsible}
      />

      <main className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Courses</h1>
          <p className="text-gray-600">Track progress and manage course deliveries</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Course Name
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('responsible')}
                    className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                  >
                    Responsible
                    {sortField === 'responsible' ? (
                      sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    ) : (
                      <ArrowUpDown size={14} className="opacity-50" />
                    )}
                  </button>
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('completion')}
                    className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                  >
                    Progress
                    {sortField === 'completion' ? (
                      sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    ) : (
                      <ArrowUpDown size={14} className="opacity-50" />
                    )}
                  </button>
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('deliveryDate')}
                    className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                  >
                    Delivery Date
                    {sortField === 'deliveryDate' ? (
                      sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    ) : (
                      <ArrowUpDown size={14} className="opacity-50" />
                    )}
                  </button>
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedCourses.map(course => (
                <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{course.name}</div>
                      <div className="text-sm text-gray-500">{course.duration} • {course.modules} modules</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTrainingTypeColor(course.trainingType)}`}>
                      {course.trainingType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleStartEdit(course.id, 'responsible', course.responsible)}
                      className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded transition-colors cursor-pointer w-full text-left"
                      title="Click to edit"
                    >
                      <User size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-900">{course.responsible}</span>
                    </button>
                    {renderEditModal(course.id, 'responsible')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 px-2 py-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[100px]">
                        <div
                          className={`h-2 rounded-full transition-all ${getCompletionColor(calculateCompletion(course))}`}
                          style={{ width: `${calculateCompletion(course)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 min-w-[40px]">
                        {calculateCompletion(course)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleStartEdit(course.id, 'deliveryDate', course.deliveryDate)}
                      className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded transition-colors cursor-pointer w-full text-left"
                      title="Click to edit"
                    >
                      <CalendarIcon size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {format(course.deliveryDate, 'MMM dd, yyyy')}
                      </span>
                    </button>
                    {renderEditModal(course.id, 'deliveryDate')}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleOpenDetails(course)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View details"
                    >
                      <ExternalLink size={18} className="text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {sortedCourses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No courses found matching your filters.</p>
            </div>
          )}
        </div>
      </main>

      {selectedCourse && (
        <CourseDetailsModal
          course={selectedCourse}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUpdateCourse={handleUpdateCourse}
        />
      )}
    </div>
  );
}
