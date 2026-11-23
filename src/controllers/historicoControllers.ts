import { db } from "../database/databaseManager"; 
const usuario = db.query("SELECT id_usuario FROM usuario WHERE email = 'dev@enem.com'").get() as any;
const idUsuarioLogado = usuario ? usuario.id_usuario : 1;

export function obterHistoricoResumido(req: Request): Response {
  try {
    const idUsuarioLogado = 2; 

    const historico = db.query(`
      SELECT 
        t.id_tentativa,
        t.pontuacao,
        t.data_realizacao,
        q.titulo AS titulo_simulado
      FROM tentativa t
      JOIN questionario q ON t.id_questionario = q.id_questionario
      WHERE t.id_usuario = ?
      ORDER BY t.data_realizacao DESC
      LIMIT 3
    `).all(idUsuarioLogado);

    return new Response(JSON.stringify(historico), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Erro no controller de histórico:", error);
    return new Response(JSON.stringify({ erro: "Erro ao carregar histórico" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
