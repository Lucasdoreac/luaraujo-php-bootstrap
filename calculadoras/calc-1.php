<?php
$page_title = "Simulador Educacional de Investimentos";
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $page_title; ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="../assets/css/styles.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="bg-dark text-light">
    <?php include '../components/navbar/navbar.php'; ?>
    <div class="container">
        <h1>Simulador Educacional de Investimentos <i class="fas fa-chart-line"></i></h1>
        <div class="educational-tips">
            <h3>Conceitos Básicos de Investimentos <span class="help-icon" onclick="toggleTips()">?</span></h3>
             <div id="tipsContent" class="concept-explanation">
                <h4><i>Conceitos Importantes:</i></h4>
                <ul>
                    <li><strong>Juros Compostos:</strong> São os juros que incidem não apenas sobre o <i>capital inicial</i>, mas também sobre os juros acumulados em períodos anteriores. É o chamado "juros sobre juros".</li>
                    <li><strong>CDI (Certificado de Depósito Interbancário):</strong> É uma <i>taxa de referência</i> no mercado financeiro brasileiro, muito utilizada para remunerar investimentos de <strong>renda fixa</strong>.</li>
                    <li><strong>Renda Fixa vs Renda Variável:</strong> <strong>Renda fixa</strong> tem retornos mais previsíveis e menor risco, enquanto <strong>renda variável</strong> pode ter maiores retornos mas com maior risco.</li>
                    <li><strong>Inflação:</strong> Aumento generalizado dos preços que reduz o <i>poder de compra</i> do dinheiro ao longo do tempo.</li>
                     <li><strong>Diversificação:</strong> Estratégia de distribuir investimentos em diferentes tipos de ativos para reduzir riscos.</li>
                </ul>
            </div>
        </div>
        <div class="goals-section">
            <h3>Planejamento Financeiro <i class="fas fa-tasks"></i></h3>
            <div class="form-group">
               <label for="goalAmount">Meta Financeira (R$):</label>
               <input type="number" id="goalAmount">
                <span class="help-icon" onclick="showConcept('goal')">?</span>
               <div id="goalConcept" class="concept-explanation">
                    <p>Defina o valor que deseja acumular. Exemplos: <i>reserva de emergência</i>, entrada para um imóvel, aposentadoria, etc.</p>
                </div>
           </div>
             <div class="form-group">
                <label for="goalYears">Prazo para atingir a meta (anos):</label>
                <input type="number" id="goalYears">
           </div>
        </div>
        <form id="simulador-form">
            <div class="form-group">
                <label for="valorInicial">Valor Inicial (R$):</label>
               <input type="number" id="valorInicial" required>
               <span class="help-icon" onclick="showConcept('valorInicial')">?</span>
                <div id="valorInicialConcept" class="concept-explanation">
                    <p>Informe o <i>valor inicial</i> que você tem para investir.</p>
                </div>
           </div>
            <div class="form-group">
                <label for="aporteMensal">Aporte Mensal (R$):</label>
               <input type="number" id="aporteMensal" required>
                <span class="help-icon" onclick="showConcept('aporteMensal')">?</span>
                <div id="aporteMensalConcept" class="concept-explanation">
                   <p>Informe o valor que você pode investir <i>mensalmente</i>.</p>
                </div>
           </div>
            <div class="form-group">
                <label for="tipoRendimento">Tipo de Rendimento:</label>
               <select id="tipoRendimento" required>
                    <option value="fixa">Taxa Fixa</option>
                    <option value="cdi">Taxa do CDI</option>
                </select>
                <span class="help-icon" onclick="showConcept('tipoRendimento')">?</span>
               <div id="tipoRendimentoConcept" class="concept-explanation">
                   <p>Escolha entre uma <i>taxa fixa</i> ou uma <i>taxa atrelada ao CDI</i>.</p>
                </div>
           </div>
             <div id="taxaFixaGroup" class="form-group">
                <label for="taxaFixa">Taxa Fixa Mensal (%):</label>
                <input type="number" id="taxaFixa" step="0.01">
               <div class="instruction">Informe a <i>taxa de rendimento mensal</i> (em %).</div>
            </div>
             <div id="cdiGroup" style="display: none;">
                 <div class="form-group">
                   <label for="taxaCDI">Taxa CDI Anual (%):</label>
                   <input type="number" id="taxaCDI" step="0.01" value="13.15">
                    <div class="instruction">Informe a <i>taxa do CDI anual</i> (em %).</div>
                </div>
                <div class="form-group">
                    <label for="percentualCDIComImposto">Percentual do CDI - Com IR (%):</label>
                    <input type="number" id="percentualCDIComImposto" step="0.1" value="100">
               </div>
                <div class="form-group">
                    <label for="percentualCDISemImposto">Percentual do CDI - Sem IR (%):</label>
                    <input type="number" id="percentualCDISemImposto" step="0.1" value="93">
               </div>
           </div>
            <div class="form-group">
                <label for="prazo">Prazo (meses):</label>
               <input type="number" id="prazo" required>
                <span class="help-icon" onclick="showConcept('prazo')">?</span>
                 <div id="prazoConcept" class="concept-explanation">
                    <p>Informe o <i>prazo do investimento</i> em meses.</p>
                </div>
            </div>
            <div class="form-group">
                <label for="inflacao">Inflação Anual Estimada (%):</label>
                <input type="number" id="inflacao" step="0.1" value="4.5">
                <span class="help-icon" onclick="showConcept('inflacao')">?</span>
               <div id="inflacaoConcept" class="concept-explanation">
                    <p>Informe a <i>taxa de inflação anual</i> estimada.</p>
               </div>
            </div>
            <button type="button" onclick="calcularRentabilidade()">Calcular Simulação <i class="fas fa-calculator"></i></button>
        </form>
       <div class="tab-container">
             <div class="container-botoes">
                 <button class="tab-button active" onclick="showTab('resultados')">Resultados <i class="fas fa-chart-bar"></i></button>
                 <button class="tab-button" onclick="showTab('comparacoes')">Comparações <i class="fas fa-balance-scale"></i></button>
                <button class="tab-button" onclick="showTab('educacional')">Material Educativo <i class="fas fa-book-open"></i></button>
                 <button class="tab-button" onclick="showTab('pgblCdb')">PGBL vs CDB <i class="fas fa-money-check-alt"></i></button>
            </div>
           <div id="resultadosTab" class="tab-content active">
               <div id="results" class="results" style="display: none;">
                    <h3>Resultados da Simulação <i class="fas fa-chart-line"></i></h3>
                    <p><strong>Valor Inicial:</strong> R$ <span id="resultValorInicial"></span></p>
                    <p><strong>Aporte Mensal:</strong> R$ <span id="resultAporteMensal"></span></p>
                   <p><strong>Prazo:</strong> <span id="resultPrazo"></span> meses</p>
                     <p><strong>Taxa de Rendimento:</strong> <span id="resultTaxaRendimento"></span>% ao mês</p>
                    <p><strong>Valor Final:</strong> R$ <span id="resultValorFinal"></span></p>
                    <p><strong>Ganho Total:</strong> R$ <span id="resultGanhoTotal"></span></p>
                    <p><strong>Inflação Acumulada:</strong> <span id="resultInflacaoAcumulada"></span>%</p>
                    <p><strong>Valor Final Ajustado pela Inflação:</strong> R$ <span id="resultValorFinalAjustado"></span></p>
                    <div class="chart-container">
                        <canvas id="chartSimulacao"></canvas>
                    </div>
                </div>
            </div>
             <div id="comparacoesTab" class="tab-content">
                <h3>Comparações <i class="fas fa-chart-pie"></i></h3>
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Investimento</th>
                            <th>Valor Final</th>
                            <th>Ganho Total</th>
                        </tr>
                   </thead>
                   <tbody>
                        <tr>
                            <td>Poupança</td>
                            <td id="comparacaoPoupancaValorFinal">-</td>
                            <td id="comparacaoPoupancaGanhoTotal">-</td>
                        </tr>
                        <tr>
                            <td>CDB</td>
                            <td id="comparacaoCDBValorFinal">-</td>
                            <td id="comparacaoCDBGanhoTotal">-</td>
                        </tr>
                        <tr>
                            <td>LCI/LCA</td>
                            <td id="comparacaoLCILCAValorFinal">-</td>
                            <td id="comparacaoLCILCAGanhoTotal">-</td>
                        </tr>
                    </tbody>
                </table>
                <div class="chart-container">
                    <canvas id="chartComparacoes"></canvas>
               </div>
                <div class="educational-content">
                    <h4>Laudo Comparativo <i class="fas fa-file-alt"></i></h4>
                   <p id="laudoComparativo"></p>
                    <p id="laudoMeta"></p>
                    <p id="laudoPercentualCDB"></p>
                </div>
            </div>
            <div id="educacionalTab" class="tab-content">
               <h3>Material Educativo <i class="fas fa-book"></i></h3>
                <div class="educational-content">
                    <h4>Como Funcionam os Investimentos? <i class="fas fa-question-circle"></i></h4>
                   <p>Investir é uma forma de fazer o dinheiro trabalhar para você. Existem diferentes tipos de investimentos, cada um com suas características, riscos e retornos. Aqui estão alguns conceitos básicos:</p>
                   <ul>
                        <li><strong>Renda Fixa:</strong> Investimentos com retornos previsíveis, como <i>títulos públicos</i> e <strong>CDBs</strong>.</li>
                        <li><strong>Renda Variável:</strong> Investimentos com retornos variáveis, como <i>ações</i> e <i>fundos imobiliários</i>.</li>
                        <li><strong>Diversificação:</strong> Estratégia de distribuir investimentos em diferentes tipos de ativos para reduzir riscos.</li>
                        <li><strong>Juros Compostos:</strong> Juros que incidem sobre o <i>capital inicial</i> e sobre os juros acumulados, gerando <i>crescimento exponencial</i>.</li>
                    </ul>
                </div>
            </div>
          <div id="pgblCdbTab" class="tab-content">
                 <h3>Simulador PGBL vs CDB <i class="fas fa-hand-holding-usd"></i></h3>
                <form id="simulador-pgbl-cdb">
                    <label for="rendaTributavel">Renda Anual Tributável (R$):</label>
                    <input type="number" id="rendaTributavel" step="0.01" required>
                   <label for="aporteInicial">Aporte Inicial (opcional) - R$:</label>
                    <input type="number" id="aporteInicial" step="0.01" value="0">
                   <label for="anos">Período de Investimento (em anos):</label>
                    <input type="number" id="anos" required min="1">
                    <label for="cdi">Taxa do CDI Anual (%):</label>
                   <input type="number" id="cdi" step="0.01" value="10" required min="0">
                   <button type="button" onclick="calcularPGBLCDB()">Simular <i class="fas fa-calculator"></i></button>
                </form>
                <div class="results" id="resultados-pgbl-cdb" style="display: none;">
                    <h2>Resultados <i class="fas fa-poll-h"></i></h2>
                   <p><strong>PGBL:</strong></p>
                   <p>Valor Total Acumulado: R$ <span id="pgblAcumulado"></span></p>
                    <p>Desembolso Efetivo: R$ <span id="pgblDesembolso"></span></p>
                    <p>IR no Resgate: R$ <span id="pgblIR"></span></p>
                   <p>Valor Líquido: R$ <span id="pgblLiquido"></span></p>
                    <p><strong>CDB:</strong></p>
                   <p>Valor Total Acumulado: R$ <span id="cdbAcumulado"></span></p>
                    <p>Desembolso Efetivo: R$ <span id="cdbDesembolso"></span></p>
                   <p>IR no Resgate: R$ <span id="cdbIR"></span></p>
                    <p>Valor Líquido: R$ <span id="cdbLiquido"></span></p>
                   <h3>Detalhamento Anual <i class="fas fa-table"></i></h3>
                    <table id="tabelaDetalhes" class="comparison-table">
                        <thead>
                            <tr>
                                <th>Ano</th>
                                <th>Aporte PGBL (R$)</th>
                                <th>Restituição PGBL (R$)</th>
                                <th>Saldo PGBL (R$)</th>
                                <th>Aporte CDB (R$)</th>
                                <th>Saldo CDB (R$)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- As linhas serão preenchidas pelo JavaScript -->
                        </tbody>
                   </table>
                    <div class="analise">
                        <h3>Análise Comparativa <i class="fas fa-balance-scale"></i></h3>
                        <p><strong>Diferença Líquida (PGBL - CDB):</strong> R$ <span id="diferencaLiquida"></span></p>
                       <p><strong>Valor Total Restituído (PGBL):</strong> R$ <span id="totalRestituido"></span></p>
                         <p><strong>Resultado Final Ajustado:</strong> R$ <span id="resultadoFinalAjustado"></span></p>
                        <p><strong>Rentabilidade Líquida PGBL:</strong> <span id="rentabilidadePGBL"></span></p>
                        <p><strong>Rentabilidade Líquida CDB:</strong> <span id="rentabilidadeCDB"></span></p>
                    </div>
               </div>
            </div>
       </div>
   </div>
    <?php include '../components/footer/footer.php'; ?>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        function toggleTips() {
           const tipsContent = document.getElementById('tipsContent');
            tipsContent.style.display = tipsContent.style.display === 'block' ? 'none' : 'block';
        }
        function showConcept(concept) {
            const conceptElement = document.getElementById(concept + 'Concept');
            if (conceptElement) {
                conceptElement.style.display = conceptElement.style.display === 'block' ? 'none' : 'block';
            }
        }
        function showTab(tabId) {
            const tabs = document.querySelectorAll('.tab-content');
            tabs.forEach(tab => tab.style.display = 'none');
            document.getElementById(tabId + 'Tab').style.display = 'block';
            const buttons = document.querySelectorAll('.tab-button');
            buttons.forEach(button => button.classList.remove('active'));
            document.querySelector(`[onclick="showTab('${tabId}')"]`).classList.add('active');
        }
        
        document.getElementById('tipoRendimento').addEventListener('change', function() {
            const tipoRendimento = this.value;
            if (tipoRendimento === 'fixa') {
                document.getElementById('taxaFixaGroup').style.display = 'block';
                document.getElementById('cdiGroup').style.display = 'none';
            } else {
                document.getElementById('taxaFixaGroup').style.display = 'none';
                document.getElementById('cdiGroup').style.display = 'block';
            }
        });
        
        function calcularRentabilidade() {
            const valorInicial = parseFloat(document.getElementById('valorInicial').value);
            const aporteMensal = parseFloat(document.getElementById('aporteMensal').value);
            const prazo = parseInt(document.getElementById('prazo').value);
            const tipoRendimento = document.getElementById('tipoRendimento').value;
            const taxaFixa = parseFloat(document.getElementById('taxaFixa').value) / 100;
            const taxaCDI = parseFloat(document.getElementById('taxaCDI').value) / 100;
            const percentualCDIComImposto = parseFloat(document.getElementById('percentualCDIComImposto').value) / 100;
            const percentualCDISemImposto = parseFloat(document.getElementById('percentualCDISemImposto').value) / 100;
            const inflacao = parseFloat(document.getElementById('inflacao').value) / 100;
            
            if (isNaN(valorInicial) || isNaN(aporteMensal) || isNaN(prazo) || isNaN(inflacao)) {
                alert("Preencha todos os campos obrigatórios para calcular a simulação.");
                return;
            }
            
            // Cálculo do percentual do CDI do CDB necessário para bater o LCI/LCA
            const ir = 0.225; // Imposto de Renda de 22.5% (exemplo)
            const percentualCDIComIRNecessario = percentualCDISemImposto / (1 - ir);
            
            let taxaMensal;
            if (tipoRendimento === 'fixa') {
                if (isNaN(taxaFixa)) {
                    alert("Preencha a taxa fixa mensal.");
                    return;
                }
                taxaMensal = taxaFixa;
            } else {
                if (isNaN(taxaCDI) || isNaN(percentualCDIComImposto) || isNaN(percentualCDISemImposto)) {
                    alert("Preencha todos os campos relacionados ao CDI.");
                    return;
                }
                taxaMensal = (taxaCDI / 12) * percentualCDIComImposto;
            }
            
            let valorFinal = valorInicial;
            for (let i = 0; i < prazo; i++) {
                valorFinal = valorFinal * (1 + taxaMensal) + aporteMensal;
            }
            
            const ganhoTotal = valorFinal - valorInicial - (aporteMensal * prazo);
            const inflacaoAcumulada = Math.pow(1 + inflacao, prazo / 12) - 1;
            const valorFinalAjustado = valorFinal / (1 + inflacaoAcumulada);
            
            document.getElementById('resultValorInicial').textContent = valorInicial.toFixed(2);
            document.getElementById('resultAporteMensal').textContent = aporteMensal.toFixed(2);
            document.getElementById('resultPrazo').textContent = prazo;
            document.getElementById('resultTaxaRendimento').textContent = (taxaMensal * 100).toFixed(2);
            document.getElementById('resultValorFinal').textContent = valorFinal.toFixed(2);
            document.getElementById('resultGanhoTotal').textContent = ganhoTotal.toFixed(2);
            document.getElementById('resultInflacaoAcumulada').textContent = (inflacaoAcumulada * 100).toFixed(2);
            document.getElementById('resultValorFinalAjustado').textContent = valorFinalAjustado.toFixed(2);
            document.getElementById('results').style.display = 'block';
            
            // Comparações
            const taxaPoupanca = 0.005; // 0.5% ao mês
            const taxaCDB = (taxaCDI / 12) * percentualCDIComImposto;
            const taxaLCILCA = (taxaCDI / 12) * percentualCDISemImposto; // LCI/LCA sem IR
            
            let valorFinalPoupanca = valorInicial;
            let valorFinalCDB = valorInicial;
            let valorFinalLCILCA = valorInicial;
            
            for (let i = 0; i < prazo; i++) {
                valorFinalPoupanca = valorFinalPoupanca * (1 + taxaPoupanca) + aporteMensal;
                valorFinalCDB = valorFinalCDB * (1 + taxaCDB) + aporteMensal;
                valorFinalLCILCA = valorFinalLCILCA * (1 + taxaLCILCA) + aporteMensal;
            }
            
            // Aplicar imposto de renda regressivo no CDB
            let aliquotaIR;
            if (prazo <= 180) {
                aliquotaIR = 0.225; // 22.5%
            } else if (prazo <= 360) {
                aliquotaIR = 0.20; // 20%
            } else if (prazo <= 720) {
                aliquotaIR = 0.175; // 17.5%
            } else {
                aliquotaIR = 0.15; // 15%
            }
            
            const ganhoBrutoCDB = valorFinalCDB - valorInicial - (aporteMensal * prazo);
            const impostoCDB = ganhoBrutoCDB * aliquotaIR;
            const ganhoLiquidoCDB = ganhoBrutoCDB - impostoCDB;
            const valorFinalLiquidoCDB = valorFinalCDB - impostoCDB;
            
            document.getElementById('comparacaoPoupancaValorFinal').textContent = valorFinalPoupanca.toFixed(2);
            document.getElementById('comparacaoPoupancaGanhoTotal').textContent = (valorFinalPoupanca - valorInicial - (aporteMensal * prazo)).toFixed(2);
            document.getElementById('comparacaoCDBValorFinal').textContent = valorFinalLiquidoCDB.toFixed(2);
            document.getElementById('comparacaoCDBGanhoTotal').textContent = ganhoLiquidoCDB.toFixed(2);
            document.getElementById('comparacaoLCILCAValorFinal').textContent = valorFinalLCILCA.toFixed(2);
            document.getElementById('comparacaoLCILCAGanhoTotal').textContent = (valorFinalLCILCA - valorInicial - (aporteMensal * prazo)).toFixed(2);
            
            // Gráfico de Simulação
            const ctxSimulacao = document.getElementById('chartSimulacao').getContext('2d');
            
            // Destruir gráfico anterior se existir
            if (window.chartSimulacao) {
                window.chartSimulacao.destroy();
            }
            
            window.chartSimulacao = new Chart(ctxSimulacao, {
                type: 'line',
                data: {
                    labels: Array.from({ length: prazo }, (_, i) => `Mês ${i + 1}`),
                    datasets: [{
                        label: 'Valor Acumulado',
                        data: Array.from({ length: prazo }, (_, i) => {
                            let valor = valorInicial;
                            for (let j = 0; j <= i; j++) {
                                valor = valor * (1 + taxaMensal) + aporteMensal;
                            }
                            return valor;
                        }),
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        borderWidth: 2,
                        fill: true
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#ffffff'
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
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: '#ffffff'
                            }
                        }
                    }
                }
            });
            
            // Gráfico de Comparações
            const ctxComparacoes = document.getElementById('chartComparacoes').getContext('2d');
            
            // Destruir gráfico anterior se existir
            if (window.chartComparacoes) {
                window.chartComparacoes.destroy();
            }
            
            window.chartComparacoes = new Chart(ctxComparacoes, {
                type: 'bar',
                data: {
                    labels: ['Poupança', 'CDB', 'LCI/LCA'],
                    datasets: [{
                        label: 'Valor Final',
                        data: [valorFinalPoupanca, valorFinalLiquidoCDB, valorFinalLCILCA],
                        backgroundColor: ['#2ecc71', '#3498db', '#e74c3c']
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#ffffff'
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
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: '#ffffff'
                            }
                        }
                    }
                }
            });
            
            // Laudo Comparativo
            const laudoComparativo = document.getElementById('laudoComparativo');
            if (valorFinalPoupanca > valorFinalLiquidoCDB && valorFinalPoupanca > valorFinalLCILCA) {
                laudoComparativo.textContent = "A poupança foi a opção mais vantajosa neste cenário.";
            } else if (valorFinalLiquidoCDB > valorFinalPoupanca && valorFinalLiquidoCDB > valorFinalLCILCA) {
                laudoComparativo.textContent = "O CDB foi a opção mais vantajosa neste cenário.";
            } else {
                laudoComparativo.textContent = "O LCI/LCA foi a opção mais vantajosa neste cenário.";
            }
            
            // Cálculo do valor necessário para atingir a meta
            const goalAmount = parseFloat(document.getElementById('goalAmount').value);
            const goalYears = parseFloat(document.getElementById('goalYears').value);
            const goalMonths = goalYears * 12;
            
            if (goalAmount && goalMonths) {
                const taxaMensalMeta = (taxaCDI / 12) * percentualCDISemImposto; // Usando LCI/LCA para cálculo da meta
                const valorNecessario = (goalAmount * taxaMensalMeta) / (Math.pow(1 + taxaMensalMeta, goalMonths) - 1);
                const valorNecessarioAjustado = valorNecessario * Math.pow(1 + inflacao, goalYears);
                document.getElementById('laudoMeta').textContent = `Para atingir a meta de R$ ${goalAmount.toFixed(2)} em ${goalYears} anos, considerando a rentabilidade do LCI/LCA e a inflação, você precisaria investir aproximadamente R$ ${valorNecessarioAjustado.toFixed(2)} mensalmente.`;
            } else {
                document.getElementById('laudoMeta').textContent = "Preencha os campos de meta financeira e prazo para calcular o valor necessário.";
            }
            
            // Exibir o percentual do CDI do CDB necessário para bater o LCI/LCA
            document.getElementById('laudoPercentualCDB').textContent = `Para o CDB ter o mesmo rendimento líquido do LCI/LCA, ele precisa render ${(percentualCDIComIRNecessario * 100).toFixed(2)}% do CDI.`;
        }
        
        // Função para calcular a alíquota de IR do PGBL com base no período
        function calcularAliquotaIRPGBL(anos) {
            if (anos <= 2) return 0.35;
            if (anos <= 4) return 0.30;
            if (anos <= 6) return 0.20;
            if (anos <= 8) return 0.15;
            return 0.10; // Acima de 8 anos
        }
        
        // Função para calcular a alíquota de IR do CDB com base no período
        function calcularAliquotaIRCDB(meses) {
           if (meses <= 6) return 0.225; // 22,5%
            if (meses <= 12) return 0.20; // 20%
            if (meses <= 24) return 0.175; // 17,5%
            return 0.15; // 15% (acima de 24 meses)
        }
        
        function calcularPGBLCDB() {
            // Obter valores dos inputs
            const rendaTributavel = parseFloat(document.getElementById('rendaTributavel').value);
            const aporteInicial = parseFloat(document.getElementById('aporteInicial').value) || 0;
            const anos = parseInt(document.getElementById('anos').value);
            const cdi = parseFloat(document.getElementById('cdi').value) / 100;
            
            // Validar entradas
            if (isNaN(rendaTributavel) || rendaTributavel <= 0) {
                alert("Por favor, insira uma renda anual tributável válida.");
                return;
            }
            if (isNaN(anos) || anos <= 0) {
                alert("Por favor, insira um período de investimento válido.");
                return;
            }
            if (isNaN(cdi) || cdi <= 0) {
                alert("Por favor, insira uma taxa do CDI válida.");
                return;
            }
            
            // Constantes
            const aliquotaIR = 0.275; // 27,5%
            const aporteAnual = rendaTributavel * 0.12;
            
            // Inicializar variáveis
            let pgblSaldo = aporteInicial;
            let pgblDesembolso = aporteInicial;
            let cdbSaldo = aporteInicial;
            let cdbDesembolso = aporteInicial;
            
            // Limpar tabela de detalhes
            const tabelaDetalhes = document.getElementById('tabelaDetalhes').getElementsByTagName('tbody')[0];
            tabelaDetalhes.innerHTML = "";
            
            // Calcular acumulação ao longo dos anos
            for (let i = 1; i <= anos; i++) {
                // PGBL: No primeiro ano, não há restituição
                const restituicao = i === 1 ? 0 : aporteAnual * aliquotaIR;
                const aporteEfetivo = i === 1 ? aporteAnual : aporteAnual - restituicao;
                pgblDesembolso += aporteEfetivo;
                pgblSaldo = (pgblSaldo + aporteEfetivo + restituicao) * (1 + cdi);
                
                // CDB: Aporte fixo anual (não há restituição)
                cdbDesembolso += aporteAnual;
                cdbSaldo = (cdbSaldo + aporteAnual) * (1 + cdi);
                
                // Adicionar linha na tabela de detalhes
                const row = tabelaDetalhes.insertRow();
                row.insertCell().innerText = i;
                row.insertCell().innerText = aporteEfetivo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                row.insertCell().innerText = restituicao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                row.insertCell().innerText = pgblSaldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                row.insertCell().innerText = aporteAnual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                row.insertCell().innerText = cdbSaldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            }
            
            // Adicionar linha de totalização
            const rowTotal = tabelaDetalhes.insertRow();
            rowTotal.classList.add('total');
            rowTotal.insertCell().innerText = "Total";
            rowTotal.insertCell().innerText = pgblDesembolso.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            rowTotal.insertCell().innerText = (pgblDesembolso - aporteInicial - aporteAnual * anos).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            rowTotal.insertCell().innerText = ""; // Saldo PGBL não é somado
            rowTotal.insertCell().innerText = cdbDesembolso.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            rowTotal.insertCell().innerText = ""; // Saldo CDB não é somado
            
            // Calcular IR no resgate
            const aliquotaPGBL = calcularAliquotaIRPGBL(anos);
            const pgblIR = pgblSaldo * aliquotaPGBL;
            const pgblLiquido = pgblSaldo - pgblIR;
            
            const meses = anos * 12; // Converter anos em meses
            const aliquotaCDB = calcularAliquotaIRCDB(meses);
            const cdbRendimentos = cdbSaldo - cdbDesembolso; // Rendimentos = Saldo - Aportes
            const cdbIR = cdbRendimentos * aliquotaCDB; // IR sobre os rendimentos
            const cdbLiquido = cdbSaldo - cdbIR; // Valor líquido após IR
            
            // Exibir resultados
            document.getElementById('pgblAcumulado').innerText = pgblSaldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', '');
            document.getElementById('pgblDesembolso').innerText = pgblDesembolso.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', '');
            document.getElementById('pgblIR').innerText = pgblIR.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', '');
            document.getElementById('pgblLiquido').innerText = pgblLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', '');
            document.getElementById('cdbAcumulado').innerText = cdbSaldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', '');
            document.getElementById('cdbDesembolso').innerText = cdbDesembolso.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', '');
            document.getElementById('cdbIR').innerText = cdbIR.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', '');
            document.getElementById('cdbLiquido').innerText = cdbLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', '');
            
            // Análise comparativa
            const diferencaLiquida = pgblLiquido - cdbLiquido;
            const totalRestituido = pgblDesembolso - aporteInicial - (aporteAnual * anos);
            const resultadoFinalAjustado = diferencaLiquida - totalRestituido;
            const rentabilidadePGBL = ((pgblLiquido - pgblDesembolso) / pgblDesembolso) * 100;
            const rentabilidadeCDB = ((cdbLiquido - cdbDesembolso) / cdbDesembolso) * 100;
            
            document.getElementById('diferencaLiquida').innerText = diferencaLiquida.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', '');
            document.getElementById('totalRestituido').innerText = totalRestituido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', '');
            document.getElementById('resultadoFinalAjustado').innerText = resultadoFinalAjustado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', '');
            document.getElementById('rentabilidadePGBL').innerText = rentabilidadePGBL.toFixed(2) + "%";
            document.getElementById('rentabilidadeCDB').innerText = rentabilidadeCDB.toFixed(2) + "%";
            
            // Mostrar resultados
            document.getElementById('resultados-pgbl-cdb').style.display = 'block';
        }
    </script>
</body>
</html>
