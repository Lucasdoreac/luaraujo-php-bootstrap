<?php
class HistoricoSimulacoes {
    private $arquivo_historico;
    private $max_simulacoes = 10;
    
    public function __construct() {
        $this->arquivo_historico = dirname(__DIR__) . '/data/historico_simulacoes.json';
        $this->inicializarArquivo();
    }
    
    private function inicializarArquivo() {
        if (!file_exists(dirname($this->arquivo_historico))) {
            mkdir(dirname($this->arquivo_historico), 0755, true);
        }
        if (!file_exists($this->arquivo_historico)) {
            file_put_contents($this->arquivo_historico, json_encode([]));
        }
    }
    
    public function salvarSimulacao($tipo, $dados) {
        $historico = $this->lerHistorico();
        
        $simulacao = [
            'id' => uniqid(),
            'tipo' => $tipo,
            'data' => date('Y-m-d H:i:s'),
            'dados' => $dados
        ];
        
        array_unshift($historico, $simulacao);
        $historico = array_slice($historico, 0, $this->max_simulacoes);
        
        file_put_contents($this->arquivo_historico, json_encode($historico));
        return $simulacao['id'];
    }
    
    public function lerHistorico() {
        $conteudo = file_get_contents($this->arquivo_historico);
        return json_decode($conteudo, true) ?? [];
    }
    
    public function buscarSimulacao($id) {
        $historico = $this->lerHistorico();
        foreach ($historico as $simulacao) {
            if ($simulacao['id'] === $id) {
                return $simulacao;
            }
        }
        return null;
    }
    
    public function limparHistorico() {
        file_put_contents($this->arquivo_historico, json_encode([]));
        return true;
    }
    
    public function gerarHTMLHistorico() {
        $historico = $this->lerHistorico();
        
        if (empty($historico)) {
            return '<p class="text-muted">Nenhuma simulação encontrada no histórico.</p>';
        }
        
        $html = '<div class="table-responsive">
                 <table class="table table-dark table-hover">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Tipo</th>
                            <th>Detalhes</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>';
        
        foreach ($historico as $simulacao) {
            $data = date('d/m/Y H:i', strtotime($simulacao['data']));
            $detalhes = $this->formatarDetalhes($simulacao['dados']);
            
            $html .= "<tr>
                        <td>{$data}</td>
                        <td>{$simulacao['tipo']}</td>
                        <td>{$detalhes}</td>
                        <td>
                            <button class='btn btn-sm btn-primary' onclick='carregarSimulacao(\"{$simulacao['id']}\")'>
                                <i class='fas fa-redo'></i> Recarregar
                            </button>
                            <button class='btn btn-sm btn-danger' onclick='excluirSimulacao(\"{$simulacao['id']}\")'>
                                <i class='fas fa-trash'></i>
                            </button>
                        </td>
                    </tr>";
        }
        
        $html .= '</tbody></table></div>';
        return $html;
    }
    
    private function formatarDetalhes($dados) {
        $detalhes = [];
        
        if (isset($dados['valorInicial'])) {
            $detalhes[] = 'Valor Inicial: R$ ' . number_format($dados['valorInicial'], 2, ',', '.');
        }
        if (isset($dados['prazo'])) {
            $detalhes[] = 'Prazo: ' . $dados['prazo'] . ' meses';
        }
        if (isset($dados['rentabilidade'])) {
            $detalhes[] = 'Rentabilidade: ' . number_format($dados['rentabilidade'], 2, ',', '.') . '%';
        }
        
        return implode(' | ', $detalhes);
    }
}
?>
