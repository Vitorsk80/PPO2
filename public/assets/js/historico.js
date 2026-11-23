document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('/api/usuario/historico');
        const historico = await response.json();

        const container = document.getElementById('containerTentativas');
        const elTotal = document.getElementById('totalQuestionarios');
        const elMedia = document.getElementById('mediaAcertos');
        const elTempo = document.getElementById('tempoEstudado');

        if (!historico || historico.length === 0) {
            container.innerHTML = '<p style="padding: 20px; text-align: center;">Nenhum simulado realizado ainda.</p>';
            elTotal.textContent = '0';
            elMedia.textContent = '0%';
            elTempo.textContent = '0h 0min';
            return;
        }

        elTotal.textContent = historico.length;

        const totalSegundos = historico.reduce((acc, h) => acc + (h.tempo_gasto || 0), 0);
        const horas = Math.floor(totalSegundos / 3600);
        const minutos = Math.floor((totalSegundos % 3600) / 60);
        

        if (horas === 0 && minutos === 0 && totalSegundos > 0) {
            elTempo.textContent = `${totalSegundos} seg`;
        } else {
            elTempo.textContent = `${horas}h ${minutos}min`;
        }

        const mediaPontos = Math.round(historico.reduce((acc, h) => acc + (h.pontuacao || 0), 0) / historico.length);
        elMedia.textContent = `${Math.round((mediaPontos / 1000) * 100)}%`;

        container.innerHTML = historico.map(h => {
            const dataFormatada = new Date(h.data_realizacao).toLocaleDateString('pt-BR');
            const segundosGasto = h.tempo_gasto || 0;

            let tempoFormatado = '';
            if (segundosGasto < 60) {
                tempoFormatado = `${segundosGasto} seg`;
            } else {
                const min = Math.round(segundosGasto / 60);
                tempoFormatado = `${min} min`;
            }

            return `
                <div class="tentativa" style="display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid #edf2f7;">
                    <div>
                        <h3 style="margin: 0 0 5px 0;">${h.titulo_questionario}</h3>
                        <p style="margin: 0; color: #718096; font-size: 0.9rem;">${h.nome_materia}</p>
                    </div>

                    <div>
                        <strong>${dataFormatada}</strong>
                    </div>

                    <div>
                        ⏱️ ${tempoFormatado}
                    </div>

                    <div>
                        <strong>${h.pontuacao} pts</strong>
                    </div>

                    <div>
                        <span style="color: #48bb78; font-weight: bold;">+${h.xp_ganho || 0} XP</span>
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error("Erro ao carregar o histórico:", error);
        document.getElementById('containerTentativas').innerHTML = '<p style="padding: 20px; text-align: center; color: red;">Erro ao carregar dados do servidor.</p>';
    }
});