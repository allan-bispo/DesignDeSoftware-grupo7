# Autenticação - Guia de Uso

## Como Funciona

A autenticação está implementada com suporte para **modo mockado** (para desenvolvimento) e **modo real** (para produção).

## Configuração

### Modo Mockado (Desenvolvimento)

1. Certifique-se que o arquivo `.env` existe com:
```env
VITE_USE_MOCK_AUTH=true
```

2. Execute o projeto:
```bash
npm run dev
```

3. Faça login com qualquer email e senha (mínimo 3 caracteres na senha)

### Modo Real (Produção)

1. Atualize o arquivo `.env`:
```env
VITE_API_URL=http://localhost:3000/api
VITE_USE_MOCK_AUTH=false
```

2. Certifique-se que o backend está rodando

3. Execute o projeto:
```bash
npm run dev
```

## Credenciais de Teste (Modo Mock)

No modo mockado, você pode usar qualquer credencial:

| Email | Senha | Role Atribuído |
|-------|-------|----------------|
| admin@email.com | qualquer (min 3 chars) | admin |
| professor@email.com | qualquer (min 3 chars) | instructor |
| usuario@email.com | qualquer (min 3 chars) | student |

**Dica:** O role é determinado pelo email:
- Contém "admin" → role: admin
- Contém "professor" ou "instructor" → role: instructor
- Outros → role: student

## Fluxo de Autenticação

1. Usuário preenche email e senha no formulário de login
2. Sistema chama `POST /auth/login` (mockado ou real)
3. Retorna:
   - Token JWT
   - Dados do usuário (id, name, email, role, avatar)
4. Token e usuário são salvos no `localStorage`
5. Usuário é redirecionado para `/dashboard`
6. Todas as requisições subsequentes incluem o token no header `Authorization: Bearer <token>`

## Tratamento de Erros

### Mockado
- Senha com menos de 3 caracteres → "Credenciais inválidas"
- Email ou senha vazio → "Email e senha são obrigatórios"

### Real
- 401 Unauthorized → Sessão expirada, redireciona para login
- Outros erros → Exibe mensagem retornada pelo backend

## Estrutura de Arquivos

```
src/
├── services/
│   ├── api.tsx              # Cliente HTTP com suporte a JWT
│   └── authService.ts       # Serviço de autenticação (mock + real)
├── store/
│   ├── useUserStore.ts      # Estado global de autenticação
│   └── types.ts             # Tipos do store
├── types/
│   └── api.tsx             # Tipos da API (LoginRequest, LoginResponse)
└── pages/
    └── Login.tsx           # Página de login
```

## Migração de Mock para Real

Quando o backend estiver pronto:

1. Atualize o `.env`:
```env
VITE_USE_MOCK_AUTH=false
```

2. O backend deve responder em `POST /auth/login` com:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "name": "Nome do Usuário",
    "email": "usuario@email.com",
    "role": "student",
    "avatar": "https://url-do-avatar.com/avatar.jpg"
  }
}
```

3. Pronto! Não precisa alterar nenhum código

## Recursos Implementados

✅ Login com email e senha
✅ Armazenamento de token JWT
✅ Persistência de sessão (localStorage)
✅ Redirecionamento após login
✅ Tratamento de erros
✅ Logout
✅ Inclusão automática de token nas requisições
✅ Modo mockado para desenvolvimento
✅ Fácil migração para API real
