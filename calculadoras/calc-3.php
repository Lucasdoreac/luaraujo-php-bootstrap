<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simulador de Investimentos</title>
     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
    <link rel="stylesheet" href="../assets/css/styles.css">
</head>
<body>
    <?php include '../components/navbar/navbar.php'; ?>
    <div class="container">
        <h1>Simulador de Investimentos <i class="fas fa-coins"></i></h1>
       <!-- Simulação Global -->
        <section>
            <h2>Simulação Global <i class="fas fa-globe"></i></h2>
            <div class="form-group">
               <label for="aporteMensal">Aporte Mensal (R$):</label>
               <input type="number" id="aporteMensal" placeholder="Exemplo: 1000" value="0">
            </div>
             <div class="form-group">
               <label for="taxaMensal">Taxa Mensal (%):</label>
                <input type="number" id="taxaMensal" placeholder="Exemplo: 0.83" value="0">
           </div>
           <div class="form-group">
                <label for="quantidadeMeses">Quantidade de Meses:</label>
                <input type="number" id="quantidadeMeses" placeholder="Exemplo: 36" value="0">
            </div>
            <button onclick="calcularSimulacaoGlobal()">Simular <i class="fas fa-calculator"></i></button>
             <div class="results">
               <p><strong>Valor Futuro Total: R$ <span id="valorFuturoGlobal">0.00</span></strong></p>
           </div>
        </section>
        <hr>
         <!-- Simulação Mensal -->
        <h2>Simulação Mensal (12 Meses) <i class="fas fa-calendar-alt"></i></h2>
        <button onclick="preencherTodosMeses()">Preencher todos os meses com o valor do primeiro mês</button>
        <button onclick="preencherTaxaAnualTodosMeses()">Preencher taxa anual do primeiro mês em todos os meses</button>
       <table id="simuladorInvestimentos" class="comparison-table">
            <thead>
                <tr>
                    <th>Mês</th>
                    <th>Valor Investido (R$)</th>
                    <th>Taxa Anual (%)</th>
                    <th>Taxa Mensal (%)</th>
                   <th>Número de Meses</th>
                   <th>Valor Futuro (R$)</th>
                </tr>
           </thead>
           <tbody>
                <!-- Linhas dos 12 meses -->
               <tr>
                    <td>Janeiro</td>
                    <td><input type="number" class="investido" value="0"></td>
                    <td><input type="number" class="taxaAnual" value="11.15"></td>
                   <td><span class="taxaMensal">0</span></td>
                    <td><span class="meses">1</span></td>
                    <td><span class="valorFuturo">0</span></td>
               </tr>
               <tr>
                    <td>Fevereiro</td>
                    <td><input type="number" class="investido" value="0"></td>
                    <td><input type="number" class="taxaAnual" value="11.15"></td>
                    <td><span class="taxaMensal">0</span></td>
                    <td><span class="meses">2</span></td>
                    <td><span class="valorFuturo">0</span></td>
               </tr>
                <tr>
                   <td>Março</td>
                    <td><input type="number" class="investido" value="0"></td>
                    <td><input type="number" class="taxaAnual" value="11.15"></td>
                   <td><span class="taxaMensal">0</span></td>
                   <td><span class="meses">3</span></td>
                    <td><span class="valorFuturo">0</span></td>
               </tr>
                <tr>
                    <td>Abril</td>
                   <td><input type="number" class="investido" value="0"></td>
                    <td><input type="number" class="taxaAnual" value="11.15"></td>
                    <td><span class="taxaMensal">0</span></td>
                   <td><span class="meses">4</span></td>
                    <td><span class="valorFuturo">0</span></td>
               </tr>
                <tr>
                    <td>Maio</td>
                   <td><input type="number" class="investido" value="0"></td>
                   <td><input type="number" class="taxaAnual" value="11.15"></td>
                    <td><span class="taxaMensal">0</span></td>
                   <td><span class="meses">5</span></td>
                   <td><span class="valorFuturo">0</span></td>
               </tr>
                <tr>
                   <td>Junho</td>
                   <td><input type="number" class="investido" value="0"></td>
                    <td><input type="number" class="taxaAnual" value="11.15"></td>
                   <td><span class="taxaMensal">0</span></td>
                    <td><span class="meses">6</span></td>
                   <td><span class="valorFuturo">0</span></td>
                </tr>
                <tr>
                    <td>Julho</td>
                    <td><input type="number" class="investido" value="0"></td>
                   <td><input type="number" class="taxaAnual" value="11.15"></td>
                    <td><span class="taxaMensal">0</span></td>
                   <td><span class="meses">7</span></td>
                    <td><span class="valorFuturo">0</span></td>
               </tr>
               <tr>
                    <td>Agosto</td>
                   <td><input type="number" class="investido" value="0"></td>
                    <td><input type="number" class="taxaAnual" value="11.15"></td>
                    <td><span class="taxaMensal">0</span></td>
                   <td><span class="meses">8</span></td>
                    <td><span class="valorFuturo">0</span></td>
               </tr>
                <tr>
                   <td>Setembro</td>
                   <td><input type="number" class="investido" value="0"></td>
                   <td><input type="number" class="taxaAnual" value="11.15"></td>
                    <td><span class="taxaMensal">0</span></td>
                   <td><span class="meses">9</span></td>
                   <td><span class="valorFuturo">0</span></td>
                </tr>
                <tr>
                    <td>Outubro</td>
                    <td><input type="number" class="investido" value="0"></td>
                    <td><input type="number" class="taxaAnual" value="11.15"></td>
                    <td><span class="taxaMensal">0</span></td>
                   <td><span class="meses">10</span></td>
                    <td><span class="valorFuturo">0</span></td>
                </tr>
                 <tr>
                   <td>Novembro</td>
                    <td><input type="number" class="investido" value="0"></td>
                   <td><input type="number" class="taxaAnual" value="11.15"></td>
                    <td><span class="taxaMensal">0</span></td>
                   <td><span class="meses">11</span></td>
                    <td><span class="valorFuturo">0</span></td>
                </tr>
                <tr>
                    <td>Dezembro</td>
                   <td><input type="number" class="investido" value="0"></td>
                    <td><input type="number" class="taxaAnual" value="11.15"></td>
                   <td><span class="taxaMensal">0</span></td>
                    <td><span class="meses">12</span></td>
                    <td><span class="valorFuturo">0</span></td>
               </tr>
                <tr class="total">
                    <td><strong>Total</strong></td>
                   <td><span id="totalInvestido">0</span></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td><span id="totalFuturo">0</span></td>
                </tr>
            </tbody>
        </table>
    </div>
    <?php include '../components/footer/footer.php'; ?>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
   <script>
         function calcularSimulacaoGlobal() {
            // Obtém os valores inseridos pelo usuário
            const aporteMensal = parseFloat(document.getElementById("aporteMensal").value) || 0;
           const taxaMensal = parseFloat(document.getElementById("taxaMensal").value) / 100 || 0;
            const quantidadeMeses = parseInt(document.getElementById("quantidadeMeses").value) || 0;
             // Verifica se os valores são válidos
           if (aporteMensal <= 0 || taxaMensal <= 0 || quantidadeMeses <= 0) {
               alert("Por favor, insira valores válidos para todos os campos.");
               return;
            }
            // Calcula o valor futuro somando os fluxos de caixa: PMT * (1 + i)^(n - t)
            let valorFuturo = 0;
           for (let t = 1; t <= quantidadeMeses; t++) {
                valorFuturo += aporteMensal * Math.pow(1 + taxaMensal, quantidadeMeses - t);
            }
             // Atualiza o valor futuro total no HTML
            document.getElementById("valorFuturoGlobal").textContent = valorFuturo.toFixed(2).replace('.', ',');
        }
         // Função para calcular o Simulador de Investimentos Mensal
        function calcularInvestimentos() {
            let totalInvestido = 0;
           let valorFuturoAnterior = 0;
            document.querySelectorAll("#simuladorInvestimentos tbody tr").forEach((row, index) => {
                const investidoInput = row.querySelector(".investido");
                if (!investidoInput) return; // Ignorar linha de totais
                const investido = parseFloat(investidoInput.value) || 0;
               const taxaAnual = parseFloat(row.querySelector(".taxaAnual").value) || 0;
                const taxaMensal = Math.pow(1 + taxaAnual / 100, 1 / 12) - 1;
                const meses = index + 1;
                // Cálculo do valor futuro acumulado
                const valorFuturo = (valorFuturoAnterior + investido) * (1 + taxaMensal);
               valorFuturoAnterior = valorFuturo;
               row.querySelector(".taxaMensal").textContent = (taxaMensal * 100).toFixed(2);
                row.querySelector(".meses").textContent = meses;
                row.querySelector(".valorFuturo").textContent = valorFuturo.toFixed(2);
                totalInvestido += investido;
           });
            // Atualiza o total investido e o total futuro
           document.getElementById("totalInvestido").textContent = totalInvestido.toFixed(2);
            document.getElementById("totalFuturo").textContent = valorFuturoAnterior.toFixed(2);
        }
        // Função para preencher todos os meses com o valor do primeiro mês
        function preencherTodosMeses() {
            const primeiroValor = parseFloat(document.querySelector(".investido").value) || 0;
           document.querySelectorAll(".investido").forEach(input => {
                input.value = primeiroValor;
            });
           calcularInvestimentos();
        }
        // Função para preencher a taxa anual do primeiro mês em todos os meses
        function preencherTaxaAnualTodosMeses() {
            const primeiraTaxaAnual = parseFloat(document.querySelector(".taxaAnual").value) || 0;
            document.querySelectorAll(".taxaAnual").forEach(input => {
                input.value = primeiraTaxaAnual;
           });
            calcularInvestimentos();
       }
       // Atualizar cálculos ao alterar valores
       document.querySelectorAll("input").forEach(input => {
           input.addEventListener("input", calcularInvestimentos);
       });
        // Calcular valores iniciais
        calcularInvestimentos();
    </script>
</body>
</html>
