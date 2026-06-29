# Dimensy Frontend

Interface React + Vite + Tailwind CSS para a plataforma Dimensy.

## Requisitos

- Node.js >= 18
- Projeto Supabase configurado
- Backend Dimensy rodando

## Instalação

```bash
npm install
cp .env.example .env
# Preencha as variáveis no .env
npm run dev
```

## Variáveis de Ambiente

| Variável | Descrição |
|---|---|
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Anon Key pública do Supabase |
| `VITE_API_URL` | URL do backend (ex: https://dimensy-backend.onrender.com) |

## Scripts

```bash
npm run dev      # Desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
```

## Estrutura de Rotas

### Rotas públicas
- `/entrar` — Login do prestador
- `/cadastro` — Cadastro do prestador
- `/:slug` — Página pública da empresa (para clientes)

### Painel do prestador (autenticado)
- `/painel` — Dashboard
- `/painel/leads` — Lista de leads
- `/painel/leads/:id` — Detalhes do lead
- `/painel/minha-pagina` — Configurar empresa/página
- `/painel/ramos` — Gerenciar ramos de atuação
- `/painel/servicos` — Gerenciar serviços
- `/painel/configuracoes` — Configurações
- `/painel/perfil` — Perfil e senha

## Deploy

### Vercel (recomendado)
1. Conecte o repositório no Vercel
2. Framework Preset: Vite
3. Adicione as variáveis de ambiente
4. Deploy!

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Adicione as variáveis de ambiente
