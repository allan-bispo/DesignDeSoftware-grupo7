# Sistema AKCIT - Gestão de Microcursos

> Ambiente de Conhecimento Compartilhado e Inovação Tecnológica

## 📋 Sobre o Projeto

O AKCIT é uma plataforma integradora e facilitadora para gestão estratégica de microcursos. O sistema atua como orquestrador, centralizando informações e automatizando fluxos de trabalho complexos desde a concepção pedagógica até a emissão de certificados.

## 🎯 Principais Funcionalidades

### 📚 Gestão do Projeto Pedagógico
- Criação e gestão de microcursos com ementa completa
- Estruturação de trilhas de aprendizagem
- Organização por áreas temáticas
- Fluxo de validação multi-etapas (INF, FF, PRPG, CONSUNI, DATASUS)
- Gestão de pré-requisitos entre microcursos

### 👥 Gestão de Equipes e Papéis
- Organização de equipes por tipo (produção, pedagógico, tutoria)
- 14 papéis diferentes de usuário
- Sistema de atribuição de tarefas
- Acompanhamento de progresso
- Organograma dinâmico

### 🎨 Gestão da Produção de Conteúdo
- Planos de ensino detalhados
- Produção de eBooks (escrita → ilustração → revisão → diagramação)
- Produção de videoaulas (roteiro → gravação → edição → legendagem)
- Materiais didáticos (mapas mentais, infográficos, quizzes)
- Sistema de revisão multi-nível
- Gestão de identidade visual

### 🎓 Gestão do AVA
- Criação e gestão de turmas
- Fóruns de discussão
- Bancos de questões
- Gestão de recursos didáticos
- Preparação para integração com Moodle

### 👨‍🎓 Interação e Acompanhamento de Alunos
- Gestão de matrículas
- Monitoramento de progresso
- Sistema de intervenção para evitar evasão
- Gestão de lives e encontros virtuais
- Preparação para integração com SIGAA

### 🎉 Gestão de Eventos
- Planejamento de eventos (abertura, encerramento, workshops)
- Gestão de equipes de eventos
- Controle de orçamento
- Gestão de infraestrutura

### 🎖️ Gestão de Certificados
- Emissão automatizada de certificados
- Templates customizáveis
- Código de validação
- Preparação para integração com SEI

## 🏗️ Arquitetura

### Backend (NestJS)
```
7 Módulos Principais
├── Pedagogical Project (4 entidades)
├── Team Management (3 entidades)
├── Content Production (6 entidades)
├── AVA Management (5 entidades)
├── Student Interaction (4 entidades)
├── Events (2 entidades)
└── Certificates (2 entidades)

Total: 28 entidades | 45+ relacionamentos
```

### Frontend (React)
```
Estrutura em desenvolvimento
├── 30+ páginas planejadas
├── 100+ componentes
├── TanStack Query para data fetching
└── Zustand para state management
```

## 🚀 Como Começar

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Git

### Instalação

```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd DesignDeSoftware-grupo7

# Instalar dependências do backend
cd backend
npm install

# Instalar dependências do frontend
cd ../frontend
npm install
```

### Configuração

```bash
# Backend - Criar arquivo .env
cd backend
cat > .env << EOF
DATABASE_TYPE=sqlite
DATABASE_NAME=database.sqlite
JWT_SECRET=your-secret-key-here
EOF
```

### Executar

```bash
# Backend (porta 3000)
cd backend
npm run start:dev

# Frontend (porta 5173)
cd frontend
npm run dev
```

O banco de dados SQLite será criado automaticamente com todas as 28 tabelas na primeira execução.

## 📖 Documentação

- **[ARQUITETURA_AKCIT.md](docs/ARQUITETURA_AKCIT.md)** - Arquitetura completa do sistema
- **[GUIA_IMPLEMENTACAO.md](docs/GUIA_IMPLEMENTACAO.md)** - Guia passo a passo para desenvolvimento
- **[REFATORACAO_AKCIT_RESUMO.md](REFATORACAO_AKCIT_RESUMO.md)** - Resumo das alterações
- **[CHANGELOG_REFATORACAO.md](CHANGELOG_REFATORACAO.md)** - Histórico de mudanças

## 👤 Papéis de Usuário

### Coordenadores
- Coordenador Geral
- Coordenador Pedagógico
- Coordenador de Área Temática

### Docentes
- Professor Conteudista
- Professor Orientador

### Tutoria
- Tutor

### Equipe de Produção
- Designer Instrucional
- Designer Gráfico
- Editor de Vídeo
- Desenvolvedor
- Ilustrador
- Revisor

### Outros
- Admin
- Estudante

## 🛠️ Stack Tecnológico

### Backend
- **Framework**: NestJS
- **ORM**: TypeORM
- **Banco de Dados**: SQLite (dev) / PostgreSQL (prod)
- **Autenticação**: JWT + Passport
- **Validação**: class-validator

### Frontend
- **Framework**: React 18 + TypeScript
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Routing**: React Router v6
- **Estilização**: Tailwind CSS
- **Ícones**: Lucide React

## 📊 Status do Projeto

### ✅ Fase 1 - Completa
- [x] Modelo de dados (28 entidades)
- [x] Estrutura de módulos backend
- [x] Documentação arquitetural
- [x] Papéis de usuário expandidos

### 🚧 Fase 2 - Em Desenvolvimento
- [ ] DTOs de validação
- [ ] Services com lógica de negócio
- [ ] Controllers e endpoints REST
- [ ] Sistema de autorização

### 📋 Fase 3 - Planejada
- [ ] Refatoração do frontend
- [ ] Páginas principais
- [ ] Componentes AKCIT
- [ ] Integração frontend-backend

### 🔮 Fase 4 - Futura
- [ ] Funcionalidades avançadas
- [ ] Sistema de notificações
- [ ] Analytics e relatórios
- [ ] Integrações externas

## 🔄 Fluxos Principais

### Criação de Microcurso
```
Coordenador → Cria Microcurso → Define Informações Pedagógicas →
Associa Trilha/Área → Define Pré-requisitos → Validação Interna →
Validação Externa → Aprovação → Produção de Conteúdo
```

### Produção de eBook
```
Designer Instrucional → Plano de Ensino → Conteudista → Escrita →
Ilustrador → Ilustrações → Revisor → Revisão → Designer →
Diagramação → Aprovação → Publicação
```

### Oferta de Turma
```
Coordenador → Cria Turma → Define Tutor → Alunos Matriculam →
Sistema Monitora → Identifica Riscos → Intervenções →
Conclusão → Certificados → Formalização
```

## 📈 Métricas do Projeto

- **Entidades**: 28
- **Módulos**: 7 novos
- **Papéis**: 14 tipos de usuário
- **Enums**: 24 definidos
- **Relacionamentos**: 45+
- **Linhas de Código**: ~2.500 (backend estrutura)
- **Arquivos Criados**: 60+

## 🤝 Contribuindo

1. Leia a documentação completa
2. Siga o [Guia de Implementação](docs/GUIA_IMPLEMENTACAO.md)
3. Implemente seguindo os padrões estabelecidos
4. Teste suas alterações
5. Documente suas mudanças

## 📝 Próximos Passos

1. **Semana 1-2**: Implementar DTOs e Services do Projeto Pedagógico
2. **Semana 3-4**: Criar frontend para gestão de microcursos
3. **Semana 5-6**: Implementar gestão de equipes e tarefas
4. **Semana 7-8**: Implementar produção de conteúdo
5. **Semana 9-10**: Implementar AVA e gestão de alunos

## ⚠️ Avisos Importantes

- **TypeORM Sync**: `synchronize: true` está habilitado apenas para desenvolvimento. **DESABILITAR EM PRODUÇÃO!**
- **Compatibilidade**: Módulos legacy mantidos durante transição
- **Migração Gradual**: Possível rodar ambos sistemas simultaneamente

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte a [documentação](docs/)
2. Verifique o [CHANGELOG](CHANGELOG_REFATORACAO.md)
3. Entre em contato com a equipe de desenvolvimento

## 📜 Licença

[Definir licença]

---

**Versão**: 0.1.0
**Última Atualização**: 26 de novembro de 2024
**Status**: Em Desenvolvimento Ativo
**Próximo Release**: v0.2.0 (Backend Core)
