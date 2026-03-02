// --- 1. CONFIGURAÇÃO DO CARRINHO ---
let cart = [];

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
    }
}

function updateCartUI() {
    const list = document.getElementById('cart-items');
    const totalSpan = document.getElementById('total-price');
    const countSpan = document.getElementById('cart-count');
    
    if (!list) return;

    list.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        total += item.price;
        list.innerHTML += `
            <li style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">
                <span>${item.name}</span>
                <strong>R$ ${item.price.toFixed(2)}</strong>
            </li>`;
    });
    
    totalSpan.innerText = total.toFixed(2);
    countSpan.innerText = cart.length;
}

// --- 2. FUNÇÃO DO CARROSSEL (SETAS) ---
function moveSlide(direction, id) {
    const carousel = document.getElementById(id);
    if (carousel) {
        const scrollAmount = carousel.offsetWidth;
        carousel.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth'
        });
    }
}

// --- 3. FUNÇÃO DE AUTOPLAY ---
function startAutoplay() {
    const carousels = document.querySelectorAll('.carousel-container');
    carousels.forEach(carousel => {
        setInterval(() => {
            const scrollWidth = carousel.offsetWidth;
            const maxScroll = carousel.scrollWidth - scrollWidth;

            if (carousel.scrollLeft >= maxScroll - 10) {
                carousel.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                carousel.scrollBy({ left: scrollWidth, behavior: 'smooth' });
            }
        }, 5000); 
    });
}

// --- 4. INICIALIZAÇÃO GERAL (DOM CONTENT LOADED) ---
document.addEventListener('DOMContentLoaded', () => {
    
    startAutoplay();

    // Lógica de Filtros
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'todos' || category === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Lógica de Adicionar ao Carrinho
    const addBtn = document.querySelectorAll('.add-to-cart');
    addBtn.forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            
            cart.push({ name, price });
            updateCartUI();
            
            // Feedback visual rápido
            button.innerText = "✓ Adicionado";
            button.style.background = "#25d366";
            setTimeout(() => {
                button.innerText = "Adicionar ao Roteiro";
                button.style.background = "var(--text-dark)";
            }, 2000);
        });
    });

    // Envio para WhatsApp (Checkout)
    const checkoutBtn = document.getElementById('checkout-whatsapp');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert("Seu roteiro está vazio! Escolha alguns destinos primeiro.");
                return;
            }

            const dataViagem = document.getElementById('travel-date').value;
            const qtdPessoas = document.getElementById('travel-people').value;

            if (!dataViagem) {
                alert("Por favor, selecione uma data prevista para sua viagem.");
                return;
            }

            let message = `*NOVO PEDIDO - EXPLORA BF*%0A%0A`;
            message += `📅 *Data prevista:* ${dataViagem}%0A`;
            message += `👥 *Nº de Pessoas:* ${qtdPessoas}%0A%0A`;
            message += `*ITENS DO ROTEIRO:*%0A`;
            
            cart.forEach(item => {
                message += `- ${item.name} (R$ ${item.price.toFixed(2)})%0A`;
            });
            
            const total = document.getElementById('total-price').innerText;
            message += `%0A💰 *TOTAL ESTIMADO:* R$ ${total}`;
            
            const phone = "5584999999999"; // SUBSTITUA PELO SEU NÚMERO
            window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
        });
    }
});

// --- 5. EFEITO NO HEADER AO ROLAR ---
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
    }
});