import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, BookOpen, FileText, CheckCircle } from 'lucide-react';
import { ebookService } from '../../services/api/ebookService';
import { EbookStatus, EbookStatusLabels } from '../../types';

const statusColors: Record<EbookStatus, string> = {
  [EbookStatus.WRITING]: 'bg-blue-100 text-blue-700',
  [EbookStatus.ILLUSTRATION]: 'bg-purple-100 text-purple-700',
  [EbookStatus.EDITORIAL_REVIEW]: 'bg-yellow-100 text-yellow-700',
  [EbookStatus.LAYOUT_WEB]: 'bg-orange-100 text-orange-700',
  [EbookStatus.LAYOUT_PDF]: 'bg-pink-100 text-pink-700',
  [EbookStatus.APPROVED]: 'bg-green-100 text-green-700',
  [EbookStatus.PUBLISHED]: 'bg-green-200 text-green-800',
};

export default function Ebooks() {
  const [searchTerm] = useState('');

  const { data: ebooks, isLoading } = useQuery({
    queryKey: ['ebooks', searchTerm],
    queryFn: () => ebookService.getAll({ search: searchTerm }),
  });

  const stats = {
    totalEbooks: ebooks?.data?.length || 0,
    inProgress: ebooks?.data?.filter((e: any) =>
      e.status !== EbookStatus.PUBLISHED && e.status !== EbookStatus.APPROVED
    ).length || 0,
    published: ebooks?.data?.filter((e: any) => e.status === EbookStatus.PUBLISHED).length || 0,
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">eBooks</h1>
          <p className="text-gray-600 mt-1">Produção de Conteúdo Didático</p>
        </div>
        <Link
          to="/ebooks/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Novo eBook
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total de eBooks</p>
              <p className="text-2xl font-bold mt-1">{stats.totalEbooks}</p>
            </div>
            <BookOpen className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Em Produção</p>
              <p className="text-2xl font-bold mt-1">{stats.inProgress}</p>
            </div>
            <FileText className="text-orange-500" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Publicados</p>
              <p className="text-2xl font-bold mt-1">{stats.published}</p>
            </div>
            <CheckCircle className="text-green-500" size={32} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center">Carregando...</div>
        ) : ebooks?.data?.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Nenhum eBook cadastrado
            </h3>
            <p className="text-gray-500 mb-4">
              Comece criando seu primeiro eBook
            </p>
            <Link
              to="/ebooks/new"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Criar eBook
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {ebooks?.data?.map((ebook: any) => (
              <Link
                key={ebook.id}
                to={`/ebooks/${ebook.id}`}
                className="block p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <BookOpen className="text-blue-500 mt-1" size={20} />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">{ebook.title}</h3>
                        {ebook.description && (
                          <p className="text-gray-600 text-sm mb-2">{ebook.description}</p>
                        )}
                        {ebook.microcourse && (
                          <p className="text-xs text-gray-500">
                            Microcurso: {ebook.microcourse.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                      {ebook.author && (
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Autor:</span>
                          <span>{ebook.author.name}</span>
                        </div>
                      )}
                      {ebook.illustrator && (
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Ilustrador:</span>
                          <span>{ebook.illustrator.name}</span>
                        </div>
                      )}
                      {ebook.version && (
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Versão:</span>
                          <span>{ebook.version}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      statusColors[ebook.status as EbookStatus]
                    }`}
                  >
                    {EbookStatusLabels[ebook.status as EbookStatus]}
                  </span>
                </div>

                {ebook.publishedAt && (
                  <div className="mt-3 text-xs text-gray-500">
                    Publicado em: {new Date(ebook.publishedAt).toLocaleDateString('pt-BR')}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
