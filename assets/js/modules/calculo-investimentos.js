class CalculoInvestimentos {
    constructor() {
        this.constantes = {
            IR_FAIXAS: [
                { limite: 180, aliquota: 0.225 },  // 22.5% até 180 dias
                { limite: 360, aliquota: 0.20 },   // 20% até 360 dias
                { limite: 720, aliquota: 0.175 },  // 17.5% até 720 dias
                { limite: Infinity, aliquota: 0.15 }  // 15% acima de 720 dias
            ],
            POUPANCA_MENSAL: 0.005, // 0.5% ao mês
            LIMITE_PGBL: 0.12,      // 12% da renda tributável
            IR_MAXIMO: 0.275        // 27.5% alíquota máxima IR
        };
    }

    calcularRentabilidade(dados) {
        try {
            const {
                valorInicial = 0,
                aporteMensal = 0,
                prazo = 0,
                taxaMensal = 0,
                taxaFixa = 0,
                tipoRendimento = 'fixa',
                taxaCDI = 0,
                percentualCDI = 100,
                inflacao = 0
            } = dados;

            // Calcular taxa mensal efetiva com base no tipo de investimento
            let taxaMensalEfetiva;
            if (tipoRendimento === 'fixa') {
                taxaMensalEfetiva = taxaFixa / 100;
            } else {
                // Taxa CDI anual para mensal (aproximada)
                const taxaCDIMensal = (Math.pow(1 + taxaCDI/100, 1/12) - 1);
                taxaMensalEfetiva = taxaCDIMensal * (percentualCDI/100);
            }

            let evolucaoMensal = [];
            let valorAtual = parseFloat(valorInicial);

            // Cálculo mês a mês
            for (let mes = 1; mes <= prazo; mes++) {
                const rendimento = valorAtual * taxaMensalEfetiva;
                valorAtual = valorAtual + rendimento + parseFloat(aporteMensal);

                evolucaoMensal.push({
                    mes,
                    valorInicial: valorAtual - rendimento - parseFloat(aporteMensal),
                    rendimento,
                    aporte: parseFloat(aporteMensal),
                    valorFinal: valorAtual
                });
            }

            // Cálculos finais
            const totalInvestido = parseFloat(valorInicial) + (parseFloat(aporteMensal) * prazo);
            const rendimentoTotal = valorAtual - totalInvestido;
            const inflacaoMensal = Math.pow(1 + parseFloat(inflacao)/100, 1/12) - 1;
            const inflacaoAcumulada = (Math.pow(1 + inflacaoMensal, prazo) - 1) * 100;
            const valorRealFinal = valorAtual / (1 + inflacaoAcumulada/100);

            // Calcular comparativos
            const comparativos = this.calcularComparativos(dados);

            return {
                evolucaoMensal,
                valorFinal: valorAtual,
                rendimentoTotal,
                inflacaoAcumulada,
                valorRealFinal,
                totalInvestido,
                comparativos
            };
        } catch (error) {
            console.error('Erro no cálculo de rentabilidade:', error);
            throw new Error('Erro ao calcular rentabilidade');
        }
    }

    calcularComparativos(dadosBase) {
        // Poupança
        const resultadoPoupanca = this.calcularRentabilidadeSimples(
            dadosBase.valorInicial,
            dadosBase.aporteMensal,
            dadosBase.prazo,
            this.constantes.POUPANCA_MENSAL,
            0 // Poupança é isenta de IR
        );
        
        // CDB 100% CDI com IR
        const taxaCDIAnual = parseFloat(dadosBase.taxaCDI || 10.5);
        const taxaCDIMensal = Math.pow(1 + taxaCDIAnual/100, 1/12) - 1;
        
        // Determinar alíquota IR com base no prazo
        const aliquotaIR = this.determinarAliquotaIR(dadosBase.prazo);
        
        const resultadoCDB = this.calcularRentabilidadeSimples(
            dadosBase.valorInicial,
            dadosBase.aporteMensal,
            dadosBase.prazo,
            taxaCDIMensal,
            aliquotaIR
        );
        
        // LCI/LCA (isento de IR)
        const percentualCDI_LCI = 0.9; // LCI/LCA geralmente paga ~90% do CDI
        const taxaLCI_LCA = taxaCDIMensal * percentualCDI_LCI;
        
        const resultadoLCI_LCA = this.calcularRentabilidadeSimples(
            dadosBase.valorInicial,
            dadosBase.aporteMensal,
            dadosBase.prazo,
            taxaLCI_LCA,
            0 // Isento de IR
        );
        
        return [
            {
                nome: 'Poupança',
                valorFinal: resultadoPoupanca.valorFinal,
                ganhoTotal: resultadoPoupanca.rendimento,
                rentabilidade: (resultadoPoupanca.rendimento / resultadoPoupanca.totalInvestido) * 100
            },
            {
                nome: 'CDB 100% CDI',
                valorFinal: resultadoCDB.valorFinal,
                ganhoTotal: resultadoCDB.rendimento,
                rentabilidade: (resultadoCDB.rendimento / resultadoCDB.totalInvestido) * 100
            },
            {
                nome: 'LCI/LCA',
                valorFinal: resultadoLCI_LCA.valorFinal,
                ganhoTotal: resultadoLCI_LCA.rendimento,
                rentabilidade: (resultadoLCI_LCA.rendimento / resultadoLCI_LCA.totalInvestido) * 100
            }
        ];
    }

    calcularRentabilidadeSimples(valorInicial, aporteMensal, prazo, taxaMensal, aliquotaIR) {
        let valorAtual = parseFloat(valorInicial);
        let rendimentoAcumulado = 0;
        
        for (let mes = 1; mes <= prazo; mes++) {
            const rendimentoMes = valorAtual * taxaMensal;
            rendimentoAcumulado += rendimentoMes;
            valorAtual = valorAtual + rendimentoMes + parseFloat(aporteMensal);
        }
        
        const totalInvestido = parseFloat(valorInicial) + (parseFloat(aporteMensal) * prazo);
        
        // Aplicar imposto de renda sobre o rendimento
        const impostoRenda = rendimentoAcumulado * aliquotaIR;
        const rendimentoLiquido = rendimentoAcumulado - impostoRenda;
        
        return {
            valorFinal: (totalInvestido + rendimentoLiquido),
            rendimento: rendimentoLiquido,
            totalInvestido: totalInvestido
        };
    }

    determinarAliquotaIR(prazoMeses) {
        const faixa = this.constantes.IR_FAIXAS.find(f => prazoMeses <= f.limite);
        return faixa ? faixa.aliquota : this.constantes.IR_FAIXAS[0].aliquota;
    }

    calcularPGBLvsCDB(dados) {
        const {
            rendaTributavel,
            aporteAnual,
            aporteInicial,
            prazoAnos,
            taxaCDI,
            taxaAdministracao,
            aliquotaIR_PGBL
        } = dados;
        
        // Parâmetros iniciais
        const prazoMeses = prazoAnos * 12;
        const aliquotaCDB = this.determinarAliquotaIR(prazoMeses);
        const taxaCDIDecimal = taxaCDI / 100;
        const taxaAdmDecimal = taxaAdministracao / 100;
        const aliquotaIRPGBL = parseFloat(aliquotaIR_PGBL) / 100;
        
        // Calcular taxa mensal efetiva
        const taxaCDIMensal = Math.pow(1 + taxaCDIDecimal, 1/12) - 1;
        const taxaAdmMensal = Math.pow(1 + taxaAdmDecimal, 1/12) - 1;
        
        // Inicializar variáveis
        let saldoPGBL = parseFloat(aporteInicial || 0);
        let saldoCDB = parseFloat(aporteInicial || 0);
        let desembolsoPGBL = parseFloat(aporteInicial || 0);
        let desembolsoCDB = parseFloat(aporteInicial || 0);
        
        // Array para armazenar a evolução anual
        const evolucaoAnual = [];
        
        // Limite PGBL
        const limiteDeducao = rendaTributavel * this.constantes.LIMITE_PGBL;
        const valorDeducao = Math.min(aporteAnual, limiteDeducao);
        const beneficioFiscal = valorDeducao * this.constantes.IR_MAXIMO;
        
        // Simulação ano a ano
        for (let ano = 1; ano <= prazoAnos; ano++) {
            // PGBL: primeiro ano não há benefício fiscal
            const deducaoAno = ano === 1 ? 0 : beneficioFiscal;
            const aporteEfetivoPGBL = aporteAnual - deducaoAno;
            
            // Acumular desembolsos
            desembolsoPGBL += aporteEfetivoPGBL;
            desembolsoCDB += aporteAnual;
            
            // Calcular rendimentos mensais
            let saldoMensalPGBL = saldoPGBL;
            let saldoMensalCDB = saldoCDB;
            
            for (let mes = 1; mes <= 12; mes++) {
                // PGBL: rendimento com desconto da taxa de administração
                const rendimentoPGBL = saldoMensalPGBL * (taxaCDIMensal - taxaAdmMensal);
                
                // CDB: rendimento sem taxa de administração
                const rendimentoCDB = saldoMensalCDB * taxaCDIMensal;
                
                // Atualizar saldos (aporte apenas no primeiro mês do ano)
                if (mes === 1) {
                    saldoMensalPGBL = saldoMensalPGBL + rendimentoPGBL + aporteAnual;
                    saldoMensalCDB = saldoMensalCDB + rendimentoCDB + aporteAnual;
                } else {
                    saldoMensalPGBL = saldoMensalPGBL + rendimentoPGBL;
                    saldoMensalCDB = saldoMensalCDB + rendimentoCDB;
                }
            }
            
            // Atualizar saldos finais
            saldoPGBL = saldoMensalPGBL;
            saldoCDB = saldoMensalCDB;
            
            // Armazenar resultados anuais
            evolucaoAnual.push({
                ano,
                pgbl: {
                    aporte: aporteAnual,
                    beneficioFiscal: deducaoAno,
                    saldo: saldoPGBL
                },
                cdb: {
                    aporte: aporteAnual,
                    saldo: saldoCDB
                }
            });
        }
        
        // Calcular impostos finais
        const rendimentoPGBL = saldoPGBL - (aporteInicial + aporteAnual * prazoAnos);
        const impostoPGBL = saldoPGBL * aliquotaIRPGBL; // PGBL: imposto sobre todo o montante
        
        const rendimentoCDB = saldoCDB - (aporteInicial + aporteAnual * prazoAnos);
        const impostoCDB = rendimentoCDB * aliquotaCDB; // CDB: imposto só sobre o rendimento
        
        // Resultados líquidos
        const liquidoPGBL = saldoPGBL - impostoPGBL;
        const liquidoCDB = saldoCDB - impostoCDB;
        
        // Rentabilidade líquida
        const rentabilidadePGBL = ((liquidoPGBL / desembolsoPGBL) - 1) * 100;
        const rentabilidadeCDB = ((liquidoCDB / desembolsoCDB) - 1) * 100;
        
        // Analisar resultados e recomendar
        const diferencaLiquida = liquidoPGBL - liquidoCDB;
        const recomendacao = diferencaLiquida > 0 ? 'pgbl' : 'cdb';
        const justificativa = diferencaLiquida > 0 
            ? `O PGBL é mais vantajoso, com diferença de ${this.formatarMoeda(diferencaLiquida)} ao final do período.`
            : `O CDB é mais vantajoso, com diferença de ${this.formatarMoeda(Math.abs(diferencaLiquida))} ao final do período.`;
        
        // Taxa equivalente CDB (taxa que o CDB precisaria ter para igualar o PGBL)
        const taxaEquivalenteCDB = taxaCDIDecimal * (1 + diferencaLiquida / saldoCDB);
        
        // Retornar resultados completos
        return {
            pgbl: {
                valorFinal: saldoPGBL,
                desembolsoEfetivo: desembolsoPGBL,
                impostoRenda: impostoPGBL,
                valorLiquido: liquidoPGBL,
                taxaAdministracao: saldoPGBL * taxaAdmDecimal * prazoAnos,
                rentabilidadeLiquida: rentabilidadePGBL
            },
            cdb: {
                valorFinal: saldoCDB,
                desembolsoEfetivo: desembolsoCDB,
                impostoRenda: impostoCDB,
                valorLiquido: liquidoCDB,
                rentabilidadeLiquida: rentabilidadeCDB
            },
            analise: {
                diferencaLiquida,
                beneficioFiscal: beneficioFiscal * (prazoAnos - 1), // Excluindo primeiro ano
                taxaEquivalenteCDB: taxaEquivalenteCDB * 100,
                recomendacao,
                justificativa
            },
            timeline: evolucaoAnual
        };
    }

    calcularMetaInvestimento(dados) {
        const {
            valorMeta,
            prazoAnos,
            taxaMensal,
            inflacaoAnual
        } = dados;

        // Conversão de taxas
        const prazoMeses = prazoAnos * 12;
        const inflacaoMensal = Math.pow(1 + inflacaoAnual/100, 1/12) - 1;

        // Valor futuro considerando inflação
        const valorMetaAjustado = valorMeta * Math.pow(1 + inflacaoAnual/100, prazoAnos);

        // Cálculo do aporte necessário
        const aporteMensal = (valorMetaAjustado * taxaMensal/100) / 
            (Math.pow(1 + taxaMensal/100, prazoMeses) - 1);

        return {
            aporteMensal,
            valorMetaAjustado,
            prazoMeses,
            taxaEquivalenteMensal: taxaMensal
        };
    }

    formatarMoeda(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }
}

// Exportar para uso global
window.CalculoInvestimentos = CalculoInvestimentos;