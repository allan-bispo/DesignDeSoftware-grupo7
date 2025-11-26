import { BookOpen, ChevronDown, ChevronUp, ExternalLink, FileCode, FileText, FolderOpen, Newspaper, Search, Tag as TagIcon, Wrench } from 'lucide-react';
import { useState } from 'react';
import Header from '../components/Header';
import { CategoryTag } from '../components/Tag';
import { mockLibraryItems } from '../data/mockData';
import { LibraryCategory } from '../types';

export default function Library() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<LibraryCategory | 'All'>('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isTagsExpanded, setIsTagsExpanded] = useState(false);

  // Get all unique tags
  const allTags = Array.from(new Set(mockLibraryItems.flatMap(item => item.tags))).sort();

  const getCategoryIcon = (category: LibraryCategory) => {
    const icons = {
      Documentation: FileText,
      Tool: Wrench,
      Template: FileCode,
      Resource: FolderOpen,
      Guide: BookOpen,
      Article: Newspaper,
    };
    return icons[category];
  };

  const getCategoryColor = (category: LibraryCategory) => {
    const colors: Record<LibraryCategory, string> = {
      Documentation: 'bg-blue-100 text-blue-700 border-blue-300',
      Tool: 'bg-green-100 text-green-700 border-green-300',
      Template: 'bg-purple-100 text-purple-700 border-purple-300',
      Resource: 'bg-orange-100 text-orange-700 border-orange-300',
      Guide: 'bg-cyan-100 text-cyan-700 border-cyan-300',
      Article: 'bg-pink-100 text-pink-700 border-pink-300',
    };
    return colors[category];
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredItems = mockLibraryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    const matchesTags = selectedTags.length === 0 ||
                       selectedTags.every(tag => item.tags.includes(tag));

    return matchesSearch && matchesCategory && matchesTags;
  });

  const categories: Array<LibraryCategory | 'All'> = ['All', 'Documentation', 'Tool', 'Template', 'Resource', 'Guide', 'Article'];

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <Header />

      <main className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Biblioteca de Recursos</h1>
          <p className="text-gray-600">Sua coleção curada de ferramentas, documentação e recursos</p>
        </div>

        {/* Search and Filters */}
        <div className="card p-6 mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar recursos por título, descrição ou tags..."
              className="input-field pl-11"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 animate-fade-in ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-medium transform scale-105'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:shadow-soft'
                  }`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  {category === 'All' ? 'Todos' : category}
                </button>
              );
            })}
          </div>

          {/* Tag Filter - Collapsible */}
          {allTags.length > 0 && (
            <div className="card overflow-hidden">
              <button
                onClick={() => setIsTagsExpanded(!isTagsExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                    <TagIcon size={16} className="text-primary-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    Filtrar por tags
                    {selectedTags.length > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-bold">
                        {selectedTags.length} selecionada{selectedTags.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </span>
                </div>
                {isTagsExpanded ? (
                  <ChevronUp size={20} className="text-gray-600 group-hover:text-primary-600 transition-colors" />
                ) : (
                  <ChevronDown size={20} className="text-gray-600 group-hover:text-primary-600 transition-colors" />
                )}
              </button>

              {isTagsExpanded && (
                <div className="px-4 py-4 bg-gradient-to-r from-gray-50 to-transparent border-t border-gray-200 animate-slide-down">
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag, index) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <CategoryTag
                          key={tag}
                          category={tag}
                          variant={isSelected ? 'primary' : 'default'}
                          size="sm"
                          outlined={!isSelected}
                          onClick={() => toggleTag(tag)}
                          icon={<TagIcon size={12} />}
                          className="animate-fade-in"
                          style={{ animationDelay: `${index * 20}ms` }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Mostrando <span className="font-bold text-gray-900">{filteredItems.length}</span> de{' '}
            <span className="font-bold text-gray-900">{mockLibraryItems.length}</span> recursos
          </p>
        </div>

        {/* Library Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <BookOpen className="text-gray-400" size={40} />
            </div>
            <p className="text-gray-600 font-medium text-lg mb-2">Nenhum recurso encontrado</p>
            <p className="text-gray-500 text-sm">Tente ajustar os filtros de busca</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item, index) => {
              const Icon = getCategoryIcon(item.category);
              return (
                <div
                  key={item.id}
                  className="card p-5 hover:shadow-large transition-all duration-300 group animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 rounded-xl border-2 ${getCategoryColor(item.category)} group-hover:scale-110 transition-transform duration-200`}>
                      <Icon size={20} />
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-primary-100 rounded-xl transition-all duration-200 hover:scale-110 group/link"
                      title="Abrir link"
                    >
                      <ExternalLink size={18} className="text-gray-600 group-hover/link:text-primary-600 transition-colors" />
                    </a>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.tags.map(tag => (
                      <CategoryTag
                        key={tag}
                        category={tag}
                        variant="default"
                        size="sm"
                        icon={<TagIcon size={10} />}
                        className="shadow-sm"
                      />
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-200 text-xs text-gray-500">
                    <p className="font-medium text-gray-700 mb-1">Adicionado por <span className="text-primary-600">{item.addedBy}</span></p>
                    <p>{new Date(item.addedAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
