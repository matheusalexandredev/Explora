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

// --- LÓGICA DO CARRINHO (SIDE-CART) ---
function toggleCart() {
    const sideCart = document.getElementById('side-cart');
    const overlay = document.getElementById('cart-overlay');
    
    if (!sideCart || !overlay) return;

    sideCart.classList.toggle('active');
    
    if (sideCart.classList.contains('active')) {
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    } else {
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function updateCartUI() {
    const list = document.getElementById('cart-items');
    const totalSpan = document.getElementById('total-price');
    const countSpan = document.getElementById('cart-count');
    const emptyMsg = document.getElementById('empty-cart-msg');

    if (!list || !totalSpan || !countSpan) return;

    list.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        emptyMsg.style.display = 'block';
    } else {
        emptyMsg.style.display = 'none';
        cart.forEach((item, index) => {
            total += item.price;
            list.innerHTML += `
                <li class="cart-item">
                    <div class="cart-item-info">
                        <strong>${item.name}</strong>
                        <span>R$ ${item.price.toFixed(2)}</span>
                    </div>
                    <button class="remove-item" onclick="removeItem(${index})">&times;</button>
                </li>`;
        });
    }

    totalSpan.innerText = `R$ ${total.toFixed(2)}`;
    countSpan.innerText = cart.length;
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// --- RESERVA WHATSAPP ---
function enviarReserva() {
    const nome = document.getElementById('res-nome').value;
    const tel = document.getElementById('res-tel').value;
    const data = document.getElementById('res-data').value;
    const qtd = document.getElementById('res-qtd').value;
    const obs = document.getElementById('res-obs').value;
    const total = document.getElementById('total-price').innerText;

    if (!nome || !data) {
        alert("Por favor, preencha seu nome e a data pretendida.");
        return;
    }

    if (cart.length === 0) {
        alert("Seu roteiro está vazio!");
        return;
    }

    let itensTexto = "";
    cart.forEach(item => {
        itensTexto += `- ${item.name} (R$ ${item.price.toFixed(2)})\n`;
    });

    const mensagem = encodeURIComponent(
        `*NOVA RESERVA - EXPLORA BF*\n\n` +
        `👤 *Nome:* ${nome}\n` +
        `📞 *WhatsApp:* ${tel}\n` +
        `📅 *Data:* ${data}\n` +
        `👥 *Pessoas:* ${qtd}\n\n` +
        `🗺️ *ROTEIRO SELECIONADO:*\n${itensTexto}\n` +
        `💰 *TOTAL ESTIMADO:* ${total}\n\n` +
        `📝 *OBS:* ${obs}`
    );

    const numeroWhats = "5584999999999"; 
    window.open(`https://wa.me/${numeroWhats}?text=${mensagem}`, '_blank');
}

// --- INICIALIZAÇÃO PRINCIPAL ---
document.addEventListener('DOMContentLoaded', () => {
// --- LÓGICA DO BOTÃO WHATSAPP AO FINAL DA PÁGINA ---
window.addEventListener('scroll', () => {
    const whatsappBtn = document.querySelector('.whatsapp-float');
    
    // Calcula se o usuário chegou ao fim da página
    // window.innerHeight + window.scrollY dá a posição atual da tela
    // document.documentElement.scrollHeight dá o tamanho total da página
    // Usamos -50 para dar uma pequena margem antes do fim absoluto
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= pageHeight - 50) {
        whatsappBtn.classList.add('show');
    } else {
        whatsappBtn.classList.remove('show');
    }
});
    // 1. Botões Adicionar ao Roteiro
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));

            cart.push({ name, price });
            updateCartUI();
            
            // REMOVIDO: toggleCart(); <- Esta linha fazia o carrinho abrir sozinho
            
            // DICA: Você pode adicionar um feedback visual sutil aqui 
            // como mudar o texto do botão para "Adicionado!" por 1 segundo.
        });
    });

    // 2. Fechar Carrinho (Overlay)
    const overlay = document.getElementById('cart-overlay');
    if (overlay) overlay.addEventListener('click', toggleCart);

    // 3. Filtros
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

    // 4. Tema (Dark/Light)
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'light';
    root.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let theme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        });
    }

    // 5. FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            document.querySelectorAll('.faq-item').forEach(other => {
                if (other !== item) other.classList.remove('active');
            });
            item.classList.toggle('active');
        });
    });

    // 6. Mapa Leaflet
    const mapElement = document.getElementById('map-element');
    if (mapElement) {
        const lat = -6.368306;
        const lng = -35.007528;
        const map = L.map('map-element', { scrollWheelZoom: false }).setView([lat, lng], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        L.marker([lat, lng]).addTo(map).bindPopup("<b>Nossa Sede</b>").openPopup();
    }
});