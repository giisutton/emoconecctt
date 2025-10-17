// Script para gerar hash da senha do administrador
import bcrypt from "bcrypt";

const SENHA_ADMIN = "Admin@2025";
const SALT_ROUNDS = 10;

async function gerarHashAdmin() {
  console.log("\n🔐 Gerando hash para senha do administrador...\n");

  const hash = await bcrypt.hash(SENHA_ADMIN, SALT_ROUNDS);

  console.log("✅ Hash gerado com sucesso!\n");
  console.log("📋 Informações:");
  console.log("   Senha: " + SENHA_ADMIN);
  console.log("   Hash:  " + hash);
  console.log("\n📝 Use este hash no schema.sql ou migration SQL:\n");
  console.log(`   '$${hash}'`);
  console.log("\n");
}

gerarHashAdmin();
