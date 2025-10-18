# -*- coding: utf-8 -*-
import re

# Ler o arquivo original
with open('chat.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Nova função melhorada
nova_funcao = '''  async function obterRespostaIA(mensagem) {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));

    const mensagemLower = mensagem.toLowerCase();
    
    // Sistema de análise contextual melhorado com REGEX
    const analiseContexto = {
      // Morte/Luto
      morte: {
        patterns: [/morr(eu|e)/i, /falec(eu|imento)/i, /perdi (meu|minha|o|a).*(pai|mãe|avô|avó|irmão|irmã|tio|tia|cachorro|gato|pet)/i, /luto/i],
        respostas: [
          "Sinto muito pela sua perda. 💙 O luto é um processo único para cada pessoa. Não há um jeito 'certo' de sentir. Você tem alguém com quem conversar sobre isso?",
          "Perder alguém que amamos é uma das dores mais profundas. Permita-se sentir o que precisa sentir. Não há pressa. Como você está cuidando de si nesse momento?",
          "Meus sentimentos por sua perda. É natural que você esteja passando por emoções intensas agora. Você está recebendo apoio das pessoas ao seu redor?"
        ]
      },
      // Problemas financeiros
      financeiro: {
        patterns: [/dinheiro/i, /desempregado/i, /conta/i, /divida/i, /dívida/i, /pagar/i, /salário/i, /financeiro/i, /demitido/i, /sem grana/i],
        respostas: [
          "Problemas financeiros geram muito estresse. Você já considerou fazer um planejamento financeiro simples? Às vezes, visualizar a situação ajuda a encontrar soluções.",
          "Entendo que a situação financeira está te preocupando. Isso é muito estressante. Você tem conseguido separar um momento para cuidar da saúde mental mesmo assim?",
          "Questões de dinheiro afetam muito nosso bem-estar. Já pensou em buscar orientação financeira gratuita? Muitas ONGs oferecem isso. E lembre-se: seu valor não está no quanto você tem no banco."
        ]
      },
      // Traição/Infidelidade
      traicao: {
        patterns: [/tra(iu|ição|í)/i, /chifruda/i, /corno/i, /infiel/i, /me traiu/i, /traído/i, /outra pessoa/i, /outro cara/i, /outra garota/i],
        respostas: [
          "Descobrir uma traição é devastador. A dor que você está sentindo é completamente válida. Não se culpe - a traição é uma escolha de quem traiu, não sua falha.",
          "Sinto muito que você tenha passado por isso. Traição quebra a confiança de forma profunda. Dê-se tempo para processar. Você merece ser tratado com respeito e fidelidade.",
          "Entendo sua dor. A traição machuca porque quebra a confiança que construímos. Não há justificativa para isso. Como você está se cuidando agora?"
        ]
      },
      // Violência/Abuso
      violencia: {
        patterns: [/abus(o|ada|ado)/i, /violência/i, /bate/i, /agrediu/i, /machuca/i, /me bate/i, /apanho/i, /abusada sexualmente/i],
        respostas: [
          "⚠️ Sinto muito que você esteja passando por isso. Sua segurança é prioridade. Por favor, considere buscar ajuda imediata: Disque 180 (mulheres) ou polícia 190. Você não merece ser tratado assim.",
          "Isso é muito sério e ninguém merece passar por violência. Por favor, procure ajuda: Disque 180, Disque 100 ou vá a uma delegacia. Há profissionais que podem te proteger.",
          "Você não está sozinho nisso e não é sua culpa. Violência é crime. Por favor, busque ajuda urgente: Disque 180, 190 ou procure uma delegacia. Sua vida e segurança importam."
        ]
      },
      // Saúde física
      saude: {
        patterns: [/doente/i, /doença/i, /diagnóstico/i, /hospital/i, /tratamento/i, /câncer/i, /cancer/i, /médico/i, /dor física/i, /cirurgia/i],
        respostas: [
          "Lidar com problemas de saúde é realmente difícil, tanto física quanto emocionalmente. Você está recebendo apoio médico adequado? E tem alguém te acompanhando nessa jornada?",
          "Entendo que questões de saúde física também afetam nosso emocional. Isso é completamente normal. Como você tem cuidado da sua saúde mental durante esse processo?",
          "Problemas de saúde podem ser assustadores. Lembre-se de que é válido ter medo e buscar informações. Você tem um bom suporte médico? E está se permitindo expressar suas emoções sobre isso?"
        ]
      },
      // Vícios/Dependências
      vicio: {
        patterns: [/vici(ado|ada|o)/i, /dependente/i, /álcool/i, /bebida/i, /drogas/i, /maconha/i, /cocaína/i, /bebo muito/i, /não consigo parar/i],
        respostas: [
          "Reconhecer que há um problema é o primeiro e mais difícil passo. Você é corajoso por admitir isso. Já considerou buscar grupos de apoio como AA ou NA? Há também o CAPS que oferece tratamento gratuito.",
          "A dependência é uma doença, não uma falha de caráter. Você merece ajuda profissional. O CVV (188) e CAPS podem te orientar. Você tem apoio familiar ou de amigos?",
          "Entendo que você está lutando contra isso. Saiba que há tratamento e você pode melhorar. Busque o CAPS da sua cidade ou ligue para 132 (SAMU) para orientação. Você não precisa enfrentar isso sozinho."
        ]
      },
      // Gravidez inesperada
      gravidez: {
        patterns: [/grávida/i, /gravida/i, /gravidez/i, /engravidei/i, /gestante/i, /aborto/i, /teste positivo/i],
        respostas: [
          "Descobrir uma gravidez, especialmente se não planejada, pode trazer muitas emoções. Não há jeito certo de se sentir. Você tem alguém de confiança para conversar sobre isso?",
          "Entendo que essa notícia te pegou de surpresa. Dê-se tempo para processar. Seja qual for sua decisão, ela é válida. Você já pensou em conversar com um profissional de saúde?",
          "Isso pode ser assustador. Lembre-se de que você tem direitos e opções, seja qual for sua escolha. Procure uma unidade de saúde para orientação médica e psicológica adequada."
        ]
      },
      // Bullying/Assédio
      bullying: {
        patterns: [/bullying/i, /zoam/i, /riem de mim/i, /assédio/i, /humilha/i, /provoca/i, /mexem comigo/i, /implicam/i],
        respostas: [
          "Bullying é sério e não é sua culpa. Ninguém merece ser tratado assim. Você já contou para alguém responsável (professor, diretor, chefe, família)? É importante denunciar.",
          "Sofrer bullying é muito doloroso. Seu sofrimento é válido. Por favor, converse com alguém que possa te ajudar - um adulto de confiança, RH da empresa, ou autoridades se necessário.",
          "Entendo como isso te afeta. Bullying pode deixar marcas profundas. Não guarde isso só para você. Denuncie e busque apoio. Você merece respeito e dignidade."
        ]
      },
      // Crises específicas
      criseTriste: {
        patterns: [/triste/i, /chorando/i, /choro/i, /mal/i, /péssimo/i, /horrível/i, /sofrendo/i],
        respostas: [
          "Vejo que você está passando por um momento difícil. Chorar e se sentir mal às vezes é necessário. Você sabe o que está te deixando assim ou é algo mais geral?",
          "Sinto que você está sofrendo. Não minimize seus sentimentos - eles são válidos. Quer me contar o que aconteceu? Às vezes, colocar para fora já alivia um pouco.",
          "Percebo que você não está bem. Está tudo bem não estar bem. O que você acha que poderia te ajudar agora? Uma conversa, um momento sozinho, ou talvez fazer algo que gosta?"
        ]
      },
      criseEstresse: {
        patterns: [/estress(e|ado|ada)/i, /sobrecarregad(o|a)/i, /exaust(o|a)/i, /cansad(o|a)/i, /esgotad(o|a)/i, /não aguento mais/i],
        respostas: [
          "Você parece estar no limite. É importante pausar antes de quebrar. Quando foi a última vez que você tirou um tempo só para você? Nem que seja 15 minutos?",
          "O esgotamento é real. Você não precisa ser produtivo 100% do tempo. Que tal listar suas prioridades e ver o que pode ser delegado ou adiado?",
          "Percebo que você está sobrecarregado. Seu corpo e mente estão pedindo descanso. Você consegue tirar um dia de folga ou pelo menos algumas horas para recarregar?"
        ]
      },
      // Cachorro/Pet morreu
      petMorreu: {
        patterns: [/(meu|minha).*(cachorro|gato|pet|animal).*(morreu|faleceu)/i, /perdi meu (cachorro|gato|pet)/i],
        respostas: [
          "Sinto muito pela perda do seu pet. 🐾💙 Eles são família e essa dor é real e profunda. Permita-se sentir saudade. Quer me contar sobre ele/ela?",
          "Perder um animal de estimação dói demais. Eles deixam marcas enormes em nossos corações. É válido estar triste. Como você está lidando com a perda?",
          "Meus sentimentos pela perda do seu companheirinho. Pets são parte da nossa família. Não há problema em estar de luto. Você tem fotos ou lembranças especiais dele?"
        ]
      }
    };
    
    // Verificar padrões específicos primeiro (regex patterns)
    for (const [categoria, dados] of Object.entries(analiseContexto)) {
      for (const pattern of dados.patterns) {
        if (pattern.test(mensagem)) {
          return dados.respostas[Math.floor(Math.random() * dados.respostas.length)];
        }
      }
    }
    
    // Contextos gerais com keywords (fallback)
    const contextosGerais = {
      trabalho: {
        keywords: ["trabalho", "chefe", "colega", "emprego", "escritório", "projeto", "reunião", "equipe"],
        respostas: [
          "Vejo que tem algo relacionado ao trabalho te incomodando. Quer me contar mais sobre o que está acontecendo lá?",
          "O ambiente de trabalho pode ser bem desafiador. O que especificamente está te afetando mais?",
          "Entendo. Trabalho ocupa grande parte do nosso tempo. Como isso está impactando seu dia a dia fora do expediente?"
        ]
      },
      estudo: {
        keywords: ["estudo", "prova", "faculdade", "escola", "vestibular", "nota", "matéria", "professor"],
        respostas: [
          "A pressão acadêmica pode ser intensa. Me conta mais - o que está sendo mais difícil para você agora?",
          "Entendo. Estudar pode ser estressante. Você tem conseguido equilibrar estudos com momentos de descanso?",
          "Vejo que os estudos estão pesando. Quer me contar o que especificamente está te preocupando?"
        ]
      },
      relacionamento: {
        keywords: ["namorado", "namorada", "relacionamento", "parceiro", "parceira", "marido", "esposa", "ficante"],
        respostas: [
          "Relacionamentos têm seus desafios. Me conta o que está acontecendo? Às vezes, falar ajuda a clarear as coisas.",
          "Percebo que tem algo no relacionamento te afetando. Você se sente confortável conversando com a pessoa sobre isso?",
          "Entendo. As relações amorosas podem ser complexas. O que você acha que está faltando ou sobrando nessa situação?"
        ]
      },
      saudacoes: {
        keywords: ["oi", "olá", "ola", "hey", "olar", "e ai", "eae"],
        respostas: [
          "Oi! Como você está se sentindo hoje? Estou aqui para conversar. 😊",
          "Olá! Fico feliz que você esteja aqui. O que você gostaria de compartilhar?",
          "Hey! Pode ficar à vontade para desabafar. Estou aqui para te ouvir. 💜"
        ]
      }
    };
    
    // Verificar contextos gerais
    for (const [categoria, dados] of Object.entries(contextosGerais)) {
      if (dados.keywords.some(keyword => mensagemLower.includes(keyword))) {
        return dados.respostas[Math.floor(Math.random() * dados.respostas.length)];
      }
    }

    // Respostas abertas e empáticas (último recurso)
    const respostasAbertas = [
      "Me conte mais sobre isso. Estou aqui para ouvir você.",
      "Percebo que isso está te afetando. Quer desabafar mais? Estou aqui.",
      "Entendo. Como você tem se sentido em relação a isso?",
      "Vejo que você precisava falar sobre isso. Continue, estou te escutando.",
      "Isso parece importante para você. Quer me contar mais detalhes sobre o que aconteceu?",
      "Suas emoções são válidas. O que mais você gostaria de compartilhar sobre isso?"
    ];

    return respostasAbertas[Math.floor(Math.random() * respostasAbertas.length)];
  }'''

# Usar regex para encontrar e substituir a função
pattern = r'  async function obterRespostaIA\(mensagem\).*?return respostasGerais\[Math\.floor\(Math\.random\(\) \* respostasGerais\.length\)\];\s+\}'
content_novo = re.sub(pattern, nova_funcao, content, flags=re.DOTALL)

# Salvar o arquivo atualizado
with open('chat.js', 'w', encoding='utf-8') as f:
    f.write(content_novo)

print("✅ Arquivo chat.js atualizado com sucesso!")
print("🎉 A IA agora está muito mais inteligente e contextual!")
