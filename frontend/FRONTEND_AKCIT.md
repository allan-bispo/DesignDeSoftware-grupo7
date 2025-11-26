# Frontend AKCIT - Refatoração Completa

## Estrutura Criada

### Tipos TypeScript (/src/types)

Foram criados tipos correspondentes a todas as 28 entidades backend:

- **user.ts**: UserRole (14 papéis), User, labels
- **pedagogical-project.ts**: Microcourse, LearningTrail, ThematicArea, ValidationWorkflow + enums
- **team-management.ts**: Team, TeamMember, TaskAssignment + enums  
- **content-production.ts**: TeachingPlan, Ebook, VideoLesson, DidacticMaterial, VisualIdentity, ContentReview + enums
- **index.ts**: Exportação centralizada

### Serviços de API (/src/services/api)

- **microcourseService.ts**: CRUD completo + validação
- **teamService.ts**: Teams e Tasks
- **contentService.ts**: Ebooks, Vídeos, Materiais

### Páginas (/src/pages)

Estrutura de diretórios criada:
```
pages/
├── PedagogicalProject/
│   └── MicrocourseList.tsx (criada)
├── TeamManagement/
│   └── TeamList.tsx (em criação)
├── ContentProduction/
├── AVA/
├── Students/
├── Events/
└── Certificates/
```

## Próximos Passos

### 1. Completar Páginas
- [ ] MicrocourseDetail
- [ ] MicrocourseForm
- [ ] TaskBoard (Kanban)
- [ ] EbookProduction
- [ ] VideoProduction
- [ ] ClassList
- [ ] StudentProgress
- [ ] EventList
- [ ] CertificateList

### 2. Atualizar Rotas
Adicionar rotas no App.tsx para todas as novas páginas

### 3. Componentes Reutilizáveis
- StatusBadge
- ProgressBar
- FilterPanel
- DataTable
- Modal
- Forms

### 4. Hooks Personalizados
- useQueryParams
- useDebounce
- usePagination
- usePermissions

### 5. Store Zustand
Atualizar stores para novos módulos:
- usePedagogicalStore
- useTeamStore
- useContentStore

## Como Usar

```typescript
// Importar tipos
import { Microcourse, UserRole } from '@/types';

// Usar serviços
import { microcourseService } from '@/services/api/microcourseService';

// React Query
const { data } = useQuery({
  queryKey: ['microcourses'],
  queryFn: microcourseService.getAll
});
```

## Compatibilidade

Mantém compatibilidade total com código anterior.
Novos componentes coexistem com os antigos.
