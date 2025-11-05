# Store Global - Zustand

## Visão Geral

Este diretório contém a implementação de estado global usando **Zustand**, uma biblioteca leve e performática para gerenciamento de estado em React.

## Estrutura

```
store/
├── types.ts          # Tipos TypeScript para o store
├── useUserStore.ts   # Store de usuário e autenticação
└── README.md         # Este arquivo
```

## Instalação

O Zustand já foi instalado via npm:

```bash
npm install zustand
```

## Como Usar

### 1. Acessar dados do usuário em qualquer componente

```tsx
import { useUserStore } from '@/store/useUserStore';

function MeuComponente() {
  // Acessar estado do store
  const user = useUserStore((state) => state.user);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  return (
    <div>
      {isAuthenticated ? (
        <p>Bem-vindo, {user?.name}!</p>
      ) : (
        <p>Por favor, faça login</p>
      )}
    </div>
  );
}
```

### 2. Chamar ações do store (login, logout, etc)

```tsx
import { useUserStore } from '@/store/useUserStore';

function LoginForm() {
  const login = useUserStore((state) => state.login);
  const isLoading = useUserStore((state) => state.isLoading);
  const error = useUserStore((state) => state.error);

  const handleSubmit = async (email: string, password: string) => {
    try {
      await login(email, password);
      // Login bem-sucedido
    } catch (error) {
      // Erro ao fazer login
      console.error(error);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit('user@email.com', 'senha');
    }}>
      {error && <p className="text-red-500">{error}</p>}
      {isLoading && <p>Carregando...</p>}
      <button type="submit">Fazer Login</button>
    </form>
  );
}
```

### 3. Acessar múltiplos estados

```tsx
import { useUserStore } from '@/store/useUserStore';

function UserProfile() {
  // Acessar múltiplos valores de uma vez (mais eficiente)
  const { user, isAuthenticated, error, logout } = useUserStore(
    (state) => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      error: state.error,
      logout: state.logout,
    })
  );

  if (!isAuthenticated) {
    return <p>Não autenticado</p>;
  }

  return (
    <div>
      <h1>{user?.name}</h1>
      <p>{user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## API do Store

### Estado (State)

#### `user: User | null`
O usuário atualmente autenticado. É `null` se não houver usuário autenticado.

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
  avatar?: string;
  createdAt: Date;
}
```

#### `isAuthenticated: boolean`
Indica se um usuário está autenticado.

#### `isLoading: boolean`
Indica se há uma operação em andamento (login, registro, etc).

#### `error: string | null`
Mensagem de erro da última operação, ou `null` se não houver erro.

### Ações (Actions)

#### `login(email: string, password: string): Promise<void>`
Faz login com email e senha.

```tsx
const login = useUserStore((state) => state.login);
await login('user@email.com', 'senha123');
```

#### `logout(): void`
Faz logout do usuário atual e limpa os dados.

```tsx
const logout = useUserStore((state) => state.logout);
logout();
```

#### `register(name: string, email: string, password: string, role: string): Promise<void>`
Registra um novo usuário.

```tsx
const register = useUserStore((state) => state.register);
await register('João', 'joao@email.com', 'senha123', 'student');
```

#### `setUser(user: User): void`
Define o usuário manualmente (útil para restaurar de localStorage ou API).

```tsx
const setUser = useUserStore((state) => state.setUser);
setUser(userData);
```

#### `setError(error: string | null): void`
Define uma mensagem de erro.

```tsx
const setError = useUserStore((state) => state.setError);
setError('Algo deu errado');
```

#### `clearError(): void`
Limpa a mensagem de erro.

```tsx
const clearError = useUserStore((state) => state.clearError);
clearError();
```

## Inicialização

O store é inicializado automaticamente no componente `App.tsx` via `initializeUserStore()`. Esta função:

1. Verifica se há usuário salvo no localStorage
2. Se existir, restaura o usuário e marca como autenticado
3. Se não, deixa o store vazio

```tsx
// Em App.tsx
import { initializeUserStore } from '@/store/useUserStore';

useEffect(() => {
  initializeUserStore();
}, []);
```

## Persistência

O store automaticamente salva o usuário no localStorage quando:
- Login é bem-sucedido
- Novo usuário é registrado
- `setUser()` é chamado

O localStorage é limpo quando:
- Logout é executado

## Exemplos de Uso Comum

### Exemplo 1: Componente que mostra informações do usuário

```tsx
function Header() {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  return (
    <header className="bg-white p-4">
      {user ? (
        <div className="flex items-center justify-between">
          <p>Bem-vindo, {user.name}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <p>Faça login para continuar</p>
      )}
    </header>
  );
}
```

### Exemplo 2: Formulário de login

```tsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useUserStore((state) => state.login);
  const isLoading = useUserStore((state) => state.isLoading);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Redirecionar ou fazer algo após login bem-sucedido
    } catch (error) {
      // Erro é capturado no store
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Entrando...' : 'Fazer Login'}
      </button>
    </form>
  );
}
```

### Exemplo 3: Verificar autenticação antes de renderizar

```tsx
function ProtectedRoute() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Dashboard />;
}
```

## Boas Práticas

1. **Use seletores específicos**: Acesse apenas o que precisa para evitar re-renderizações desnecessárias
   ```tsx
   // ✅ Bom - acessa apenas user
   const user = useUserStore((state) => state.user);

   // ❌ Evitar - acessa todo o store
   const store = useUserStore();
   ```

2. **Trate erros adequadamente**: Sempre capture erros ao chamar ações assíncronas
   ```tsx
   try {
     await login(email, password);
   } catch (error) {
     console.error('Erro:', error);
   }
   ```

3. **Limpe erros quando apropriado**: Use `clearError()` quando necessário
   ```tsx
   useEffect(() => {
     clearError();
   }, []);
   ```

## Futuras Extensões

Este store foi projetado para ser facilmente estendido. Você pode adicionar novos stores para:

- **Cursos**: Gerenciar lista de cursos
- **Configurações**: Preferências do usuário
- **Notificações**: Sistema de notificações global
- **UI**: Estado de modais, sidebars, etc

Exemplo de novo store:

```typescript
// store/useCourseStore.ts
import { create } from 'zustand';

export const useCourseStore = create((set) => ({
  courses: [],
  addCourse: (course) => set((state) => ({
    courses: [...state.courses, course]
  })),
  // ... mais ações
}));
```

## Troubleshooting

### Problema: Usuário não persiste após reload
**Solução**: Verifique se `initializeUserStore()` está sendo chamado no componente raiz.

### Problema: Estado não está atualizando em componentes
**Solução**: Verifique se você está usando o hook `useUserStore` corretamente e selecionando os valores que deseja observar.

### Problema: localStorage não está funcionando
**Solução**: Verifique se o navegador tem o localStorage habilitado e se não está em modo privado.
