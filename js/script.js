let cart = [];

function moveSlide(direction, id) {
    const carousel = document.getElementById(id);
    if (carousel) carousel.scrollBy({ left: direction * carousel.offsetWidth, behavior: 'smooth' });
}

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
                        <span>R$ ${item.price.toFixed(2)} / pessoa</span>
                    </div>
                    <button class="remove-item" onclick="removeItem(${index})">&times;</button>
                </li>`;
        });
    }
    const qtdEl = document.getElementById('res-qtd');
    const qtdNum = parseInt(qtdEl ? qtdEl.value : 1) || 1;
    totalSpan.innerText = `R$ ${(total * qtdNum).toFixed(2)}`;
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

function enviarReserva() {
    const nome = document.getElementById('res-nome').value;
    const tel = document.getElementById('res-tel').value;
    const data = document.getElementById('res-data').value;
    const qtd = document.getElementById('res-qtd').value;
    const obs = document.getElementById('res-obs').value;
    if (!nome || !data) { alert("Por favor, preencha seu nome e a data pretendida."); return; }
    if (cart.length === 0) { alert("Seu roteiro está vazio!"); return; }

    const qtdNum = parseInt(qtd) || 1;
    let itensTexto = "";
    let totalCalculado = 0;

    cart.forEach(item => {
        const subtotal = item.price * qtdNum;
        totalCalculado += subtotal;
        itensTexto += `- ${item.name}: R$ ${item.price.toFixed(2)} x ${qtdNum} pessoa(s) = R$ ${subtotal.toFixed(2)}\n`;
    });

    const totalFinal = `R$ ${totalCalculado.toFixed(2)}`;
    const obsTexto = obs.trim() !== "" ? `\n*OBS:* ${obs}` : "";
    const mensagem = encodeURIComponent(
        `*NOVA RESERVA - EXPLORA BF*\n\n` +
        `*Nome:* ${nome}\n*WhatsApp:* ${tel}\n*Data:* ${data}\n*Pessoas:* ${qtdNum}\n\n` +
        `*ROTEIRO SELECIONADO:*\n${itensTexto}\n*TOTAL ESTIMADO:* ${totalFinal}${obsTexto}`
    );
    window.open(`https://wa.me/5584991951206?text=${mensagem}`, '_blank');
    cart = [];
    localStorage.removeItem('cart_explora');
    updateCartUI();
    toggleCart();
}

const textosLegais = {
    termos: `
        <h3>Uso do Site</h3>
        <p>Ao navegar na Explora BF, você concorda com a coleta de dados básicos para sua reserva.</p>
        <h3>Política de Cancelamento</h3>
        <p><strong>Até 24h antes:</strong> Reembolso de 100% do sinal pago.<br>
           <strong>No dia:</strong> Não haverá devolução em caso de desistência.</p>
        <h3>Responsabilidade</h3>
        <p>Os passeios envolvem aventura. É obrigatório seguir as instruções do guia para sua segurança.</p>
        <h3>Condições Climáticas</h3>
        <p>Em caso de chuvas que comprometam a segurança, o passeio será reagendado ou o valor estornado.</p>
    `
};

function toggleTerms() {
    const modal = document.getElementById('terms-modal');
    if (!modal) return;
    if (modal.style.display === "block") { closeTerms(); return; }
    document.getElementById('modal-title').innerText = "Termos de Uso";
    document.getElementById('modal-text').innerHTML = textosLegais.termos;
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
}

function closeTerms() {
    const modal = document.getElementById('terms-modal');
    if (modal) { modal.style.display = "none"; document.body.style.overflow = "auto"; }
}

document.addEventListener('DOMContentLoaded', () => {

    const savedCart = localStorage.getItem('cart_explora');
    if (savedCart) { cart = JSON.parse(savedCart); updateCartUI(); }

    ['res-nome', 'res-tel', 'res-data', 'res-qtd', 'res-obs'].forEach(id => {
        const el = document.getElementById(id);
        const saved = localStorage.getItem(id);
        if (saved && el) el.value = saved;
        if (el) el.addEventListener('input', () => localStorage.setItem(id, el.value));
    });

    // Atualiza total ao mudar número de pessoas
    const qtdInput = document.getElementById('res-qtd');
    if (qtdInput) qtdInput.addEventListener('input', updateCartUI);

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            cart.push({ name: button.getAttribute('data-name'), price: parseFloat(button.getAttribute('data-price')) });
            updateCartUI();
            const original = button.innerHTML;
            button.innerHTML = "✅ Adicionado!";
            button.classList.add('btn-success');
            setTimeout(() => { button.innerHTML = original; button.classList.remove('btn-success'); }, 1200);
        });
    });

    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.destinos-grid .card');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const val = btn.getAttribute('data-filter');
            cards.forEach(card => {
                card.style.display = (val === 'todos' || card.getAttribute('data-category') === val) ? 'block' : 'none';
            });
        });
    });

    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;
    root.setAttribute('data-theme', localStorage.getItem('theme') || 'light');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const theme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        });
    }

    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => q.parentElement.classList.toggle('active'));
    });

    const mapEl = document.getElementById('map-element');
    if (mapEl) {
        const map = L.map('map-element', { scrollWheelZoom: false }).setView([-6.368306, -35.007528], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        L.marker([-6.368306, -35.007528]).addTo(map).bindPopup("<b>Explora Baía Formosa</b>").openPopup();
    }

    const wpp = document.querySelector('.whatsapp-float');
    if (wpp) window.addEventListener('scroll', () => wpp.classList.toggle('show', window.scrollY > 300));

    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('visible'), i * 80);
                revealObserver.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
});

window.onclick = function(e) {
    if (e.target == document.getElementById('terms-modal')) closeTerms();
    if (e.target == document.getElementById('cart-overlay')) toggleCart();
};