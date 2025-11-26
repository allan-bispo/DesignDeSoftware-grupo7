# Guia de Implementação AKCIT

## Status Atual da Refatoração

### ✅ Concluído

1. **Modelo de Dados Completo**
   - 28 entidades criadas organizadas em 7 módulos funcionais
   - Relacionamentos entre entidades bem definidos
   - Enums para status, tipos e categorias

2. **Estrutura de Módulos Backend**
   - 7 módulos NestJS criados e registrados no AppModule
   - TypeORM configurado para todas as entidades
   - Arquitetura modular e escalável implementada

3. **Documentação**
   - Arquitetura completa documentada
   - Modelo de dados explicado
   - Fluxos principais mapeados

### 🚧 Próximos Passos

## Fase 1: Completar Backend (Prioridade Alta)

### 1.1 Criar DTOs (Data Transfer Objects)

Para cada módulo, criar os DTOs necessários:

**Exemplo - PedagogicalProject**:
```typescript
// backend/src/pedagogical-project/dto/create-microcourse.dto.ts
export class CreateMicrocourseDto {
  name: string;
  description: string;
  syllabus: string;
  workload: number;
  pedagogicalApproach: PedagogicalApproach;
  // ... outros campos
}

// backend/src/pedagogical-project/dto/update-microcourse.dto.ts
export class UpdateMicrocourseDto extends PartialType(CreateMicrocourseDto) {}

// backend/src/pedagogical-project/dto/microcourse-filters.dto.ts
export class MicrocourseFiltersDto {
  search?: string;
  status?: MicrocourseStatus;
  thematicAreaId?: string;
  learningTrailId?: string;
  page?: number;
  limit?: number;
}
```

**Criar DTOs para**:
- [x] Microcourse (create, update, filters)
- [ ] LearningTrail (create, update)
- [ ] ThematicArea (create, update)
- [ ] ValidationWorkflow (create, update)
- [ ] Team (create, update)
- [ ] TaskAssignment (create, update, filters)
- [ ] TeachingPlan (create, update)
- [ ] Ebook (create, update, filters)
- [ ] VideoLesson (create, update, filters)
- [ ] CourseClass (create, update, filters)
- [ ] StudentEnrollment (create, update)
- [ ] Event (create, update)
- [ ] Certificate (create, update)

### 1.2 Implementar Services

Criar services com lógica de negócio para cada módulo:

**Exemplo - PedagogicalProjectService**:
```typescript
// backend/src/pedagogical-project/services/microcourse.service.ts
@Injectable()
export class MicrocourseService {
  constructor(
    @InjectRepository(Microcourse)
    private microcourseRepository: Repository<Microcourse>,
  ) {}

  async create(dto: CreateMicrocourseDto): Promise<Microcourse> {
    // Lógica de criação
  }

  async findAll(filters: MicrocourseFiltersDto) {
    // Lógica de listagem com filtros e paginação
  }

  async findOne(id: string): Promise<Microcourse> {
    // Buscar com relações
  }

  async update(id: string, dto: UpdateMicrocourseDto): Promise<Microcourse> {
    // Lógica de atualização
  }

  async startValidation(id: string, stage: ValidationStage) {
    // Iniciar processo de validação
  }
}
```

**Services prioritários**:
1. MicrocourseService
2. LearningTrailService
3. TeamService
4. TaskAssignmentService
5. EbookService
6. VideoLessonService
7. CourseClassService
8. StudentEnrollmentService

### 1.3 Implementar Controllers

Criar controllers com endpoints REST:

**Exemplo - MicrocourseController**:
```typescript
@Controller('microcourses')
@UseGuards(JwtAuthGuard)
export class MicrocourseController {
  constructor(private readonly microcourseService: MicrocourseService) {}

  @Post()
  @Roles(UserRole.PEDAGOGICAL_COORDINATOR, UserRole.GENERAL_COORDINATOR)
  create(@Body() dto: CreateMicrocourseDto) {
    return this.microcourseService.create(dto);
  }

  @Get()
  findAll(@Query() filters: MicrocourseFiltersDto) {
    return this.microcourseService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.microcourseService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.PEDAGOGICAL_COORDINATOR)
  update(@Param('id') id: string, @Body() dto: UpdateMicrocourseDto) {
    return this.microcourseService.update(id, dto);
  }

  @Post(':id/validation/:stage')
  @Roles(UserRole.PEDAGOGICAL_COORDINATOR)
  startValidation(
    @Param('id') id: string,
    @Param('stage') stage: ValidationStage,
  ) {
    return this.microcourseService.startValidation(id, stage);
  }
}
```

### 1.4 Atualizar Sistema de Autenticação

Adaptar o AuthModule para os novos papéis:

```typescript
// backend/src/auth/guards/roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}

// Decorator
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
```

## Fase 2: Refatorar Frontend (Prioridade Alta)

### 2.1 Atualizar Tipos TypeScript

Criar interfaces correspondentes às entidades backend:

```typescript
// frontend/src/types/microcourse.ts
export interface Microcourse {
  id: string;
  name: string;
  description: string;
  syllabus: string;
  workload: number;
  pedagogicalApproach: PedagogicalApproach;
  status: MicrocourseStatus;
  learningTrail?: LearningTrail;
  thematicArea?: ThematicArea;
  coordinator?: User;
  createdAt: string;
  updatedAt: string;
}

export enum PedagogicalApproach {
  SELF_INSTRUCTIONAL = 'autoinstrucional',
  TUTOR_SUPPORTED = 'com_apoio_tutor',
  ADVISOR_SUPPORTED = 'com_apoio_orientador',
}

export enum MicrocourseStatus {
  DRAFT = 'rascunho',
  IN_INTERNAL_VALIDATION = 'validacao_interna',
  IN_EXTERNAL_VALIDATION = 'validacao_externa',
  APPROVED = 'aprovado',
  PUBLISHED = 'publicado',
  ARCHIVED = 'arquivado',
}
```

### 2.2 Criar Serviços de API

```typescript
// frontend/src/services/microcourseService.ts
import api from './api';

export const microcourseService = {
  getAll: async (filters?: MicrocourseFilters) => {
    const { data } = await api.get('/microcourses', { params: filters });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/microcourses/${id}`);
    return data;
  },

  create: async (microcourse: CreateMicrocourseDto) => {
    const { data } = await api.post('/microcourses', microcourse);
    return data;
  },

  update: async (id: string, microcourse: UpdateMicrocourseDto) => {
    const { data } = await api.put(`/microcourses/${id}`, microcourse);
    return data;
  },

  delete: async (id: string) => {
    await api.delete(`/microcourses/${id}`);
  },
};
```

### 2.3 Criar Páginas Principais

**Estrutura de páginas proposta**:
```
frontend/src/pages/
├── Dashboard/
│   └── index.tsx (Dashboard principal com métricas)
├── PedagogicalProject/
│   ├── MicrocourseList.tsx
│   ├── MicrocourseDetail.tsx
│   ├── MicrocourseForm.tsx
│   ├── LearningTrails.tsx
│   └── ThematicAreas.tsx
├── TeamManagement/
│   ├── TeamList.tsx
│   ├── TeamDetail.tsx
│   ├── TaskBoard.tsx (Kanban de tarefas)
│   └── Organogram.tsx
├── ContentProduction/
│   ├── EbookList.tsx
│   ├── EbookProduction.tsx
│   ├── VideoLessonList.tsx
│   ├── VideoProduction.tsx
│   ├── TeachingPlanList.tsx
│   └── MaterialList.tsx
├── AVA/
│   ├── ClassList.tsx
│   ├── ClassDetail.tsx
│   ├── ForumManagement.tsx
│   └── QuestionBanks.tsx
├── Students/
│   ├── EnrollmentList.tsx
│   ├── ProgressMonitoring.tsx
│   ├── InterventionDashboard.tsx
│   └── VirtualMeetings.tsx
├── Events/
│   ├── EventList.tsx
│   ├── EventPlanning.tsx
│   └── EventDetail.tsx
└── Certificates/
    ├── CertificateList.tsx
    ├── CertificateGeneration.tsx
    └── TemplateManagement.tsx
```

### 2.4 Atualizar Sistema de Rotas

```typescript
// frontend/src/App.tsx
<Routes>
  <Route path="/" element={<Navigate to="/login" replace />} />

  <Route element={<PublicRoute />}>
    <Route path="/login" element={<Login />} />
  </Route>

  <Route element={<ProtectedRoute />}>
    <Route element={<LayoutPrivado />}>
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Projeto Pedagógico */}
      <Route path="/microcourses" element={<MicrocourseList />} />
      <Route path="/microcourses/:id" element={<MicrocourseDetail />} />
      <Route path="/learning-trails" element={<LearningTrails />} />

      {/* Equipes */}
      <Route path="/teams" element={<TeamList />} />
      <Route path="/teams/:id" element={<TeamDetail />} />
      <Route path="/tasks" element={<TaskBoard />} />

      {/* Produção de Conteúdo */}
      <Route path="/ebooks" element={<EbookList />} />
      <Route path="/videos" element={<VideoLessonList />} />

      {/* AVA */}
      <Route path="/classes" element={<ClassList />} />

      {/* Estudantes */}
      <Route path="/students" element={<EnrollmentList />} />
      <Route path="/interventions" element={<InterventionDashboard />} />

      {/* Eventos */}
      <Route path="/events" element={<EventList />} />

      {/* Certificados */}
      <Route path="/certificates" element={<CertificateList />} />
    </Route>
  </Route>
</Routes>
```

## Fase 3: Funcionalidades Avançadas (Prioridade Média)

### 3.1 Sistema de Notificações
- Notificações em tempo real para tarefas atribuídas
- Alertas de prazos próximos
- Notificações de mudanças de status

### 3.2 Dashboard Analytics
- Métricas de produção de conteúdo
- Taxa de conclusão de alunos
- Identificação de gargalos
- Relatórios gerenciais

### 3.3 Sistema de Busca Avançada
- Busca full-text em microcursos
- Filtros combinados
- Busca por tags e categorias

### 3.4 Exportação de Relatórios
- Relatórios em PDF
- Exportação para Excel
- Relatórios customizáveis

## Fase 4: Integrações (Prioridade Baixa)

Implementar integrações conforme necessidade:

1. **Moodle**: Sincronização de turmas e alunos
2. **SIGAA**: Matrícula automática
3. **SEI**: Formalização de certificados
4. **Google Drive**: Upload de materiais
5. **YouTube**: Upload de vídeos
6. **Google Calendar**: Agendamento de lives
7. **Email/WhatsApp**: Notificações

## Como Começar a Desenvolver

### 1. Preparar Ambiente

```bash
# Backend
cd backend
npm install
npm run start:dev

# Frontend
cd frontend
npm install
npm run dev
```

### 2. Testar Banco de Dados

O TypeORM está configurado com `synchronize: true`, então as tabelas serão criadas automaticamente na primeira execução.

```bash
# Verificar se as tabelas foram criadas
sqlite3 backend/database.sqlite
.tables
.schema microcourses
```

### 3. Ordem de Implementação Sugerida

**Semana 1-2: Backend Básico**
- [ ] Implementar DTOs para Microcourse, LearningTrail, ThematicArea
- [ ] Criar MicrocourseService com CRUD completo
- [ ] Criar MicrocourseController
- [ ] Testar endpoints com Postman/Insomnia

**Semana 3-4: Frontend Básico**
- [ ] Criar tipos TypeScript
- [ ] Implementar microcourseService
- [ ] Criar página MicrocourseList
- [ ] Criar página MicrocourseForm
- [ ] Testar fluxo completo de CRUD

**Semana 5-6: Gestão de Equipes**
- [ ] Implementar backend de Team e TaskAssignment
- [ ] Criar páginas de gestão de equipes
- [ ] Implementar Kanban de tarefas

**Semana 7-8: Produção de Conteúdo**
- [ ] Implementar backend de Ebook e VideoLesson
- [ ] Criar páginas de produção
- [ ] Implementar fluxo de revisão

**Semana 9-10: AVA e Alunos**
- [ ] Implementar backend de CourseClass e StudentEnrollment
- [ ] Criar páginas de gestão de turmas
- [ ] Implementar monitoramento de progresso

## Considerações Importantes

1. **Migração Gradual**: Manter módulos legacy funcionando durante a transição
2. **Testes**: Adicionar testes unitários e E2E conforme implementa
3. **Validação**: Usar class-validator em todos os DTOs
4. **Autorização**: Implementar guards baseados em papéis
5. **Documentação**: Manter docs atualizadas
6. **Performance**: Implementar paginação e cache quando necessário

## Recursos Úteis

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [React Query Documentation](https://tanstack.com/query)
- [Tailwind CSS Documentation](https://tailwindcss.com)

## Suporte

Para dúvidas ou problemas na implementação, consulte a documentação de arquitetura em [ARQUITETURA_AKCIT.md](./ARQUITETURA_AKCIT.md).
