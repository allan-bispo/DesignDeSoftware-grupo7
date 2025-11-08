📚 Backend: Gestão de Cursos AKCIT (NestJS)

Este documento detalha o escopo de desenvolvimento do backend da aplicação de Gestão de Cursos AKCIT, construído utilizando o framework NestJS. Serve como um checklist de progresso e guia de implementação para todas as funcionalidades.

🎯 Status Atual do Projeto

| Tarefa | Status | Descrição |
|--------|--------|-----------|
|1.1. Inicialização do Projeto | ✅ Concluída | Projeto NestJS inicializado na pasta backend/. |
|1.2. Configuração de Variáveis de Ambiente | ⬜ Pendente | Configurar o NestJS Config. |
|1.3. Conexão com o Banco de Dados | ⬜ Pendente | Configurar o ORM (Prisma/TypeORM). |

Próximas tarefas detalhadas abaixo.

1. Configuração de Ambiente & Arquitetura (Core Setup)

| Task | Descrição | Aceite | Status |
|------|-----------|--------|--------|
| [Setup] Inicializar o projeto backend | Configurar a base do projeto com NestJS. Incluir a estrutura de pastas inicial. | O projeto roda localmente (npm run start:dev), e um endpoint de health check (GET /) retorna status 200 OK. | 	⬜ Pendente |
| [Setup] Configurar a gestão de variáveis de ambiente | Criar arquivos .env e .env.example. Integrar com o @nestjs/config para ler configurações. | As configurações da aplicação (porta, URL do banco) são lidas a partir de process.env. | 	⬜ Pendente |
| [Setup] Configurar a conexão com o banco de dados e ORM | Instalar e configurar um ORM (ex: Prisma ou TypeORM) e estabelecer a conexão com PostgreSQL. | A aplicação consegue se conectar ao banco de dados com sucesso na inicialização. | 	⬜ Pendente |
| [Setup] Modelagem de Dados Inicial (Schema) | Definir os schemas iniciais para: User, Course, Task. Incluir campos e relacionamentos básicos. | Os schemas são criados e uma migração inicial do banco é gerada e executada com sucesso. | 	⬜ Pendente |
| [Setup] Configurar ESLint e Prettier | Garantir que as regras de lint e formatação de código sejam aplicadas para manter a consistência do código. | O comando npm run lint roda sem erros e o código é formatado automaticamente ao salvar. | 	⬜ Pendente |
| [Setup] Implementar logging e tratamento de erros global | Criar um filtro de exceção global para padronizar as respostas de erro ({ statusCode, message, error }) e registrar logs. | Um erro não tratado resulta em uma resposta JSON formatada com status 500, em vez de crashar o servidor. | 	⬜ Pendente |

2. Autenticação & Autorização

| Task | Descrição | Aceite | Status |
|------|-----------|--------|--------|
| [Auth] Criar o schema do User com perfil (role) | Expandir o schema do User para incluir password (hash) e um campo role (enum: ADMIN, PRODUTOR). | O modelo User no banco de dados reflete esses campos. | 	⬜ Pendente |
| [Auth] Implementar endpoint de autenticação (POST /auth/login) | Criar a rota que valida email/senha, compara o hash e, se bem-sucedido, gera e retorna um token JWT. | 1. Com credenciais válidas, retorna um token JWT e status 200. 2. Com credenciais inválidas, retorna um erro 401 Unauthorized. | 	⬜ Pendente |
| [Auth] Implementar middleware de proteção de rotas (JWT Guard) | Criar um Guard que extrai o token JWT do header, verifica sua validade e anexa os dados do usuário (userId, role) ao objeto request. | Rotas protegidas com este Guard retornam 401 Unauthorized se o token for inválido ou ausente. | 	⬜ Pendente |
| [Auth] Implementar endpoint para obter dados do usuário logado (GET /auth/me) | Criar um endpoint protegido que usa o JWT Guard para identificar o usuário e retornar seus dados (exceto a senha). | Acessar GET /auth/me com um token válido retorna os dados do usuário correspondente. | 	⬜ Pendente |
| [Auth] Implementar middleware de controle de acesso (RBAC Guard) | Criar um Guard que verifica o perfil (role) do usuário para restringir o acesso a rotas específicas (ex: apenas ADMIN). | Um usuário com perfil PRODUTOR recebe 403 Forbidden ao tentar acessar uma rota protegida para ADMIN. | 	⬜ Pendente |

3. Feature: Dashboard & Gestão de Cursos

| Task | Descrição | Aceite | Status |
|------|-----------|--------|--------|
| [Model] Modelar entidade Course | Definir o schema completo para Course, incluindo title, description, status (enum), startDate, targetDate, category, e o relacionamento many-to-many com User (membros da equipe). | O schema do Course e sua tabela de junção com User são criados via migração. | 	⬜ Pendente |
| [Feature] Implementar CRUD para Course | Criar os endpoints RESTful para gerenciar cursos (POST, GET, PUT, DELETE). | Todos os endpoints estão funcionais, protegidos por autenticação, e as operações de escrita são restritas por perfil. | 	⬜ Pendente |
| [Feature] Implementar endpoint para o Dashboard Kanban (GET /dashboard/cursos) | Criar um endpoint otimizado que retorna todos os cursos formatados para renderização do Kanban, agrupáveis por status. | O endpoint retorna um array de cursos com os dados essenciais para os cards do Kanban. | 	⬜ Pendente |
| [Feature] Implementar endpoint de atualização de status (PATCH /cursos/:id/status) | Criar o endpoint que recebe um novo status, valida a transição de estado e atualiza o curso no banco. | A requisição PATCH atualiza o status do curso e retorna o curso atualizado. | 	⬜ Pendente |
| [Feature] Implementar endpoints de gestão de membros do curso | Criar rotas para associar e desassociar usuários de um curso (POST /cursos/:id/membros, DELETE /cursos/:id/membros/:userId). | As operações refletem corretamente a associação na tabela de junção. | 	⬜ Pendente |
4. Feature: Gestão de Tarefas & Detalhes

| Task | Descrição | Aceite | Status |
|------|-----------|--------|--------|
| [Model] Modelar entidades Task, Subtask, Comment, ActivityLog | Definir os schemas para Task, Subtask (relacionado a Task), Comment (relacionado a Task e User) e ActivityLog (para rastreamento de mudanças). | Todos os schemas e seus relacionamentos são criados via migração do banco de dados. | 	⬜ Pendente |
| [Feature] Implementar CRUD para Task | Criar os endpoints RESTful para gerenciar tarefas. O listagem (GET /tarefas) deve suportar filtros por query params (ex: ?responsavelId=..., ?status=...). | É possível criar, listar (com filtros), obter, atualizar e excluir tarefas através da API. | 	⬜ Pendente |
| [Feature] Implementar CRUD para Subtask | Criar endpoints para gerenciar subtarefas (POST /tarefas/:id/subtarefas, PATCH /subtarefas/:subtaskId, DELETE /subtarefas/:subtaskId). | As operações de subtarefas funcionam e estão corretamente associadas à tarefa pai. | 	⬜ Pendente | 
| [Feature] Implementar endpoint de Comentários (POST /tarefas/:id/comentarios) | Criar um endpoint para adicionar um comentário a uma tarefa, associando o comentário ao userId do token. | Um novo comentário é salvo no banco com o conteúdo, taskId e userId corretos. | 	⬜ Pendente |
| [Feature] Implementar lógica de logging de atividade | Integrar a criação de registros na tabela ActivityLog nos serviços que modificam entidades importantes (ex: mudança de status de Task). | Alterar o status de uma tarefa cria um registro em ActivityLog com a descrição da mudança. | 	⬜ Pendente |
| [Feature] Implementar o cálculo de Progresso (%) na API | No serviço que busca uma tarefa (GET /tarefas/:id), calcular dinamicamente o progresso com base nas subtarefas concluídas versus o total de subtarefas. | O JSON de retorno para GET /tarefas/:id inclui um campo progresso calculado (ex: 0.5 para 50%). | 	⬜ Pendente

5. Feature: Gestão de Arquivos (Attachments) - (MVP Sprint 2)

| Task | Descrição | Aceite | Status |
|------|-----------|--------|--------|
| [Model] Modelar entidade Attachment | Criar o schema para Attachment, incluindo filename, path/url, mimetype, size, version, e relacionamento com Task e User. | O novo schema é criado no banco de dados. | 	⬜ Pendente |
| [Feature] Implementar Upload de Arquivos (POST /tarefas/:id/anexos) | Criar o endpoint que recebe arquivos, salva-os em um sistema de armazenamento (local/cloud) e registra o metadado no banco de dados. | É possível fazer upload de um arquivo e ver seu registro na tarefa. | 	⬜ Pendente |
| [Feature] Implementar Download de Arquivos (GET /tarefas/:id/anexos/:anexoId) | Criar o endpoint para servir o arquivo (stream) ao usuário, garantindo proteção por autenticação. | Um usuário autenticado pode baixar o arquivo anexado. | 	⬜ Pendente |
| [Feature] Implementar Controle de Versão (Subida de Nova Versão) | Criar lógica no endpoint de upload que, ao receber um arquivo com o mesmo nome e contexto, incrementa a versão e marca a versão anterior como inativa. | O histórico de versões do arquivo pode ser rastreado no banco. | 	⬜ Pendente |

6. Feature: Telas de Gestão & Relatórios

| Task | Descrição | Aceite | Status |
|------|-----------|--------|--------|
| [Model] Modelar LibraryItem e Formation | Criar os schemas para LibraryItem (título, url, categoria) e Formation. | As novas tabelas são criadas no banco de dados via migração. | 	⬜ Pendente |
| [Feature] Implementar CRUD para LibraryItem | Criar os endpoints RESTful (POST, GET, PUT, DELETE) para a entidade LibraryItem. | A gestão completa de itens da biblioteca é possível via API. | 	⬜ Pendente |
| [Feature] Implementar CRUD para Formation | Criar os endpoints RESTful (POST, GET, PUT, DELETE) para a entidade Formation. | A gestão completa de formações é possível via API. | 	⬜ Pendente |
| [Feature] Implementar CRUD para User (Admin only) | Criar os endpoints RESTful (POST, GET, PUT, DELETE) em /admin/usuarios. Todas as rotas devem ser protegidas por RBAC Guard (ADMIN apenas). | Um administrador pode criar, listar, editar (incluindo o perfil) e excluir usuários. | 	⬜ Pendente |
| [Feature] Implementar Relatório Semanal (GET /relatorios/semanal) | Criar um endpoint otimizado para gerar as métricas de progresso (Tasks concluídas, em andamento, pendentes por Course), conforme solicitado no MVP. | O endpoint retorna um JSON com dados sumarizados para o relatório. | 	⬜ Pendente |

7. Qualidade & Deploy

| Task | Descrição | Aceite | Status |
|------|-----------|--------|--------|
| [Docs] Configurar documentação de API (Swagger/OpenAPI) | Integrar a funcionalidade nativa do NestJS com o Swagger para gerar documentação da API automaticamente a partir dos decorators. | Uma rota /api-docs está disponível e exibe uma UI interativa da documentação da API. | 	⬜ Pendente |
| [Test] Implementar testes unitários e de integração | Escrever testes para as lógicas de negócio críticas (services) e para os endpoints principais (ex: autenticação, CRUD de cursos). | A suíte de testes (npm test) roda e cobre as funcionalidades essenciais. | 	⬜ Pendente |
| [Deploy] Configurar Docker para o ambiente de desenvolvimento | Criar um Dockerfile e um docker-compose.yml para orquestrar a aplicação backend e o banco de dados. | O comando docker-compose up inicia a aplicação e o banco de dados com sucesso. | 	⬜ Pendente |
| [Deploy] Preparar scripts para build e deploy de produção | Configurar o package.json com scripts para construir a aplicação para produção (npm run build) e definir um pipeline de CI/CD básico. | Um build de produção é gerado sem erros. | 	⬜ Pendente |