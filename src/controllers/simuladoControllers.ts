import { db } from "../database/databaseManager";

export function listarSimulados(req: Request): Response {
  try {
    const simulados = db.query(`
      SELECT 
        q.id_questionario, 
        q.titulo, 
        q.dificuldade, 
        q.id_materia, 
        m.nome AS nome_materia
      FROM questionario q
      JOIN materia m ON q.id_materia = m.id_materia
    `).all();

    return new Response(JSON.stringify(simulados), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Erro ao listar simulados:", error);
    return new Response(JSON.stringify({ erro: "Erro interno no servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
