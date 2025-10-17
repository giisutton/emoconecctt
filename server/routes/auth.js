import express from "express";
import {
  cadastro,
  login,
  me,
  atualizarPerfil,
  alterarSenha,
  logout,
  verificarEmail
} from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Rotas públicas (sem autenticação)
router.post("/cadastro", cadastro);
router.post("/login", login);
router.get("/verificar-email/:email", verificarEmail);

// Rotas protegidas (requerem autenticação)
router.get("/me", authenticateToken, me);
router.put("/perfil", authenticateToken, atualizarPerfil);
router.put("/senha", authenticateToken, alterarSenha);
router.post("/logout", authenticateToken, logout);

export default router;
