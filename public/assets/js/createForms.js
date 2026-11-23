// Pega o ID do questionário passado na URL (ex: createForms.html?id=1)
const urlParams = new URLSearchParams(window.location.search);
const idQuestionario = urlParams.get('id');

let questoesGlobais = [];

async function carregarSimulado() {
    if (!idQuestionario) {
        document.getElementById('simuladoTitulo').textContent = "Nenhum simulado selecionado.";
        return;
    }

    try {
        // Busca o simulado completo no backend
        const response = await fetch(`/api/simulados/buscar?id=${idQuestionario}`);
        const dados = await response.json();

        if (!response.ok) {
            document.getElementById('simuladoTitulo').textContent = "Simulado não encontrado.";
            return;
        }

        // Preenche o cabeçalho da página
        document.getElementById('simuladoTitulo').textContent = dados.titulo || "Simulado";
        document.getElementById('simuladoMateria').textContent = dados.nome_materia || 'Matéria Geral';
        document.getElementById('simuladoDificuldade').textContent = `Dificuldade: ${dados.dificuldade || 'Normal'}`;

        questoesGlobais = dados.questoes || [];
        const container = document.getElementById('containerQuestoes');

        if (questoesGlobais.length === 0) {
            container.innerHTML = '<p style="color: #a0aec0; text-align: center; padding: 20px;">Este simulado não possui questões cadastradas.</p>';
            return;
        }

        // Renderiza as questões e suas alternativas na tela
        container.innerHTML = questoesGlobais.map((q, index) => `
            <div class="questao-box" style="margin-bottom: 25px; padding: 20px; background: #2d3748; border-radius: 8px; border: 1px solid #4a5568;">
                <h3 style="margin-top: 0; color: #e2e8f0;">Questão ${index + 1}</h3>
                <p style="font-size: 1.05rem; line-height: 1.5; color: #fff;">${q.enunciado}</p>
                <div class="alternativas" style="margin-top: 15px;">
                    ${q.alternativas.map(alt => `
                        <label style="display: block; margin: 10px 0; padding: 10px; background: #1a202c; border-radius: 6px; cursor: pointer; border: 1px solid transparent; transition: 0.2s;">
                            <input type="radio" name="questao_${q.id_questao}" value="${alt.id_alternativa}" required style="margin-right: 10px;">
                            <strong style="color: #63b3ed;">${alt.letra})</strong> <span style="color: #e2e8f0;">${alt.descricao}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `).join('');

        // Exibe o botão de enviar após carregar com sucesso
        const btnEnviar = document.getElementById('btnEnviar');
        if (btnEnviar) {
            btnEnviar.style.display = 'block';
        }

    } catch (error) {
        console.error("Erro ao carregar simulado:", error);
        document.getElementById('simuladoTitulo').textContent = "Erro de conexão com o servidor.";
    }
}

// Função acionada ao enviar o formulário (onsubmit)
async function enviarRespostas(event) {
    event.preventDefault();

    // Calcula os segundos exatos passados desde que a página abriu
    // (A variável 'tempoInicio' vem declarada no <script> do createForms.html)
    const tempoGastoSegundos = typeof tempoInicio !== 'undefined' 
        ? Math.floor((Date.now() - tempoInicio) / 1000) 
        : 0;

    // Coleta todas as alternativas marcadas pelo aluno
    const respostas = [];
    questoesGlobais.forEach(q => {
        const marcada = document.querySelector(`input[name="questao_${q.id_questao}"]:checked`);
        if (marcada) {
            respostas.push({
                id_questao: q.id_questao,
                id_alternativa: parseInt(marcada.value)
            });
        }
    });

    const payload = {
        id_questionario: parseInt(idQuestionario),
        tempo_gasto: tempoGastoSegundos, // <-- Envia o tempo calculado em segundos para o backend
        respostas: respostas
    };

    try {
        const response = await fetch('/api/simulados/salvar-tentativa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const resultado = await response.json();

        if (response.ok) {
            alert(`Simulado finalizado com sucesso!\nAcertos: ${resultado.acertos} | Pontuação: ${resultado.pontuacao} pts`);
            window.location.href = 'historico.html'; 
        } else {
            alert('Erro ao salvar tentativa: ' + (resultado.erro || 'Tente novamente.'));
        }
    } catch (error) {
        console.error("Erro ao enviar tentativa:", error);
        alert('Erro de conexão ao enviar o simulado.');
    }
}

carregarSimulado();