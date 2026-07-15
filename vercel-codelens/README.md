# CodeLens - Deploy na Vercel

## Passo a passo

### 1. Banco de dados PostgreSQL (gratis)
1. Va em https://neon.tech e crie uma conta gratuita
2. Crie um novo projeto e copie a DATABASE_URL

### 2. Deploy na Vercel
1. Va em https://vercel.com e faca login com sua conta GitHub
2. Clique em "New Project"
3. Importe o repositorio "codelens"
4. Configure as variaveis de ambiente:
   - `DATABASE_URL` = a URL que copiou do Neon
5. Clique em "Deploy"

### Funcionalidades
- Editor de codigo com syntax highlighting
- Upload de projetos via ZIP
- Importacao/exportacao GitHub
- Analise de codigo com IA (Gemini/OpenAI/Anthropic/Groq)
- Terminal integrado
- Preview ao vivo
- Multi-perfis de configuracao
