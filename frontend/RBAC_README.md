# RBAC - Role-Based Access Control

## Visão Geral

Sistema de controle de acesso baseado em perfis (roles) que permite definir quais funcionalidades cada tipo de usuário pode acessar.

## Perfis de Usuário

### Admin
- **Acesso total** ao sistema
- Pode acessar **todas as funcionalidades**
- Possui acesso exclusivo à **Gestão de Usuários**
- Vê todos os itens do menu

### Produtor
- **Acesso limitado** ao sistema
- Pode acessar funcionalidades padrão (Dashboard, Courses, Library, Team, Analytics)
- **NÃO pode acessar** a Gestão de Usuários
- **NÃO vê** o link de Gestão de Usuários no menu

## Arquitetura

### 1. Hook `usePermissions`
Localização: `src/hooks/usePermissions.ts`

Fornece funções para verificar permissões:
```typescript
const { hasRole, isAdmin, isProdutor, getCurrentRole } = usePermissions();

// Verificar se tem um role específico
if (isAdmin()) {
  // Código apenas para Admin
}

// Verificar múltiplos roles
if (hasRole(['Admin', 'Produtor'])) {
  // Código para Admin ou Produtor
}
```

### 2. Componente `RoleGuard`
Localização: `src/components/RoleGuard.tsx`

Protege rotas no React Router:
```tsx
<Route element={<RoleGuard allowedRoles={['Admin']} />}>
  <Route path="/user-management" element={<UserManagement />} />
</Route>
```

**Comportamento:**
- Se o usuário TEM permissão → renderiza as rotas filhas
- Se o usuário NÃO TEM permissão → redireciona para `/dashboard`

### 3. Sidebar com Filtro de Permissões
Localização: `src/components/Sidebar.tsx`

Menu items podem ter `allowedRoles`:
```typescript
{
  id: 'user-management',
  label: 'Gestão de Usuários',
  icon: Shield,
  path: '/user-management',
  allowedRoles: ['Admin'] // Apenas Admin vê este item
}
```

O sidebar filtra automaticamente os itens baseado nas permissões do usuário.

## Fluxo de Proteção

### Proteção em Camadas

1. **Camada de UI (Sidebar)**
   - Usuário Produtor **não vê** o link de "Gestão de Usuários"
   - Menu é filtrado automaticamente

2. **Camada de Roteamento (RoleGuard)**
   - Se um usuário Produtor tentar acessar `/user-management` diretamente na URL
   - Será **redirecionado** automaticamente para `/dashboard`
   - Não consegue burlar a proteção

3. **Camada de Componente (usePermissions)**
   - Componentes podem usar o hook para renderização condicional
   - Exemplo: mostrar/esconder botões baseado no role

## Exemplo Prático

### Testando como Admin

1. Faça login com email contendo "admin":
   ```
   Email: admin@teste.com
   Senha: 123456
   ```

2. No menu lateral, você verá:
   - ✅ Dashboard
   - ✅ Courses
   - ✅ Library
   - ✅ Team
   - ✅ Analytics
   - ✅ **Gestão de Usuários** (exclusivo)

3. Acesse `/user-management`:
   - ✅ Funciona normalmente
   - Mostra página completa de gestão

### Testando como Produtor

1. Faça login com email SEM "admin":
   ```
   Email: produtor@teste.com
   Senha: 123456
   ```

2. No menu lateral, você verá:
   - ✅ Dashboard
   - ✅ Courses
   - ✅ Library
   - ✅ Team
   - ✅ Analytics
   - ❌ **Gestão de Usuários** (não aparece)

3. Tente acessar `/user-management` diretamente:
   - ❌ Será redirecionado para `/dashboard`
   - Não consegue acessar

## Como Adicionar Novas Funcionalidades Protegidas

### 1. Criar a Página

```tsx
// src/pages/MinhaNovaFuncionalidade.tsx
export default function MinhaNovaFuncionalidade() {
  const { isAdmin } = usePermissions();

  return (
    <div>
      {/* Conteúdo da página */}
    </div>
  );
}
```

### 2. Adicionar no Sidebar

```typescript
// src/components/Sidebar.tsx
const menuItems: MenuItem[] = [
  // ... outros items
  {
    id: 'minha-funcionalidade',
    label: 'Minha Funcionalidade',
    icon: MinhaIcon,
    path: '/minha-funcionalidade',
    allowedRoles: ['Admin'] // Define quem pode ver
  },
];
```

### 3. Proteger a Rota

```tsx
// src/App.tsx
<Route element={<RoleGuard allowedRoles={['Admin']} />}>
  <Route path="/minha-funcionalidade" element={<MinhaNovaFuncionalidade />} />
</Route>
```

## Estrutura de Arquivos

```
src/
├── hooks/
│   └── usePermissions.ts       # Hook de permissões
├── components/
│   ├── RoleGuard.tsx          # Proteção de rotas
│   └── Sidebar.tsx            # Menu com filtro de roles
├── pages/
│   └── UserManagement.tsx     # Exemplo de página protegida
├── store/
│   └── types.ts               # Tipos (UserRole)
└── App.tsx                    # Configuração de rotas
```

## Verificação dos Critérios de Aceite

### ✅ Critério: Produtor não vê link de Gestão de Usuários
- **Implementado**: Sidebar filtra menu items baseado em `allowedRoles`
- **Teste**: Login como produtor → link não aparece

### ✅ Critério: Produtor não consegue acessar rota
- **Implementado**: `RoleGuard` protege a rota `/user-management`
- **Teste**: Acesso direto via URL → redireciona para `/dashboard`

## Recursos Implementados

✅ Sistema RBAC completo
✅ Hook `usePermissions` para verificação de permissões
✅ Componente `RoleGuard` para proteção de rotas
✅ Sidebar com filtro automático de menu items
✅ Página de Gestão de Usuários (exclusiva para Admin)
✅ Proteção em múltiplas camadas (UI + Routing)
✅ Redirecionamento automático para usuários sem permissão
✅ Tipos TypeScript para roles (Admin, Produtor)

## Logs no Console

Quando usar modo mockado, você verá logs indicando o role atribuído:
```
🔧 Usando autenticação MOCKADA
```

Para verificar seu role atual, você pode usar:
```typescript
const { getCurrentRole } = usePermissions();
console.log('Meu role:', getCurrentRole());
```
