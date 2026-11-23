import { listarSimulados, buscarSimuladoCompleto, salvarTentativa, obterHistorico } from "./controllers/respostaControllers";

if (url.pathname === "/api/usuario/historico" && req.method === "GET") {
    return obterHistorico(req);
}