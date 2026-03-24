# 🗺️ Explora BF - Roteiros de Aventura

Sistema interativo de seleção de roteiros turísticos com integração direta para reserva via WhatsApp. O projeto foca em experiência do usuário (UX), oferecendo filtros por categoria, modo escuro e um carrinho de roteiro persistente.

## 🚀 Funcionalidades

* **Carrinho de Roteiros:** Adicione múltiplos passeios e veja o total estimado em tempo real.
* **Reserva via WhatsApp:** Gera uma mensagem automática e formatada com todos os dados da reserva (Nome, Data, Pessoas, Itens e Observações).
* **Filtros Inteligentes:** Organize os passeios por categorias (ex: Aventura, Relaxante, Família).
* **Persistência de Dados:** O carrinho e os dados do formulário são salvos no `localStorage`, evitando perda de dados ao atualizar a página.
* **Interface Adaptativa:** Suporte a **Dark Mode** e layout totalmente responsivo para dispositivos móveis.
* **Mapa Interativo:** Localização da sede integrada com Leaflet.js.

## 🛠️ Tecnologias Utilizadas

* **HTML5 / CSS3:** Estrutura e estilização moderna com variáveis CSS.
* **JavaScript (Vanilla):** Lógica do carrinho, manipulação de DOM e integração com WhatsApp.
* **Leaflet.js:** Biblioteca para o mapa interativo.
* **Google Fonts:** Tipografia personalizada.

## 📂 Estrutura do Projeto

```text
/
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilização e temas (Light/Dark)
├── js/
│   └── script.js      # Lógica do sistema e integração WhatsApp
├── assets/             # Imagens e ícones dos passeios
└── README.md           # Documentação do projeto
