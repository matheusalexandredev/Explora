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