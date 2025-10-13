import { getConnection } from '../config/database.js';

// Buscar humores do usuário
export async function getHumores(req, res) {
    try {
        const { usuario_id } = req.params;
        const { dias = 7 } = req.query;

        const connection = await getConnection();
        const [rows] = await connection.query(
            `SELECT * FROM humores 
             WHERE usuario_id = ? 
             AND data_registro >= DATE_SUB(NOW(), INTERVAL ? DAY)
             ORDER BY data_registro DESC`,
            [usuario_id, dias]
        );

        res.json({
            success: true,
            data: rows,
            total: rows.length
        });
    } catch (error) {
        console.error('Erro ao buscar humores:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar humores'
        });
    }
}

// Salvar humor
export async function salvarHumor(req, res) {
    try {
        const { usuario_id, humor, intensidade, observacoes } = req.body;

        if (!usuario_id || !humor || !intensidade) {
            return res.status(400).json({
                success: false,
                error: 'Campos obrigatórios: usuario_id, humor, intensidade'
            });
        }

        const connection = await getConnection();
        const [result] = await connection.query(
            `INSERT INTO humores (usuario_id, humor, intensidade, observacoes)
             VALUES (?, ?, ?, ?)`,
            [usuario_id, humor, intensidade, observacoes]
        );

        res.status(201).json({
            success: true,
            data: {
                id: result.insertId,
                usuario_id,
                humor,
                intensidade,
                observacoes
            }
        });
    } catch (error) {
        console.error('Erro ao salvar humor:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao salvar humor'
        });
    }
}

// Buscar atividades
export async function getAtividades(req, res) {
    try {
        const { usuario_id } = req.params;
        const { tipo } = req.query;

        const connection = await getConnection();
        let query = 'SELECT * FROM atividades WHERE usuario_id = ?';
        const params = [usuario_id];

        if (tipo) {
            query += ' AND tipo = ?';
            params.push(tipo);
        }

        query += ' ORDER BY data_criacao DESC';

        const [rows] = await connection.query(query, params);

        res.json({
            success: true,
            data: rows,
            total: rows.length
        });
    } catch (error) {
        console.error('Erro ao buscar atividades:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar atividades'
        });
    }
}

// Salvar atividade
export async function salvarAtividade(req, res) {
    try {
        const { usuario_id, tipo, nome, descricao, duracao_minutos } = req.body;

        if (!usuario_id || !tipo || !nome) {
            return res.status(400).json({
                success: false,
                error: 'Campos obrigatórios: usuario_id, tipo, nome'
            });
        }

        const connection = await getConnection();
        const [result] = await connection.query(
            `INSERT INTO atividades (usuario_id, tipo, nome, descricao, duracao_minutos)
             VALUES (?, ?, ?, ?, ?)`,
            [usuario_id, tipo, nome, descricao, duracao_minutos]
        );

        res.status(201).json({
            success: true,
            data: {
                id: result.insertId,
                usuario_id,
                tipo,
                nome,
                descricao,
                duracao_minutos
            }
        });
    } catch (error) {
        console.error('Erro ao salvar atividade:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao salvar atividade'
        });
    }
}

// Buscar mensagens do chat
export async function getMensagens(req, res) {
    try {
        const { usuario_id, contato } = req.params;

        const connection = await getConnection();
        const [rows] = await connection.query(
            `SELECT * FROM mensagens 
             WHERE usuario_id = ? AND contato = ?
             ORDER BY data_envio ASC`,
            [usuario_id, contato]
        );

        res.json({
            success: true,
            data: rows,
            total: rows.length
        });
    } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar mensagens'
        });
    }
}

// Salvar mensagem
export async function salvarMensagem(req, res) {
    try {
        const { usuario_id, contato, tipo, conteudo } = req.body;

        if (!usuario_id || !contato || !tipo || !conteudo) {
            return res.status(400).json({
                success: false,
                error: 'Campos obrigatórios: usuario_id, contato, tipo, conteudo'
            });
        }

        const connection = await getConnection();
        const [result] = await connection.query(
            `INSERT INTO mensagens (usuario_id, contato, tipo, conteudo)
             VALUES (?, ?, ?, ?)`,
            [usuario_id, contato, tipo, conteudo]
        );

        res.status(201).json({
            success: true,
            data: {
                id: result.insertId,
                usuario_id,
                contato,
                tipo,
                conteudo,
                data_envio: new Date()
            }
        });
    } catch (error) {
        console.error('Erro ao salvar mensagem:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao salvar mensagem'
        });
    }
}

// Buscar progresso
export async function getProgresso(req, res) {
    try {
        const { usuario_id } = req.params;
        const { categoria, dias = 30 } = req.query;

        const connection = await getConnection();
        let query = `SELECT * FROM progresso 
                     WHERE usuario_id = ? 
                     AND data_registro >= DATE_SUB(NOW(), INTERVAL ? DAY)`;
        const params = [usuario_id, dias];

        if (categoria) {
            query += ' AND categoria = ?';
            params.push(categoria);
        }

        query += ' ORDER BY data_registro DESC';

        const [rows] = await connection.query(query, params);

        res.json({
            success: true,
            data: rows,
            total: rows.length
        });
    } catch (error) {
        console.error('Erro ao buscar progresso:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar progresso'
        });
    }
}

// Salvar progresso
export async function salvarProgresso(req, res) {
    try {
        const { usuario_id, categoria, valor, meta, data_registro } = req.body;

        if (!usuario_id || !categoria || valor === undefined) {
            return res.status(400).json({
                success: false,
                error: 'Campos obrigatórios: usuario_id, categoria, valor'
            });
        }

        const connection = await getConnection();
        const [result] = await connection.query(
            `INSERT INTO progresso (usuario_id, categoria, valor, meta, data_registro)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE valor = ?, meta = ?`,
            [usuario_id, categoria, valor, meta, data_registro || new Date(), valor, meta]
        );

        res.status(201).json({
            success: true,
            data: {
                id: result.insertId,
                usuario_id,
                categoria,
                valor,
                meta,
                data_registro
            }
        });
    } catch (error) {
        console.error('Erro ao salvar progresso:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao salvar progresso'
        });
    }
}

// Salvar sessão de respiração
export async function salvarSessaoRespiracao(req, res) {
    try {
        const { usuario_id, duracao_segundos, ciclos_completos } = req.body;

        if (!usuario_id || !duracao_segundos || !ciclos_completos) {
            return res.status(400).json({
                success: false,
                error: 'Campos obrigatórios: usuario_id, duracao_segundos, ciclos_completos'
            });
        }

        const connection = await getConnection();
        const [result] = await connection.query(
            `INSERT INTO sessoes_respiracao (usuario_id, duracao_segundos, ciclos_completos)
             VALUES (?, ?, ?)`,
            [usuario_id, duracao_segundos, ciclos_completos]
        );

        res.status(201).json({
            success: true,
            data: {
                id: result.insertId,
                usuario_id,
                duracao_segundos,
                ciclos_completos
            }
        });
    } catch (error) {
        console.error('Erro ao salvar sessão de respiração:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao salvar sessão de respiração'
        });
    }
}
