class GraficoManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.charts = {};
        this.colors = {
            primary: '#3498db',
            success: '#2ecc71',
            warning: '#f1c40f',
            danger: '#e74c3c',
            info: '#3498db'
        };
    }

    getContext(id) {
        let canvas = document.getElementById(id);
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = id;
            this.container.appendChild(canvas);
        }
        return canvas.getContext('2d');
    }

    criarGraficoEvolucaoPatrimonio(dados) {
        const ctx = this.getContext('evolucao-patrimonio');
        
        if (this.charts['evolucao-patrimonio']) {
            this.charts['evolucao-patrimonio'].destroy();
        }

        this.charts['evolucao-patrimonio'] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dados.labels,
                datasets: [{
                    label: 'Patrimônio Total',
                    data: dados.valores,
                    borderColor: this.colors.primary,
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: this.getOptionsComuns('Evolução do Patrimônio')
        });
    }

    criarGraficoComparativo(dados) {
        const ctx = this.getContext('comparativo');
        
        if (this.charts['comparativo']) {
            this.charts['comparativo'].destroy();
        }

        const datasets = Array.isArray(dados.datasets) 
            ? dados.datasets.map((dataset, index) => ({
                label: dataset.label,
                data: dataset.data,
                backgroundColor: this.getColor(index, 0.8),
                borderColor: this.getColor(index),
                borderWidth: 1
            }))
            : [{
                label: 'Valor Final',
                data: dados.valores || [],
                backgroundColor: [
                    this.colors.primary,
                    this.colors.success,
                    this.colors.warning,
                    this.colors.danger
                ].slice(0, dados.labels.length),
                borderWidth: 1
            }];

        this.charts['comparativo'] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dados.labels,
                datasets: datasets
            },
            options: this.getOptionsComuns('Comparativo de Investimentos')
        });
    }

    criarGraficoRentabilidade(dados) {
        const ctx = this.getContext('rentabilidade');
        
        if (this.charts['rentabilidade']) {
            this.charts['rentabilidade'].destroy();
        }

        this.charts['rentabilidade'] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dados.labels,
                datasets: [{
                    label: 'Rentabilidade (%)',
                    data: dados.valores,
                    borderColor: this.colors.success,
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: this.getOptionsComuns('Evolução da Rentabilidade')
        });
    }

    criarGraficoProjecao(dados) {
        const ctx = this.getContext('projecao');
        
        if (this.charts['projecao']) {
            this.charts['projecao'].destroy();
        }

        this.charts['projecao'] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dados.labels,
                datasets: [
                    {
                        label: 'Cenário Otimista',
                        data: dados.otimista,
                        borderColor: this.colors.success,
                        borderDash: [],
                        fill: false
                    },
                    {
                        label: 'Cenário Base',
                        data: dados.base,
                        borderColor: this.colors.primary,
                        borderDash: [],
                        fill: false
                    },
                    {
                        label: 'Cenário Pessimista',
                        data: dados.pessimista,
                        borderColor: this.colors.danger,
                        borderDash: [],
                        fill: false
                    }
                ]
            },
            options: this.getOptionsComuns('Projeção de Cenários')
        });
    }

    getOptionsComuns(titulo) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: titulo,
                    color: '#ffffff',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    position: 'top',
                    labels: {
                        color: '#ffffff',
                        usePointStyle: true
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    callbacks: {
                        label: this.formatarTooltipLabel.bind(this)
                    }
                }
            },
            scales: {
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff',
                        callback: this.formatarEixoY.bind(this)
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                }
            }
        };
    }

    formatarTooltipLabel(context) {
        const value = context.raw;
        if (typeof value === 'number') {
            if (context.dataset.label.includes('%')) {
                return value.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }) + '%';
            } else {
                return 'R$ ' + value.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            }
        }
        return value;
    }

    formatarEixoY(value) {
        if (value >= 1000000) {
            return 'R$ ' + (value / 1000000).toLocaleString('pt-BR', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
            }) + 'M';
        } else if (value >= 1000) {
            return 'R$ ' + (value / 1000).toLocaleString('pt-BR', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
            }) + 'k';
        }
        return 'R$ ' + value.toLocaleString('pt-BR');
    }

    getColor(index, alpha = 1) {
        const colors = [
            `rgba(52, 152, 219, ${alpha})`,  // primary
            `rgba(46, 204, 113, ${alpha})`,  // success
            `rgba(241, 196, 15, ${alpha})`,  // warning
            `rgba(231, 76, 60, ${alpha})`,   // danger
            `rgba(155, 89, 182, ${alpha})`   // purple
        ];
        return colors[index % colors.length];
    }

    atualizarGrafico(nome, dados) {
        if (this.charts[nome]) {
            this.charts[nome].data = dados;
            this.charts[nome].update();
        }
    }

    destruirGrafico(nome) {
        if (this.charts[nome]) {
            this.charts[nome].destroy();
            delete this.charts[nome];
        }
    }

    destruirTodos() {
        Object.keys(this.charts).forEach(key => {
            this.destruirGrafico(key);
        });
    }
}

// Exportar para uso global
window.GraficoManager = GraficoManager;