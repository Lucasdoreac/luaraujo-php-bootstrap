<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contato e Agendamento de Consulta</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet">
</head>
<body class="bg-dark text-light">
    
    <!-- Incluindo a Navbar (Mesma do index) -->
    <?php include 'components/navbar/navbar.php'; ?>

    <!-- Seção de Contato -->
    <section class="py-5">
        <div class="container">
            <h1 class="text-center mb-4">Entre em Contato para Agendamento de Consulta</h1>
            <p class="lead text-center">Estamos aqui para te ajudar! Para agendar uma consulta, é só clicar no botão abaixo e enviar sua mensagem pelo WhatsApp.</p>
            
            <!-- Botão de WhatsApp para agendamento -->
            <a href="https://wa.me/5561983426774?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20consulta." class="btn btn-lg btn-success w-100 mb-4">
                <i class="fab fa-whatsapp"></i> Agendar Consulta via WhatsApp
            </a>

            <hr>

            <!-- Informações de Contato -->
            <h2 class="text-center mb-4">Informações de Contato</h2>
            <div class="contact-info text-center">
                <p><i class="fas fa-phone-alt"></i> Telefone: (61) 98342-6774</p>
                <p><i class="fas fa-envelope"></i> Email: contato@luaraujo.com</p>
                <p><i class="fas fa-map-marker-alt"></i> Endereço: Rua Exemplo, 123, Brasília, DF</p>
            </div>

            <hr>

            <!-- Formulário de Contato -->
            <h2 class="text-center mb-4">Ou, entre em contato por aqui:</h2>
            <form method="post" action="processa_feedback.php">
                <div class="mb-3">
                    <label for="name" class="form-label">Seu Nome</label>
                    <input type="text" class="form-control" id="name" name="name" placeholder="Seu nome" required>
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Seu Email</label>
                    <input type="email" class="form-control" id="email" name="email" placeholder="Seu email" required>
                </div>
                <div class="mb-3">
                    <label for="message" class="form-label">Mensagem</label>
                    <textarea class="form-control" id="message" name="message" rows="4" placeholder="Escreva sua mensagem" required></textarea>
                </div>
                <button type="submit" class="btn btn-primary w-100">Enviar Mensagem</button>
            </form>
        </div>
    </section>

    <!-- Incluindo o Footer (Mesmo do index) -->
    <?php include 'components/footer/footer.php'; ?>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
