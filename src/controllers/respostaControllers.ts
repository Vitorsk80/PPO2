import { db } from "../database/databaseManager";

export function listarSimulados(req: Request): Response {
  try {
    const simulados = db.query(`
      SELECT q.id_questionario, q.titulo, q.dificuldade, q.id_materia, m.nome AS nome_materia
      FROM questionario q
      JOIN materia m ON q.id_materia = m.id_materia
    `).all();
    return new Response(JSON.stringify(simulados), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ erro: "Erro ao listar simulados" }), { status: 500 });
  }
}

export function buscarSimuladoCompleto(req: Request): Response {
  try {
    const url = new URL(req.url);
    const idQuestionario = url.searchParams.get("id");

    if (!idQuestionario) {
      return new Response(JSON.stringify({ erro: "ID do simulado não fornecido" }), { status: 400 });
    }

    const simulado = db.query(`
      SELECT q.id_questionario, q.titulo, q.dificuldade, m.nome AS nome_materia
      FROM questionario q
      JOIN materia m ON q.id_materia = m.id_materia
      WHERE q.id_questionario = ?
    `).get(idQuestionario) as any;

    if (!simulado) {
      return new Response(JSON.stringify({ erro: "Simulado não encontrado" }), { status: 404 });
    }

    const questoes = db.query(`
      SELECT id_questao, enunciado FROM questao WHERE id_questionario = ?
    `).all(idQuestionario) as any[];

    for (const q of questoes) {
      q.alternativas = db.query(`
        SELECT id_alternativa, letra, descricao FROM alternativa WHERE id_questao = ?
      `).all(q.id_questao);
    }

    simulado.questoes = questoes;

    return new Response(JSON.stringify(simulado), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ erro: "Erro ao buscar simulado" }), { status: 500 });
  }
}

export async function salvarTentativa(req: Request): Promise<Response> {
  try {
    const body = await req.json() as { id_questionario: number; tempo_gasto: number; respostas: { id_questao: number; id_alternativa: number }[] };
    
    const idUsuarioLogado = 2; 

    let acertos = 0;
    const totalQuestoes = body.respostas.length;

    for (const resp of body.respostas) {
      const checagem = db.query(`
        SELECT correta FROM alternativa WHERE id_alternativa = ? AND id_questao = ?
      `).get(resp.id_alternativa, resp.id_questao) as any;

      if (checagem && checagem.correta === 1) {
        acertos++;
      }
    }

    const pontuacaoFinal = totalQuestoes > 0 ? Math.round((acertos / totalQuestoes) * 1000) : 0;

    const stmtTentativa = db.prepare(`
      INSERT INTO tentativa (tempo_gasto, pontuacao, id_usuario, id_questionario)
      VALUES ($tempo, $pontos, $id_user, $id_quest)
      RETURNING id_tentativa;
    `);
    
    const resultadoTentativa = stmtTentativa.get({
      tempo: body.tempo_gasto,
      pontos: pontuacaoFinal,
      id_user: idUsuarioLogado,
      id_quest: body.id_questionario
    }) as { id_tentativa: number };

    const idTentativaGerada = resultadoTentativa.id_tentativa;

    const stmtResposta = db.prepare(`
      INSERT INTO resposta (acertou, id_tentativa, id_questao, id_alternativa)
      VALUES ($acertou, $id_tentativa, $id_questao, $id_alternativa)
    `);

    for (const resp of body.respostas) {
      const checagem = db.query(`SELECT correta FROM alternativa WHERE id_alternativa = ?`).get(resp.id_alternativa) as any;
      const acertou = checagem && checagem.correta === 1 ? 1 : 0;

      stmtResposta.run({
        acertou: acertou,
        id_tentativa: idTentativaGerada,
        id_questao: resp.id_questao,
        id_alternativa: resp.id_alternativa
      });
    }

    db.prepare("UPDATE usuario SET xp = xp + ?, streak = streak + 1 WHERE id_usuario = ?").run(Math.round(pontuacaoFinal / 10), idUsuarioLogado);

    return new Response(JSON.stringify({ pontuacao: pontuacaoFinal, acertos: acertos }), { 
      status: 200, 
      headers: { "Content-Type": "application/json" } 
    });

  } catch (error) {
    console.error("Erro ao salvar tentativa:", error);
    return new Response(JSON.stringify({ erro: "Erro ao processar e salvar respostas" }), { status: 500 });
  }
}

export function obterHistorico(req: Request): Response {
  try {
    const idUsuarioLogado = 2;

    const historico = db.query(`
      SELECT 
        t.id_tentativa, 
        t.data_realizacao, 
        t.tempo_gasto, 
        t.pontuacao,
        q.titulo AS titulo_questionario, 
        m.nome AS nome_materia
      FROM tentativa t
      JOIN questionario q ON t.id_questionario = q.id_questionario
      JOIN materia m ON q.id_materia = m.id_materia
      WHERE t.id_usuario = ?
      ORDER BY t.data_realizacao DESC
    `).all(idUsuarioLogado);

    return new Response(JSON.stringify(historico), { 
      status: 200, 
      headers: { "Content-Type": "application/json" } 
    });
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    return new Response(JSON.stringify({ erro: "Erro ao buscar histórico de tentativas" }), { status: 500 });
  }
}