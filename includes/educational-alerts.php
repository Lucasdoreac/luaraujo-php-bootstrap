<?php
function avaliarInvestimento($dados) {
    $alertas = [];
    
    // Avaliação de valor inicial
    if ($dados['valorInicial'] < 1000) {
        $alertas[] = [
            'tipo' => 'info',
            'titulo' => 'Valor Inicial',
            'mensagem' => 'Mesmo com um valor inicial baixo, investir regularmente pode trazer bons resultados a longo prazo.'
        ];
    }
    
    // Avaliação de diversificação
    if ($dados['valorInicial'] > 100000) {
        $alertas[] = [
            'tipo' => 'warning',
            'titulo' => 'Diversificação',
            'mensagem' => 'Com este valor, considere diversificar seus investimentos em diferentes produtos para reduzir riscos.'
        ];
    }
    
    // Avaliação de prazo
    if ($dados['prazo'] < 24) {
        $alertas[] = [
            'tipo' => 'warning',
            'titulo' => 'Imposto de Renda',
            'mensagem' => 'Investimentos com prazo menor que 2 anos têm alíquota de IR mais alta (15% a 22,5%).'
        ];
    }
    
    // Avaliação de rentabilidade vs inflação
    if (isset($dados['rentabilidade']) && isset($dados['inflacao'])) {
        if ($dados['rentabilidade'] < $dados['inflacao']) {
            $alertas[] = [
                'tipo' => 'danger',
                'titulo' => 'Rentabilidade Real',
                'mensagem' => 'Atenção: o rendimento projetado está abaixo da inflação, o que significa perda de poder de compra.'
            ];
        }
    }
    
    // Avaliação de aporte mensal
    if ($dados['aporteMensal'] > 0) {
        $percentualRenda = ($dados['aporteMensal'] / $dados['rendaMensal']) * 100;
        if ($percentualRenda > 30) {
            $alertas[] = [
                'tipo' => 'warning',
                'titulo' => 'Comprometimento de Renda',
                'mensagem' => 'O aporte mensal representa mais de 30% da sua renda. Certifique-se de manter uma reserva de emergência.'
            ];
        }
    }
    
    return $alertas;
}

function avaliarPGBLvsCDB($dados) {
    $alertas = [];
    
    // Avaliação de benefício fiscal
    $beneficioFiscal = $dados['rendaTributavel'] * 0.275 * 0.12;
    if ($beneficioFiscal > 0) {
        $alertas[] = [
            'tipo' => 'info',
            'titulo' => 'Benefício Fiscal PGBL',
            'mensagem' => sprintf(
                'O benefício fiscal anual estimado é de R$ %.2f, considerando dedução de 12%% da renda tributável.',
                $beneficioFiscal
            )
        ];
    }
    
    // Avaliação de prazo
    if ($dados['anos'] < 10) {
        $alertas[] = [
            'tipo' => 'warning',
            'titulo' => 'Prazo do Investimento',
            'mensagem' => 'PGBL é mais indicado para prazos longos. Para prazos menores que 10 anos, considere outras opções.'
        ];
    }
    
    return $alertas;
}

function avaliarSimulacaoMensal($dados) {
    $alertas = [];
    
    // Avaliação de consistência dos aportes
    $valores = $dados['valoresMensais'];
    $media = array_sum($valores) / count($valores);
    $variacao = max($valores) - min($valores);
    
    if ($variacao > $media * 0.5) {
        $alertas[] = [
            'tipo' => 'info',
            'titulo' => 'Variação de Aportes',
            'mensagem' => 'Há grande variação nos valores mensais. Considere manter aportes mais regulares para melhor planejamento.'
        ];
    }
    
    return $alertas;
}

function gerarHTMLAlerta($alerta) {
    $icones = [
        'info' => 'fa-info-circle',
        'warning' => 'fa-exclamation-triangle',
        'danger' => 'fa-exclamation-circle'
    ];
    
    $icone = $icones[$alerta['tipo']] ?? 'fa-info-circle';
    
    return "
        <div class='alert alert-{$alerta['tipo']} alert-dismissible fade show' role='alert'>
            <h5 class='alert-heading'>
                <i class='fas {$icone}'></i> 
                {$alerta['titulo']}
            </h5>
            <p class='mb-0'>{$alerta['mensagem']}</p>
            <button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Fechar'></button>
        </div>
    ";
}

function exibirAlertas($alertas) {
    echo "<div class='alertas-container mt-3'>";
    foreach ($alertas as $alerta) {
        echo gerarHTMLAlerta($alerta);
    }
    echo "</div>";
}
?>
