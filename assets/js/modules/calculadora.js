/**
 * Módulo de Calculadora Financeira
 * Contém funções básicas para cálculos financeiros reutilizáveis
 */
const Calculadora = {
    /**
     * Formata um valor numérico para moeda brasileira
     * @param {number} valor - Valor a ser formatado
     * @return {string} - Valor formatado como moeda (ex: R$ 1.000,00)
     */
    formatarMoeda(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    },

    /**
     * Formata um valor como percentual
     * @param {number} valor - Valor a ser formatado (ex: 0.05 para 5%)
     * @return {string} - Valor formatado como percentual (ex: 5,00%)
     */
    formatarPorcentagem(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(valor / 100);
    },

    /**
     * Calcula montante com juros compostos
     * @param {number} principal - Valor inicial
     * @param {number} aporteMensal - Valor de aporte mensal
     * @param {number} taxa - Taxa mensal (ex: 0.01 para 1%)
     * @param {number} prazo - Prazo em meses
     * @return {number} - Montante final
     */
    calcularJurosCompostos(principal, aporteMensal, taxa, prazo) {
        let montante = principal;
        for (let i = 0; i < prazo; i++) {
            montante = montante * (1 + taxa) + aporteMensal;
        }
        return montante;
    },

    /**
     * Calcula rentabilidade real descontando a inflação
     * @param {number} rentabilidadeNominal - Rentabilidade nominal (ex: 0.10 para 10%)
     * @param {number} inflacao - Taxa de inflação (ex: 0.05 para 5%)
     * @return {number} - Rentabilidade real
     */
    calcularRentabilidadeReal(rentabilidadeNominal, inflacao) {
        return ((1 + rentabilidadeNominal) / (1 + inflacao) - 1);
    },

    /**
     * Determina a alíquota de Imposto de Renda aplicável
     * @param {number} prazoMeses - Prazo do investimento em meses
     * @return {number} - Alíquota aplicável (ex: 0.15 para 15%)
     */
    calcularAliquotaIR(prazoMeses) {
        if (prazoMeses <= 180) return 0.225;
        if (prazoMeses <= 360) return 0.20;
        if (prazoMeses <= 720) return 0.175;
        return 0.15;
    },

    /**
     * Calcula o valor do imposto de renda sobre rendimentos
     * @param {number} rendimento - Valor do rendimento
     * @param {number} prazoMeses - Prazo do investimento em meses
     * @return {number} - Valor do IR
     */
    calcularImpostoRenda(rendimento, prazoMeses) {
        const aliquota = this.calcularAliquotaIR(prazoMeses);
        return rendimento * aliquota;
    },

    /**
     * Calcula o benefício fiscal do PGBL considerando o limite de 12% da renda
     * @param {number} rendaTributavel - Renda tributável anual
     * @param {number} aportePGBL - Valor aportado em PGBL
     * @return {number} - Valor do benefício fiscal
     */
    calcularBeneficioFiscalPGBL(rendaTributavel, aportePGBL) {
        const limiteDeducao = rendaTributavel * 0.12;
        const valorDedutivel = Math.min(aportePGBL, limiteDeducao);
        return valorDedutivel * 0.275; // Considerando alíquota máxima de 27.5%
    },

    /**
     * Calcula o rendimento acumulado ao longo do tempo
     * @param {Array<number>} aportes - Array com os valores de aporte
     * @param {Array<number>} taxas - Array com as taxas aplicáveis
     * @param {number} prazo - Prazo total
     * @return {Object} - Objeto com saldo final e rendimento total
     */
    calcularRendimentoAcumulado(aportes, taxas, prazo) {
        let saldo = 0;
        let rendimentoTotal = 0;

        for (let i = 0; i < prazo; i++) {
            const rendimentoMes = saldo * taxas[i];
            saldo = (saldo + rendimentoMes + aportes[i]);
            rendimentoTotal += rendimentoMes;
        }

        return {
            saldoFinal: saldo,
            rendimentoTotal: rendimentoTotal
        };
    },

    /**
     * Calcula o aporte mensal necessário para atingir uma meta
     * @param {number} valorMeta - Valor da meta
     * @param {number} prazo - Prazo em meses
     * @param {number} taxaMensal - Taxa mensal (ex: 0.01 para 1%)
     * @return {number} - Valor do aporte mensal necessário
     */
    calcularMetaMensal(valorMeta, prazo, taxaMensal) {
        // PMT = VF / ((1 + i)^n - 1) / i
        const taxaDecimal = taxaMensal / 100;
        const denominador = (Math.pow(1 + taxaDecimal, prazo) - 1) / taxaDecimal;
        return valorMeta / denominador;
    },

    /**
     * Calcula a Taxa Interna de Retorno (TIR)
     * @param {Array<number>} fluxoCaixa - Array com o fluxo de caixa
     * @param {number} estimativaInicial - Estimativa inicial para a TIR
     * @return {number} - Taxa interna de retorno
     */
    calcularTIR(fluxoCaixa, estimativaInicial = 0.1) {
        const ITERACOES_MAX = 100;
        const PRECISAO = 0.0000001;
        
        let taxaAtual = estimativaInicial;
        
        for (let i = 0; i < ITERACOES_MAX; i++) {
            const vpla = this.calcularVPLA(fluxoCaixa, taxaAtual);
            
            if (Math.abs(vpla) < PRECISAO) {
                return taxaAtual;
            }
            
            const derivada = this.calcularDerivadaVPLA(fluxoCaixa, taxaAtual);
            const novaTaxa = taxaAtual - vpla / derivada;
            
            if (Math.abs(novaTaxa - taxaAtual) < PRECISAO) {
                return novaTaxa;
            }
            
            taxaAtual = novaTaxa;
        }
        
        return null; // Não convergiu
    },

    /**
     * Calcula o Valor Presente Líquido Anualizado
     * @param {Array<number>} fluxoCaixa - Array com o fluxo de caixa
     * @param {number} taxa - Taxa de desconto
     * @return {number} - VPLA
     */
    calcularVPLA(fluxoCaixa, taxa) {
        return fluxoCaixa.reduce((vpla, fluxo, periodo) => {
            return vpla + fluxo / Math.pow(1 + taxa, periodo);
        }, 0);
    },

    /**
     * Calcula a derivada do VPLA em relação à taxa
     * @param {Array<number>} fluxoCaixa - Array com o fluxo de caixa
     * @param {number} taxa - Taxa de desconto
     * @return {number} - Derivada do VPLA
     */
    calcularDerivadaVPLA(fluxoCaixa, taxa) {
        return fluxoCaixa.reduce((derivada, fluxo, periodo) => {
            if (periodo === 0) return derivada;
            return derivada - periodo * fluxo / Math.pow(1 + taxa, periodo + 1);
        }, 0);
    }
};

// Export para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Calculadora;
}
