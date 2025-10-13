import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuração da conexão
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
};

// Criar pool de conexões
let pool;

export async function getConnection() {
    try {
        if (!pool) {
            pool = mysql.createPool(dbConfig);
            console.log('✅ Pool de conexões MySQL criado com sucesso');
        }
        return pool;
    } catch (error) {
        console.error('❌ Erro ao criar pool de conexões:', error.message);
        throw error;
    }
}

// Testar conexão
export async function testConnection() {
    try {
        const connection = await getConnection();
        const [rows] = await connection.query('SELECT 1 + 1 AS result');
        console.log('✅ Conexão com MySQL bem-sucedida:', rows[0]);
        return true;
    } catch (error) {
        console.error('❌ Erro ao testar conexão:', error.message);
        return false;
    }
}

// Fechar conexões
export async function closeConnection() {
    try {
        if (pool) {
            await pool.end();
            console.log('✅ Conexões MySQL fechadas');
        }
    } catch (error) {
        console.error('❌ Erro ao fechar conexões:', error.message);
    }
}

export default { getConnection, testConnection, closeConnection };
