# Arquitetura do Sistema AKCIT

## Visão Geral

O sistema AKCIT (Ambiente de Conhecimento Compartilhado e Inovação Tecnológica) é uma plataforma integradora e facilitadora para gestão estratégica de microcursos. O sistema atua como orquestrador, centralizando informações e automatizando fluxos de trabalho complexos.

## Princípios Arquiteturais

1. **Modularidade**: Organização em módulos funcionais independentes
2. **Escalabilidade**: Estrutura preparada para crescimento
3. **Separação de Responsabilidades**: Backend (NestJS) e Frontend (React) bem definidos
4. **Rastreabilidade**: Histórico completo de ações e validações
5. **Flexibilidade**: Suporte a múltiplos fluxos de trabalho

## Estrutura de Módulos Backend

### 1. Módulo de Projeto Pedagógico (`pedagogical-project`)

**Responsabilidade**: Gestão completa do projeto pedagógico dos microcursos

**Entidades**:
- `Microcourse`: Representa um microcurso com ementa, competências, carga horária, etc.
- `LearningTrail`: Trilhas de aprendizagem que agrupam microcursos
- `ThematicArea`: Áreas temáticas para organização dos microcursos
- `ValidationWorkflow`: Fluxo de validação interna/externa (INF, FF, PRPG, CONSUNI, DATASUS)

**Principais Funcionalidades**:
- CRUD de microcursos com informações pedagógicas completas
- Gestão de pré-requisitos entre microcursos
- Estruturação de trilhas de aprendizagem
- Fluxo de validação multi-etapas
- Geração de documentos para submissão aos órgãos competentes

### 2. Módulo de Gestão de Equipes (`team-management`)

**Responsabilidade**: Gerenciamento de equipes e atribuição de tarefas

**Entidades**:
- `Team`: Equipes de trabalho (produção, pedagógico, tutoria, coordenação)
- `TeamMember`: Membros de cada equipe com seus papéis específicos
- `TaskAssignment`: Atribuição de tarefas aos membros da equipe

**Principais Funcionalidades**:
- Criação e gestão de equipes por tipo
- Atribuição de membros com papéis específicos
- Sistema de tarefas com status, prioridade e prazos
- Acompanhamento de progresso de tarefas
- Organograma dinâmico da estrutura organizacional

### 3. Módulo de Produção de Conteúdo (`content-production`)

**Responsabilidade**: Gestão do ciclo de vida de produção de materiais didáticos

**Entidades**:
- `TeachingPlan`: Planos de ensino com objetivos, estratégias e avaliações
- `Ebook`: Gestão de eBooks (escrita, ilustração, revisão, diagramação)
- `VideoLesson`: Gestão de videoaulas (roteirização, gravação, edição, legendagem)
- `DidacticMaterial`: Outros materiais (mapas mentais, infográficos, quizzes)
- `VisualIdentity`: Gestão de identidade visual (logos, réguas de estilo, artes)
- `ContentReview`: Sistema de revisão e validação de conteúdo

**Principais Funcionalidades**:
- Fluxo completo de produção de eBooks (múltiplas etapas)
- Fluxo completo de produção de videoaulas
- Gestão de materiais didáticos diversos
- Sistema robusto de revisão com diferentes tipos (conteúdo, técnica, pedagógica)
- Versionamento de materiais
- Controle de identidade visual do projeto

### 4. Módulo de Gestão do AVA (`ava-management`)

**Responsabilidade**: Configuração e gestão do Ambiente Virtual de Aprendizagem

**Entidades**:
- `CourseClass`: Turmas dos microcursos
- `ForumTopic`: Tópicos de discussão
- `ForumPost`: Posts em fóruns
- `QuestionBank`: Bancos de questões
- `Question`: Questões para avaliações

**Principais Funcionalidades**:
- Criação e gestão de turmas
- Gestão de fóruns de discussão
- Criação de bancos de questões categorizados
- Configuração de recursos e atividades do AVA
- Preparação para integração com Moodle

### 5. Módulo de Interação com Alunos (`student-interaction`)

**Responsabilidade**: Acompanhamento e suporte aos estudantes

**Entidades**:
- `StudentEnrollment`: Matrículas de alunos em turmas
- `StudentProgress`: Progresso individual em atividades
- `InterventionAction`: Ações de intervenção para evitar evasão
- `VirtualMeeting`: Lives e encontros virtuais

**Principais Funcionalidades**:
- Gestão de matrículas
- Monitoramento de acesso e progresso
- Sistema de intervenção automatizado
- Identificação de alunos em risco
- Gestão de lives e encontros virtuais
- Preparação para integração com SIGAA

### 6. Módulo de Eventos (`events`)

**Responsabilidade**: Planejamento e organização de eventos

**Entidades**:
- `Event`: Eventos (abertura, encerramento, workshops)
- `EventTeamMember`: Equipe envolvida em cada evento

**Principais Funcionalidades**:
- Planejamento de eventos com agenda completa
- Gestão de equipes de eventos
- Controle de orçamento estimado vs real
- Gestão de infraestrutura necessária

### 7. Módulo de Certificados (`certificates`)

**Responsabilidade**: Emissão e gestão de certificados

**Entidades**:
- `Certificate`: Certificados de conclusão
- `CertificateTemplate`: Templates para geração de certificados

**Principais Funcionalidades**:
- Geração de certificados com número único
- Templates customizáveis por microcurso
- Código de validação para verificação externa
- Preparação para integração com SEI
- Rastreamento de processo de formalização

### 8. Módulo de Usuários (`users`)

**Responsabilidade**: Gestão de usuários e permissões

**Entidade Principal**:
- `User`: Usuário com papéis expandidos

**Papéis Suportados**:
- **Coordenadores**: Geral, Pedagógico, Área Temática
- **Docentes**: Conteudista, Orientador
- **Tutoria**: Tutor
- **Produção**: Designer Instrucional, Designer Gráfico, Editor de Vídeo, Desenvolvedor, Ilustrador, Revisor
- **Administrativo**: Admin
- **Estudantes**: Estudante

## Modelo de Dados - Relacionamentos Principais

```
Microcourse (1) ─────── (N) CourseClass
    │                        │
    │                        │
    (N)                      (N)
    │                        │
LearningTrail        StudentEnrollment
ThematicArea                 │
ValidationWorkflow           │
    │                        (N)
    │                        │
    (N)              StudentProgress
    │              InterventionAction
TeachingPlan
Ebook
VideoLesson
DidacticMaterial

User (1) ─────── (N) TeamMember
  │                   TaskAssignment
  │                   StudentEnrollment
  │
  (N)
  │
Team
Certificate
ContentReview
```

## Fluxos Principais

### Fluxo de Criação de Microcurso

1. Coordenador cria microcurso com informações pedagógicas
2. Define competências, ementa, carga horária
3. Associa a trilha de aprendizagem e área temática
4. Define pré-requisitos (se houver)
5. Inicia fluxo de validação interna (INF → FF → PRPG → CONSUNI)
6. Após validação interna, submete para validação externa (DATASUS)
7. Microcurso aprovado fica disponível para produção de conteúdo

### Fluxo de Produção de Conteúdo

1. Designer instrucional cria plano de ensino
2. Conteudista escreve eBook
3. Ilustrador cria ilustrações
4. Revisor faz revisão editorial
5. Designer faz diagramação (web e PDF)
6. Professor cria roteiro de videoaula
7. Gravação e edição de vídeo
8. Legendagem
9. Todos os materiais passam por revisões em cada etapa

### Fluxo de Oferta de Turma

1. Coordenador cria turma para um microcurso
2. Define datas, tutor/orientador responsável
3. Alunos se matriculam (via SIGAA)
4. Sistema monitora acesso e progresso
5. Identificação automática de alunos em risco
6. Ações de intervenção são planejadas e executadas
7. Ao final, certificados são gerados
8. Certificados são formalizados via SEI

## Stack Tecnológico

### Backend
- **Framework**: NestJS (Node.js + TypeScript)
- **ORM**: TypeORM
- **Banco de Dados**: SQLite (desenvolvimento) / PostgreSQL (produção recomendado)
- **Autenticação**: JWT com Passport
- **Validação**: class-validator e class-transformer

### Frontend
- **Framework**: React 18 com TypeScript
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Roteamento**: React Router v6
- **Estilização**: Tailwind CSS
- **Ícones**: Lucide React

## Próximos Passos de Implementação

1. ✅ Criar todas as entidades do modelo de dados
2. ⏳ Criar módulos NestJS para cada área funcional
3. ⏳ Implementar services com lógica de negócio
4. ⏳ Criar controllers e rotas de API
5. ⏳ Criar DTOs para validação de entrada
6. ⏳ Refatorar frontend para nova estrutura
7. ⏳ Criar páginas e componentes específicos do AKCIT
8. ⏳ Implementar autenticação com novos papéis
9. ⏳ Criar dashboards específicos por papel de usuário
10. ⏳ Implementar fluxos de trabalho completos

## Considerações de Segurança

- Autenticação JWT em todas as rotas protegidas
- Guards baseados em papéis para controle de acesso
- Validação rigorosa de entrada com DTOs
- Sanitização de dados sensíveis
- Logs de auditoria para ações críticas

## Escalabilidade

- Arquitetura modular permite crescimento incremental
- Banco de dados preparado para migração para PostgreSQL
- Possibilidade de microserviços no futuro
- Cache estratégico para otimização de performance
- Paginação em todas as listagens
