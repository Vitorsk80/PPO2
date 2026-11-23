import { db } from "../database/databaseManager";

export async function salvarFormularioCompleto(req: Request): Promise<Response> {
  try {
    const { id_materia, titulo, dificuldade, questoes } = await req.json();

    // 1. Cria o Questionário
    const stmtQuest = db.prepare(
      "INSERT INTO questionario (titulo, dificuldade, id_materia) VALUES ($titulo, $dificuldade, $id_materia)"
    );
    const infoQuest = stmtQuest.run({
      $titulo: titulo,
      $dificuldade: dificuldade,
      $id_materia: id_materia,
    });
    const idQuestionario = infoQuest.lastInsertRowid;

    const stmtQuestao = db.prepare(
      "INSERT INTO questao (enunciado, id_questionario) VALUES ($enunciado, $id_questionario)"
    );
    const stmtAlt = db.prepare(
      "INSERT INTO alternativa (letra, descricao, correta, id_questao) VALUES ($letra, $descricao, $correta, $id_questao)"
    );

    for (const q of questoes) {
      const infoQ = stmtQuestao.run({
        $enunciado: q.enunciado,
        $id_questionario: idQuestionario,
      });
      const idQuestao = infoQ.lastInsertRowid;

      for (const alt of q.alternativas) {
        stmtAlt.run({
          $letra: alt.letra,
          $descricao: alt.descricao,
          $correta: alt.correta,
          $id_questao: idQuestao,
        });
      }
    }

    return Response.json({ mensagem: "Formulário e questões salvos com sucesso!" });
  } catch (err) {
    return Response.json({ erro: "Erro ao salvar formulário completo." }, { status: 400 });
  }
}