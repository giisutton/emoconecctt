// Script para executar migração de roles
import { createConnection } from "mysql2/promise";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";
import bcrypt from "bcrypt";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigration() {
  console.log("\n🔄 Iniciando migração do banco de dados...\n");

  try {
    // Conectar ao banco
    const connection = await createConnection({
      host: process.env.DB_HOST || "mysql-giovana.alwaysdata.net",
      user: process.env.DB_USER || "giovana",
      password: process.env.DB_PASSWORD || "giovana2021",
      database: process.env.DB_NAME || "giovana_tcc",
      multipleStatements: true
    });

    console.log("✅ Conectado ao banco de dados\n");

    // Gerar hash da senha do admin
    console.log("🔐 Gerando hash para senha do administrador...");
    const senhaAdmin = "Admin@2025";
    const senhaHash = await bcrypt.hash(senhaAdmin, 10);
    console.log(`✅ Hash gerado: ${senhaHash}\n`);

    // Ler arquivo de migração
    const migrationPath = join(__dirname, "migrations", "001_add_roles.sql");
    let migration = readFileSync(migrationPath, "utf8");

    // Substituir o hash dummy pelo hash real
    migration = migration.replace(
      "$2b$10$XqZ4Kx0Y8N9Zm5h6LZ8TtON9Q5K7g.xRhvJ5c8B9Xz.6Kq3A7LmWS",
      senhaHash
    );

    console.log("📝 Executando migração SQL...\n");

    // Executar migração
    await connection.query(migration);

    console.log("✅ Migração executada com sucesso!\n");

    // Verificar resultados
    const [usuarios] = await connection.query(
      "SELECT role, COUNT(*) as total FROM usuarios GROUP BY role"
    );

    console.log("📊 Usuários por role:");
    usuarios.forEach((row) => {
      console.log(`   ${row.role}: ${row.total}`);
    });

    // Buscar usuário admin
    const [admin] = await connection.query(
      "SELECT id, nome, email, role FROM usuarios WHERE role = 'admin' LIMIT 1"
    );

    if (admin.length > 0) {
      console.log("\n✅ Usuário administrador criado:");
      console.log(`   ID: ${admin[0].id}`);
      console.log(`   Nome: ${admin[0].nome}`);
      console.log(`   Email: ${admin[0].email}`);
      console.log(`   Senha: ${senhaAdmin}`);
    }

    await connection.end();

    console.log("\n🎉 Migração concluída com sucesso!");
    console.log(
      "\n📌 Credenciais do administrador:\n   Email: admin@emoconnect.com\n   Senha: Admin@2025\n"
    );
  } catch (error) {
    console.error("\n❌ Erro na migração:", error.message);
    process.exit(1);
  }
}

runMigration();
