// Abas
const abas = document.querySelectorAll(".menu .icon");
const conteudos = document.querySelectorAll(".tab-content");

abas.forEach(aba => {
  aba.addEventListener("click", () => {
    abas.forEach(a => a.classList.remove("active"));
    conteudos.forEach(c => c.classList.remove("active"));

    aba.classList.add("active");
    document.getElementById(aba.dataset.tab).classList.add("active");
  });
});

// Cursos
let cursos = JSON.parse(localStorage.getItem("cursos")) || [];

const nomeCurso = document.getElementById("nomeCurso");
const categoriaCurso = document.getElementById("categoriaCurso");
const linkCurso = document.getElementById("linkCurso");
const statusCurso = document.getElementById("statusCurso");
const btnAdicionar = document.getElementById("btnAdicionar");
const listaCursos = document.getElementById("cursos");
const filtroCategoria = document.getElementById("filtroCategoria");
const filtroStatus = document.getElementById("filtroStatus");
const progresso = document.getElementById("progresso");
const progressoTexto = document.getElementById("progresso-texto");

// Adicionar curso
btnAdicionar.addEventListener("click", () => {
  const novoCurso = {
    nome: nomeCurso.value,
    categoria: categoriaCurso.value || "Sem categoria",
    link: linkCurso.value,
    status: statusCurso.value
  };

  cursos.push(novoCurso);
  salvarCursos();
  renderizarCursos();
  nomeCurso.value = "";
  categoriaCurso.value = "";
  linkCurso.value = "";
  statusCurso.value = "nao-iniciado";
});

// Salvar no localStorage
function salvarCursos(){
  localStorage.setItem("cursos", JSON.stringify(cursos));
}

// Renderizar cursos
function renderizarCursos(){
  listaCursos.innerHTML = "";
  filtroCategoria.innerHTML = '<option value="todas">Todas categorias</option>';

  const categorias = [...new Set(cursos.map(c => c.categoria))];
  categorias.forEach(cat => {
    filtroCategoria.innerHTML += `<option value="${cat}">${cat}</option>`;
  });

  let filtrados = cursos.filter(c => {
    return (filtroCategoria.value === "todas" || c.categoria === filtroCategoria.value) &&
           (filtroStatus.value === "todos" || c.status === filtroStatus.value);
  });

  filtrados.forEach((c, index) => {
    let li = document.createElement("li");
    li.classList.add("card");
    li.innerHTML = `
      <div>
        <h3>${c.nome}</h3>
        <p><strong>Categoria:</strong> ${c.categoria}</p>
        <p><strong>Status:</strong> ${c.status}</p>
        ${c.link ? `<p><a href="${c.link}" target="_blank">🔗 Acessar</a></p>` : ''}
      </div>
      <div>
        <button class="editar" onclick="editarCurso(${index})">✏️ Editar</button>
        <button class="remover" onclick="removerCurso(${index})">🗑️ Remover</button>
      </div>
    `;
    listaCursos.appendChild(li);
  });

  atualizarProgresso();
}

// Editar curso
function editarCurso(index){
  const c = cursos[index];
  nomeCurso.value = c.nome;
  categoriaCurso.value = c.categoria === "Sem categoria" ? "" : c.categoria;
  linkCurso.value = c.link;
  statusCurso.value = c.status;

  cursos.splice(index,1);
  salvarCursos();
  renderizarCursos();
}

// Remover curso
function removerCurso(index){
  cursos.splice(index,1);
  salvarCursos();
  renderizarCursos();
}

// Filtros
filtroCategoria.addEventListener("change", renderizarCursos);
filtroStatus.addEventListener("change", renderizarCursos);

// Progresso
function atualizarProgresso(){
  const total = cursos.length;
  const concluido = cursos.filter(c => c.status === "concluido").length;
  const perc = total ? Math.round((concluido/total)*100) : 0;
  progresso.value = perc;
  progressoTexto.textContent = `${perc}% concluído`;
}

// Inicializa
renderizarCursos();
