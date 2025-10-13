import { testConnection, getConnection } from '../config/database.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initDatabase() {
    console.log('🚀 Iniciando configuração do banco de dados...\n');

    try {
        // 1. Testar conexão
        console.log('1️⃣ Testando conexão com MySQL...');
        const isConnected = await testConnection();

        if (!isConnected) {
            throw new Error('Falha ao conectar com o banco de dados');
        }

        // 2. Ler e executar SQL
        console.log('\n2️⃣ Criando tabelas...');
        const connection = await getConnection();
        const sqlPath = join(__dirname, 'schema.sql');
        const sql = readFileSync(sqlPath, 'utf-8');

        // Dividir e executar cada comando SQL
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        console.log(`   Total de comandos SQL: ${statements.length}`);

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            try {
                // Pular statements vazios ou só com comentários
                if (statement.length < 10) continue;

                console.log(`   Executando comando ${i + 1}/${statements.length}...`);
                await connection.query(statement);
                console.log(`   ✅ Comando ${i + 1} executado`);
            } catch (error) {
                // Ignorar erros de tabelas já existentes
                if (error.message.includes('already exists')) {
                    console.log(`   ⚠️ Tabela já existe (ignorado)`);
                } else {
                    console.error(`   ❌ Erro no comando ${i + 1}:`, error.message);
                    console.error(`   SQL:`, statement.substring(0, 100) + '...');
                }
            }
        }

        // 3. Verificar tabelas criadas
        console.log('\n3️⃣ Verificando tabelas criadas...');
        const [tables] = await connection.query('SHOW TABLES');

        console.log('\n📊 Tabelas disponíveis:');
        tables.forEach((table, index) => {
            const tableName = Object.values(table)[0];
            console.log(`   ${index + 1}. ${tableName}`);
        });

        // 4. Contar registros (exemplo)
        console.log('\n4️⃣ Contando registros...');
        const [userCount] = await connection.query('SELECT COUNT(*) as count FROM usuarios');
        console.log(`   👥 Usuários: ${userCount[0].count}`);

        console.log('\n✅ Banco de dados configurado com sucesso!\n');

    } catch (error) {
        console.error('\n❌ Erro ao inicializar banco de dados:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    initDatabase()
        .then(() => {
            console.log('🎉 Script finalizado!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Erro fatal:', error);
            process.exit(1);
        });
}

export default initDatabase;
