# AKCIT - Sistema de Gestão Educacional

Sistema de gestão educacional desenvolvido com React (Frontend) e NestJS (Backend), focado na gestão de cursos, biblioteca de recursos e controle de acesso baseado em papéis.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Frontend - React + TypeScript](#frontend---react--typescript)
- [Backend - NestJS](#backend---nestjs)
- [Funcionalidades Implementadas](#funcionalidades-implementadas)
- [Instalação e Execução](#instalação-e-execução)
- [Estrutura de Dados](#estrutura-de-dados)
- [API Endpoints](#api-endpoints)

---

## 🎯 Visão Geral

O **AKCIT** é uma plataforma para gestão de processos educacionais com as seguintes funcionalidades implementadas:

- **Dashboard de Cursos**: Visualização, criação e edição de cursos com sistema de progresso
- **Biblioteca de Recursos**: Repositório de documentações, ferramentas, templates e artigos
- **Gestão de Usuários**: Controle de usuários com diferentes níveis de acesso
- **Autenticação e Autorização**: Sistema JWT com controle baseado em papéis (RBAC)
- **Microcursos**: CRUD básico de microcursos (em desenvolvimento)

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages      │  │  Components  │  │   Layouts    │      │
│  │  - Login     │  │  - Header    │  │  - Privado   │      │
│  │  - Dashboard │  │  - Sidebar   │  │  - Publico   │      │
│  │  - Library   │  │  - Modals    │  │              │      │
│  │  - Users     │  │  - Cards     │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Store      │  │   Services   │  │ Auth Guards  │      │
│  │  (Zustand)   │  │  - API Base  │  │ - Protected  │      │
│  │  - User      │  │  - Courses   │  │ - RoleGuard  │      │
│  │  - Auth      │  │  - Users     │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST (Axios)
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (NestJS)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Controllers  │  │   Services   │  │  Entities    │      │
│  │  - Auth      │  │  - Auth      │  │  - User      │      │
│  │  - Users     │  │  - Users     │  │  - Course    │      │
│  │  - Courses   │  │  - Courses   │  │  - Library   │      │
│  │  - Library   │  │  - Library   │  │  - Micro...  │      │
│  │  - Micros... │  │  - Micros... │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │     DTOs     │  │  Validators  │                         │
│  │ - Validação  │  │ class-val... │                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
                            ↕ TypeORM
┌─────────────────────────────────────────────────────────────┐
│                     DATABASE (SQLite)                        │
│            Users, Courses, Library Items                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 💻 Frontend - React + TypeScript

### 🗂️ Estrutura de Diretórios

```
frontend/src/
├── components/              # Componentes reutilizáveis
│   ├── Header.tsx          # Cabeçalho com navegação
│   ├── Sidebar.tsx         # Menu lateral
│   ├── Tag.tsx             # Tags categorizadas
│   ├── Avatar.tsx          # Avatar de usuário
│   ├── CreateCourseModal.tsx    # Modal de criação de curso
│   ├── EditCourseModal.tsx      # Modal de edição de curso
│   ├── ViewCourseModal.tsx      # Modal de visualização
│   ├── ProtectedRoute.tsx       # Guard de autenticação
│   └── RoleGuard.tsx            # Guard de autorização
├── pages/                   # Páginas implementadas
│   ├── Login.tsx           # ✅ Página de login
│   ├── Dashboard.tsx       # ✅ Dashboard de cursos
│   ├── Library.tsx         # ✅ Biblioteca de recursos
│   ├── UserManagement.tsx  # ✅ Gestão de usuários (Admin)
│   └── Courses.tsx         # ⚠️  Em desenvolvimento
├── layouts/                 # Layouts da aplicação
│   ├── LayoutPrivado.tsx   # Layout para rotas autenticadas
│   └── LayoutPublico.tsx   # Layout para login/registro
├── store/                   # Gerenciamento de estado (Zustand)
│   ├── useUserStore.ts     # Store de autenticação
│   └── types.ts            # Tipos do store
├── services/                # Serviços de API
│   ├── api.tsx             # Configuração Axios
│   ├── authService.ts      # Serviço de autenticação
│   ├── courseService.tsx   # Serviço de cursos
│   └── userService.tsx     # Serviço de usuários
├── types/                   # Tipos TypeScript
│   ├── index.ts            # Tipos principais
│   ├── user.ts             # Tipos de usuário
│   └── api.tsx             # Tipos de API
├── hooks/                   # Custom Hooks
│   ├── useCourses.tsx      # Hook de cursos
│   ├── useUsers.tsx        # Hook de usuários
│   └── usePermissions.ts   # Hook de permissões
├── data/                    # Dados mockados
│   └── mockData.ts         # Mock de biblioteca e cursos
└── App.tsx                  # Componente raiz com rotas
```

### 🔑 Principais Tecnologias

- **React 18** com TypeScript
- **React Router v6** - Roteamento e navegação
- **Zustand** - Gerenciamento de estado global
- **Axios** - Cliente HTTP para API
- **Lucide React** - Biblioteca de ícones
- **Tailwind CSS** - Estilização (via classes utilitárias)

### 🎨 Padrões de Design Implementados

#### 1. **Autenticação e Controle de Acesso**
Store global com Zustand para gerenciar autenticação:
```typescript
export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  // Métodos de autenticação
  login: async (email, password) => { /* ... */ },
  logout: () => { /* ... */ },
}));
```

**Guards de Rota:**
- `ProtectedRoute`: Redireciona para login se não autenticado
- `RoleGuard`: Restringe acesso por papel de usuário (admin, instructor, student)

#### 2. **Modal Detalhado de Curso (Dashboard)**
Sistema de visualização de cursos com 4 abas:
- **Informações Principais**: Dados básicos (carga horária, descrição, ementa)
- **Links da Biblioteca**: Vinculação de recursos com checkboxes
- **Atividades Recentes**: Histórico de ações do curso
- **Atividades Gerais**: Checklist padrão de tarefas

**Cálculo de Progresso Dinâmico:**
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

#### 3. **Biblioteca de Recursos**
Sistema de categorização e filtragem:
- Categorias: Documentation, Tool, Template, Resource, Guide, Article
- Sistema de tags com múltipla seleção
- Busca por título, descrição ou tags
- Modal de adição de novos recursos

---

## 🔧 Backend - NestJS

### 🗂️ Estrutura de Módulos Implementados

```
backend/src/
├── app/
│   ├── app.controller.ts       # ✅ Controller principal
│   ├── app.service.ts          # ✅ Service principal
│   └── app.module.ts           # ✅ Módulo raiz
│
├── auth/                        # ✅ Autenticação
│   ├── auth.controller.ts      # POST /auth/login, /auth/register
│   ├── auth.service.ts         # Lógica de autenticação JWT
│   ├── auth.module.ts
│   └── dto/
│       ├── login.dto.ts        # Validação de login
│       └── register.dto.ts     # Validação de registro
│
├── users/                       # ✅ Usuários
│   ├── users.controller.ts     # GET /users
│   ├── users.service.ts        # Lógica de usuários
│   └── users.module.ts
│
├── courses/                     # ✅ Cursos
│   ├── courses.controller.ts   # CRUD completo + stats
│   ├── courses.service.ts      # Lógica de cursos
│   ├── courses.module.ts
│   ├── entities/
│   │   └── course.entity.ts    # Entidade TypeORM
│   └── dto/
│       ├── create-course.dto.ts
│       ├── update-course.dto.ts
│       └── course-filters.dto.ts
│
├── library/                     # ✅ Biblioteca
│   ├── library.controller.ts   # GET /library (com filtros)
│   ├── library.service.ts      # Lógica de biblioteca
│   ├── library.module.ts
│   ├── entities/
│   │   └── library-item.entity.ts
│   └── dto/
│       └── library-filters.dto.ts
│
├── pedagogical-project/         # ⚠️  Em desenvolvimento
│   ├── microcourses.controller.ts  # CRUD básico
│   ├── microcourses.service.ts
│   ├── pedagogical-project.module.ts
│   ├── entities/
│   │   └── microcourse.entity.ts
│   └── dto/
│       ├── create-microcourse.dto.ts
│       ├── update-microcourse.dto.ts
│       └── microcourse-filters.dto.ts
│
├── common/                      # ✅ Utilitários
│   └── interfaces/
│       └── response.interface.ts  # Tipos de resposta padronizados
│
└── main.ts                      # ✅ Entry point + configuração CORS
```

### 🔑 Principais Tecnologias Backend

- **NestJS** - Framework Node.js
- **TypeORM** - ORM para banco de dados
- **SQLite** - Banco de dados (em memória/arquivo)
- **Class Validator** - Validação de DTOs
- **Class Transformer** - Transformação de dados

### 📦 Exemplo de Controller Implementado

**Courses Controller (courses.controller.ts):**
```typescript
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  async create(@Body() createCourseDto: CreateCourseDto) {
    const course = await this.coursesService.create(createCourseDto);
    return { data: course };
  }

  @Get()
  async findAll(@Query() filters: CourseFiltersDto) {
    return await this.coursesService.findAll(filters);
  }

  @Get('stats')
  async getStats() {
    return await this.coursesService.getStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const course = await this.coursesService.findOne(id);
    return { data: course };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    const course = await this.coursesService.update(id, updateCourseDto);
    return { data: course };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.coursesService.remove(id);
  }

  @Put(':courseId/checklist/:itemId')
  async updateChecklistItem(
    @Param('courseId') courseId: string,
    @Param('itemId') itemId: string,
    @Body() body: { completed: boolean },
  ) {
    const course = await this.coursesService.updateChecklistItem(
      courseId,
      itemId,
      body.completed,
    );
    return { data: course };
  }
}
```

---

## ⚙️ Funcionalidades Implementadas

### 1. Dashboard de Cursos

- ✅ Visualização em tabela com todos os cursos
- ✅ Busca por nome ou descrição
- ✅ Modal detalhado com 4 abas:
  - **Informações Principais**: Dados básicos (nome, descrição, ementa, carga horária, responsável, módulos)
  - **Links da Biblioteca**: Vinculação de recursos da biblioteca com checkboxes
  - **Atividades Recentes**: Histórico de ações realizadas no curso
  - **Atividades Gerais**: Checklist padrão de tarefas do curso
- ✅ Cálculo de progresso dinâmico baseado em atividades e recursos vinculados
- ✅ Criação de novos cursos via modal
- ✅ Edição de cursos existentes
- ✅ Barra de progresso visual com código de cores

### 2. Biblioteca de Recursos

- ✅ Repositório centralizado de recursos educacionais
- ✅ Categorização por tipo:
  - Documentation
  - Tool
  - Template
  - Resource
  - Guide
  - Article
- ✅ Sistema de tags para classificação adicional
- ✅ Busca por título, descrição ou tags
- ✅ Filtros por categoria e tags (múltipla seleção)
- ✅ Modal de criação de novos recursos
- ✅ Links externos para cada recurso
- ✅ Cards com ícones personalizados por categoria

### 3. Gestão de Usuários (Somente Admin)

- ✅ Listagem de todos os usuários do sistema
- ✅ Busca por nome ou email
- ✅ Exibição de perfil (Admin, Instructor, Student)
- ✅ Estatísticas por perfil
- ✅ Controle de acesso baseado em papel (RBAC)
- ✅ Interface protegida com RoleGuard

### 4. Sistema de Autenticação

- ✅ Página de login com validação
- ✅ Autenticação via backend (JWT simulado no frontend)
- ✅ Rotas protegidas por autenticação (ProtectedRoute)
- ✅ Rotas protegidas por papel de usuário (RoleGuard)
- ✅ Redirecionamento automático para login quando não autenticado
- ✅ Persistência de sessão com Zustand
- ✅ Logout com limpeza de estado

### 5. Backend API

- ✅ **Auth**: POST /auth/login, /auth/register
- ✅ **Users**: GET /users (listar usuários)
- ✅ **Courses**: CRUD completo + GET /courses/stats + PUT /courses/:id/checklist/:itemId
- ✅ **Library**: GET /library (com filtros)
- ⚠️  **Microcourses**: CRUD básico (em desenvolvimento)

---

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/akcit.git
cd DesignDeSoftware-grupo7

# Instale as dependências do backend
cd backend
npm install

# Instale as dependências do frontend
cd ../frontend
npm install
```

### Executando o Projeto

**Backend:**
```bash
cd backend
npm run start:dev
```
O backend estará disponível em `http://localhost:3000`

**Frontend:**
```bash
cd frontend
npm run dev
```
O frontend estará disponível em `http://localhost:5173`

### 🔑 Credenciais de Acesso

O sistema possui usuários pré-cadastrados para teste com diferentes níveis de acesso:

#### Administrador (Acesso Total)
- **Email:** `superadmin@akcit.com`
- **Senha:** `Admin@123`
- **Permissões:** Acesso total ao sistema, incluindo gestão de usuários

#### Professor/Instrutor
- **Email:** `professor@akcit.com`
- **Senha:** `professor123`
- **Permissões:** Gestão de cursos, biblioteca e projetos pedagógicos

#### Aluno/Estudante
- **Email:** `aluno@akcit.com`
- **Senha:** `aluno123`
- **Permissões:** Visualização de cursos e acesso limitado

> **Nota de Segurança:** Estas são credenciais para ambiente de desenvolvimento. Em produção, sempre altere as senhas padrão e utilize senhas seguras.

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

### User
```typescript
{
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
  avatar?: string;
  createdAt: Date;
}
```

### Course
```typescript
{
  id: string;
  name: string;
  description: string;
  syllabus?: string;
  workload?: number;
  expirationDate?: Date;
  completion: number;
  responsible?: string;
  modules?: number;
  trainingType?: string;
  projectNotes?: string;
  createdAt: Date;
}
```

### LibraryItem
```typescript
{
  id: string;
  title: string;
  description: string;
  category: 'Documentation' | 'Tool' | 'Template' | 'Resource' | 'Guide' | 'Article';
  tags: string[];
  url: string;
  addedBy?: string;
  addedAt?: Date;
  createdAt: Date;
}
```

---

## 📝 API Endpoints

### Autenticação
```
POST   /api/auth/login       # Login de usuário
POST   /api/auth/register    # Registro de novo usuário
```

### Usuários
```
GET    /api/users            # Listar todos os usuários
```

### Cursos
```
GET    /api/courses                    # Listar todos os cursos (com filtros)
GET    /api/courses/stats              # Estatísticas dos cursos
GET    /api/courses/:id                # Buscar curso por ID
POST   /api/courses                    # Criar novo curso
PUT    /api/courses/:id                # Atualizar curso
DELETE /api/courses/:id                # Deletar curso
PUT    /api/courses/:courseId/checklist/:itemId  # Atualizar item do checklist
```

### Biblioteca
```
GET    /api/library          # Listar recursos (com filtros por categoria e tags)
```

### Microcursos (Em Desenvolvimento)
```
GET    /api/microcourses                # Listar microcursos (com filtros)
GET    /api/microcourses/:id            # Buscar microcurso por ID
POST   /api/microcourses                # Criar microcurso
PUT    /api/microcourses/:id            # Atualizar microcurso
DELETE /api/microcourses/:id            # Deletar microcurso
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
- **Card** (card com shadow)
- **Input** (input-field)
- **Badge** (badge com variantes)
- **Tag** (CategoryTag com ícone)
- **Modal** (overlay + container com animações)
- **Table** (table com hover)
- **Avatar** (com iniciais do nome)

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

## 👥 Equipe

- **Desenvolvimento Frontend**: React + TypeScript
- **Desenvolvimento Backend**: NestJS + TypeORM
- **Design UI/UX**: Tailwind CSS
- **Banco de Dados**: SQLite

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Desenvolvido pela equipe AKCIT**
