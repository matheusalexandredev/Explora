// --- FUNÇÃO DO CARROSSEL (SETAS) ---
// Esta função move as imagens para a esquerda ou direita
function moveSlide(direction, id) {
    const carousel = document.getElementById(id);
    if (carousel) {
        const scrollAmount = carousel.offsetWidth; // Move exatamente a largura visível do container
        carousel.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth'
        });
    }
}

// --- SISTEMA DE FILTROS ---
// Aguarda o DOM carregar para garantir que os botões existam
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 1. Gerencia a classe 'active' nos botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 2. Filtra os cards
            const filterValue = button.getAttribute('data-filter');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                // Se for 'todos' ou a categoria bater, mostra. Senão, esconde.
                if (filterValue === 'todos' || category === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});

// --- EFEITO NO HEADER AO ROLAR ---
// Adiciona uma sombra ao menu quando você desce a página
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
    }
});
// --- FUNÇÃO DE AUTOPLAY ---
function startAutoplay() {
    // Procura todos os containers de carrossel na página
    const carousels = document.querySelectorAll('.carousel-container');

    carousels.forEach(carousel => {
        setInterval(() => {
            const scrollWidth = carousel.offsetWidth;
            const maxScroll = carousel.scrollWidth - scrollWidth;

            // Se estiver no final, volta para o começo (0)
            if (carousel.scrollLeft >= maxScroll - 10) {
                carousel.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                // Senão, pula para a próxima imagem
                carousel.scrollBy({ left: scrollWidth, behavior: 'smooth' });
            }
        }, 5000); // 5000ms = 5 segundos (pode mudar para 3000 se quiser mais rápido)
    });
}

// Inicia o autoplay assim que a página carregar
document.addEventListener('DOMContentLoaded', () => {
    startAutoplay();
    // ... (mantenha o resto do seu código de filtros aqui embaixo)
});