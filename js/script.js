// --- ESTADO GLOBAL ---
let cart = [];

const empresa = "Explora BF";
const whatsappEmpresa = "558486766578";

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

    localStorage.setItem('cart_explora', JSON.stringify(cart));

    list.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        if (emptyMsg) emptyMsg.style.display = 'block';
    } else {
        if (emptyMsg) emptyMsg.style.display = 'none';
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

function clearCart() {
    if (confirm("Tem certeza que deseja limpar todo o seu roteiro?")) {
        cart = [];
        localStorage.removeItem('cart_explora');
        updateCartUI();
    }
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

    // Monta a lista de itens
    let itensTexto = "";
    cart.forEach(item => {
        itensTexto += `- ${item.name} (R$ ${item.price.toFixed(2)})\n`;
    });

    // AJUSTE: Só cria a linha de OBS se houver texto
    const obsTexto = obs.trim() !== "" ? `\n📝 *OBS:* ${obs}` : "";

    const mensagem = encodeURIComponent(
<<<<<<< HEAD
        `🌴 *NOVA RESERVA - EXPLORA BF* 🌴\n\n` +
        `👤 *Nome:* ${nome}\n` +
        `📱 *WhatsApp:* ${tel}\n` +
        `📅 *Data:* ${data}\n` +
        `👥 *Pessoas:* ${qtd}\n\n` +
        `📍 *ROTEIRO SELECIONADO:*\n${itensTexto}\n` +
        `💰 *TOTAL ESTIMADO:* ${total}\n\n` +
        `${obsTexto}`
=======
        `*NOVA RESERVA - EXPLORA BF*\n\n` +
        ` *Nome:* ${nome}\n` +
        ` *WhatsApp:* ${tel}\n` +
        ` *Data:* ${data}\n` +
        ` *Pessoas:* ${qtd}\n\n` +
        ` *ROTEIRO SELECIONADO:*\n${itensTexto}` +
        obsTexto +
        `\n *TOTAL ESTIMADO:* ${total}\n`
>>>>>>> 88ca6a3650370046e55016de45fc6ba2b75bc992
    );

    const numeroWhats = "5584991951206";
    window.open(`https://wa.me/${numeroWhats}?text=${mensagem}`, '_blank');

    // Limpa após envio
    cart = [];
    localStorage.removeItem('cart_explora');
    updateCartUI();
    toggleCart();
}

// --- LÓGICA DO MODAL DE TERMOS ---
const textosLegais = {
    termos: `
        <h3>Uso do Site</h3>
        <p>Ao navegar na Explora BF, você concorda com a coleta de dados básicos para sua reserva.</p>
        <h3>Política de Cancelamento</h3>
        <p>• <strong>Até 24h antes:</strong> Reembolso de 100% do sinal pago.<br>
           • <strong>No dia:</strong> Não haverá devolução em caso de desistência.</p>
        <h3>Responsabilidade</h3>
        <p>Os passeios envolvem aventura. É obrigatório seguir as instruções do guia para sua segurança.</p>
        <h3>Condições Climáticas</h3>
        <p>Em caso de chuvas que comprometam a segurança, o passeio será reagendado ou o valor estornado.</p>
    `
};

function toggleTerms() {
    const modal = document.getElementById('terms-modal');
    const title = document.getElementById('modal-title');
    const content = document.getElementById('modal-text');

    if (!modal) return;

    if (modal.style.display === "block") {
        closeTerms();
    } else {
        if (title) title.innerText = "Termos de Uso";
        if (content) content.innerHTML = textosLegais.termos;
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
    }
}

function closeTerms() {
    const modal = document.getElementById('terms-modal');
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

// --- INICIALIZAÇÃO PRINCIPAL ---
document.addEventListener('DOMContentLoaded', () => {

    // 1. Carregar Carrinho
    const savedCart = localStorage.getItem('cart_explora');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }

    // 2. Persistência do Formulário
    const formFields = ['res-nome', 'res-tel', 'res-data', 'res-qtd', 'res-obs'];
    formFields.forEach(fieldId => {
        const savedValue = localStorage.getItem(fieldId);
        const element = document.getElementById(fieldId);
        if (savedValue && element) element.value = savedValue;
        if (element) {
            element.addEventListener('input', () => {
                localStorage.setItem(fieldId, element.value);
            });
        }
    });

    // 3. Botões Adicionar ao Roteiro
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            cart.push({ name, price });
            updateCartUI();

            const originalText = button.innerHTML;
            button.innerHTML = "✅ Adicionado";
            button.classList.add('btn-success');

            setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.remove('btn-success');
            }, 1000);
        });
    });

    // 4. Filtros
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.card');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filterValue = button.getAttribute('data-filter');
            cards.forEach(card => {
                card.style.display = (filterValue === 'todos' || card.getAttribute('data-category') === filterValue) ? 'block' : 'none';
            });
        });
    });

    // 5. Tema (Dark/Light)
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

    // 6. FAQ
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            item.classList.toggle('active');
        });
    });

    // 7. Mapa Leaflet
    const mapElement = document.getElementById('map-element');
    if (mapElement) {
        const lat = -6.368306;
        const lng = -35.007528;
        const map = L.map('map-element', { scrollWheelZoom: false }).setView([lat, lng], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        L.marker([lat, lng]).addTo(map).bindPopup("<b>Nossa Sede</b>").openPopup();
    }
});

// Listener Global para fechar modais ao clicar fora
window.onclick = function (event) {
    const termsModal = document.getElementById('terms-modal');
    const cartOverlay = document.getElementById('cart-overlay');

    if (event.target == termsModal) closeTerms();
    if (event.target == cartOverlay) toggleCart();
};