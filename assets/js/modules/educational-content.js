/**
 * Módulo para gerenciamento de conteúdo educacional
 * Fornece dicas, conceitos e explicações para os usuários
 */
const ConteudoEducacional = {
    // Dicas por tipo de calculadora
    dicas: {
        investimentos: {
            basico: [
                {
                    titulo: 'Juros Compostos',
                    descricao: 'O poder dos juros sobre juros é um dos princípios mais importantes para o crescimento do seu patrimônio a longo prazo.',
                    exemplo: 'Um investimento de R$ 1.000 a 10% ao ano rende R$ 100 no primeiro ano. No segundo ano, você ganha juros também sobre esses R$ 100.',
                    nivel: 1
                },
                {
                    titulo: 'Diversificação',
                    descricao: 'Distribuir seus investimentos em diferentes tipos de aplicações ajuda a reduzir riscos.',
                    exemplo: 'Combine renda fixa (CDBs, Tesouro Direto) com renda variável (ações, fundos imobiliários).',
                    nivel: 1
                }
            ],
            intermediario: [
                {
                    titulo: 'Imposto de Renda',
                    descricao: 'Entenda como a tributação afeta seus investimentos ao longo do tempo.',
                    exemplo: 'Tabela Regressiva de IR:\n- Até 180 dias: 22,5%\n- 181 a 360 dias: 20%\n- 361 a 720 dias: 17,5%\n- Acima de 720 dias: 15%',
                    nivel: 2
                },
                {
                    titulo: 'Rentabilidade Real',
                    descricao: 'A rentabilidade real considera o impacto da inflação nos seus rendimentos.',
                    exemplo: 'Se seu investimento rende 10% ao ano e a inflação é 4%, sua rentabilidade real é de aproximadamente 5,77% [(1,10/1,04) - 1].',
                    nivel: 2
                }
            ]
        },
        previdencia: {
            basico: [
                {
                    titulo: 'PGBL vs VGBL',
                    descricao: 'A escolha entre PGBL e VGBL depende do seu perfil tributário.',
                    exemplo: 'PGBL: dedução de até 12% da renda bruta no IR (declaração completa)\nVGBL: mais adequado para declaração simplificada',
                    nivel: 1
                },
                {
                    titulo: 'Benefício Fiscal PGBL',
                    descricao: 'Entenda como funciona a dedução fiscal do PGBL.',
                    exemplo: 'Com renda anual de R$ 120.000, você pode deduzir até R$ 14.400 (12%), gerando economia de até R$ 3.960 no IR.',
                    nivel: 1
                }
            ]
        }
    },
    
    // Tooltips para campos de formulário
    tooltips: {
        valorInicial: "O valor que você já tem disponível para começar a investir.",
        aporteMensal: "Quanto você pretende investir todo mês de forma regular.",
        prazo: "Por quanto tempo você planeja manter o investimento.",
        rentabilidade: "A taxa de rendimento esperada para o investimento.",
        taxaCDI: "Taxa básica de referência para investimentos de renda fixa.",
        aliquotaIR: "Percentual de imposto que incide sobre os rendimentos.",
        rendaTributavel: "Renda anual sujeita à tributação do Imposto de Renda.",
        objetivoFinanceiro: "Valor que você deseja acumular no fim do período."
    },
    
    // Método para gerar dicas contextuais baseadas nos valores inseridos
    gerarDicaContextual: function(campo, valor, contexto) {
        const dicas = [];

        switch (campo) {
            case 'valorInicial':
                if (valor > 100000) {
                    dicas.push({
                        tipo: 'warning',
                        mensagem: 'Com este valor, considere diversificar seus investimentos em diferentes produtos.'
                    });
                } else if (valor < 1000) {
                    dicas.push({
                        tipo: 'info',
                        mensagem: 'Mesmo começando com pouco, o importante é manter a regularidade nos investimentos.'
                    });
                }
                break;

            case 'prazo':
                if (valor < 24) {
                    dicas.push({
                        tipo: 'warning',
                        mensagem: 'Investimentos de curto prazo têm maior incidência de IR (22,5% a 20%).'
                    });
                } else if (valor > 60) {
                    dicas.push({
                        tipo: 'success',
                        mensagem: 'Excelente! Investimentos de longo prazo se beneficiam da menor alíquota de IR (15%).'
                    });
                }
                break;

            case 'aporteMensal':
                if (contexto && contexto.rendaMensal) {
                    const percentualRenda = (valor / contexto.rendaMensal) * 100;
                    if (percentualRenda > 30) {
                        dicas.push({
                            tipo: 'warning',
                            mensagem: 'O aporte representa mais de 30% da sua renda. Mantenha uma reserva de emergência.'
                        });
                    }
                }
                break;
        }

        return dicas;
    },
    
    // Método para obter conteúdo de tooltip para um campo específico
    mostrarTooltip: function(campo) {
        if (this.tooltips[campo]) {
            return `
                <div class="tooltip-content">
                    <p>${this.tooltips[campo]}</p>
                </div>
            `;
        }
        return '';
    },
    
    // Método para gerar uma dica de investimento de um nível específico
    renderizarDicaInvestimento: function(nivel = 'basico') {
        const dicasNivel = this.dicas.investimentos[nivel];
        if (!dicasNivel) return '';

        const dicaAleatoria = dicasNivel[Math.floor(Math.random() * dicasNivel.length)];

        return `
            <div class="dica-investimento nivel-${dicaAleatoria.nivel}">
                <h4>${dicaAleatoria.titulo}</h4>
                <p>${dicaAleatoria.descricao}</p>
                <div class="exemplo">
                    <strong>Exemplo:</strong>
                    <p>${dicaAleatoria.exemplo}</p>
                </div>
            </div>
        `;
    },
    
    // Método para gerar conteúdo educacional completo
    renderizarConteudoEducacional: function(tipo, nivel) {
        const conteudo = this.dicas[tipo]?.[nivel];
        if (!conteudo) return '';

        return `
            <div class="conteudo-educacional">
                ${conteudo.map(item => `
                    <div class="item-educacional">
                        <h3>${item.titulo}</h3>
                        <p>${item.descricao}</p>
                        <div class="exemplo-box">
                            <strong>Exemplo Prático:</strong>
                            <p>${item.exemplo}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },
    
    // Método para obter glossário de termos financeiros
    obterGlossario: function() {
        return {
            jurosCompostos: {
                termo: "Juros Compostos",
                definicao: "São os juros que incidem não apenas sobre o capital inicial, mas também sobre os juros acumulados em períodos anteriores."
            },
            cdi: {
                termo: "CDI",
                definicao: "Certificado de Depósito Interbancário, é uma taxa que serve como referência para a maioria dos investimentos de renda fixa."
            },
            liquidez: {
                termo: "Liquidez",
                definicao: "Facilidade de converter um investimento em dinheiro sem perda significativa de valor."
            },
            volatilidade: {
                termo: "Volatilidade",
                definicao: "Medida da variação do preço de um ativo ao longo do tempo."
            },
            inflacao: {
                termo: "Inflação",
                definicao: "Aumento generalizado e contínuo dos preços, que reduz o poder de compra do dinheiro."
            },
            pgbl: {
                termo: "PGBL",
                definicao: "Plano Gerador de Benefício Livre, é um tipo de previdência privada com benefícios fiscais para quem declara IR no modelo completo."
            }
        };
    },
    
    // Método para gerar um quiz educacional
    gerarQuiz: function(tema) {
        const quizzes = {
            jurosCompostos: [
                {
                    pergunta: "O que são juros compostos?",
                    opcoes: [
                        "Juros que incidem apenas sobre o capital inicial",
                        "Juros que incidem sobre o capital e juros acumulados",
                        "Juros fixos mensais",
                        "Juros sem capitalização"
                    ],
                    resposta: 1
                },
                {
                    pergunta: "Qual a principal vantagem dos juros compostos?",
                    opcoes: [
                        "Previsibilidade dos rendimentos",
                        "Baixo risco",
                        "Crescimento exponencial",
                        "Liquidez diária"
                    ],
                    resposta: 2
                }
            ],
            inflacao: [
                {
                    pergunta: "Qual o efeito da inflação no poder de compra?",
                    opcoes: [
                        "Aumenta o poder de compra",
                        "Não afeta o poder de compra",
                        "Reduz o poder de compra",
                        "Paralisa o poder de compra"
                    ],
                    resposta: 2
                }
            ]
        };
        
        return quizzes[tema] || [];
    }
};

// Expor o objeto para uso global
window.ConteudoEducacional = ConteudoEducacional;