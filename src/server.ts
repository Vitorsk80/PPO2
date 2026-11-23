import { db } from "./database/databaseManager";
import { listarMaterias } from "./controllers/materiaControllers";
import { salvarFormularioCompleto } from "./controllers/adminControllers";
import { obterHistoricoResumido } from "./controllers/historicoControllers";
import { rodarSeed } from "./seed"; 
import { listarSimulados, buscarSimuladoCompleto, salvarTentativa, obterHistorico } from "./controllers/respostaControllers";

await rodarSeed(); 

Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/") return new Response(Bun.file("./public/index.html"));
    if (url.pathname === "/admin") return new Response(Bun.file("./public/admin.html"));
    if (url.pathname === "/simulados") return new Response(Bun.file("./public/simulados.html"));
    

    if (url.pathname === "/createForms.html" || url.pathname === "/createForms") {
      return new Response(Bun.file("./public/createForms.html"));
    }
    
    if (url.pathname === "/historico.html" || url.pathname === "/historico") {
      return new Response(Bun.file("./public/historico.html"));
    }

    const arquivoEstatico = Bun.file(`./public${url.pathname}`);
    if (await arquivoEstatico.exists()) {
      return new Response(arquivoEstatico);
    }

    if (url.pathname === "/api/materias" && req.method === "GET") {
      return listarMaterias(req);
    }

    if (url.pathname === "/api/simulados" && req.method === "GET") {
      return listarSimulados(req);
    }

    if (url.pathname === "/api/simulados/buscar" && req.method === "GET") {
      return buscarSimuladoCompleto(req);
    }

    if (url.pathname === "/api/simulados/salvar-tentativa" && req.method === "POST") {
      return salvarTentativa(req);
    }

    if (url.pathname === "/api/usuario/historico-resumido" && req.method === "GET") {
      return obterHistoricoResumido(req);
    }

    if (url.pathname === "/api/usuario/historico" && req.method === "GET") {
      return obterHistorico(req);
    }

    if (url.pathname === "/api/admin/salvar-formulario" && req.method === "POST") {
      return salvarFormularioCompleto(req);
    }

    return new Response("Rota não encontrada", { status: 404 });
  },
});

console.log("Servidor rodando em http://localhost:3000");