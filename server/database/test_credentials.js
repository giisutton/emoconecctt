import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const host = process.env.DB_HOST;
const database = process.env.DB_NAME;
const password = process.env.DB_PASSWORD;

// Variações comuns de usuário no AlwaysData
const possiveisUsuarios = [
    'giovana',           // Usuário simples
    'giovana_tcc',       // Nome do banco
    '357618',            // ID da conta (comum no AlwaysData)
    '357618_giovana',    // ID + nome
    'giovana_user',      // Variação com sufixo
    'giovana_admin'      // Variação admin
];

async function testarConexoes() {
    console.log('🔍 Testando diferentes combinações de usuário...\n');
    console.log(`Host: ${host}`);
    console.log(`Database: ${database}`);
    console.log(`Password: ${'*'.repeat(password?.length || 0)}\n`);
    console.log('─'.repeat(60));

    for (const usuario of possiveisUsuarios) {
        try {
            console.log(`\n🔑 Tentando usuário: ${usuario}`);

            const connection = await mysql.createConnection({
                host: host,
                user: usuario,
                password: password,
                database: database,
                connectTimeout: 5000
            });

            // Se chegou aqui, conseguiu conectar!
            const [rows] = await connection.query('SELECT 1 + 1 AS result');

            console.log(`✅ SUCESSO! Usuário correto: ${usuario}`);
            console.log(`   Resultado do teste: ${rows[0].result}`);
            console.log('\n' + '='.repeat(60));
            console.log('✅ CREDENCIAIS CORRETAS ENCONTRADAS!');
            console.log('='.repeat(60));
            console.log(`\nAtualize seu arquivo .env com:`);
            console.log(`DB_USER=${usuario}`);
            console.log('='.repeat(60));

            await connection.end();
            process.exit(0);

        } catch (error) {
            if (error.code === 'ER_ACCESS_DENIED_ERROR') {
                console.log(`❌ Acesso negado para: ${usuario}`);
            } else if (error.code === 'ETIMEDOUT') {
                console.log(`⏱️  Timeout para: ${usuario}`);
            } else {
                console.log(`❌ Erro: ${error.message}`);
            }
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('❌ NENHUM USUÁRIO FUNCIONOU');
    console.log('='.repeat(60));
    console.log('\n📋 Próximos passos:');
    console.log('1. Acesse o painel do AlwaysData');
    console.log('2. Vá em "Databases" → "MySQL"');
    console.log('3. Verifique o nome EXATO do usuário');
    console.log('4. Atualize o arquivo .env com o usuário correto');
    console.log('\n💡 Dica: O usuário pode incluir o ID da conta AlwaysData');
    console.log('   Exemplo: 357618_giovana ou 357618');
    process.exit(1);
}

testarConexoes();
