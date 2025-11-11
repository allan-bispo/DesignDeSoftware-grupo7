import { useState } from 'react';
import Header from '../components/Header';
import FilterBar from '../components/FilterBar';
import CourseCard from '../components/CourseCard';
import CourseDetailsModal from '../components/CourseDetailsModal';
import Calendar from '../components/Calendar';
import { mockCourses } from '../data/mockData';
import { Course, FilterPeriod } from '../types';

export default function Dashboard() {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [period, setPeriod] = useState<FilterPeriod>('Week');
  const [responsible, setResponsible] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleExpand = (id: string) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, expanded: !course.expanded } : course
    ));
  };

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

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesResponsible = responsible === 'All' || course.responsible === responsible;
    
    return matchesSearch && matchesResponsible;
  });

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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Course Name</h2>
            </div>
            <div className="flex gap-8 text-sm">
              <span className="font-medium text-gray-700">Training Type</span>
              <span className="font-medium text-gray-700">Completion</span>
              <span className="font-medium text-gray-700">Delivery Date</span>
              <span className="font-medium text-gray-700">Actions</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onToggleExpand={handleToggleExpand}
              onOpenDetails={handleOpenDetails}
            />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No courses found matching your filters.</p>
          </div>
        )}
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
