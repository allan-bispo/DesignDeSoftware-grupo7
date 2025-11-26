# AKCIT - Sistema de Gestão Educacional

Sistema completo de gestão educacional desenvolvido com React (Frontend) e NestJS (Backend), focado na gestão de projetos pedagógicos, produção de conteúdo educacional e administração de equipes.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Frontend - React + TypeScript](#frontend---react--typescript)
- [Backend - NestJS](#backend---nestjs)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Instalação e Execução](#instalação-e-execução)
- [Estrutura de Dados](#estrutura-de-dados)
- [Fluxos de Trabalho](#fluxos-de-trabalho)

---

## 🎯 Visão Geral

O **AKCIT** é uma plataforma integrada para gestão de processos educacionais, oferecendo:

- **Gestão de Projeto Pedagógico**: Criação e gerenciamento de microcursos, trilhas de aprendizagem e áreas temáticas
- **Produção de Conteúdo**: Gestão de e-books, videoaulas e materiais didáticos
- **Gestão de Equipes**: Organização de times, atribuição de tarefas e acompanhamento de progresso
- **Ambiente Virtual de Aprendizagem (AVA)**: Gestão de turmas e fóruns
- **Gestão de Estudantes**: Acompanhamento de alunos e intervenções pedagógicas
- **Eventos e Certificados**: Gerenciamento de eventos educacionais e emissão de certificados
- **Biblioteca de Recursos**: Repositório centralizado de documentações, ferramentas e templates

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages      │  │  Components  │  │   Layouts    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Store      │  │   Services   │  │    Hooks     │      │
│  │  (Zustand)   │  │   (API)      │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (NestJS)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Controllers  │  │   Services   │  │  Entities    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │     DTOs     │  │  Validators  │  │  Middleware  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                     DATABASE (SQLite)                        │
│        Users, Courses, Microcourses, Teams, Tasks...        │
└─────────────────────────────────────────────────────────────┘
```

---

## 💻 Frontend - React + TypeScript

### 🗂️ Estrutura de Diretórios

```
frontend/src/
├── components/          # Componentes reutilizáveis
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── Tag.tsx
│   ├── CreateMicrocourseModal.tsx
│   ├── CreateCourseModal.tsx
│   └── ...
├── pages/              # Páginas da aplicação
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── Library.tsx
│   ├── PedagogicalProject/
│   │   ├── MicrocourseList.tsx
│   │   ├── LearningTrails.tsx
│   │   └── ThematicAreas.tsx
│   ├── TeamManagement/
│   │   ├── Teams.tsx
│   │   └── Tasks.tsx
│   ├── ContentProduction/
│   │   ├── Ebooks.tsx
│   │   ├── Videos.tsx
│   │   └── Materials.tsx
│   ├── AVA/
│   ├── Students/
│   ├── Events/
│   └── Certificates/
├── layouts/            # Layouts da aplicação
│   ├── LayoutPrivado.tsx
│   └── LayoutPublico.tsx
├── store/              # Gerenciamento de estado (Zustand)
│   ├── useUserStore.ts
│   └── types.ts
├── services/           # Serviços de comunicação com API
│   ├── api/
│   │   ├── index.ts
│   │   ├── microcourseService.ts
│   │   ├── courseService.ts
│   │   └── ...
│   └── authService.ts
├── types/              # Definições de tipos TypeScript
│   ├── index.ts
│   ├── user.ts
│   ├── pedagogical-project.ts
│   ├── team-management.ts
│   └── content-production.ts
├── hooks/              # Custom React Hooks
├── lib/                # Utilitários e helpers
├── data/               # Dados mockados para desenvolvimento
│   └── mockData.ts
└── App.tsx             # Componente raiz
```

### 🔑 Principais Tecnologias

- **React 18** com TypeScript
- **React Router v6** - Roteamento
- **Zustand** - Gerenciamento de estado global
- **Axios** - Cliente HTTP
- **Lucide React** - Biblioteca de ícones
- **Tailwind CSS** - Estilização

### 🎨 Padrões de Design

#### 1. **Componentização**
Componentes reutilizáveis com props tipadas:
```typescript
interface TagProps {
  category: string;
  variant?: 'default' | 'primary' | 'success';
  size?: 'sm' | 'md' | 'lg';
  outlined?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export const CategoryTag: React.FC<TagProps> = ({ ... }) => {
  // Implementação
}
```

#### 2. **State Management com Zustand**
Store global para autenticação e dados do usuário:
```typescript
export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async (email, password) => { ... },
  logout: () => { ... },
}));
```

#### 3. **Serviços de API**
Abstração da comunicação com backend:
```typescript
export const microcourseService = {
  getAll: (filters?: MicrocourseFilters) =>
    api.get<Microcourse[]>('/microcourses', { params: filters }),

  getById: (id: string) =>
    api.get<Microcourse>(`/microcourses/${id}`),

  create: (data: CreateMicrocourseDto) =>
    api.post<Microcourse>('/microcourses', data),

  update: (id: string, data: UpdateMicrocourseDto) =>
    api.patch<Microcourse>(`/microcourses/${id}`, data),

  delete: (id: string) =>
    api.delete(`/microcourses/${id}`),
};
```

#### 4. **Rotas Protegidas**
Sistema de autenticação com guards de rota:
```typescript
// ProtectedRoute.tsx
export default function ProtectedRoute() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

// RoleGuard.tsx
export default function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const user = useUserStore((state) => state.user);

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
```

### 🎭 Modais Detalhados com Abas

Modais complexos para visualização e edição de cursos/microcursos:

**Estrutura:**
- **Header**: Nome, status, barra de progresso dinâmica
- **Navegação em Abas**: 4 abas principais
  1. **Informações Principais**: Dados básicos do curso
  2. **Links da Biblioteca**: Vinculação de recursos
  3. **Atividades Recentes**: Histórico de ações
  4. **Atividades Gerais**: Checklist de tarefas padrão
- **Footer**: Ações (Fechar, Salvar, etc.)

**Progresso Calculado:**
```typescript
const calculateCompletionPercentage = () => {
  const totalGeneralActivities = Object.keys(generalActivities).length;
  const completedGeneralActivities = Object.values(generalActivities).filter(Boolean).length;
  const totalLibraryItems = mockLibraryItems.length;
  const linkedItems = linkedLibraryItems.length;

  const totalTasks = totalGeneralActivities + totalLibraryItems;
  const completedTasks = completedGeneralActivities + linkedItems;

  return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
};
```

---

## 🔧 Backend - NestJS

### 🗂️ Estrutura de Módulos

```
backend/src/
├── app/
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── app.module.ts
├── auth/                          # Módulo de Autenticação
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   └── dto/
│       ├── login.dto.ts
│       └── register.dto.ts
├── users/                         # Módulo de Usuários
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.module.ts
│   ├── entities/
│   │   └── user.entity.ts
│   └── dto/
│       ├── create-user.dto.ts
│       └── update-user.dto.ts
├── pedagogical-project/           # Módulo de Projeto Pedagógico
│   ├── pedagogical-project.module.ts
│   ├── microcourses.controller.ts
│   ├── microcourses.service.ts
│   ├── learning-trails.controller.ts
│   ├── learning-trails.service.ts
│   ├── thematic-areas.controller.ts
│   ├── thematic-areas.service.ts
│   ├── entities/
│   │   ├── microcourse.entity.ts
│   │   ├── learning-trail.entity.ts
│   │   ├── thematic-area.entity.ts
│   │   └── validation-workflow.entity.ts
│   └── dto/
│       ├── create-microcourse.dto.ts
│       ├── update-microcourse.dto.ts
│       └── ...
├── team-management/               # Módulo de Gestão de Equipes
│   ├── team-management.module.ts
│   ├── teams.controller.ts
│   ├── teams.service.ts
│   ├── tasks.controller.ts
│   ├── tasks.service.ts
│   ├── entities/
│   │   ├── team.entity.ts
│   │   ├── task.entity.ts
│   │   └── team-member.entity.ts
│   └── dto/
│       ├── create-team.dto.ts
│       ├── create-task.dto.ts
│       └── ...
├── content-production/            # Módulo de Produção de Conteúdo
│   ├── content-production.module.ts
│   ├── ebooks.controller.ts
│   ├── ebooks.service.ts
│   ├── videos.controller.ts
│   ├── videos.service.ts
│   ├── entities/
│   │   ├── ebook.entity.ts
│   │   ├── video.entity.ts
│   │   └── material.entity.ts
│   └── dto/
├── ava-management/                # Módulo AVA
│   ├── ava-management.module.ts
│   ├── classes.controller.ts
│   ├── classes.service.ts
│   ├── forums.controller.ts
│   ├── forums.service.ts
│   ├── entities/
│   │   ├── class.entity.ts
│   │   ├── forum.entity.ts
│   │   └── post.entity.ts
│   └── dto/
├── student-interaction/           # Módulo de Estudantes
│   ├── student-interaction.module.ts
│   ├── students.controller.ts
│   ├── students.service.ts
│   ├── interventions.controller.ts
│   ├── interventions.service.ts
│   ├── entities/
│   │   ├── student.entity.ts
│   │   └── intervention.entity.ts
│   └── dto/
├── events/                        # Módulo de Eventos
│   ├── events.module.ts
│   ├── events.controller.ts
│   ├── events.service.ts
│   ├── entities/
│   │   └── event.entity.ts
│   └── dto/
├── certificates/                  # Módulo de Certificados
│   ├── certificates.module.ts
│   ├── certificates.controller.ts
│   ├── certificates.service.ts
│   ├── entities/
│   │   └── certificate.entity.ts
│   └── dto/
├── library/                       # Módulo de Biblioteca
│   ├── library.module.ts
│   ├── library.controller.ts
│   ├── library.service.ts
│   ├── entities/
│   │   └── library-item.entity.ts
│   └── dto/
│       ├── create-library-item.dto.ts
│       └── update-library-item.dto.ts
├── courses/                       # Módulo de Cursos (Legacy)
│   ├── courses.module.ts
│   ├── courses.controller.ts
│   ├── courses.service.ts
│   ├── entities/
│   │   └── course.entity.ts
│   └── dto/
├── common/                        # Utilitários Compartilhados
│   ├── decorators/
│   │   ├── roles.decorator.ts
│   │   └── public.decorator.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── interceptors/
│   │   └── logging.interceptor.ts
│   ├── pipes/
│   │   └── validation.pipe.ts
│   └── guards/
│       └── throttle.guard.ts
└── main.ts                        # Entry point
```

### 🔑 Principais Tecnologias Backend

- **NestJS** - Framework Node.js
- **TypeORM** - ORM para banco de dados
- **SQLite** - Banco de dados
- **Passport JWT** - Autenticação
- **Class Validator** - Validação de DTOs
- **Swagger** - Documentação de API

### 📦 Exemplo de Módulo Completo

#### Pedagogical Project Module

**1. Entity (microcourse.entity.ts):**
```typescript
@Entity('microcourses')
export class Microcourse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('text')
  syllabus: string;

  @Column('text', { nullable: true })
  expectedCompetencies?: string;

  @Column('text', { nullable: true })
  graduateProfile?: string;

  @Column('text', { nullable: true })
  bibliography?: string;

  @Column('int')
  workload: number;

  @Column({
    type: 'varchar',
    enum: PedagogicalApproach,
  })
  pedagogicalApproach: PedagogicalApproach;

  @Column({
    type: 'varchar',
    enum: MicrocourseStatus,
    default: MicrocourseStatus.DRAFT,
  })
  status: MicrocourseStatus;

  @Column('text', { nullable: true })
  programContent?: string;

  @Column('text', { nullable: true })
  evaluationMethods?: string;

  @Column('text', { nullable: true })
  teachingStrategies?: string;

  @ManyToOne(() => LearningTrail, { nullable: true })
  learningTrail?: LearningTrail;

  @ManyToOne(() => ThematicArea, { nullable: true })
  thematicArea?: ThematicArea;

  @ManyToMany(() => Microcourse)
  @JoinTable()
  prerequisites?: Microcourse[];

  @ManyToOne(() => User)
  coordinator: User;

  @OneToMany(() => ValidationWorkflow, workflow => workflow.microcourse)
  validationWorkflows: ValidationWorkflow[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

**2. DTO (create-microcourse.dto.ts):**
```typescript
export class CreateMicrocourseDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  syllabus: string;

  @IsString()
  @IsOptional()
  expectedCompetencies?: string;

  @IsString()
  @IsOptional()
  graduateProfile?: string;

  @IsString()
  @IsOptional()
  bibliography?: string;

  @IsInt()
  @Min(1)
  @Max(1000)
  workload: number;

  @IsEnum(PedagogicalApproach)
  pedagogicalApproach: PedagogicalApproach;

  @IsString()
  @IsOptional()
  programContent?: string;

  @IsString()
  @IsOptional()
  evaluationMethods?: string;

  @IsString()
  @IsOptional()
  teachingStrategies?: string;

  @IsUUID()
  @IsOptional()
  learningTrailId?: string;

  @IsUUID()
  @IsOptional()
  thematicAreaId?: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  prerequisiteIds?: string[];

  @IsUUID()
  coordinatorId: string;
}
```

**3. Controller (microcourses.controller.ts):**
```typescript
@Controller('microcourses')
@UseGuards(JwtAuthGuard)
export class MicrocoursesController {
  constructor(private readonly microcoursesService: MicrocoursesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'coordinator')
  create(@Body() createMicrocourseDto: CreateMicrocourseDto) {
    return this.microcoursesService.create(createMicrocourseDto);
  }

  @Get()
  findAll(
    @Query() filters: MicrocourseFiltersDto,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.microcoursesService.findAll(filters, page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.microcoursesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'coordinator')
  update(
    @Param('id') id: string,
    @Body() updateMicrocourseDto: UpdateMicrocourseDto,
  ) {
    return this.microcoursesService.update(id, updateMicrocourseDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.microcoursesService.remove(id);
  }

  @Post(':id/submit-for-validation')
  @UseGuards(RolesGuard)
  @Roles('coordinator')
  submitForValidation(@Param('id') id: string) {
    return this.microcoursesService.submitForValidation(id);
  }

  @Post(':id/approve')
  @UseGuards(RolesGuard)
  @Roles('admin', 'validator')
  approve(
    @Param('id') id: string,
    @Body() approvalDto: ApprovalDto,
  ) {
    return this.microcoursesService.approve(id, approvalDto);
  }

  @Post(':id/reject')
  @UseGuards(RolesGuard)
  @Roles('admin', 'validator')
  reject(
    @Param('id') id: string,
    @Body() rejectionDto: RejectionDto,
  ) {
    return this.microcoursesService.reject(id, rejectionDto);
  }
}
```

**4. Service (microcourses.service.ts):**
```typescript
@Injectable()
export class MicrocoursesService {
  constructor(
    @InjectRepository(Microcourse)
    private microcoursesRepository: Repository<Microcourse>,
    @InjectRepository(ValidationWorkflow)
    private validationWorkflowRepository: Repository<ValidationWorkflow>,
  ) {}

  async create(createMicrocourseDto: CreateMicrocourseDto): Promise<Microcourse> {
    const microcourse = this.microcoursesRepository.create(createMicrocourseDto);
    return await this.microcoursesRepository.save(microcourse);
  }

  async findAll(
    filters: MicrocourseFiltersDto,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<Microcourse>> {
    const query = this.microcoursesRepository
      .createQueryBuilder('microcourse')
      .leftJoinAndSelect('microcourse.coordinator', 'coordinator')
      .leftJoinAndSelect('microcourse.learningTrail', 'learningTrail')
      .leftJoinAndSelect('microcourse.thematicArea', 'thematicArea');

    if (filters.status) {
      query.andWhere('microcourse.status = :status', { status: filters.status });
    }

    if (filters.search) {
      query.andWhere(
        '(microcourse.name LIKE :search OR microcourse.description LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    if (filters.learningTrailId) {
      query.andWhere('microcourse.learningTrailId = :learningTrailId', {
        learningTrailId: filters.learningTrailId,
      });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Microcourse> {
    const microcourse = await this.microcoursesRepository.findOne({
      where: { id },
      relations: [
        'coordinator',
        'learningTrail',
        'thematicArea',
        'prerequisites',
        'validationWorkflows',
        'validationWorkflows.validator',
      ],
    });

    if (!microcourse) {
      throw new NotFoundException(`Microcurso com ID ${id} não encontrado`);
    }

    return microcourse;
  }

  async update(
    id: string,
    updateMicrocourseDto: UpdateMicrocourseDto,
  ): Promise<Microcourse> {
    await this.findOne(id); // Verifica se existe
    await this.microcoursesRepository.update(id, updateMicrocourseDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.microcoursesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Microcurso com ID ${id} não encontrado`);
    }
  }

  async submitForValidation(id: string): Promise<Microcourse> {
    const microcourse = await this.findOne(id);

    if (microcourse.status !== MicrocourseStatus.DRAFT) {
      throw new BadRequestException(
        'Apenas microcursos em rascunho podem ser enviados para validação',
      );
    }

    microcourse.status = MicrocourseStatus.IN_INTERNAL_VALIDATION;

    // Criar workflow de validação
    const workflow = this.validationWorkflowRepository.create({
      microcourse,
      type: ValidationType.INTERNAL,
      status: ValidationStatus.PENDING,
    });
    await this.validationWorkflowRepository.save(workflow);

    return await this.microcoursesRepository.save(microcourse);
  }

  async approve(id: string, approvalDto: ApprovalDto): Promise<Microcourse> {
    const microcourse = await this.findOne(id);

    microcourse.status = MicrocourseStatus.APPROVED;

    const workflow = microcourse.validationWorkflows.find(
      w => w.status === ValidationStatus.PENDING,
    );

    if (workflow) {
      workflow.status = ValidationStatus.APPROVED;
      workflow.comments = approvalDto.comments;
      workflow.reviewedAt = new Date();
      await this.validationWorkflowRepository.save(workflow);
    }

    return await this.microcoursesRepository.save(microcourse);
  }

  async reject(id: string, rejectionDto: RejectionDto): Promise<Microcourse> {
    const microcourse = await this.findOne(id);

    microcourse.status = MicrocourseStatus.REJECTED;

    const workflow = microcourse.validationWorkflows.find(
      w => w.status === ValidationStatus.PENDING,
    );

    if (workflow) {
      workflow.status = ValidationStatus.REJECTED;
      workflow.comments = rejectionDto.comments;
      workflow.reviewedAt = new Date();
      await this.validationWorkflowRepository.save(workflow);
    }

    return await this.microcoursesRepository.save(microcourse);
  }
}
```

**5. Module (pedagogical-project.module.ts):**
```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Microcourse,
      LearningTrail,
      ThematicArea,
      ValidationWorkflow,
    ]),
  ],
  controllers: [
    MicrocoursesController,
    LearningTrailsController,
    ThematicAreasController,
  ],
  providers: [
    MicrocoursesService,
    LearningTrailsService,
    ThematicAreasService,
  ],
  exports: [
    MicrocoursesService,
    LearningTrailsService,
    ThematicAreasService,
  ],
})
export class PedagogicalProjectModule {}
```

### 🔐 Autenticação e Autorização

**1. JWT Strategy:**
```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret-key',
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
```

**2. Roles Guard:**
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
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
```

**3. Roles Decorator:**
```typescript
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```

### 🗄️ Configuração do Banco de Dados

**main.ts:**
```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('AKCIT API')
    .setDescription('API do Sistema AKCIT de Gestão Educacional')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}
bootstrap();
```

---

## ⚙️ Funcionalidades Principais

### 1. Gestão de Projeto Pedagógico

#### Microcursos
- ✅ CRUD completo de microcursos
- ✅ Sistema de validação (interna e externa)
- ✅ Workflow de aprovação
- ✅ Vinculação com trilhas de aprendizagem
- ✅ Vinculação com áreas temáticas
- ✅ Pré-requisitos entre microcursos
- ✅ Múltiplas abordagens pedagógicas

#### Trilhas de Aprendizagem
- ✅ Criação de trilhas temáticas
- ✅ Organização de microcursos em sequência
- ✅ Definição de objetivos de aprendizagem

#### Áreas Temáticas
- ✅ Categorização de conteúdos
- ✅ Agrupamento de microcursos relacionados

### 2. Biblioteca de Recursos

- ✅ Repositório centralizado de recursos
- ✅ Categorização (Documentation, Tool, Template, Resource, Guide, Article)
- ✅ Sistema de tags
- ✅ Busca e filtros avançados
- ✅ Vinculação de recursos a cursos/microcursos
- ✅ Links externos

### 3. Gestão de Cursos (Dashboard)

- ✅ Visualização em tabela
- ✅ Busca e filtros
- ✅ Modal detalhado com 4 abas:
  - Informações principais
  - Links da biblioteca vinculados
  - Atividades recentes
  - Atividades gerais (checklist)
- ✅ Cálculo de progresso dinâmico
- ✅ Criação e edição de cursos

### 4. Gestão de Equipes

- ✅ Criação e gerenciamento de times
- ✅ Atribuição de membros
- ✅ Definição de papéis
- ✅ Gestão de tarefas por time
- ✅ Acompanhamento de status

### 5. Produção de Conteúdo

- ✅ Gestão de e-books
- ✅ Gestão de videoaulas
- ✅ Materiais didáticos
- ✅ Controle de versões
- ✅ Status de produção

### 6. Sistema de Autenticação

- ✅ Login com JWT
- ✅ Controle de acesso baseado em roles
- ✅ Rotas protegidas
- ✅ Guards de autorização
- ✅ Sessão persistente

---

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- SQLite3

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/akcit.git
cd akcit

# Instale as dependências do backend
cd backend
npm install

# Instale as dependências do frontend
cd ../frontend
npm install
```

### Configuração

**Backend (.env):**
```env
PORT=3000
DATABASE_PATH=./database.sqlite
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=7d
CORS_ORIGIN=http://localhost:5173
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3000/api
```

### Executando o Projeto

**Backend:**
```bash
cd backend
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

Acesse:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- Swagger Docs: http://localhost:3000/api/docs

### Build para Produção

**Backend:**
```bash
cd backend
npm run build
npm run start:prod
```

**Frontend:**
```bash
cd frontend
npm run build
# Os arquivos estarão em dist/
```

---

## 📊 Estrutura de Dados

### Principais Entidades

#### User
```typescript
{
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'coordinator' | 'teacher' | 'student' | 'validator';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Microcourse
```typescript
{
  id: string;
  name: string;
  description: string;
  syllabus: string;
  expectedCompetencies?: string;
  graduateProfile?: string;
  bibliography?: string;
  workload: number;
  pedagogicalApproach: 'SELF_INSTRUCTIONAL' | 'TUTOR_SUPPORTED' | 'ADVISOR_SUPPORTED';
  status: 'DRAFT' | 'IN_INTERNAL_VALIDATION' | 'APPROVED' | 'PUBLISHED' | 'IN_EXTERNAL_VALIDATION' | 'REJECTED';
  programContent?: string;
  evaluationMethods?: string;
  teachingStrategies?: string;
  learningTrail?: LearningTrail;
  thematicArea?: ThematicArea;
  prerequisites?: Microcourse[];
  coordinator: User;
  validationWorkflows: ValidationWorkflow[];
  createdAt: Date;
  updatedAt: Date;
}
```

#### Course
```typescript
{
  id: string;
  name: string;
  description: string;
  syllabus?: string;
  workload?: number;
  expirationDate?: Date;
  completion: number;
  checklist?: ChecklistItem[];
  responsible?: string;
  modules?: number;
  trainingType?: string;
  projectNotes?: string;
  usefulLinks?: UsefulLink[];
  actionHistory?: ActionHistory[];
  createdAt: Date;
}
```

#### LibraryItem
```typescript
{
  id: string;
  title: string;
  description: string;
  category: 'Documentation' | 'Tool' | 'Template' | 'Resource' | 'Guide' | 'Article';
  tags: string[];
  url?: string;
  addedBy?: string;
  addedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Team
```typescript
{
  id: string;
  name: string;
  description?: string;
  members: TeamMember[];
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔄 Fluxos de Trabalho

### 1. Criação de Microcurso

```
1. Coordenador acessa "Novo Microcurso"
2. Preenche formulário com informações básicas
3. Sistema valida dados (backend)
4. Microcurso criado com status "DRAFT"
5. Coordenador pode editar e adicionar detalhes
6. Quando pronto, submete para validação interna
7. Status muda para "IN_INTERNAL_VALIDATION"
8. Validador revisa e aprova/rejeita
9. Se aprovado, status muda para "APPROVED"
10. Pode ser publicado (status "PUBLISHED")
```

### 2. Vinculação de Recursos da Biblioteca

```
1. Usuário abre modal de detalhes do curso
2. Navega para aba "Links da Biblioteca"
3. Visualiza todos os recursos disponíveis
4. Marca checkboxes dos recursos relevantes
5. Progresso do curso é atualizado automaticamente
6. Recursos ficam vinculados ao curso
```

### 3. Gestão de Tarefas em Equipe

```
1. Líder de equipe cria nova tarefa
2. Atribui membros da equipe
3. Define prioridade e prazo
4. Membros visualizam tarefas atribuídas
5. Atualizam status conforme progresso
6. Líder acompanha através de dashboard
```

---

## 📝 API Endpoints

### Autenticação
```
POST   /api/auth/login          # Login
POST   /api/auth/register       # Registro
POST   /api/auth/refresh        # Refresh token
GET    /api/auth/profile        # Perfil do usuário
```

### Microcursos
```
GET    /api/microcourses                    # Listar todos
GET    /api/microcourses/:id                # Buscar por ID
POST   /api/microcourses                    # Criar
PATCH  /api/microcourses/:id                # Atualizar
DELETE /api/microcourses/:id                # Deletar
POST   /api/microcourses/:id/submit         # Submeter para validação
POST   /api/microcourses/:id/approve        # Aprovar
POST   /api/microcourses/:id/reject         # Rejeitar
```

### Biblioteca
```
GET    /api/library                         # Listar recursos
GET    /api/library/:id                     # Buscar por ID
POST   /api/library                         # Criar recurso
PATCH  /api/library/:id                     # Atualizar
DELETE /api/library/:id                     # Deletar
```

### Equipes
```
GET    /api/teams                           # Listar equipes
GET    /api/teams/:id                       # Buscar por ID
POST   /api/teams                           # Criar equipe
PATCH  /api/teams/:id                       # Atualizar
DELETE /api/teams/:id                       # Deletar
POST   /api/teams/:id/members               # Adicionar membro
DELETE /api/teams/:id/members/:memberId     # Remover membro
```

### Tarefas
```
GET    /api/tasks                           # Listar tarefas
GET    /api/tasks/:id                       # Buscar por ID
POST   /api/tasks                           # Criar tarefa
PATCH  /api/tasks/:id                       # Atualizar
DELETE /api/tasks/:id                       # Deletar
PATCH  /api/tasks/:id/status                # Atualizar status
```

---

## 🎨 Design System

### Cores Principais
- **Primary**: `#6366f1` (Indigo)
- **Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Amber)
- **Error**: `#ef4444` (Red)
- **Info**: `#3b82f6` (Blue)

### Componentes Reutilizáveis
- **Button** (btn-primary, btn-secondary, btn-outline)
- **Card** (card)
- **Input** (input-field)
- **Badge** (badge-*)
- **Tag** (CategoryTag)
- **Modal** (overlay + container)
- **Table** (table striped/hover)

### Animações
```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes scale-in {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

---

## 🧪 Testes

### Frontend
```bash
cd frontend
npm run test              # Testes unitários
npm run test:coverage     # Coverage
npm run test:e2e          # Testes E2E
```

### Backend
```bash
cd backend
npm run test              # Testes unitários
npm run test:e2e          # Testes E2E
npm run test:cov          # Coverage
```

---

## 📚 Documentação Adicional

- [Frontend - Guia de Componentes](./docs/frontend-components.md)
- [Backend - API Reference](./docs/api-reference.md)
- [Banco de Dados - Schema](./docs/database-schema.md)
- [Guia de Contribuição](./CONTRIBUTING.md)
- [Changelog](./CHANGELOG.md)

---

## 👥 Equipe

- **Desenvolvimento Frontend**: React + TypeScript
- **Desenvolvimento Backend**: NestJS + TypeORM
- **Design UI/UX**: Tailwind CSS
- **Banco de Dados**: SQLite

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, leia o [Guia de Contribuição](./CONTRIBUTING.md) antes de submeter pull requests.

---

**Desenvolvido com ❤️ pela equipe AKCIT**
