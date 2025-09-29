# 🌟 EmoConnect - Plataforma de Apoio Emocional

Uma plataforma completa de saúde mental e apoio emocional com IA integrada, desenvolvida com tecnologias modernas e boas práticas de desenvolvimento.

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
- **Firebase** - Banco de dados em tempo real
- **PWA** - Progressive Web App

### Backend
- **Node.js + Express** - Servidor API
- **Winston** - Sistema de logs
- **Helmet** - Segurança HTTP
- **Rate Limiting** - Proteção contra spam

### DevOps
- **Docker** - Containerização
- **GitHub Actions** - CI/CD
- **ESLint/Prettier** - Code quality
- **Vitest** - Framework de testes

## 🏗️ Estrutura do Projeto

```
emoconecctt/
├── 📁 emoconnect_chat_corrigido/     # Frontend source
│   ├── 📁 html/                      # Páginas HTML
│   ├── 📁 css/                       # Estilos
│   └── 📁 js/                        # JavaScript modules
├── 📁 server/                        # Backend API
├── 📁 tests/                         # Testes automatizados
├── 📁 .github/workflows/             # CI/CD pipelines
├── 📄 package.json                   # Dependências e scripts
├── 📄 vite.config.js                 # Build configuration
├── 📄 Dockerfile                     # Container configuration
└── 📄 docker-compose.yml             # Multi-container setup
```

## 🚀 Instalação

### Pré-requisitos
- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Git**

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

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Edit .env with your configurations
   ```

4. **Execute em modo de desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

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
npm run deploy           # Deploy para Firebase
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

### Docker (Recomendado)

```bash
# Build da imagem
docker build -t emoconnect .

# Executar container
docker run -p 3000:3000 emoconnect

# Com Docker Compose
docker-compose up -d
```

### Manual

```bash
# Build para produção
npm run build:prod

# Upload para servidor
rsync -avz dist/ user@server:/var/www/emoconnect/

# Restart do servidor
ssh user@server 'pm2 restart emoconnect'
```

### CI/CD Automático

O projeto possui pipeline automático que:
1. **Executa testes** em cada push
2. **Build automático** na branch main
3. **Deploy** para staging e produção
4. **Verificações de segurança**

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