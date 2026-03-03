// --- ESTADO GLOBAL ---
let cart = [];

// --- LÓGICA DO CARROSSEL ---
function moveSlide(direction, id) {
    const carousel = document.getElementById(id);
    
    if (carousel) {
        const scrollAmount = carousel.offsetWidth;
        carousel.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth'
        });
    } else {
        console.error(`Carrossel com ID "${id}" não encontrado.`);
    }
}

// --- LÓGICA DO CARRINHO ---

function toggleCart() {
    const dropdown = document.getElementById('cart-dropdown');
    if (dropdown) {
        const isVisible = dropdown.style.display === 'block';
        dropdown.style.display = isVisible ? 'none' : 'block';
    }
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartUI();
    
    // Só fecha automaticamente se o carrinho ficar totalmente vazio
    if (cart.length === 0) {
        setTimeout(() => {
            const dropdown = document.getElementById('cart-dropdown');
            if (dropdown) dropdown.style.display = 'none';
        }, 500);
    }
}

function updateCartUI() {
    const list = document.getElementById('cart-items');
    const totalSpan = document.getElementById('total-price');
    const countSpan = document.getElementById('cart-count');
    
    if (!list || !totalSpan || !countSpan) return;

    list.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        total += item.price;
        list.innerHTML += `
            <li class="cart-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">
                <div style="display: flex; flex-direction: column;">
                    <span style="font-weight: 600; font-size: 0.9rem;">${item.name}</span>
                    <small style="color: #666;">R$ ${item.price.toFixed(2)}</small>
                </div>
                <button onclick="event.stopPropagation(); removeItem(${index})" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-size:1.4rem; padding: 0 5px;">
                    &times;
                </button>
            </li>`;
    });
    
    totalSpan.innerText = total.toFixed(2);
    countSpan.innerText = cart.length;
}

// --- INICIALIZAÇÃO DE EVENTOS ---
document.addEventListener('DOMContentLoaded', () => {
    
    // Configura botões "Adicionar ao Roteiro"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            
            cart.push({ name, price });
            updateCartUI();
            
            const dropdown = document.getElementById('cart-dropdown');
            if (dropdown) dropdown.style.display = 'block';
        });
    });

    // Configura botão de Finalizar Reserva via WhatsApp
    const checkoutBtn = document.getElementById('checkout-whatsapp');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert("Seu roteiro está vazio!");
                return;
            }

            let msg = "*NOVO ROTEIRO - EXPLORA BF*%0A%0A";
            cart.forEach(item => {
                msg += `• ${item.name} (R$ ${item.price.toFixed(2)})%0A`;
            });
            msg += `%0A💰 *TOTAL:* R$ ${document.getElementById('total-price').innerText}`;
            msg += `%0A%0A_Gostaria de verificar disponibilidade para estes passeios._`;
            
            const numero = "5584999999999"; 
            window.open(`https://wa.me/${numero}?text=${msg}`, '_blank');
        });
    }

    // Fecha o carrinho se o usuário clicar fora dele (CORRIGIDO)
    window.addEventListener('click', (e) => {
        const dropdown = document.getElementById('cart-dropdown');
        const cartContainer = document.querySelector('.nav-cart-container');
        
        // Verifica se o menu está aberto e se o clique foi fora de todo o container do carrinho
        if (dropdown && dropdown.style.display === 'block') {
            if (cartContainer && !cartContainer.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        }
    });

    // --- LÓGICA DE FILTRAGEM ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');
            cards.forEach(card => {
                if (filterValue === 'todos' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});