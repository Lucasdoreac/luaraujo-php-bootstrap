class AppIntegrator {
    constructor() {
        this.modules = {
            calculator: null,
            charts: null,
            validation: null,
            educational: null
        };
        this.state = {
            currentCalculator: '',
            lastResults: null,
            isSimulating: false
        };
    }

    async init(calculatorType) {
        this.state.currentCalculator = calculatorType;
        
        // Carregar módulos
        await this.loadModules();
        
        // Inicializar listeners
        this.setupEventListeners();
        
        // Carregar último estado se existir
        this.loadLastState();
        
        // Iniciar tour se for primeira visita
        this.checkFirstVisit();
        
        // Adicionar ao window para acesso global
        window.app = this;
    }

    async loadModules() {
        try {
            // Instanciar módulos diretamente - não estamos mais usando import dinâmico do ES6
            this.modules.calculator = new CalculoInvestimentos();
            this.modules.charts = new GraficoManager('chart-container');
            this.modules.validation = new ValidacaoInvestimentos();
            this.modules.educational = new ConteudoEducacional();

            console.log('Módulos carregados com sucesso');
        } catch (error) {
            console.error('Erro ao carregar módulos:', error);
            this.showError('Erro ao inicializar calculadora. Por favor, recarregue a página.');
        }
    }

    setupEventListeners() {
        // Form principal
        document.getElementById('calc-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCalculation();
        });

        // Inputs numéricos
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener('input', (e) => this.handleInputChange(e));
            input.addEventListener('blur', (e) => this.handleInputBlur(e));
        });

        // Botões de exportação
        document.querySelectorAll('.export-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleExport(e));
        });

        // Tooltips educacionais
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.addEventListener('mouseover', (e) => this.showTooltip(e));
            element.addEventListener('mouseout', (e) => this.hideTooltip(e));
        });
        
        // Dropdown de tipo de rendimento
        document.getElementById('tipoRendimento')?.addEventListener('change', () => {
            this.toggleRendimentoFields();
        });
    }
    
    toggleRendimentoFields() {
        const tipoRendimento = document.getElementById('tipoRendimento');
        if (!tipoRendimento) return;
        
        const taxaFixaGroup = document.getElementById('taxaFixaGroup');
        const cdiGroup = document.getElementById('cdiGroup');
        
        if (tipoRendimento.value === 'fixa') {
            taxaFixaGroup.style.display = 'block';
            cdiGroup.style.display = 'none';
        } else {
            taxaFixaGroup.style.display = 'none';
            cdiGroup.style.display = 'block';
        }
    }

    async handleCalculation() {
        if (this.state.isSimulating) return;
        
        this.state.isSimulating = true;
        this.showLoader();

        try {
            // Coletar dados do formulário
            const formData = this.collectFormData();

            // Validar dados
            const validationResult = this.modules.validation.validarFormulario(formData);
            if (!validationResult.valido) {
                this.showValidationErrors(validationResult.erros);
                this.hideLoader();
                this.state.isSimulating = false;
                return;
            }

            // Realizar cálculos
            const results = await this.modules.calculator.calcularRentabilidade(formData);
            this.state.lastResults = results;

            // Atualizar UI
            this.updateResults(results);
            
            // Gerar gráficos
            this.updateCharts(results);
            
            // Mostrar dicas educacionais
            this.showEducationalTips(results);
            
            // Salvar no histórico
            this.saveToHistory(formData, results);

        } catch (error) {
            console.error('Erro ao calcular:', error);
            this.showError('Erro ao realizar os cálculos. Por favor, tente novamente.');
        } finally {
            this.state.isSimulating = false;
            this.hideLoader();
        }
    }

    collectFormData() {
        const form = document.getElementById('calc-form');
        const formData = new FormData(form);
        const data = {};

        for (let [key, value] of formData.entries()) {
            data[key] = value.includes('.') ? parseFloat(value) : parseInt(value, 10);
        }

        return data;
    }

    updateResults(results) {
        Object.entries(results).forEach(([key, value]) => {
            const element = document.getElementById(`result-${key}`);
            if (element) {
                if (typeof value === 'number') {
                    element.textContent = this.formatValue(value, key);
                } else {
                    element.textContent = value;
                }
                element.classList.add('updated');
                setTimeout(() => element.classList.remove('updated'), 1000);
            }
        });
        
        // Mostrar o container de resultados
        const resultsContainer = document.getElementById('results-container');
        if (resultsContainer) {
            resultsContainer.style.display = 'block';
        }
    }

    updateCharts(results) {
        if (results.evolucaoMensal && this.modules.charts) {
            // Gráfico de evolução
            this.modules.charts.criarGraficoEvolucaoPatrimonio({
                labels: Array.from({ length: results.evolucaoMensal.length }, (_, i) => `Mês ${i + 1}`),
                valores: results.evolucaoMensal.map(m => m.valorFinal)
            });

            // Gráfico comparativo
            if (results.comparativos) {
                this.modules.charts.criarGraficoComparativo({
                    labels: results.comparativos.map(c => c.nome),
                    datasets: [{
                        label: 'Valor Final',
                        data: results.comparativos.map(c => c.valorFinal)
                    }]
                });
            }
        }
    }

    showEducationalTips(results) {
        const tipsContainer = document.getElementById('educational-tips');
        if (!tipsContainer) return;

        const tips = this.modules.educational.gerarDicasContextuais(results);
        tipsContainer.innerHTML = tips;
        tipsContainer.style.display = 'block';
    }

    async saveToHistory(formData, results) {
        try {
            const data = {
                data: new Date().toISOString(),
                tipo: this.state.currentCalculator,
                entrada: formData,
                resultados: results
            };

            await fetch('includes/save-history.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.error('Erro ao salvar no histórico:', error);
        }
    }

    formatValue(value, type) {
        if (type.includes('moeda') || type.includes('valor') || type.includes('final') || type.includes('ganho')) {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(value);
        } else if (type.includes('percentual') || type.includes('taxa') || type.includes('inflacao')) {
            return new Intl.NumberFormat('pt-BR', {
                style: 'percent',
                minimumFractionDigits: 2
            }).format(value / 100);
        } else {
            return value.toLocaleString('pt-BR');
        }
    }

    showLoader() {
        const loader = document.querySelector('.calculation-loader');
        if (loader) loader.classList.add('active');
    }

    hideLoader() {
        const loader = document.querySelector('.calculation-loader');
        if (loader) loader.classList.remove('active');
    }

    showError(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.querySelector('.messages-container')?.appendChild(alertDiv);
    }

    showValidationErrors(errors) {
        errors.forEach(error => {
            const input = document.getElementById(error.campo);
            if (input) {
                input.classList.add('is-invalid');
                const feedback = document.createElement('div');
                feedback.className = 'invalid-feedback';
                feedback.textContent = error.mensagem;
                input.parentElement.appendChild(feedback);
            }
        });
    }

    handleInputChange(e) {
        // Limpar validação quando o usuário começa a editar
        e.target.classList.remove('is-invalid');
        const feedback = e.target.parentElement.querySelector('.invalid-feedback');
        if (feedback) feedback.remove();
    }

    handleInputBlur(e) {
        // Validar campo quando o usuário sai dele
        const field = e.target.id;
        const value = parseFloat(e.target.value);
        
        if (this.modules.validation) {
            const result = this.modules.validation.validarCampo(field, value);
            if (!result.valido) {
                e.target.classList.add('is-invalid');
                const feedback = document.createElement('div');
                feedback.className = 'invalid-feedback';
                feedback.textContent = result.mensagem;
                e.target.parentElement.appendChild(feedback);
            }
        }
    }

    handleExport(e) {
        const type = e.target.dataset.type;
        if (type === 'pdf') {
            this.exportPDF();
        } else if (type === 'excel') {
            this.exportExcel();
        }
    }

    async exportPDF() {
        // Implementação na main.js
    }

    async exportExcel() {
        // Implementação na main.js
    }

    showTooltip(e) {
        const tooltipId = e.target.dataset.tooltip;
        const tooltip = document.getElementById(tooltipId);
        if (tooltip) {
            tooltip.style.display = 'block';
        }
    }

    hideTooltip(e) {
        const tooltipId = e.target.dataset.tooltip;
        const tooltip = document.getElementById(tooltipId);
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }

    loadLastState() {
        const lastState = localStorage.getItem('lastCalculation');
        if (lastState) {
            try {
                const state = JSON.parse(lastState);
                // Preencher o formulário com valores salvos
                Object.entries(state).forEach(([key, value]) => {
                    const input = document.getElementById(key);
                    if (input) {
                        input.value = value;
                    }
                });
            } catch (error) {
                console.error('Erro ao carregar último estado:', error);
            }
        }
    }

    checkFirstVisit() {
        if (!localStorage.getItem('visitado')) {
            this.startTour();
            localStorage.setItem('visitado', 'true');
        }
    }

    startTour() {
        // Iniciar tour guiado, se TourGuide estiver disponível
        if (typeof TourGuide !== 'undefined') {
            const tour = new TourGuide(this.state.currentCalculator);
            tour.start();
        } else {
            console.warn('TourGuide não está disponível');
        }
    }
}

// Exportar para uso global
window.AppIntegrator = AppIntegrator;