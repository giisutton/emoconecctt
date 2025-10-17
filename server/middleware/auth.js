import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta_super_segura";

// Middleware de autenticação
export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Token não fornecido",
      code: "NO_TOKEN"
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Adicionar dados do usuário à requisição
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.userName = decoded.nome;
    req.userRole = decoded.role || "user";

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Token expirado",
        code: "TOKEN_EXPIRED"
      });
    }

    return res.status(403).json({
      success: false,
      error: "Token inválido",
      code: "INVALID_TOKEN"
    });
  }
}

// Middleware opcional (não retorna erro se não tiver token)
export function optionalAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.userName = decoded.nome;
    req.userRole = decoded.role || "user";
  } catch (error) {
    // Ignora erros e continua sem autenticação
    console.log("Token inválido ou expirado (opcional)");
  }

  next();
}
