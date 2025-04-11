/**
 * Módulo de Geração de Gráficos
 * Implementa gráficos financeiros utilizando Chart.js
 */
const GraficoManager = {
    /**
     * Configurações padrão de cores
     */
    cores: {
        primaria: '#3498db',
        secundaria: '#2ecc71',
        terciaria: '#e74c3c',
        quaternaria: '#f1c40f',
        cinza: '#95a5a6'
    },

    /**
     * Configura um contexto de gráfico
     * @param {string} idCanvas - ID do elemento canvas
     * @return {CanvasRenderingContext2D} - Contexto do canvas
     */
    obterContexto(idCanvas) {
        const canvas = document.getElementById(idCanvas);
        if (!canvas) {
            console.error(`Canvas com ID ${idCanvas} não encontrado`);
            return null;
        }
        return canvas.getContext('2d');
    },

    /**
     * Formata valores como moeda
     * @param {number} valor - Valor a ser formatado
     * @return {string} - Valor formatado como moeda
     */
    formatarMoeda(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(valor);
    },

    /**
     * Cria um gráfico de evolução do patrimônio
     * @param {string} idCanvas - ID do elemento canvas
     * @param {Object} dados - Dados para o gráfico
     */
    criarGraficoEvolucaoPatrimonio(idCanvas, dados) {
        const ctx = this.obterContexto(idCanvas);
        if (!ctx) return;
        
        // Destroi gráfico anterior se existir
        if (window.graficoEvolucao) {
            window.graficoEvolucao.destroy();
        }
        
        window.graficoEvolucao = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dados.labels,
                datasets: [{
                    label: 'Patrimônio Total',
                    data: dados.valores,
                    borderColor: this.cores.primaria,
                    backgroundColor: this.gerarGradiente(ctx, this.cores.primaria),
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: this.opcoesComuns('Evolução do Patrimônio')
        });
    },

    /**
     * Cria um gráfico comparativo entre diferentes investimentos
     * @param {string} idCanvas - ID do elemento canvas
     * @param {Object} dados - Dados para o gráfico
     */
    criarGraficoComparativo(idCanvas, dados) {
        const ctx = this.obterContexto(idCanvas);
        if (!ctx) return;
        
        // Destroi gráfico anterior se existir
        if (window.graficoComparativo) {
            window.graficoComparativo.destroy();
        }
        
        window.graficoComparativo = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dados.labels,
                datasets: [{
                    label: 'Valor Final',
                    data: dados.valores,
                    backgroundColor: [
                        this.cores.primaria,
                        this.cores.secundaria,
                        this.cores.terciaria,
                        this.cores.quaternaria
                    ],
                    borderColor: [
                        this.cores.primaria,
                        this.cores.secundaria,
                        this.cores.terciaria,
                        this.cores.quaternaria
                    ],
                    borderWidth: 1
                }]
            },
            options: this.opcoesComuns('Comparativo de Investimentos')
        });
    },

    /**
     * Cria um gráfico de composição (pizza)
     * @param {string} idCanvas - ID do elemento canvas
     * @param {Object} dados - Dados para o gráfico
     */
    criarGraficoComposicao(idCanvas, dados) {
        const ctx = this.obterContexto(idCanvas);
        if (!ctx) return;
        
        // Destroi gráfico anterior se existir
        if (window.graficoComposicao) {
            window.graficoComposicao.destroy();
        }
        
        window.graficoComposicao = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: dados.labels,
                datasets: [{
                    label: dados.titulo || 'Composição',
                    data: dados.valores,
                    backgroundColor: [
                        this.cores.primaria,
                        this.cores.secundaria,
                        this.cores.terciaria,
                        this.cores.quaternaria
                    ],
                    borderColor: '#1e1e1e',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#ffffff',
                            font: {
                                family: "'Roboto Mono', monospace"
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const value = context.raw;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${context.label}: ${this.formatarMoeda(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    },

    /**
     * Cria um gráfico de projeção com múltiplos cenários
     * @param {string} idCanvas - ID do elemento canvas
     * @param {Object} dados - Dados para o gráfico
     */
    criarGraficoProjecao(idCanvas, dados) {
        const ctx = this.obterContexto(idCanvas);
        if (!ctx) return;
        
        // Destroi gráfico anterior se existir
        if (window.graficoProjecao) {
            window.graficoProjecao.destroy();
        }
        
        const datasets = [];
        
        if (dados.otimista) {
            datasets.push({
                label: 'Cenário Otimista',
                data: dados.otimista,
                borderColor: this.cores.secundaria,
                backgroundColor: 'transparent',
                borderWidth: 2,
                fill: false
            });
        }
        
        if (dados.base) {
            datasets.push({
                label: 'Cenário Base',
                data: dados.base,
                borderColor: this.cores.primaria,
                backgroundColor: 'transparent',
                borderWidth: 2,
                fill: false
            });
        }
        
        if (dados.pessimista) {
            datasets.push({
                label: 'Cenário Pessimista',
                data: dados.pessimista,
                borderColor: this.cores.terciaria,
                backgroundColor: 'transparent',
                borderWidth: 2,
                fill: false
            });
        }
        
        window.graficoProjecao = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dados.labels,
                datasets: datasets
            },
            options: this.opcoesComuns('Projeção de Cenários')
        });
    },

    /**
     * Configurações comuns para todos os gráficos
     * @param {string} titulo - Título do gráfico
     * @return {Object} - Configurações para o Chart.js
     */
    opcoesComuns(titulo) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: titulo,
                    color: '#ffffff',
                    font: {
                        family: "'Roboto Mono', monospace",
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    position: 'top',
                    labels: {
                        color: '#ffffff',
                        font: {
                            family: "'Roboto Mono', monospace"
                        },
                        usePointStyle: true
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(46, 46, 46, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderWidth: 1,
                    borderColor: '#333333',
                    titleFont: {
                        family: "'Roboto Mono', monospace"
                    },
                    bodyFont: {
                        family: "'Roboto Mono', monospace"
                    },
                    callbacks: {
                        label: (context) => {
                            const value = context.raw;
                            if (typeof value === 'number') {
                                return `${context.dataset.label}: ${this.formatarMoeda(value)}`;
                            }
                            return value;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff',
                        font: {
                            family: "'Roboto Mono', monospace"
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff',
                        font: {
                            family: "'Roboto Mono', monospace"
                        },
                        callback: (value) => {
                            return this.formatarEixoY(value);
                        }
                    }
                }
            }
        };
    },

    /**
     * Formata os valores do eixo Y para melhor legibilidade
     * @param {number} valor - Valor a ser formatado
     * @return {string} - Valor formatado para exibição
     */
    formatarEixoY(valor) {
        if (valor >= 1000000) {
            return 'R$ ' + (valor / 1000000).toLocaleString('pt-BR', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
            }) + 'M';
        } else if (valor >= 1000) {
            return 'R$ ' + (valor / 1000).toLocaleString('pt-BR', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
            }) + 'k';
        }
        return 'R$ ' + valor.toLocaleString('pt-BR');
    },

    /**
     * Cria um gradiente para preenchimento do gráfico
     * @param {CanvasRenderingContext2D} ctx - Contexto do canvas
     * @param {string} corBase - Cor base para o gradiente
     * @return {CanvasGradient} - Objeto de gradiente
     */
    gerarGradiente(ctx, corBase) {
        const gradiente = ctx.createLinearGradient(0, 0, 0, 400);
        gradiente.addColorStop(0, this.hexToRgba(corBase, 0.6));
        gradiente.addColorStop(1, this.hexToRgba(corBase, 0));
        return gradiente;
    },

    /**
     * Converte cor hexadecimal para RGBA
     * @param {string} hex - Cor em formato hexadecimal
     * @param {number} alpha - Valor de transparência (0-1)
     * @return {string} - Cor em formato RGBA
     */
    hexToRgba(hex, alpha) {
        let r = 0, g = 0, b = 0;
        
        // Remove o # se estiver presente
        if (hex.indexOf('#') === 0) {
            hex = hex.slice(1);
        }
        
        // Converte hex para RGB
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
        
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },

    /**
     * Atualiza dados de um gráfico existente
     * @param {string} nome - Nome do gráfico a ser atualizado
     * @param {Object} dados - Novos dados para o gráfico
     */
    atualizarGrafico(nome, dados) {
        const grafico = window[`grafico${nome}`];
        if (grafico) {
            grafico.data = dados;
            grafico.update();
        }
    },

    /**
     * Destroi um gráfico específico
     * @param {string} nome - Nome do gráfico a ser destruído
     */
    destruirGrafico(nome) {
        const grafico = window[`grafico${nome}`];
        if (grafico) {
            grafico.destroy();
            delete window[`grafico${nome}`];
        }
    },

    /**
     * Destroi todos os gráficos existentes
     */
    destruirTodos() {
        ['graficoEvolucao', 'graficoComparativo', 'graficoComposicao', 'graficoProjecao'].forEach(nome => {
            this.destruirGrafico(nome);
        });
    }
};

// Export para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GraficoManager;
}
