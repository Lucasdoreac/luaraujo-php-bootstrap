/**
 * Módulo de Validação de Formulários
 * Implementa validações client-side para formulários financeiros
 */
const Validacao = {
    /**
     * Regras de validação para diferentes campos
     */
    regras: {
        valorInicial: {
            min: 0,
            mensagem: 'O valor inicial não pode ser negativo'
        },
        aporteMensal: {
            min: 0,
            mensagem: 'O aporte mensal não pode ser negativo'
        },
        prazo: {
            min: 1,
            mensagem: 'O prazo deve ser de pelo menos 1 mês'
        },
        rentabilidade: {
            min: 0,
            max: 100,
            mensagem: 'A rentabilidade deve estar entre 0% e 100%'
        },
        rendaTributavel: {
            min: 0,
            mensagem: 'A renda tributável não pode ser negativa'
        },
        contribuicaoAnual: {
            min: 0,
            mensagem: 'A contribuição anual não pode ser negativa' 
        }
    },

    /**
     * Avisos para diferentes cenários
     */
    avisos: {
        valorInicial: {
            alto: {
                limite: 100000,
                mensagem: 'Com este valor, considere diversificar seus investimentos'
            },
            baixo: {
                limite: 1000,
                mensagem: 'Mesmo com pouco, o importante é começar e manter a regularidade'
            }
        },
        prazo: {
            curto: {
                limite: 12,
                mensagem: 'Investimentos de curto prazo têm maior tributação'
            },
            medio: {
                limite: 24,
                mensagem: 'Prazo intermediário: considere a tabela regressiva de IR'
            },
            longo: {
                limite: 36,
                mensagem: 'Ótimo! Prazos longos têm menor tributação'
            }
        },
        aporteMensal: {
            excessivo: {
                porcentagemRenda: 30,
                mensagem: 'O aporte representa mais de 30% da sua renda mensal'
            }
        },
        pgbl: {
            excedeDeducao: {
                porcentagem: 12,
                mensagem: 'O valor excede o limite de 12% de dedução da renda tributável'
            }
        }
    },

    /**
     * Valida um campo individual
     * @param {string} campo - Nome do campo
     * @param {number} valor - Valor a ser validado
     * @return {Object} - Resultado da validação
     */
    validarCampo(campo, valor) {
        const regra = this.regras[campo];
        if (!regra) return { valido: true };

        if (typeof valor !== 'number' || isNaN(valor)) {
            return {
                valido: false,
                mensagem: 'Por favor, insira um valor numérico válido'
            };
        }

        if (regra.min !== undefined && valor < regra.min) {
            return {
                valido: false,
                mensagem: regra.mensagem
            };
        }

        if (regra.max !== undefined && valor > regra.max) {
            return {
                valido: false,
                mensagem: regra.mensagem
            };
        }

        return { valido: true };
    },

    /**
     * Gera avisos com base nos dados fornecidos
     * @param {Object} dados - Dados do formulário
     * @return {Array} - Lista de avisos
     */
    gerarAvisos(dados) {
        const avisos = [];

        // Validar valor inicial
        if (dados.valorInicial >= this.avisos.valorInicial.alto.limite) {
            avisos.push({
                tipo: 'warning',
                campo: 'valorInicial',
                mensagem: this.avisos.valorInicial.alto.mensagem
            });
        } else if (dados.valorInicial <= this.avisos.valorInicial.baixo.limite) {
            avisos.push({
                tipo: 'info',
                campo: 'valorInicial',
                mensagem: this.avisos.valorInicial.baixo.mensagem
            });
        }

        // Validar prazo
        if (dados.prazo <= this.avisos.prazo.curto.limite) {
            avisos.push({
                tipo: 'warning',
                campo: 'prazo',
                mensagem: this.avisos.prazo.curto.mensagem
            });
        } else if (dados.prazo >= this.avisos.prazo.longo.limite) {
            avisos.push({
                tipo: 'success',
                campo: 'prazo',
                mensagem: this.avisos.prazo.longo.mensagem
            });
        }

        // Validar aporte em relação à renda
        if (dados.rendaMensal) {
            const percentualRenda = (dados.aporteMensal / dados.rendaMensal) * 100;
            if (percentualRenda > this.avisos.aporteMensal.excessivo.porcentagemRenda) {
                avisos.push({
                    tipo: 'warning',
                    campo: 'aporteMensal',
                    mensagem: this.avisos.aporteMensal.excessivo.mensagem
                });
            }
        }

        // Validação PGBL
        if (dados.rendaTributavel && dados.contribuicaoAnual) {
            const limiteDeducao = dados.rendaTributavel * (this.avisos.pgbl.excedeDeducao.porcentagem / 100);
            if (dados.contribuicaoAnual > limiteDeducao) {
                avisos.push({
                    tipo: 'warning',
                    campo: 'contribuicaoAnual',
                    mensagem: `O valor excede o limite de dedução de R$ ${limiteDeducao.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`
                });
            }
        }

        return avisos;
    },

    /**
     * Validar formulário completo
     * @param {Object} dados - Dados do formulário
     * @return {Object} - Resultado da validação
     */
    validarFormulario(dados) {
        const erros = [];
        const avisos = this.gerarAvisos(dados);

        // Validar cada campo
        Object.entries(dados).forEach(([campo, valor]) => {
            const resultado = this.validarCampo(campo, valor);
            if (!resultado.valido) {
                erros.push({
                    campo,
                    mensagem: resultado.mensagem
                });
            }
        });

        return {
            valido: erros.length === 0,
            erros,
            avisos
        };
    },

    /**
     * Limpa mensagens de erro em todos os campos
     * @param {HTMLFormElement} form - Formulário a ser limpo
     */
    limparErros(form) {
        form.querySelectorAll('.is-invalid').forEach(campo => {
            campo.classList.remove('is-invalid');
        });
        
        form.querySelectorAll('.invalid-feedback').forEach(feedback => {
            feedback.remove();
        });
    },

    /**
     * Exibe mensagens de erro nos campos
     * @param {HTMLFormElement} form - Formulário 
     * @param {Array} erros - Lista de erros
     */
    exibirErros(form, erros) {
        erros.forEach(erro => {
            const campo = form.querySelector(`#${erro.campo}`);
            if (campo) {
                campo.classList.add('is-invalid');
                
                const feedback = document.createElement('div');
                feedback.className = 'invalid-feedback';
                feedback.textContent = erro.mensagem;
                
                campo.parentElement.appendChild(feedback);
            }
        });
    },

    /**
     * Mostra os avisos em um contêiner
     * @param {HTMLElement} container - Contêiner para os avisos
     * @param {Array} avisos - Lista de avisos
     */
    exibirAvisos(container, avisos) {
        container.innerHTML = '';
        
        avisos.forEach(aviso => {
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert alert-${aviso.tipo} alert-dismissible fade show`;
            
            alertDiv.innerHTML = `
                <strong>${aviso.campo}:</strong> ${aviso.mensagem}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            
            container.appendChild(alertDiv);
        });
    },

    /**
     * Aplicar validação em tempo real para um campo
     * @param {HTMLInputElement} input - Campo de entrada
     */
    aplicarValidacaoEmCampo(input) {
        const campo = input.id;
        
        input.addEventListener('input', () => {
            // Limpar estados anteriores
            input.classList.remove('is-invalid', 'is-valid');
            const feedbackAntigo = input.parentElement.querySelector('.invalid-feedback');
            if (feedbackAntigo) {
                feedbackAntigo.remove();
            }
            
            // Validar novo valor
            const valor = parseFloat(input.value);
            if (!isNaN(valor)) {
                const resultado = this.validarCampo(campo, valor);
                
                if (!resultado.valido) {
                    input.classList.add('is-invalid');
                    
                    const feedback = document.createElement('div');
                    feedback.className = 'invalid-feedback';
                    feedback.textContent = resultado.mensagem;
                    
                    input.parentElement.appendChild(feedback);
                } else {
                    input.classList.add('is-valid');
                }
            }
        });
    },

    /**
     * Configurar validação para todos os campos numéricos de um formulário
     * @param {HTMLFormElement} form - Formulário a ser configurado
     */
    configurarValidacaoFormulario(form) {
        form.querySelectorAll('input[type="number"]').forEach(input => {
            this.aplicarValidacaoEmCampo(input);
        });
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const dados = {};
            const formData = new FormData(form);
            
            for (let [campo, valor] of formData.entries()) {
                dados[campo] = valor.includes('.') ? parseFloat(valor) : parseInt(valor, 10);
            }
            
            const validacao = this.validarFormulario(dados);
            
            this.limparErros(form);
            
            if (!validacao.valido) {
                this.exibirErros(form, validacao.erros);
                return false;
            }
            
            const avisosContainer = document.querySelector('#avisos-container');
            if (avisosContainer && validacao.avisos.length > 0) {
                this.exibirAvisos(avisosContainer, validacao.avisos);
            }
            
            // Se chegou aqui, o formulário é válido
            return true;
        });
    }
};

// Export para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Validacao;
}
