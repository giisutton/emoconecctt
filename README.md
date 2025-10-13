# 🌟 EmoConnect - Plataforma de Apoio Emocional

Uma plataforma completa de saúde mental e apoio emocional com IA integrada, desenvolvida com tecnologias modernas e boas práticas de desenvolvimento.

## 🔗 Links Importantes

- **Deploy na Vercel**: [emoconnect.vercel.app](https://emoconnect.vercel.app) _(Atualizar após deploy)_
- **Repositório GitHub**: https://github.com/giisutton/emoconecctt
- **Documentação**: [Ver abaixo](#📋-índice)

## 📋 Índice

- [Características](#-características)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação](#-instalação)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Ambientes de Desenvolvimento](#-ambientes-de-desenvolvimento)
- [Testes](#-testes)
- [Deploy](#-deploy)
- [Monitoramento](#-monitoramento)
- [API](#-api)
- [Contribuição](#-contribuição)

## ✨ Características

- **Chat com IA**: Integração com Google Gemini para apoio emocional inteligente
- **Interface Responsiva**: Design adaptável para desktop e mobile
- **Sistema de Humor**: Tracking diário de estado emocional
- **Comunidade**: Conexão segura entre usuários
- **PWA**: Funciona offline e pode ser instalada
- **Analytics**: Monitoramento de uso e performance
- **Segurança**: Implementação de HTTPS, CSP e rate limiting
- **Performance**: Build otimizado e lazy loading

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5/CSS3/JavaScript ES6+**
- **Vite** - Build tool moderna
- **localStorage** - Armazenamento local de dados
- **PWA** - Progressive Web App

### Backend
- **Node.js + Express** - Servidor API
- **MySQL** - Banco de dados (AlwaysData)
- **Winston** - Sistema de logs
- **Helmet** - Segurança HTTP

### DevOps
- **Vite** - Build tool moderna
- **Vercel** - Deploy e hospedagem
- **Git** - Controle de versão
- **npm** - Gerenciador de pacotes

## 🏗️ Estrutura do Projeto

```
emoconecctt/
├── 📁 emoconnect/                    # Frontend source
│   ├── 📁 html/                      # Páginas HTML
│   ├── 📁 css/                       # Estilos
│   └── 📁 js/                        # JavaScript modules
├── 📁 server/                        # Backend API
├── 📁 tests/                         # Testes automatizados
├──  package.json                   # Dependências e scripts
├── 📄 vite.config.js                 # Build configuration
├── 📄 vercel.json                    # Configuração Vercel
└── 📄 README.md                      # Documentação
```

## 🚀 Instalação

### Pré-requisitos
- **Node.js** >= 18.0.0 ([Download aqui](https://nodejs.org/))
- **npm** >= 8.0.0 (vem com Node.js)
- **Git** ([Download aqui](https://git-scm.com/))

### Passo a passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/giisutton/emoconecctt.git
   cd emoconecctt
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente (OPCIONAL)**
   - O projeto funciona sem configuração adicional!
   - Se quiser usar API do Gemini via servidor (mais seguro):
     - Copie `.env.example` para `.env`
     - Adicione sua chave: `GEMINI_API_KEY=sua_chave`
     - **Obter chave do Gemini**: https://makersuite.google.com/app/apikey
   - **Nota**: O projeto usa localStorage para salvar dados localmente

4. **Execute em modo de desenvolvimento**
   ```bash
   npm run dev
   ```
   Ou execute frontend e backend separadamente:
   ```bash
   # Terminal 1 - Backend
   npm run server:dev
   
   # Terminal 2 - Frontend
   npm run client:dev
   ```

5. **Acesse a aplicação**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:3000
   - **Health Check**: http://localhost:3000/api/health

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia frontend + backend
npm run server:dev       # Apenas backend
npm run client:dev       # Apenas frontend

# Build e produção
npm run build            # Build para produção
npm run build:prod       # Build otimizado
npm run start            # Executar em produção
npm run preview          # Preview do build

# Qualidade de código
npm run lint             # Verificar código
npm run lint:fix         # Corrigir automaticamente
npm run format           # Formatar código

# Testes
npm run test             # Executar testes
npm run test:ui          # Interface visual dos testes
npm run test:coverage    # Relatório de cobertura

# Utilitários
npm run clean            # Limpar build
npm run deploy           # Deploy para Vercel

# Banco de Dados
npm run db:test          # Testar conexão MySQL
npm run db:init          # Inicializar banco de dados
```

## 🌍 Ambientes de Desenvolvimento

### Development
- **URL**: http://localhost:5173
- **Logs**: Debug level
- **Hot reload**: Ativo
- **Source maps**: Ativo

### Staging  
- **URL**: https://staging.emoconnect.app
- **Logs**: Info level
- **Analytics**: Ativo
- **Error tracking**: Ativo

### Production
- **URL**: https://emoconnect.app
- **Logs**: Error level apenas
- **Minification**: Ativo
- **CDN**: CloudFlare

## 🧪 Testes

```bash
# Executar todos os testes
npm run test

# Testes com interface visual
npm run test:ui

# Cobertura de código
npm run test:coverage

# Testes específicos
npm run test -- config.test.js
```

### Tipos de teste:
- **Unit**: Componentes individuais
- **Integration**: Interação entre módulos
- **E2E**: Fluxo completo do usuário

## 🐳 Deploy

### Deploy na Vercel (Recomendado para o projeto)

1. **Instale a CLI do Vercel** (opcional)
   ```bash
   npm i -g vercel
   ```

2. **Faça login no Vercel**
   ```bash
   vercel login
   ```

3. **Deploy do projeto**
   ```bash
   vercel
   ```
   
4. **Para produção**
   ```bash
   vercel --prod
   ```

5. **Configurar variáveis de ambiente no Vercel**
   - Acesse: https://vercel.com/dashboard
   - Vá em Settings > Environment Variables
   - Adicione todas as variáveis do `.env`

**Ou via GitHub:**
1. Conecte seu repositório GitHub ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push!

### Docker (Opcional)

```bash
# Build da imagem
docker build -t emoconnect .

# Executar container
docker run -p 3000:3000 emoconnect

# Com Docker Compose
docker-compose up -d
```

### Build Manual

```bash
# Build para produção
npm run build:prod

# Os arquivos estarão em /dist
# Faça upload para seu servidor
```

## 📊 Monitoramento

### Métricas acompanhadas:
- **Performance**: LCP, FID, CLS
- **Erros**: JavaScript errors, API failures
- **Analytics**: User interactions, page views
- **Uptime**: Server availability

### Dashboards disponíveis:
- **/api/health** - Health check
- **/api/metrics** - Performance metrics
- **Analytics dashboard** - User analytics

## 🔌 API

### Endpoints principais:

```bash
GET  /api/health              # Status do servidor
POST /api/v1/chat/gemini      # Chat com IA
POST /api/v1/analytics/event  # Track de eventos
POST /api/v1/errors           # Report de erros
```

### Autenticação:
- **Rate limiting**: 100 requests/15min
- **CORS**: Configurado por ambiente
- **Headers**: Content-Type, Authorization

### Exemplo de uso:

```javascript
// Chat com IA
const response = await fetch('/api/v1/chat/gemini', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    message: 'Como você pode me ajudar?' 
  })
});

const data = await response.json();
console.log(data.response);
```

## 📖 Como Usar o EmoConnect

### Página Inicial
1. **Selecione seu humor**: Clique em um dos cards de humor (Feliz, Triste, Ansioso, etc)
2. **Exercício de Respiração**: Clique em "Respirar" para fazer um exercício guiado
3. **Atividades**: Marque suas atividades diárias de bem-estar
4. **Ver Progresso**: Visualize seus gráficos emocionais semanais e mensais
5. **Mural de Apoio**: Compartilhe mensagens positivas com a comunidade

### Chat
- **Modo Usuário**: Converse com outros usuários da plataforma
- **Modo IA**: Converse com nossa assistente de apoio emocional
- Troque entre os modos usando os botões no topo

### Perfil
- Configure suas informações pessoais
- Veja seu histórico de humores
- Gerencie suas preferências

## 🤝 Contribuição

### Como contribuir:

1. **Fork** o projeto
2. **Crie uma branch** para sua feature
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```
3. **Commit** suas mudanças
   ```bash
   git commit -m 'Adiciona nova funcionalidade'
   ```
4. **Push** para a branch
   ```bash
   git push origin feature/nova-funcionalidade
   ```
5. **Abra um Pull Request**

### Guidelines:
- ✅ Testes passando
- ✅ Código formatado (Prettier)
- ✅ Linting sem erros (ESLint)
- ✅ Documentação atualizada

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

- **Giovana Sutton** - Desenvolvimento principal
- **Contributors** - Veja [CONTRIBUTORS.md](CONTRIBUTORS.md)

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/giisutton/emoconecctt/issues)
- **Discussões**: [GitHub Discussions](https://github.com/giisutton/emoconecctt/discussions)
- **Email**: suporte@emoconnect.app

---

## 🏆 Status do Projeto

![Build Status](https://img.shields.io/github/workflow/status/giisutton/emoconecctt/CI)
![Coverage](https://img.shields.io/codecov/c/github/giisutton/emoconecctt)
![Version](https://img.shields.io/github/package-json/v/giisutton/emoconecctt)
![License](https://img.shields.io/github/license/giisutton/emoconecctt)

**EmoConnect v1.0.0** - Conectando pessoas através do cuidado emocional 💜