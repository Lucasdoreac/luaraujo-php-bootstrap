document.addEventListener('DOMContentLoaded', async () => {
    // Identificar qual calculadora está sendo usada
    const calculatorType = document.body.dataset.calculator;
    
    // Inicializar o integrador
    const app = new AppIntegrator();
    await app.init(calculatorType);
    
    // Adicionar eventos globais
    setupGlobalEvents(app);
    
    // Verificar parâmetros da URL
    checkUrlParameters(app);
});

function setupGlobalEvents(app) {
    // Botão de exportar PDF
    document.querySelectorAll('.export-pdf').forEach(btn => {
        btn.addEventListener('click', async () => {
            try {
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando PDF...';
                await exportToPDF(app.state.lastResults);
            } catch (error) {
                console.error('Erro ao exportar PDF:', error);
                alert('Erro ao gerar PDF. Por favor, tente novamente.');
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-file-pdf"></i> Exportar PDF';
            }
        });
    });

    // Botão de exportar Excel
    document.querySelectorAll('.export-excel').forEach(btn => {
        btn.addEventListener('click', async () => {
            try {
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando Excel...';
                await exportToExcel(app.state.lastResults);
            } catch (error) {
                console.error('Erro ao exportar Excel:', error);
                alert('Erro ao gerar Excel. Por favor, tente novamente.');
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-file-excel"></i> Exportar Excel';
            }
        });
    });

    // Botão de histórico
    document.getElementById('show-history')?.addEventListener('click', async () => {
        try {
            const historyData = await fetchHistory();
            showHistoryModal(historyData);
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
            alert('Erro ao carregar histórico. Por favor, tente novamente.');
        }
    });

    // Botão de ajuda
    document.getElementById('show-help')?.addEventListener('click', () => {
        app.startTour();
    });
}

async function checkUrlParameters(app) {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Carregar simulação específica
    const simulationId = urlParams.get('simulation');
    if (simulationId) {
        try {
            const simulation = await fetchSimulation(simulationId);
            if (simulation) {
                loadSimulation(app, simulation);
            }
        } catch (error) {
            console.error('Erro ao carregar simulação:', error);
        }
    }
}

async function exportToPDF(data) {
    const response = await fetch('includes/export-pdf.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Erro ao gerar PDF');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio.pdf';
    a.click();
    
    window.URL.revokeObjectURL(url);
}

async function exportToExcel(data) {
    const response = await fetch('includes/export-excel.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Erro ao gerar Excel');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio.xlsx';
    a.click();
    
    window.URL.revokeObjectURL(url);
}

async function fetchHistory() {
    const response = await fetch('includes/get-history.php');
    if (!response.ok) {
        throw new Error('Erro ao carregar histórico');
    }
    return response.json();
}

async function fetchSimulation(id) {
    const response = await fetch(`includes/get-simulation.php?id=${id}`);
    if (!response.ok) {
        throw new Error('Erro ao carregar simulação');
    }
    return response.json();
}

function loadSimulation(app, simulation) {
    // Preencher formulário
    Object.entries(simulation.entrada).forEach(([key, value]) => {
        const input = document.getElementById(key);
        if (input) {
            input.value = value;
        }
    });
    
    // Recalcular
    app.handleCalculation();
}

function showHistoryModal(historyData) {
    const modal = new bootstrap.Modal(document.getElementById('historyModal'));
    const tbody = document.querySelector('#historyModal tbody');
    
    tbody.innerHTML = historyData.map(item => `
        <tr>
            <td>${new Date(item.data).toLocaleDateString()}</td>
            <td>R$ ${item.resultados.valorFinal.toLocaleString()}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="loadHistoryItem('${item.id}')">
                    <i class="fas fa-sync"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    modal.show();
}

// Exportar função para uso global (necessário para o onclick no HTML)
window.loadHistoryItem = async (id) => {
    try {
        const simulation = await fetchSimulation(id);
        if (simulation) {
            loadSimulation(window.app, simulation);
            bootstrap.Modal.getInstance(document.getElementById('historyModal')).hide();
        }
    } catch (error) {
        console.error('Erro ao carregar simulação:', error);
        alert('Erro ao carregar simulação. Por favor, tente novamente.');
    }
};
