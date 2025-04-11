<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simulador PGBL vs CDB</title>
     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
    <link rel="stylesheet" href="../assets/css/styles.css">
</head>
<body>
    <?php include '../components/navbar/navbar.php'; ?>
    <div class="container">
        <h1>Simulador PGBL vs CDB <i class="fas fa-piggy-bank"></i></h1>
         <form id="simulador">
            <div class="form-group">
                <label for="rendaTributavel">Renda Anual Tributável (R$):</label>
                <input type="number" id="rendaTributavel" step="0.01" required>
           </div>
           <div class="form-group">
                <label for="aporteInicial">Aporte Inicial (opcional) - R$:</label>
                <input type="number" id="aporteInicial" step="0.01" value="0">
           </div>
           <div class="form-group">
               <label for="anos">Período de Investimento (em anos):</label>
                <input type="number" id="anos" required min="1">
            </div>
            <div class="form-group">
                <label for="cdi">Taxa do CDI Anual (%):</label>
                <input type="number" id="cdi" step="0.01" value="10" required min="0">
           </div>
            <button type="button" onclick="calcular()">Simular <i class="fas fa-calculator"></i></button>
        </form>
       
        <div class="results" id="resultados" style="display: none;">
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
    <?php include '../components/footer/footer.php'; ?>
   <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
   <script>
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
        function calcular() {
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
            document.getElementById('pgblAcumulado').innerText = pgblSaldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            document.getElementById('pgblDesembolso').innerText = pgblDesembolso.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            document.getElementById('pgblIR').innerText = pgblIR.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            document.getElementById('pgblLiquido').innerText = pgblLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            document.getElementById('cdbAcumulado').innerText = cdbSaldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            document.getElementById('cdbDesembolso').innerText = cdbDesembolso.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            document.getElementById('cdbIR').innerText = cdbIR.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            document.getElementById('cdbLiquido').innerText = cdbLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
           // Análise comparativa
           const diferencaLiquida = pgblLiquido - cdbLiquido;
           const totalRestituido = pgblDesembolso - aporteInicial - (aporteAnual * anos);
            const resultadoFinalAjustado = diferencaLiquida - totalRestituido;
            const rentabilidadePGBL = ((pgblLiquido - pgblDesembolso) / pgblDesembolso) * 100;
            const rentabilidadeCDB = ((cdbLiquido - cdbDesembolso) / cdbDesembolso) * 100;
           document.getElementById('diferencaLiquida').innerText = diferencaLiquida.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
           document.getElementById('totalRestituido').innerText = totalRestituido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
           document.getElementById('resultadoFinalAjustado').innerText = resultadoFinalAjustado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
           document.getElementById('rentabilidadePGBL').innerText = rentabilidadePGBL.toFixed(2) + "%";
          document.getElementById('rentabilidadeCDB').innerText = rentabilidadeCDB.toFixed(2) + "%";
            // Mostrar resultados
           document.getElementById('resultados').style.display = 'block';
       }
   </script>
</body>
</html>
