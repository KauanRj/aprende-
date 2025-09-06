const icons = document.querySelectorAll(".menu .icon");
const tabs = document.querySelectorAll(".tab-content");

const btnAdicionar = document.getElementById("btnAdicionar");
const listaCursos = document.getElementById("cursos");
const progresso = document.getElementById("progresso");
const progressoTexto = document.getElementById("progresso-texto");
const filtroCategoria = document.getElementById("filtroCategoria");
const filtroStatus = document.getElementById("filtroStatus");

let cursos = JSON.parse(localStorage.getItem("cursos")) || [];

// Troca de abas
icons.forEach(icon => {
  icon.addEventListener("click", () => {
    let tabId = icon.dataset.tab;
    tabs.forEach(t => t.classList.remove("active"));
    icons.forEach(i => i.classList.remove("active"));
    document.getElementById(tabId).classList.add("active");
    icon.classList.add("active");
  });
});

// Adicionar curso
btnAdicionar.addEventListener("click", () => {
  const nome = document.getElementById("nomeCurso").value.trim();
  let categoria = document.getElementById("categoriaCurso").value.trim();
  const link = document.getElementById("linkCurso").value.trim();
  const status = document.getElementById("statusCurso").value;
  if(!nome) return alert("Digite o nome do curso!");

  if(!categoria) categoria = "Sem categoria";

  cursos.push({ nome, categoria, link, status });
  localStorage.setItem("cursos", JSON.stringify(cursos));

  document.getElementById("nomeCurso").value = "";
  document.getElementById("categoriaCurso").value = "";
  document.getElementById("linkCurso").value = "";
  document.getElementById("statusCurso").value = "nao-iniciado";

  renderizarCursos();
});

// Renderizar cursos
function renderizarCursos() {
  listaCursos.innerHTML = "";

  // Salva valor selecionado antes de atualizar o select
  const categoriaSelecionada = filtroCategoria.value;

  // Atualiza filtro de categoria
  filtroCategoria.innerHTML = `<option value="todas">Todas categorias</option>`;
  let categorias = [...new Set(cursos.map(c => c.categoria || "Sem categoria"))];
  categorias.forEach(cat => {
    let opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    filtroCategoria.appendChild(opt);
  });

  // Restaura valor selecionado
  if ([...filtroCategoria.options].some(o => o.value === categoriaSelecionada)) {
    filtroCategoria.value = categoriaSelecionada;
  } else {
    filtroCategoria.value = "todas";
  }

  // Filtrar cursos
  let filtrados = cursos.filter(c => {
    let categoriaOk = filtroCategoria.value === "todas" || (c.categoria || "Sem categoria") === filtroCategoria.value;
    let statusOk = filtroStatus.value === "todos" || c.status === filtroStatus.value;
    return categoriaOk && statusOk;
  });

  if (filtrados.length === 0) {
    listaCursos.innerHTML = "<li class='card'>Nenhum curso encontrado.</li>";
  }

  filtrados.forEach((c, index) => {
    let li = document.createElement("li");
    li.classList.add("card");
    li.innerHTML = `
      <h3>${c.nome}</h3>
      <p><strong>Categoria:</strong> ${c.categoria || "Sem categoria"}</p>
      <p><strong>Status:</strong> ${c.status}</p>
      ${c.link ? `<p><a href="${c.link}" target="_blank">🔗 Acessar</a></p>` : ''}
    `;
    listaCursos.appendChild(li);
  });

  let concluidos = cursos.filter(c => c.status === "concluido").length;
  let porcentagem = cursos.length ? Math.round((concluidos / cursos.length) * 100) : 0;
  progresso.value = porcentagem;
  progressoTexto.textContent = `${porcentagem}% concluído`;
}

// Filtros
filtroCategoria.addEventListener("change", renderizarCursos);
filtroStatus.addEventListener("change", renderizarCursos);

// Inicialização
renderizarCursos();
