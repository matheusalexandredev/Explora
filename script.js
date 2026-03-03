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
    
    // Fecha se esvaziar
    if (cart.length === 0) {
        setTimeout(() => {
            const dropdown = document.getElementById('cart-dropdown');
            if (dropdown && cart.length === 0) dropdown.style.display = 'none';
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

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Adicionar ao Roteiro
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

    // 2. Checkout WhatsApp
    const checkoutBtn = document.getElementById('checkout-whatsapp');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) return alert("Seu roteiro está vazio!");

            let total = cart.reduce((acc, item) => acc + item.price, 0);
            let msg = "*NOVO ROTEIRO - EXPLORA BF*%0A%0A";
            cart.forEach(item => msg += `• ${item.name} (R$ ${item.price.toFixed(2)})%0A`);
            msg += `%0A💰 *TOTAL:* R$ ${total.toFixed(2)}`;
            msg += `%0A%0A_Gostaria de verificar disponibilidade para estes passeios._`;
            
            window.open(`https://wa.me/5584999999999?text=${msg}`, '_blank');
        });
    }

    // 3. Fechar ao clicar fora
    window.addEventListener('click', (e) => {
        const dropdown = document.getElementById('cart-dropdown');
        const cartContainer = document.querySelector('.nav-cart-container');
        if (dropdown && dropdown.style.display === 'block') {
            if (cartContainer && !cartContainer.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        }
    });

    // 4. Lógica de Filtragem (Melhorada)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');
            cards.forEach(card => {
                // Se for 'todos' ou a categoria bater, mostra
                if (filterValue === 'todos' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // 1. Nova localização
    const lat = -6.368306;
    const lng = -35.007528;

    // 2. Inicializa o mapa
    const map = L.map('map-element', {
        scrollWheelZoom: false
    }).setView([lat, lng], 15);

    // 3. Camada OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // 4. Marcador
    const marker = L.marker([lat, lng]).addTo(map);
    
    // 5. Popup
    marker.bindPopup("<b>Nossa Sede</b><br>Estamos esperando você!").openPopup();
    
});
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;
    const currentTheme = localStorage.getItem('theme') || 'light';

    // Aplica o tema salvo ou padrão ao carregar
    root.setAttribute('data-theme', currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let theme = root.getAttribute('data-theme');
            
            if (theme === 'dark') {
                root.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            } else {
                root.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }
});