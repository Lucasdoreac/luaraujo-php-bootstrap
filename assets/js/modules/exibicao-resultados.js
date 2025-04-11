class ExibicaoResultados {
    constructor() {
        this.formatoMoeda = {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        };
        
        this.formatoPorcentagem = {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        };
        
        this.cores = {
            primaria: '#3498db',
            secundaria: '#2ecc71',
            terciaria: '#e74c3c',
            neutra: '#95a5a6'
        };
    }

    exibirResultadosBasicos(resultados, containerId = 'results') {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.style.display = 'block';
        
        // Formatar valores para exibição
        const valorInicial = this.formatarValor(resultados.valorInicial || resultados.totalInvestido, 'moeda');
        const valorFinal = this.formatarValor(resultados.valorFinal, 'moeda');
        const ganhoTotal = this.formatarValor(resultados.rendimentoTotal || resultados.ganhoTotal, 'moeda');
        const inflacao = resultados.inflacaoAcumulada ? 
            this.formatarValor(resultados.inflacaoAcumulada / 100, 'porcentagem') : '';
        const valorRealFinal = resultados.valorRealFinal ? 
            this.formatarValor(resultados.valorRealFinal, 'moeda') : '';
            
        // Definir conteúdo HTML
        const html = `
            <h3>Resultados da Simulação <i class="fas fa-chart-line"></i></h3>
            <p><strong>Valor Inicial:</strong> ${valorInicial}</p>
            <p><strong>Valor Final:</strong> ${valorFinal}</p>
            <p><strong>Ganho Total:</strong> ${ganhoTotal}</p>
            ${inflacao ? `<p><strong>Inflação Acumulada:</strong> ${inflacao}</p>` : ''}
            ${valorRealFinal ? `<p><strong>Valor Final Ajustado pela Inflação:</strong> ${valorRealFinal}</p>` : ''}
        `;
        
        container.innerHTML = html;
    }

    exibirTabelaComparativa(comparativos, containerId = 'tabela-comparativa') {
        const container = document.getElementById(containerId);
        if (!container || !comparativos) return;
        
        let html = `
            <h3>Comparação com Outros Investimentos</h3>
            <div class="table-responsive">
                <table class="table table-dark table-hover">
                    <thead>
                        <tr>
                            <th>Investimento</th>
                            <th class="text-end">Valor Final</th>
                            <th class="text-end">Ganho Total</th>
                            <th class="text-end">Rentabilidade</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        comparativos.forEach(item => {
            html += `
                <tr>
                    <td>${item.nome}</td>
                    <td class="text-end">${this.formatarValor(item.valorFinal, 'moeda')}</td>
                    <td class="text-end">${this.formatarValor(item.ganhoTotal, 'moeda')}</td>
                    <td class="text-end">${this.formatarValor(item.rentabilidade / 100, 'porcentagem')}</td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = html;
    }

    exibirGraficoEvolucao(evolucaoMensal, containerId = 'chart-evolucao') {
        const container = document.getElementById(containerId);
        if (!container || !evolucaoMensal) return;
        
        // Preparar dados
        const labels = evolucaoMensal.map(d => `Mês ${d.mes}`);
        const valores = evolucaoMensal.map(d => d.valorFinal);
        const aportes = evolucaoMensal.map(d => d.valorInicial + d.aporte);
        
        // Configurar o gráfico
        const config = {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Patrimônio Total',
                        data: valores,
                        borderColor: this.cores.primaria,
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        fill: true
                    },
                    {
                        label: 'Total Investido',
                        data: aportes,
                        borderColor: this.cores.secundaria,
                        borderDash: [5, 5],
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#fff'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${this.formatarValor(context.raw, 'moeda')}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            color: '#fff',
                            callback: (value) => this.formatarValor(value, 'moeda')
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#fff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        };
        
        // Limpar gráfico anterior se existir
        if (window.chartEvolucao) {
            window.chartEvolucao.destroy();
        }
        
        // Criar novo canvas
        container.innerHTML = '<canvas></canvas>';
        const ctx = container.querySelector('canvas').getContext('2d');
        
        // Renderizar novo gráfico
        window.chartEvolucao = new Chart(ctx, config);
    }

    exibirGraficoComparativo(comparativos, containerId = 'chart-comparativo') {
        const container = document.getElementById(containerId);
        if (!container || !comparativos) return;
        
        // Preparar dados
        const labels = comparativos.map(c => c.nome);
        const valoresFinais = comparativos.map(c => c.valorFinal);
        
        // Configurar o gráfico
        const config = {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Valor Final',
                        data: valoresFinais,
                        backgroundColor: [
                            'rgba(52, 152, 219, 0.8)',  // azul
                            'rgba(46, 204, 113, 0.8)',  // verde
                            'rgba(231, 76, 60, 0.8)',   // vermelho
                            'rgba(241, 196, 15, 0.8)'   // amarelo
                        ]
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${this.formatarValor(context.raw, 'moeda')}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            color: '#fff',
                            callback: (value) => this.formatarValor(value, 'moeda')
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#fff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        };
        
        // Limpar gráfico anterior se existir
        if (window.chartComparativo) {
            window.chartComparativo.destroy();
        }
        
        // Criar novo canvas
        container.innerHTML = '<canvas></canvas>';
        const ctx = container.querySelector('canvas').getContext('2d');
        
        // Renderizar novo gráfico
        window.chartComparativo = new Chart(ctx, config);
    }

    exibirResultadosPGBLvsCDB(resultados, containerId = 'resultados-pgbl-cdb') {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.style.display = 'block';
        
        // Formatar dados para exibição
        const html = `
            <h2>Resultados <i class="fas fa-poll-h"></i></h2>
            <div class="row">
                <div class="col-md-6">
                    <div class="card bg-dark mb-4">
                        <div class="card-header bg-primary text-white">
                            <h3 class="card-title h5">PGBL</h3>
                        </div>
                        <div class="card-body">
                            <p><strong>Valor Total Acumulado:</strong> ${this.formatarValor(resultados.pgbl.valorFinal, 'moeda')}</p>
                            <p><strong>Desembolso Efetivo:</strong> ${this.formatarValor(resultados.pgbl.desembolsoEfetivo, 'moeda')}</p>
                            <p><strong>IR no Resgate:</strong> ${this.formatarValor(resultados.pgbl.impostoRenda, 'moeda')}</p>
                            <p><strong>Valor Líquido:</strong> ${this.formatarValor(resultados.pgbl.valorLiquido, 'moeda')}</p>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6">
                    <div class="card bg-dark mb-4">
                        <div class="card-header bg-success text-white">
                            <h3 class="card-title h5">CDB</h3>
                        </div>
                        <div class="card-body">
                            <p><strong>Valor Total Acumulado:</strong> ${this.formatarValor(resultados.cdb.valorFinal, 'moeda')}</p>
                            <p><strong>Desembolso Efetivo:</strong> ${this.formatarValor(resultados.cdb.desembolsoEfetivo, 'moeda')}</p>
                            <p><strong>IR no Resgate:</strong> ${this.formatarValor(resultados.cdb.impostoRenda, 'moeda')}</p>
                            <p><strong>Valor Líquido:</strong> ${this.formatarValor(resultados.cdb.valorLiquido, 'moeda')}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card bg-dark mb-4">
                <div class="card-header">
                    <h3 class="card-title h5">Análise Comparativa <i class="fas fa-balance-scale"></i></h3>
                </div>
                <div class="card-body">
                    <p><strong>Diferença Líquida (PGBL - CDB):</strong> ${this.formatarValor(resultados.analise.diferencaLiquida, 'moeda')}</p>
                    <p><strong>Benefício Fiscal Total:</strong> ${this.formatarValor(resultados.analise.beneficioFiscal, 'moeda')}</p>
                    <p><strong>Taxa Equivalente CDB:</strong> ${this.formatarValor(resultados.analise.taxaEquivalenteCDB / 100, 'porcentagem')}</p>
                    
                    <div class="alert alert-${resultados.analise.recomendacao === 'pgbl' ? 'primary' : 'success'} mt-3">
                        <strong>Recomendação:</strong> ${resultados.analise.recomendacao === 'pgbl' ? 'PGBL' : 'CDB'} <br>
                        ${resultados.analise.justificativa}
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        
        // Criar tabela detalhada em outro div
        const tabelaDetalhesContainer = document.getElementById('tabela-detalhes');
        if (tabelaDetalhesContainer && resultados.timeline) {
            this.exibirTabelaDetalhada(resultados.timeline, tabelaDetalhesContainer);
        }
        
        // Criar gráfico de evolução em outro div
        const graficoTimelineContainer = document.getElementById('grafico-timeline');
        if (graficoTimelineContainer && resultados.timeline) {
            this.exibirGraficoTimeline(resultados.timeline, graficoTimelineContainer);
        }
    }

    exibirTabelaDetalhada(timeline, container) {
        let html = `
            <h3>Detalhamento Anual <i class="fas fa-table"></i></h3>
            <div class="table-responsive">
                <table class="table table-dark table-striped">
                    <thead>
                        <tr>
                            <th>Ano</th>
                            <th>Aporte PGBL</th>
                            <th>Benefício Fiscal</th>
                            <th>Saldo PGBL</th>
                            <th>Aporte CDB</th>
                            <th>Saldo CDB</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        timeline.forEach(item => {
            html += `
                <tr>
                    <td>${item.ano}</td>
                    <td>${this.formatarValor(item.pgbl.aporte, 'moeda')}</td>
                    <td>${this.formatarValor(item.pgbl.beneficioFiscal, 'moeda')}</td>
                    <td>${this.formatarValor(item.pgbl.saldo, 'moeda')}</td>
                    <td>${this.formatarValor(item.cdb.aporte, 'moeda')}</td>
                    <td>${this.formatarValor(item.cdb.saldo, 'moeda')}</td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = html;
    }

    exibirGraficoTimeline(timeline, container) {
        // Preparar dados
        const anos = timeline.map(t => `Ano ${t.ano}`);
        const saldosPGBL = timeline.map(t => t.pgbl.saldo);
        const saldosCDB = timeline.map(t => t.cdb.saldo);
        
        // Configurar o gráfico
        const config = {
            type: 'line',
            data: {
                labels: anos,
                datasets: [
                    {
                        label: 'PGBL',
                        data: saldosPGBL,
                        borderColor: this.cores.primaria,
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        fill: true
                    },
                    {
                        label: 'CDB',
                        data: saldosCDB,
                        borderColor: this.cores.secundaria,
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#fff'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${this.formatarValor(context.raw, 'moeda')}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            color: '#fff',
                            callback: (value) => this.formatarValor(value, 'moeda')
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#fff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        };
        
        // Limpar gráfico anterior se existir
        if (window.chartTimeline) {
            window.chartTimeline.destroy();
        }
        
        // Criar novo canvas
        container.innerHTML = '<canvas></canvas>';
        const ctx = container.querySelector('canvas').getContext('2d');
        
        // Renderizar novo gráfico
        window.chartTimeline = new Chart(ctx, config);
    }

    formatarValor(valor, tipo) {
        if (isNaN(valor)) return "-";
        
        if (tipo === 'moeda' || tipo.includes('moeda')) {
            return new Intl.NumberFormat('pt-BR', this.formatoMoeda).format(valor);
        } else if (tipo === 'porcentagem' || tipo.includes('porcentagem')) {
            return new Intl.NumberFormat('pt-BR', this.formatoPorcentagem).format(valor);
        } else {
            return valor.toLocaleString('pt-BR');
        }
    }
}

// Exportar para uso global
window.ExibicaoResultados = ExibicaoResultados;