import { getConnection } from '../config/database.js';

async function criarTabelas() {
    console.log('🚀 Criando tabelas do EmoConnect...\n');

    try {
        const connection = await getConnection();

        // 1. Tabela de usuários
        console.log('1️⃣ Criando tabela usuarios...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                senha_hash VARCHAR(255) NOT NULL,
                avatar VARCHAR(255),
                data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                ativo BOOLEAN DEFAULT TRUE
            ) ENGINE=InnoDB
        `);
        console.log('   ✅ Tabela usuarios criada!\n');

        // 2. Tabela de humores
        console.log('2️⃣ Criando tabela humores...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS humores (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT NOT NULL,
                humor VARCHAR(50) NOT NULL,
                intensidade INT NOT NULL,
                observacoes TEXT,
                data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB
        `);
        console.log('   ✅ Tabela humores criada!\n');

        // 3. Tabela de atividades
        console.log('3️⃣ Criando tabela atividades...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS atividades (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT NOT NULL,
                tipo VARCHAR(50) NOT NULL,
                nome VARCHAR(100) NOT NULL,
                descricao TEXT,
                duracao_minutos INT,
                concluida BOOLEAN DEFAULT FALSE,
                data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                data_conclusao TIMESTAMP NULL
            ) ENGINE=InnoDB
        `);
        console.log('   ✅ Tabela atividades criada!\n');

        // 4. Tabela de mensagens
        console.log('4️⃣ Criando tabela mensagens...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS mensagens (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT NOT NULL,
                contato VARCHAR(100) NOT NULL,
                tipo VARCHAR(20) NOT NULL,
                conteudo TEXT NOT NULL,
                data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                lida BOOLEAN DEFAULT FALSE
            ) ENGINE=InnoDB
        `);
        console.log('   ✅ Tabela mensagens criada!\n');

        // 5. Tabela de progresso
        console.log('5️⃣ Criando tabela progresso...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS progresso (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT NOT NULL,
                categoria VARCHAR(50) NOT NULL,
                valor INT NOT NULL,
                meta INT,
                data_registro DATE NOT NULL,
                UNIQUE KEY idx_usuario_categoria_data (usuario_id, categoria, data_registro)
            ) ENGINE=InnoDB
        `);
        console.log('   ✅ Tabela progresso criada!\n');

        // 6. Tabela de sessões de respiração
        console.log('6️⃣ Criando tabela sessoes_respiracao...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS sessoes_respiracao (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT NOT NULL,
                duracao_segundos INT NOT NULL,
                ciclos_completos INT NOT NULL,
                data_sessao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB
        `);
        console.log('   ✅ Tabela sessoes_respiracao criada!\n');

        // 7. Tabela de configurações
        console.log('7️⃣ Criando tabela configuracoes...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS configuracoes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT NOT NULL,
                tema VARCHAR(20) DEFAULT 'light',
                notificacoes_ativas BOOLEAN DEFAULT TRUE,
                lembretes_ativos BOOLEAN DEFAULT TRUE,
                horario_lembrete TIME DEFAULT '09:00:00',
                UNIQUE KEY idx_usuario (usuario_id)
            ) ENGINE=InnoDB
        `);
        console.log('   ✅ Tabela configuracoes criada!\n');

        // Verificar tabelas criadas
        console.log('📊 Verificando tabelas...');
        const [tables] = await connection.query('SHOW TABLES');

        console.log('\n✅ Tabelas disponíveis no banco giovana_tcc:');
        tables.forEach((table, index) => {
            const tableName = Object.values(table)[0];
            console.log(`   ${index + 1}. ${tableName}`);
        });

        // Inserir usuário demo
        console.log('\n👤 Criando usuário demo...');
        try {
            await connection.query(`
                INSERT INTO usuarios (nome, email, senha_hash, avatar) 
                VALUES ('Usuário Demo', 'demo@emoconnect.com', 'demo123', '😊')
                ON DUPLICATE KEY UPDATE nome=nome
            `);
            console.log('   ✅ Usuário demo criado!\n');
        } catch (e) {
            console.log('   ⚠️ Usuário demo já existe\n');
        }

        console.log('🎉 Banco de dados configurado com sucesso!\n');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Erro ao criar tabelas:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

criarTabelas();
