class ValidacaoInvestimentos {
    constructor() {
        this.regras = {
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
            taxaFixa: {
                min: 0,
                max: 100,
                mensagem: 'A taxa fixa deve estar entre 0% e 100%'
            },
            taxaCDI: {
                min: 0,
                max: 100,
                mensagem: 'A taxa CDI deve estar entre 0% e 100%'
            },
            inflacao: {
                min: 0,
                max: 100,
                mensagem: 'A inflação deve estar entre 0% e 100%'
            }
        };

        this.avisos = {
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
            }
        };
    }

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
    }

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
            if (percentualRenda > 30) {
                avisos.push({
                    tipo: 'warning',
                    campo: 'aporteMensal',
                    mensagem: 'O aporte representa mais de 30% da sua renda mensal'
                });
            }
        }

        return avisos;
    }

    validarFormulario(dados) {
        const erros = [];
        const avisos = this.gerarAvisos(dados);

        // Validar cada campo
        Object.keys(dados).forEach(campo => {
            if (this.regras[campo]) {
                const resultado = this.validarCampo(campo, dados[campo]);
                if (!resultado.valido) {
                    erros.push({
                        campo,
                        mensagem: resultado.mensagem
                    });
                }
            }
        });

        // Validações específicas de acordo com o tipo de calculadora
        if (dados.tipoRendimento === 'fixa' && this.regras.taxaFixa) {
            const resultado = this.validarCampo('taxaFixa', dados.taxaFixa);
            if (!resultado.valido) {
                erros.push({
                    campo: 'taxaFixa',
                    mensagem: resultado.mensagem
                });
            }
        } else if (dados.tipoRendimento === 'cdi' && this.regras.taxaCDI) {
            const resultado = this.validarCampo('taxaCDI', dados.taxaCDI);
            if (!resultado.valido) {
                erros.push({
                    campo: 'taxaCDI',
                    mensagem: resultado.mensagem
                });
            }
        }

        return {
            valido: erros.length === 0,
            erros,
            avisos
        };
    }

    renderizarFeedback(resultado) {
        let html = '';

        // Renderizar erros
        if (resultado.erros.length > 0) {
            html += '<div class="feedback-erros">';
            resultado.erros.forEach(erro => {
                html += `
                    <div class="alert alert-danger">
                        <strong>${erro.campo}:</strong> ${erro.mensagem}
                    </div>
                `;
            });
            html += '</div>';
        }

        // Renderizar avisos
        if (resultado.avisos.length > 0) {
            html += '<div class="feedback-avisos">';
            resultado.avisos.forEach(aviso => {
                html += `
                    <div class="alert alert-${aviso.tipo}">
                        <strong>${aviso.campo}:</strong> ${aviso.mensagem}
                    </div>
                `;
            });
            html += '</div>';
        }

        return html;
    }

    aplicarValidacaoEmCampo(input) {
        input.addEventListener('input', (e) => {
            const campo = e.target.id;
            const valor = parseFloat(e.target.value);
            const resultado = this.validarCampo(campo, valor);

            this.atualizarFeedbackVisual(input, resultado);
        });
    }

    atualizarFeedbackVisual(input, resultado) {
        // Remover classes anteriores
        input.classList.remove('is-invalid', 'is-valid');
        
        // Remover mensagem de erro anterior
        const feedbackAntigo = input.parentElement.querySelector('.feedback-message');
        if (feedbackAntigo) {
            feedbackAntigo.remove();
        }

        // Adicionar nova classe e mensagem
        if (!resultado.valido) {
            input.classList.add('is-invalid');
            const feedback = document.createElement('div');
            feedback.className = 'feedback-message invalid-feedback';
            feedback.textContent = resultado.mensagem;
            input.parentElement.appendChild(feedback);
        } else {
            input.classList.add('is-valid');
        }
    }
}

// Exportar para uso global
window.ValidacaoInvestimentos = ValidacaoInvestimentos;