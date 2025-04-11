/**
 * Módulo de Calculadora Financeira
 * Implementa funções básicas para cálculos financeiros utilizados nas simulações
 */
const Calculadora = {
    /**
     * Formata um valor para moeda brasileira (R$)
     * @param {number} valor - Valor a ser formatado
     * @return {string} Valor formatado como moeda
     */
    formatarMoeda(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    },

    /**
     * Formata um valor para porcentagem
     * @param {number} valor - Valor a ser formatado (0.1 para 10%)
     * @return {string} Valor formatado como porcentagem
     */
    formatarPorcentagem(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(valor / 100);
    },

    /**
     * Calcula o montante final usando juros compostos
     * @param {number} principal - Capital inicial
     * @param {number} aporteMensal - Valor de aporte mensal
     * @param {number} taxa - Taxa de juros mensal (decimal)
     * @param {number} prazo - Prazo em meses
     * @return {number} Montante final após o período
     */
    calcularJurosCompostos(principal, aporteMensal, taxa, prazo) {
        let montante = principal;
        for (let i = 0; i < prazo; i++) {
            montante = montante * (1 + taxa) + aporteMensal;
        }
        return montante;
    },

    /**
     * Calcula a rentabilidade real descontando a inflação
     * @param {number} rentabilidadeNominal - Rentabilidade nominal (decimal)
     * @param {number} inflacao - Taxa de inflação (decimal)
     * @return {number} Rentabilidade real
     */
    calcularRentabilidadeReal(rentabilidadeNominal, inflacao) {
        return ((1 + rentabilidadeNominal) / (1 + inflacao) - 1);
    },

    /**
     * Calcula a alíquota de IR com base no prazo
     * @param {number} prazoMeses - Prazo em meses
     * @return {number} Alíquota do IR (decimal)
     */
    calcularAliquotaIR(prazoMeses) {
        if (prazoMeses <= 6) return 0.225;
        if (prazoMeses <= 12) return 0.20;
        if (prazoMeses <= 24) return 0.175;
        return 0.15;
    },

    /**
     * Calcula o imposto de renda sobre o rendimento
     * @param {number} rendimento - Valor do rendimento
     * @param {number} prazoMeses - Prazo em meses
     * @return {number} Valor do imposto de renda
     */
    calcularImpostoRenda(rendimento, prazoMeses) {
        const aliquota = this.calcularAliquotaIR(prazoMeses);
        return rendimento * aliquota;
    },

    /**
     * Calcula o benefício fiscal do PGBL
     * @param {number} rendaTributavel - Renda tributável anual
     * @param {number} aportePGBL - Valor anual aportado no PGBL
     * @return {number} Benefício fiscal (economia no IR)
     */
    calcularBeneficioFiscalPGBL(rendaTributavel, aportePGBL) {
        const limiteDeducao = rendaTributavel * 0.12;
        const valorDedutivel = Math.min(aportePGBL, limiteDeducao);
        return valorDedutivel * 0.275; // Considerando alíquota máxima de 27.5%
    },

    /**
     * Calcula o rendimento acumulado ao longo de um período
     * @param {Array<number>} aportes - Array com os valores de aporte para cada período
     * @param {Array<number>} taxas - Array com as taxas para cada período
     * @param {number} prazo - Número de períodos
     * @return {Object} Objeto com saldo final e rendimento total
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
     * @param {number} valorMeta - Valor alvo a ser alcançado
     * @param {number} prazo - Prazo em meses
     * @param {number} taxaMensal - Taxa mensal de rendimento (decimal)
     * @return {number} Valor do aporte mensal necessário
     */
    calcularMetaMensal(valorMeta, prazo, taxaMensal) {
        // PMT = VF / ((1 + i)^n - 1) / i
        const taxaDecimal = taxaMensal / 100;
        const denominador = (Math.pow(1 + taxaDecimal, prazo) - 1) / taxaDecimal;
        return valorMeta / denominador;
    }
};

// Exportando o objeto Calculadora para uso em outros arquivos
// Em um ambiente de PHP puro, podemos usar este objeto diretamente
// através da tag <script> que inclui este arquivo