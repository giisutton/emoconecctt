import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import winston from 'winston';
import { testConnection } from './config/database.js';
import apiRoutes from './routes/api.js';

// Configurar ambiente
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurar logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'emoconnect-api' },
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://www.gstatic.com", "https://cdn.jsdelivr.net"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            connectSrc: ["'self'", "https://generativelanguage.googleapis.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:"]
        }
    }
}));

// CORS configuration
const corsOptions = {
    origin: NODE_ENV === 'production'
        ? ['https://your-domain.com']
        : ['http://localhost:3000', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
});

app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Request logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path} - ${req.ip}`);
    next();
});

// Serve static files
app.use(express.static(join(__dirname, '../dist')));
if (NODE_ENV === 'development') {
    app.use(express.static(join(__dirname, '../emoconnect')));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
        environment: NODE_ENV
    });
});

// API versioning
app.use('/api/v1', (req, res, next) => {
    res.header('API-Version', 'v1');
    next();
});

// Rotas de dados (banco de dados)
app.use('/api/v1/data', apiRoutes);

// Gemini AI proxy endpoint (para ocultar API key)
app.post('/api/v1/chat/gemini', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                error: 'Mensagem é obrigatória',
                code: 'INVALID_MESSAGE'
            });
        }

        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + process.env.GEMINI_API_KEY, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Você é um assistente de apoio emocional especializado em saúde mental. Responda de forma empática, acolhedora e profissional. Mensagem: ${message}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();

        res.json({
            response: data.candidates[0]?.content?.parts[0]?.text || 'Desculpe, não consegui gerar uma resposta no momento.',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        logger.error('Gemini API Error:', error);
        res.status(500).json({
            error: 'Erro interno do servidor',
            code: 'GEMINI_API_ERROR',
            timestamp: new Date().toISOString()
        });
    }
});

// Analytics endpoint
app.post('/api/v1/analytics/event', (req, res) => {
    try {
        const { event, data } = req.body;

        logger.info('Analytics Event:', { event, data, ip: req.ip });

        res.json({ status: 'recorded' });
    } catch (error) {
        logger.error('Analytics Error:', error);
        res.status(500).json({ error: 'Failed to record event' });
    }
});

// Catch-all handler: serve index.html for SPA routes
app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
        const indexPath = NODE_ENV === 'production'
            ? join(__dirname, '../dist/index.html')
            : join(__dirname, '../emoconnect/html/index.html');

        res.sendFile(indexPath);
    } else {
        next();
    }
});

// Global error handler
app.use((error, req, res, next) => {
    logger.error('Unhandled Error:', error);

    res.status(error.status || 500).json({
        error: NODE_ENV === 'production' ? 'Internal Server Error' : error.message,
        code: error.code || 'INTERNAL_ERROR',
        timestamp: new Date().toISOString(),
        ...(NODE_ENV === 'development' && { stack: error.stack })
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    process.exit(0);
});

app.listen(PORT, async () => {
    logger.info(`🚀 EmoConnect server running on port ${PORT} in ${NODE_ENV} mode`);

    // Testar conexão com banco de dados
    const dbConnected = await testConnection();
    if (dbConnected) {
        logger.info('✅ Banco de dados conectado com sucesso');
    } else {
        logger.warn('⚠️ Falha ao conectar com banco de dados - usando localStorage apenas');
    }
});

export default app;