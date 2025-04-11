<?php
class ExportacaoRelatorios {
    private $dados;
    private $tipo;
    
    public function __construct($dados, $tipo = 'investimentos') {
        $this->dados = $dados;
        $this->tipo = $tipo;
    }
    
    private function renderizarResumoInvestimentos() {
        ?>
        <table class="resumo-table">
            <tr>
                <th>Valor Inicial</th>
                <td>R$ <?php echo number_format($this->dados['valorInicial'], 2, ',', '.'); ?></td>
            </tr>
            <tr>
                <th>Aporte Mensal</th>
                <td>R$ <?php echo number_format($this->dados['aporteMensal'], 2, ',', '.'); ?></td>
            </tr>
            <tr>
                <th>Prazo</th>
                <td><?php echo $this->dados['prazo']; ?> meses</td>
            </tr>
            <tr>
                <th>Rentabilidade</th>
                <td><?php echo number_format($this->dados['rentabilidade'], 2, ',', '.'); ?>% ao ano</td>
            </tr>
            <tr>
                <th>Valor Final</th>
                <td>R$ <?php echo number_format($this->dados['valorFinal'], 2, ',', '.'); ?></td>
            </tr>
            <tr>
                <th>Ganho Total</th>
                <td>R$ <?php echo number_format($this->dados['ganhoTotal'], 2, ',', '.'); ?></td>
            </tr>
        </table>
        <?php
    }
    
    private function renderizarDetalhamentoInvestimentos() {
        ?>
        <div class="evolucao-mensal">
            <table class="detailed-table">
                <thead>
                    <tr>
                        <th>Mês</th>
                        <th>Valor Inicial</th>
                        <th>Aporte</th>
                        <th>Rendimento</th>
                        <th>Valor Final</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($this->dados['evolucaoMensal'] as $mes => $valores): ?>
                    <tr>
                        <td><?php echo $mes + 1; ?></td>
                        <td>R$ <?php echo number_format($valores['valorInicial'], 2, ',', '.'); ?></td>
                        <td>R$ <?php echo number_format($valores['aporte'], 2, ',', '.'); ?></td>
                        <td>R$ <?php echo number_format($valores['rendimento'], 2, ',', '.'); ?></td>
                        <td>R$ <?php echo number_format($valores['valorFinal'], 2, ',', '.'); ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <?php
    }
    
    private function renderizarAnaliseInvestimentos() {
        ?>
        <div class="analise-section">
            <h3>Análise de Rentabilidade</h3>
            <p>Com base nos parâmetros informados, este investimento apresenta:</p>
            <ul>
                <li>Rentabilidade nominal: <?php echo number_format($this->dados['rentabilidadeNominal'], 2, ',', '.'); ?>% ao ano</li>
                <li>Rentabilidade real (descontada a inflação): <?php echo number_format($this->dados['rentabilidadeReal'], 2, ',', '.'); ?>% ao ano</li>
                <li>Ganho líquido após impostos: R$ <?php echo number_format($this->dados['ganhoLiquido'], 2, ',', '.'); ?></li>
            </ul>
            
            <h3>Comparativo com Outros Investimentos</h3>
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Investimento</th>
                        <th>Valor Final</th>
                        <th>Rentabilidade</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($this->dados['comparativo'] as $investimento): ?>
                    <tr>
                        <td><?php echo $investimento['nome']; ?></td>
                        <td>R$ <?php echo number_format($investimento['valorFinal'], 2, ',', '.'); ?></td>
                        <td><?php echo number_format($investimento['rentabilidade'], 2, ',', '.'); ?>%</td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            
            <h3>Recomendações</h3>
            <div class="recommendations">
                <?php foreach ($this->dados['recomendacoes'] as $recomendacao): ?>
                    <p class="recommendation-item"><?php echo $recomendacao; ?></p>
                <?php endforeach; ?>
            </div>
        </div>
        <?php
    }
    
    private function aplicarEstilosExcel($sheet, $maxCol, $maxRow) {
        // Estilo para cabeçalho
        $headerStyle = [
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'startColor' => ['rgb' => '3498DB']
            ],
            'alignment' => [
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER
            ]
        ];
        
        // Aplicar estilo no cabeçalho
        $sheet->getStyle('A1:' . $this->colLetter($maxCol-1) . '1')->applyFromArray($headerStyle);
        
        // Estilo para células de dados
        $dataStyle = [
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN
                ]
            ],
            'alignment' => [
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_RIGHT
            ]
        ];
        
        // Aplicar estilo nas células de dados
        $sheet->getStyle('A2:' . $this->colLetter($maxCol-1) . $maxRow)->applyFromArray($dataStyle);
        
        // Formatar células de moeda
        $currencyFormat = '_-R$ * #,##0.00_-';
        foreach (range(2, $maxRow) as $row) {
            $sheet->getStyle('B' . $row)->getNumberFormat()->setFormatCode($currencyFormat);
            $sheet->getStyle('D' . $row)->getNumberFormat()->setFormatCode($currencyFormat);
        }
        
        // Auto-size colunas
        foreach (range('A', $this->colLetter($maxCol-1)) as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }
    }
    
    private function colLetter($col) {
        $letter = '';
        while ($col >= 0) {
            $letter = chr($col % 26 + 65) . $letter;
            $col = intval($col / 26) - 1;
        }
        return $letter;
    }
}
?>
