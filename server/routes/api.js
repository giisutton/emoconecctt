import express from 'express';
import {
    getHumores,
    salvarHumor,
    getAtividades,
    salvarAtividade,
    getMensagens,
    salvarMensagem,
    getProgresso,
    salvarProgresso,
    salvarSessaoRespiracao
} from '../controllers/dataController.js';

const router = express.Router();

// Rotas de Humores
router.get('/humores/:usuario_id', getHumores);
router.post('/humores', salvarHumor);

// Rotas de Atividades
router.get('/atividades/:usuario_id', getAtividades);
router.post('/atividades', salvarAtividade);

// Rotas de Mensagens
router.get('/mensagens/:usuario_id/:contato', getMensagens);
router.post('/mensagens', salvarMensagem);

// Rotas de Progresso
router.get('/progresso/:usuario_id', getProgresso);
router.post('/progresso', salvarProgresso);

// Rotas de Sessões de Respiração
router.post('/respiracao', salvarSessaoRespiracao);

export default router;
