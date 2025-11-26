# Resumo da Refatoração AKCIT

## Visão Geral

Este documento resume todas as alterações realizadas na refatoração do sistema para atender aos novos requisitos do projeto AKCIT (Ambiente de Conhecimento Compartilhado e Inovação Tecnológica).

## O Que Foi Feito

### 1. Novo Modelo de Dados (28 Entidades Criadas)

#### 1.1 Módulo de Projeto Pedagógico (`pedagogical-project/`)
- **Microcourse**: Microcursos com ementa completa, competências, carga horária
- **LearningTrail**: Trilhas de aprendizagem que agrupam microcursos
- **ThematicArea**: Áreas temáticas para organização
- **ValidationWorkflow**: Fluxo de validação multi-etapas (INF, FF, PRPG, CONSUNI, DATASUS)

#### 1.2 Módulo de Gestão de Equipes (`team-management/`)
- **Team**: Equipes (produção, pedagógico, tutoria, coordenação)
- **TeamMember**: Membros com papéis específicos
- **TaskAssignment**: Sistema de tarefas com status, prioridade e prazos

#### 1.3 Módulo de Produção de Conteúdo (`content-production/`)
- **TeachingPlan**: Planos de ensino detalhados
- **Ebook**: Gestão de eBooks (escrita → ilustração → revisão → diagramação)
- **VideoLesson**: Gestão de videoaulas (roteiro → gravação → edição → legendagem)
- **DidacticMaterial**: Mapas mentais, infográficos, quizzes, etc.
- **VisualIdentity**: Logos, réguas de estilo, artes
- **ContentReview**: Sistema de revisão de conteúdo

#### 1.4 Módulo de Gestão do AVA (`ava-management/`)
- **CourseClass**: Turmas dos microcursos
- **ForumTopic** e **ForumPost**: Fóruns de discussão
- **QuestionBank** e **Question**: Bancos de questões para avaliações

#### 1.5 Módulo de Interação com Alunos (`student-interaction/`)
- **StudentEnrollment**: Matrículas de alunos
- **StudentProgress**: Progresso individual em atividades
- **InterventionAction**: Ações de intervenção para evitar evasão
- **VirtualMeeting**: Lives e encontros virtuais

#### 1.6 Módulo de Eventos (`events/`)
- **Event**: Eventos (abertura, encerramento, workshops)
- **EventTeamMember**: Equipe de cada evento

#### 1.7 Módulo de Certificados (`certificates/`)
- **Certificate**: Certificados de conclusão
- **CertificateTemplate**: Templates customizáveis

### 2. Sistema de Papéis Expandido

Atualização da entidade `User` com novos papéis:

**Coordenadores**:
- Coordenador Geral
- Coordenador Pedagógico
- Coordenador de Área Temática

**Docentes**:
- Professor Conteudista
- Professor Orientador

**Tutoria**:
- Tutor

**Equipe de Produção**:
- Designer Instrucional
- Designer Gráfico
- Editor de Vídeo
- Desenvolvedor
- Ilustrador
- Revisor

**Administrativo**:
- Admin

**Estudantes**:
- Estudante

### 3. Módulos NestJS Criados

7 novos módulos registrados no AppModule:
- `PedagogicalProjectModule`
- `TeamManagementModule`
- `ContentProductionModule`
- `AvaManagementModule`
- `StudentInteractionModule`
- `EventsModule`
- `CertificatesModule`

### 4. Documentação Completa

- **ARQUITETURA_AKCIT.md**: Documentação detalhada da arquitetura, modelo de dados e fluxos
- **GUIA_IMPLEMENTACAO.md**: Guia passo a passo para continuar a implementação
- Este arquivo (REFATORACAO_AKCIT_RESUMO.md): Resumo executivo das alterações

## Estrutura de Diretórios Backend

```
backend/src/
├── app/
│   └── app.module.ts (ATUALIZADO - novos módulos registrados)
├── auth/ (legacy - manter)
├── courses/ (legacy - manter)
├── library/ (legacy - manter)
├── users/
│   └── entities/
│       └── user.entity.ts (ATUALIZADO - novos papéis)
├── pedagogical-project/ (NOVO)
│   ├── entities/
│   │   ├── microcourse.entity.ts
│   │   ├── learning-trail.entity.ts
│   │   ├── thematic-area.entity.ts
│   │   └── validation-workflow.entity.ts
│   ├── dto/ (vazio - a implementar)
│   └── pedagogical-project.module.ts
├── team-management/ (NOVO)
│   ├── entities/
│   │   ├── team.entity.ts
│   │   ├── team-member.entity.ts
│   │   └── task-assignment.entity.ts
│   ├── dto/ (vazio - a implementar)
│   └── team-management.module.ts
├── content-production/ (NOVO)
│   ├── entities/
│   │   ├── teaching-plan.entity.ts
│   │   ├── ebook.entity.ts
│   │   ├── video-lesson.entity.ts
│   │   ├── didactic-material.entity.ts
│   │   ├── visual-identity.entity.ts
│   │   └── content-review.entity.ts
│   ├── dto/ (vazio - a implementar)
│   └── content-production.module.ts
├── ava-management/ (NOVO)
│   ├── entities/
│   │   ├── course-class.entity.ts
│   │   ├── forum-topic.entity.ts
│   │   ├── forum-post.entity.ts
│   │   ├── question-bank.entity.ts
│   │   └── question.entity.ts
│   ├── dto/ (vazio - a implementar)
│   └── ava-management.module.ts
├── student-interaction/ (NOVO)
│   ├── entities/
│   │   ├── student-enrollment.entity.ts
│   │   ├── student-progress.entity.ts
│   │   ├── intervention-action.entity.ts
│   │   └── virtual-meeting.entity.ts
│   ├── dto/ (vazio - a implementar)
│   └── student-interaction.module.ts
├── events/ (NOVO)
│   ├── entities/
│   │   ├── event.entity.ts
│   │   └── event-team-member.entity.ts
│   ├── dto/ (vazio - a implementar)
│   └── events.module.ts
└── certificates/ (NOVO)
    ├── entities/
    │   ├── certificate.entity.ts
    │   └── certificate-template.entity.ts
    ├── dto/ (vazio - a implementar)
    └── certificates.module.ts
```

## O Que Falta Implementar

### Backend (Prioritário)

1. **DTOs**: Criar DTOs de validação para todos os módulos
2. **Services**: Implementar lógica de negócio
3. **Controllers**: Criar endpoints REST
4. **Guards**: Adaptar sistema de autorização para novos papéis
5. **Validações**: Adicionar decorators de validação nos DTOs

### Frontend (Prioritário)

1. **Tipos**: Criar interfaces TypeScript correspondentes às entidades
2. **Serviços de API**: Criar services para comunicação com backend
3. **Páginas**: Implementar páginas para cada módulo funcional
4. **Componentes**: Criar componentes reutilizáveis específicos do AKCIT
5. **Rotas**: Atualizar sistema de rotas
6. **Store**: Adaptar Zustand stores para nova estrutura

### Funcionalidades Avançadas (Médio Prazo)

1. Sistema de notificações
2. Dashboard analytics
3. Busca avançada
4. Exportação de relatórios
5. Sistema de arquivos/uploads

## Como Começar

1. **Ler a documentação**:
   - `docs/ARQUITETURA_AKCIT.md` - Entender a arquitetura completa
   - `docs/GUIA_IMPLEMENTACAO.md` - Seguir o guia passo a passo

2. **Testar o backend**:
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```
   As tabelas serão criadas automaticamente no banco SQLite.

3. **Começar pela implementação dos DTOs e Services do módulo de Projeto Pedagógico**, pois é a base de tudo.

4. **Implementar o frontend correspondente** após ter os endpoints funcionando.

## Principais Fluxos Implementados

### 1. Fluxo de Criação de Microcurso
```
Coordenador → Cria Microcurso → Define Competências/Ementa →
Associa Trilha/Área → Define Pré-requisitos → Inicia Validação Interna →
Validação Externa DATASUS → Aprovação → Disponível para Produção
```

### 2. Fluxo de Produção de eBook
```
Designer Instrucional → Plano de Ensino → Conteudista → Escrita →
Ilustrador → Ilustrações → Revisor → Revisão Editorial →
Designer → Diagramação Web/PDF → Aprovação → Publicação
```

### 3. Fluxo de Oferta de Turma
```
Coordenador → Cria Turma → Define Tutor/Orientador →
Alunos Matriculam (SIGAA) → Sistema Monitora → Identifica Riscos →
Intervenções → Conclusão → Gera Certificados → Formaliza SEI
```

## Compatibilidade com Sistema Anterior

- **Módulos legacy mantidos**: `auth`, `courses`, `library`
- **Migração gradual**: Possível manter ambos sistemas rodando simultaneamente
- **Banco de dados**: SQLite permite fácil migração de dados quando necessário

## Arquitetura de Banco de Dados

- **ORM**: TypeORM
- **Banco**: SQLite (desenvolvimento) / PostgreSQL (produção recomendado)
- **Sincronização**: Automática em desenvolvimento (`synchronize: true`)
- **Entidades**: 28 entidades com relacionamentos bem definidos

## Melhorias em Relação ao Sistema Anterior

1. **Modularidade**: Organização clara por domínio funcional
2. **Rastreabilidade**: Histórico completo de validações e alterações
3. **Flexibilidade**: Suporte a múltiplos fluxos de trabalho
4. **Escalabilidade**: Arquitetura preparada para crescimento
5. **Papéis Específicos**: Sistema de permissões muito mais granular
6. **Fluxos Completos**: Cobertura de todo o ciclo de vida dos microcursos

## Próximos Marcos Sugeridos

### Milestone 1 (2 semanas)
- Implementar CRUD completo de Microcursos no backend
- Criar páginas de gestão de microcursos no frontend

### Milestone 2 (2 semanas)
- Implementar gestão de equipes e tarefas
- Criar Kanban de tarefas

### Milestone 3 (2 semanas)
- Implementar gestão de produção de eBooks
- Implementar fluxo de revisão

### Milestone 4 (2 semanas)
- Implementar gestão de turmas e alunos
- Implementar monitoramento de progresso

### Milestone 5 (2 semanas)
- Implementar gestão de eventos
- Implementar sistema de certificados

## Suporte e Recursos

- Documentação NestJS: https://docs.nestjs.com
- Documentação TypeORM: https://typeorm.io
- Documentação React: https://react.dev
- Documentação TanStack Query: https://tanstack.com/query

---

**Última Atualização**: 26 de novembro de 2024

**Status**: Fase 1 completa (Modelo de Dados e Estrutura de Módulos)

**Próximo Passo**: Implementar DTOs e Services para o módulo PedagogicalProject
