import React, { useState, useEffect } from "react";
import axios from "axios";
import { ModalAdd } from "../components/modalAdd";
import { ModalEditDel } from "../components/modalEditDel";
import { ModalFilter } from "../components/modalFilter";
import { GraficoQnt } from "../components/graficoQnt";
import menu from "../assets/settings.svg";
import add from "../assets/add.svg";
import filter from "../assets/filter.svg";

export function Historico() {
  // ----------- Estados do componente -----------
  // Armazena os dados dos históricos, texto para busca e estados dos modais
  const [dados, setDados] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalAdd, setModalAdd] = useState(false);
  const [modalFilter, setModalFilter] = useState(false);
  const [modalDeleteEdit, setModalDeleteEdit] = useState(false);
  const [historicoSelecionado, setHistoricoSelecionado] = useState(null);

  // ----------- Token de autenticação -----------
  // Pega o token salvo no localStorage para usar nas requisições autenticadas
  const token = localStorage.getItem("token");

  // ----------- Efeito para carregar dados da API -----------
  // Ao montar o componente ou quando o token mudar, busca os históricos da API
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/historicos/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDados(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    fetchData();
  }, [token]);

  // ----------- Filtragem dos históricos com base no texto digitado -----------
  // Aqui faço um filtro nos dados para mostrar só os históricos que batem com o texto
  const historicosFiltrados = dados.filter(
    (historico) =>
      String(historico.valor).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(historico.id).includes(searchTerm) ||
      String(historico.sensor_id).includes(searchTerm) ||
      String(historico.ambiente_id).includes(searchTerm) ||
      String(historico.timestamp).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ----------- JSX: Estrutura visual da página -----------
  // Contém:
  // - Cabeçalho com gráfico mostrando quantidade total de históricos
  // - Barra com botões para abrir modais de adicionar e filtrar
  // - Grid listando os históricos filtrados com botão para abrir modal de editar/deletar
  // - Inclusão dos modais para add, filter e edit/delete
  return (
    <main
      className="flex flex-col items-center bg-[#faf9f9] min-h-screen w-full px-4 sm:px-6"
      aria-label="Página de histórico de sensores"
    >
      {/* Cabeçalho com gráfico */}
      <header className="z-10 flex items-center justify-center !mt-30 !mb-4 w-full max-w-[1160px]">
        <GraficoQnt total={dados.length} max={200} title="Históricos Cadastrados" />
      </header>

      {/* Barra de ações */}
      <section
        aria-labelledby="acoes-header"
        className="flex items-center justify-center w-full max-w-[1100px] !mb-5"
      >
        <h2 id="acoes-header" className="sr-only">
          Ações disponíveis
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setModalAdd(true)}
            className="bg-white shadow-md rounded lg:!p-2 hover:shadow-lg transition-all cursor-pointer"
            aria-label="Criar novo histórico"
          >
            <img src={add} alt="Ícone de adição - Criar novo registro" className="w-6 h-6" />
          </button>
          <button
            onClick={() => setModalFilter(true)}
            className="bg-white shadow-md rounded lg:!p-2 hover:shadow-lg transition-all cursor-pointer"
            aria-label="Abrir filtros de pesquisa"
          >
            <img src={filter} alt="Ícone de filtro - Filtrar registros" className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Grid de históricos */}
      <section
        aria-labelledby="historicos-header"
        className="grid place-items-center grid-cols-1 lg:grid-cols-2 gap-3 w-full max-w-[1100px]"
      >
        <h2 id="historicos-header" className="sr-only">
          Lista de históricos registrados
        </h2>

        {/* Modal para adicionar histórico */}
        <ModalAdd
          isOpen={modalAdd}
          onClose={() => setModalAdd(false)}
          titulo="Histórico"
          url="historico"
          campos={["ambiente_id", "sensor_id", "timestamp", "valor"]}
        />

        {/* Modal para filtrar históricos */}
        <ModalFilter
          isOpen={modalFilter}
          onClose={() => setModalFilter(false)}
          url="historico"
          campos={["id", "ambiente_id", "sensor_id", "timestamp", "valor"]}
          setDados={setDados}
        />

        {/* Lista dos históricos filtrados */}
        {historicosFiltrados.map((historico) => (
          <article
            key={historico.id}
            className="flex justify-between items-center bg-white shadow-md rounded !p-3 w-full hover:shadow-lg transition-all"
            aria-labelledby={`historico-${historico.id}-header`}
          >
            <div>
              <h3 id={`historico-${historico.id}-header`} className="text-sm text-[#226D13]">
                ID #{historico.id}
              </h3>
              <p className="text-lg font-semibold text-[#226D13]">Valor: {historico.valor}</p>
              <p className="sr-only">
                Sensor ID: {historico.sensor_id}, Ambiente ID: {historico.ambiente_id}, Timestamp:{" "}
                {historico.timestamp}
              </p>
            </div>

            {/* Botão para abrir modal de editar/deletar */}
            <button
              onClick={() => {
                setHistoricoSelecionado(historico);
                setModalDeleteEdit(true);
              }}
              className="cursor-pointer"
              aria-label={`Opções para o histórico ID ${historico.id}`}
              aria-haspopup="dialog"
            >
              <img src={menu} alt="Ícone de menu - Abrir opções" className="w-[35px] h-auto" />
            </button>
          </article>
        ))}

        {/* Modal para editar/deletar histórico selecionado */}
        <ModalEditDel
          isOpen={modalDeleteEdit}
          onClose={() => setModalDeleteEdit(false)}
          url="hist"
          dados={historicoSelecionado}
          camposUpdate={["ambiente_id", "sensor_id", "timestamp", "valor"]}
        />
      </section>
    </main>
  );
}
