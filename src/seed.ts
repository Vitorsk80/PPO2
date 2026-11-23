import { db } from './database/databaseManager';

export async function rodarSeed() {
  const senhaPadrao = await Bun.password.hash('123456', { algorithm: 'bcrypt', cost: 10 });

  const stmtUsuario = db.prepare(`
    INSERT INTO usuario (nome, email, senha, tipo_usuario, xp, nivel, streak)
    VALUES ($nome, $email, $senha, $tipo_usuario, $xp, $nivel, $streak)
    ON CONFLICT(email) DO NOTHING;
  `);

  stmtUsuario.run({ nome: 'Professor Admin', email: 'admin@enem.com', senha: senhaPadrao, tipo_usuario: 'admin', xp: 2500, nivel: 10, streak: 15 });
  stmtUsuario.run({ nome: 'Dev Teste', email: 'dev@enem.com', senha: senhaPadrao, tipo_usuario: 'usuario', xp: 1400, nivel: 6, streak: 5 });
  stmtUsuario.run({ nome: 'Ana Clara', email: 'ana@enem.com', senha: senhaPadrao, tipo_usuario: 'usuario', xp: 950, nivel: 4, streak: 3 });

  const materias = [
    { nome: 'Português', area: 'Linguagens e Códigos' },
    { nome: 'História', area: 'Ciências Humanas' },
    { nome: 'Geografia', area: 'Ciências Humanas' },
    { nome: 'Filosofia', area: 'Ciências Humanas' },
    { nome: 'Sociologia', area: 'Ciências Humanas' },
    { nome: 'Biologia', area: 'Ciências da Natureza' },
    { nome: 'Física', area: 'Ciências da Natureza' },
    { nome: 'Química', area: 'Ciências da Natureza' },
    { nome: 'Matemática', area: 'Matemática e suas Tecnologias' }
  ];

  const stmtMateria = db.prepare(`
    INSERT INTO materia (nome, area_conhecimento) VALUES ($nome, $area)
    ON CONFLICT(nome) DO NOTHING;
  `);

  for (const m of materias) {
    stmtMateria.run({ nome: m.nome, area: m.area });
  }

  const getMateriaId = (nome: string) => {
    const res = db.query("SELECT id_materia FROM materia WHERE nome = ?").get(nome) as any;
    return res ? res.id_materia : null;
  };

  const dadosSimulados = [
    {
      materia: 'Português',
      titulo: 'Simulado de Português',
      dificuldade: 'Fácil',
      questoes: [
        {
          enunciado: 'Na frase "Os alunos estudaram bastante", a palavra "bastante" funciona como:',
          alternativas: [
            { letra: 'A', descricao: 'Substantivo', correta: 0 },
            { letra: 'B', descricao: 'Advérbio de intensidade', correta: 1 },
            { letra: 'C', descricao: 'Adjetivo', correta: 0 },
            { letra: 'D', descricao: 'Pronome', correta: 0 }
          ]
        }
      ]
    },
    {
      materia: 'História',
      titulo: 'Simulado de História',
      dificuldade: 'Médio',
      questoes: [
        {
          enunciado: 'Em que ano foi proclamada a Independência do Brasil?',
          alternativas: [
            { letra: 'A', descricao: '1500', correta: 0 },
            { letra: 'B', descricao: '1822', correta: 1 },
            { letra: 'C', descricao: '1889', correta: 0 },
            { letra: 'D', descricao: '1930', correta: 0 }
          ]
        }
      ]
    },
    {
      materia: 'Geografia',
      titulo: 'Simulado de Geografia',
      dificuldade: 'Fácil',
      questoes: [
        {
          enunciado: 'Qual é o maior país do mundo em extensão territorial?',
          alternativas: [
            { letra: 'A', descricao: 'China', correta: 0 },
            { letra: 'B', descricao: 'Canadá', correta: 0 },
            { letra: 'C', descricao: 'Rússia', correta: 1 },
            { letra: 'D', descricao: 'Brasil', correta: 0 }
          ]
        }
      ]
    },
    {
      materia: 'Filosofia',
      titulo: 'Simulado de Filosofia',
      dificuldade: 'Médio',
      questoes: [
        {
          enunciado: 'Quem é o autor da famosa frase "Penso, logo existo"?',
          alternativas: [
            { letra: 'A', descricao: 'Platão', correta: 0 },
            { letra: 'B', descricao: 'René Descartes', correta: 1 },
            { letra: 'C', descricao: 'Aristóteles', correta: 0 },
            { letra: 'D', descricao: 'Friedrich Nietzsche', correta: 0 }
          ]
        }
      ]
    },
    {
      materia: 'Sociologia',
      titulo: 'Simulado de Sociologia',
      dificuldade: 'Fácil',
      questoes: [
        {
          enunciado: 'Qual sociólogo é conhecido pelo conceito de "fato social"?',
          alternativas: [
            { letra: 'A', descricao: 'Émile Durkheim', correta: 1 },
            { letra: 'B', descricao: 'Karl Marx', correta: 0 },
            { letra: 'C', descricao: 'Max Weber', correta: 0 },
            { letra: 'D', descricao: 'Augusto Comte', correta: 0 }
          ]
        }
      ]
    },
    {
      materia: 'Biologia',
      titulo: 'Simulado de Biologia',
      dificuldade: 'Fácil',
      questoes: [
        {
          enunciado: 'Qual organela é responsável pela produção de energia (ATP) na célula?',
          alternativas: [
            { letra: 'A', descricao: 'Ribossomo', correta: 0 },
            { letra: 'B', descricao: 'Complexo de Golgi', correta: 0 },
            { letra: 'C', descricao: 'Mitocôndria', correta: 1 },
            { letra: 'D', descricao: 'Lisossomo', correta: 0 }
          ]
        }
      ]
    },
    {
      materia: 'Física',
      titulo: 'Simulado de Física',
      dificuldade: 'Médio',
      questoes: [
        {
          enunciado: 'Qual é a fórmula que representa a Segunda Lei de Newton?',
          alternativas: [
            { letra: 'A', descricao: 'E = mc²', correta: 0 },
            { letra: 'B', descricao: 'F = m · a', correta: 1 },
            { letra: 'C', descricao: 'P = m · g', correta: 0 },
            { letra: 'D', descricao: 'v = d / t', correta: 0 }
          ]
        }
      ]
    },
    {
      materia: 'Química',
      titulo: 'Simulado de Química',
      dificuldade: 'Fácil',
      questoes: [
        {
          enunciado: 'Qual é a fórmula química da água?',
          alternativas: [
            { letra: 'A', descricao: 'CO2', correta: 0 },
            { letra: 'B', descricao: 'NaCl', correta: 0 },
            { letra: 'C', descricao: 'H2O', correta: 1 },
            { letra: 'D', descricao: 'O2', correta: 0 }
          ]
        }
      ]
    },
    {
      materia: 'Matemática',
      titulo: 'Simulado de Matemática',
      dificuldade: 'Fácil',
      questoes: [
        {
          enunciado: 'Quanto é 20% de 200?',
          alternativas: [
            { letra: 'A', descricao: '20', correta: 0 },
            { letra: 'B', descricao: '30', correta: 0 },
            { letra: 'C', descricao: '40', correta: 1 },
            { letra: 'D', descricao: '50', correta: 0 }
          ]
        }
      ]
    }
  ];

  const stmtQuest = db.prepare("INSERT INTO questionario (titulo, dificuldade, id_materia) VALUES ($titulo, $dificuldade, $id_materia)");
  const stmtQuestao = db.prepare("INSERT INTO questao (enunciado, id_questionario) VALUES ($enunciado, $id_questionario)");
  const stmtAlt = db.prepare("INSERT INTO alternativa (letra, descricao, correta, id_questao) VALUES ($letra, $descricao, $correta, $id_questao)");

  for (const sim of dadosSimulados) {
    const idMateria = getMateriaId(sim.materia);
    if (!idMateria) continue;
    
    const infoQuest = stmtQuest.run({ titulo: sim.titulo, dificuldade: sim.dificuldade, id_materia: idMateria });
    const idQuestionario = infoQuest.lastInsertRowid;

    for (const q of sim.questoes) {
      const infoQ = stmtQuestao.run({ enunciado: q.enunciado, id_questionario: idQuestionario });
      const idQuestao = infoQ.lastInsertRowid;

      for (const alt of q.alternativas) {
        stmtAlt.run({
          letra: alt.letra,
          descricao: alt.descricao,
          correta: alt.correta,
          id_questao: idQuestao
        });
      }
    }
  }

  const questionarioCriado = db.query("SELECT id_questionario FROM questionario LIMIT 1").get() as any;
  const usuarioCriado = db.query("SELECT id_usuario FROM usuario WHERE email = 'dev@enem.com'").get() as any;

  if (questionarioCriado && usuarioCriado) {
    const stmtTentativa = db.prepare(`
      INSERT INTO tentativa (tempo_gasto, pontuacao, xp_ganho, id_usuario, id_questionario, data_realizacao)
      VALUES ($tempo, $pontos, $xp_ganho, $id_user, $id_quest, $data)
    `);

    stmtTentativa.run({ 
      tempo: 120, 
      pontos: 800, 
      xp_ganho: 100, 
      id_user: usuarioCriado.id_usuario, 
      id_quest: questionarioCriado.id_questionario, 
      data: '2026-09-20 14:30:00' 
    });
    
stmtTentativa.run({ 
      tempo: 180, 
      pontos: 950, 
      xp_ganho: 150, 
      id_user: usuarioCriado.id_usuario, 
      id_quest: questionarioCriado.id_questionario, 
      data: '2026-09-22 10:15:00' 
    });
  } 
}

rodarSeed().catch((err) => {
  console.error("❌ Erro ao rodar o seed:", err);
});