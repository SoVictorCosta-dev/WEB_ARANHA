let cardContainer = document.querySelector("main.card-container");

let dados = [];
let filtroAtual = 'todos'; // Mantém o estado do filtro atual
// Função para carregar os dados do JSON e renderizar todos os cards inicialmente
async function carregarDados() {
    let resposta = await fetch("data.json");
    dados = await resposta.json();
    renderizarCards(dados)
}

// Função para filtrar por tag
function filtrarPorTag(tag, elementoBotao) {
    filtroAtual = tag.toLowerCase();

    // Atualiza a classe 'active' nos botões
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    elementoBotao.classList.add('active');

    // Aplica o filtro e a busca atual
    iniciarBusca();
}

// Função para filtrar e exibir os cards com base na busca
function iniciarBusca() {
    const buscaInput = document.getElementById("busca-input");
    const termoBusca = buscaInput.value.toLowerCase();

    let dadosFiltrados = dados;

    // 1. Aplica o filtro de tag
    if (filtroAtual !== 'todos') {
        dadosFiltrados = dados.filter(dado =>
            dado.tags.some(tag => tag.toLowerCase() === filtroAtual)
        );
    }

    // 2. Aplica a busca por texto sobre os dados já filtrados pela tag
    if (termoBusca.trim() !== "") {
        dadosFiltrados = dadosFiltrados.filter(dado =>
            dado.nome.toLowerCase().includes(termoBusca) ||
            dado.descrição.toLowerCase().includes(termoBusca) ||
            dado.tags.some(tag => tag.toLowerCase().includes(termoBusca))
        );
    }

    renderizarCards(dadosFiltrados);
}

function renderizarCards(dados) {
    cardContainer.innerHTML = ""; // Limpa o container antes de adicionar novos cards
    for (let dado of dados) {
        let article = document.createElement("article");
        article.classList.add("card");
        article.style.setProperty('--bg-image', `url('${dado.imagem}')`);
        article.innerHTML = `
        <div class="card-content">
        <div class="card-header"> 
            <img src="${dado.imagem}" alt="Avatar de ${dado.nome}" class="avatar"> 
            <h2>${dado.nome}</h2> 
        </div> 
        <div class="card-info">
            <p><strong>Data:</strong> ${dado.data}</p>
            <p><strong>Local:</strong> ${dado.local}</p>
            <p class="desc">${dado.descrição}</p>
        </div>
        <div class="tags-container">
    ${dado.tags.slice(0, 3).map(tag => `<span class="tag-comic">${tag}</span>`).join('')}
`;
const forca = dado.atributos?.forca || Math.floor(Math.random() * 50) + 50;
        const agilidade = dado.atributos?.agilidade || Math.floor(Math.random() * 50) + 50;
        const tecnologia = dado.atributos?.teia || Math.floor(Math.random() * 50) + 50;

        const statsHtml = `
            <div class="stats-container">
                <div class="stat-row">
                    <span>FOR</span>
                    <div class="bar-bg"><div class="bar-fill" style="width: ${forca}%"></div></div>
                </div>
                <div class="stat-row">
                    <span>AGI</span>
                    <div class="bar-bg"><div class="bar-fill" style="width: ${agilidade}%"></div></div>
                </div>
                <div class="stat-row">
                    <span>TEC</span>
                    <div class="bar-bg"><div class="bar-fill" style="width: ${tecnologia}%"></div></div>
                </div>
            </div>
        `;
        article.innerHTML = `
        <div class="card-content">
            <div class="card-header">
                <img src="${dado.imagem}" alt="Avatar de ${dado.nome}" class="avatar">
                <h2>${dado.nome}</h2>
            </div>
            <div class="card-info">
                <p><strong>Data:</strong> ${dado.data}</p>
                <p><strong>Local:</strong> ${dado.local}</p>
                <p class="desc">${dado.descrição}</p>
            </div>

            ${statsHtml} <div class="tags-container">
               ${dado.tags.slice(0, 3).map(tag => `<span class="tag-comic">${tag}</span>`).join('')}
            </div>
            <a href="${dado.link}" target="_blank" class="btn-saiba-mais">Acessar Arquivo</a>
        </div>
        `;

cardContainer.appendChild(article);
    }
}

// Carrega os dados assim que a página é carregada
window.addEventListener('DOMContentLoaded', carregarDados);

function gerarBotoesFiltro(dados) {
    // Extrai todas as tags únicas
    const todasTags = new Set();
    dados.forEach(dado => dado.tags.forEach(tag => todasTags.add(tag)));

    const filterContainer = document.querySelector('.filter-container'); // Precisa criar essa div no HTML
    filterContainer.innerHTML = `<button class="filter-btn active" onclick="filtrarPorTag('todos', this)">Todos</button>`;

    todasTags.forEach(tag => {
        // Cria um botão para cada tag
        const btn = document.createElement('button');
        btn.classList.add('filter-btn');
        btn.innerText = tag.charAt(0).toUpperCase() + tag.slice(1); // Capitaliza
        btn.onclick = () => filtrarPorTag(tag, btn);
        filterContainer.appendChild(btn);
    });
}

window.addEventListener('scroll', () => {
    const btnTopo = document.getElementById('btn-topo');
    if (window.scrollY > 300) {
        btnTopo.style.display = 'block';
    } else {
        btnTopo.style.display = 'none';
    }
});

