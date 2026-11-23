import { db } from "../database/databaseManager";

export async function listarMaterias(req: Request): Promise<Response> {
  try {
    const materias = db.query("SELECT id_materia, nome, area_conhecimento FROM materia").all();
    return Response.json(materias);
  } catch (error) {
    return Response.json({ erro: "Erro ao buscar matérias." }, { status: 500 });
  }
}