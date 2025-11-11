import { useState } from 'react';
import { ExternalLink, Search, Tag, FileText, Wrench, FileCode, BookOpen, Newspaper, FolderOpen, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '../components/Header';
import { mockLibraryItems } from '../data/mockData';
import { LibraryItem, LibraryCategory } from '../types';

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
      Documentation: 'bg-blue-100 text-blue-700 border-blue-200',
      Tool: 'bg-green-100 text-green-700 border-green-200',
      Template: 'bg-purple-100 text-purple-700 border-purple-200',
      Resource: 'bg-orange-100 text-orange-700 border-orange-200',
      Guide: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      Article: 'bg-pink-100 text-pink-700 border-pink-200',
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
    <div className="flex-1 bg-gray-50">
      <Header />

      <main className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Resource Library</h1>
          <p className="text-gray-600">Your curated collection of tools, documentation, and resources</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search resources by title, description, or tags..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Tag Filter - Collapsible */}
          {allTags.length > 0 && (
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setIsTagsExpanded(!isTagsExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Filter by tags
                    {selectedTags.length > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {selectedTags.length} selected
                      </span>
                    )}
                  </span>
                </div>
                {isTagsExpanded ? (
                  <ChevronUp size={20} className="text-gray-600" />
                ) : (
                  <ChevronDown size={20} className="text-gray-600" />
                )}
              </button>

              {isTagsExpanded && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            isSelected
                              ? 'bg-blue-100 text-blue-700 border border-blue-300'
                              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <Tag size={12} />
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredItems.length}</span> of {mockLibraryItems.length} resources
          </p>
        </div>

        {/* Library Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => {
            const Icon = getCategoryIcon(item.category);
            return (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-1.5 rounded-lg border ${getCategoryColor(item.category)}`}>
                    <Icon size={16} />
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Open link"
                  >
                    <ExternalLink size={16} className="text-gray-600" />
                  </a>
                </div>

                <h3 className="text-base font-semibold text-gray-900 mb-1.5">{item.title}</h3>

                {item.description && (
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                )}

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {item.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      <Tag size={10} />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-gray-200 text-xs text-gray-500">
                  <p>Added by {item.addedBy}</p>
                  <p>{new Date(item.addedAt).toLocaleDateString()}</p>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No resources found matching your filters.</p>
          </div>
        )}
      </main>
    </div>
  );
}
