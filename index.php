<?php
$page_title = "Calculadoras Financeiras - Seu Futuro Financeiro Começa Aqui";
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $page_title; ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet">
</head>
<body class="bg-dark text-light">
    <?php include 'components/navbar/navbar.php'; ?>

    <!-- Hero Section -->
    <header class="hero-section py-5">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6">
                    <h1 class="display-4 fw-bold mb-4">Desvende o Potencial do Seu Dinheiro</h1>
                    <p class="lead mb-4">Explore ferramentas avançadas para simular investimentos, planejar seus objetivos financeiros e dominar o mundo das finanças.</p>
                    <a href="calculadoras/calc-1.php" class="btn btn-primary btn-lg">Iniciar Simulação <i class="fas fa-arrow-right ms-2"></i></a>
                </div>
                <div class="col-lg-6 d-none d-lg-block">
                    <img src="assets/images/finance-hero.svg" alt="Finanças" class="img-fluid hero-image">
                </div>
            </div>
        </div>
    </header>

    <!-- Calculadoras Grid -->
    <section class="calculators-section py-5">
        <div class="container">
            <h2 class="text-center mb-5 section-title">Escolha seu Portal de Simulação <i class="fas fa-space-shuttle text-primary"></i></h2>
            
            <div class="row g-4">
                <!-- Card 1 -->
                <div class="col-md-4">
                    <div class="card h-100 shadow-lg calculator-card">
                        <div class="card-body">
                            <div class="text-center mb-4">
                                <i class="fas fa-chart-line fa-3x text-primary"></i>
                            </div>
                            <h3 class="card-title h5 text-center">Simulador Educacional</h3>
                            <p class="card-text text-muted">Desvende os mistérios da renda fixa e CDI, com juros compostos e inflação na prática.</p>
                            <div class="text-center">
                                <a href="calculadoras/calc-1.php" class="btn btn-outline-primary">Acessar <i class="fas fa-arrow-circle-right ms-1"></i></a>
                            </div>
                        </div>
                         <div class="card-footer text-center">
                             <small class="text-muted">Entenda o Futuro</small>
                         </div>
                    </div>
                </div>

                <!-- Card 2 -->
                <div class="col-md-4">
                    <div class="card h-100 shadow-lg calculator-card">
                        <div class="card-body">
                            <div class="text-center mb-4">
                                <i class="fas fa-piggy-bank fa-3x text-primary"></i>
                            </div>
                            <h3 class="card-title h5 text-center">PGBL vs CDB</h3>
                            <p class="card-text text-muted">Compare PGBL e CDB e encontre o investimento perfeito para você, sem complicações.</p>
                            <div class="text-center">
                                <a href="calculadoras/calc-2.php" class="btn btn-outline-primary">Comparar <i class="fas fa-arrow-circle-right ms-1"></i></a>
                            </div>
                        </div>
                        <div class="card-footer text-center">
                             <small class="text-muted">Compare e Decida</small>
                         </div>
                    </div>
                </div>

                <!-- Card 3 -->
                <div class="col-md-4">
                    <div class="card h-100 shadow-lg calculator-card">
                        <div class="card-body">
                            <div class="text-center mb-4">
                                <i class="fas fa-coins fa-3x text-primary"></i>
                            </div>
                            <h3 class="card-title h5 text-center">Simulador de Investimentos</h3>
                            <p class="card-text text-muted">Veja seu patrimônio crescer com aportes e juros. Planejar nunca foi tão fácil e estimulante.</p>
                            <div class="text-center">
                                <a href="calculadoras/calc-3.php" class="btn btn-outline-primary">Simular <i class="fas fa-arrow-circle-right ms-1"></i></a>
                            </div>
                        </div>
                         <div class="card-footer text-center">
                             <small class="text-muted">Visualize seu Crescimento</small>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features-section py-5">
        <div class="container">
            <h2 class="text-center mb-5 section-title">Recursos que Impulsionam suas Decisões <i class="fas fa-rocket text-primary"></i></h2>
            <div class="row g-4">
                <div class="col-md-4 text-center">
                    <div class="feature-item p-3">
                        <i class="fas fa-shield-alt fa-3x text-primary mb-3"></i>
                        <h3 class="h5">Segurança Reforçada</h3>
                        <p class="text-muted">Suas informações permanecem seguras no seu navegador.</p>
                    </div>
                </div>
                <div class="col-md-4 text-center">
                   <div class="feature-item p-3">
                        <i class="fas fa-stopwatch fa-3x text-primary mb-3"></i>
                        <h3 class="h5">Resultados Imediatos</h3>
                         <p class="text-muted">Cálculos precisos, sem enrolação, para você agir agora.</p>
                    </div>
                </div>
                <div class="col-md-4 text-center">
                    <div class="feature-item p-3">
                        <i class="fas fa-laptop-code fa-3x text-primary mb-3"></i>
                        <h3 class="h5">Acessibilidade Total</h3>
                        <p class="text-muted">Use em qualquer dispositivo, com a mesma experiência.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Call to Action -->
     <section class="cta-section py-5">
        <div class="container">
            <div class="text-center">
                <h2 class="section-title mb-4">Pronto para decolar rumo aos seus Objetivos? <i class="fas fa-chart-bar text-primary"></i></h2>
                <p class="lead mb-4">Não espere mais! Comece a planejar seu futuro financeiro agora mesmo com nossas ferramentas.</p>
                <a href="contato.php" class="btn btn-light btn-lg">Entre em Contato <i class="fas fa-paper-plane ms-2"></i></a>
            </div>
        </div>
    </section>

    <?php include 'components/footer/footer.php'; ?>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>