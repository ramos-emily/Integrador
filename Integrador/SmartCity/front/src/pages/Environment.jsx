import React, { useState, useEffect } from "react";
import axios from 'axios';
import { ModalAdd } from "../components/modalAdd";
import { ModalEditDel } from "../components/modalEditDel";
import { ModalFilter } from "../components/modalFilter";
import { GraficoQnt } from "../components/graficoQnt";
import menu from "../assets/settings.svg";
import add from "../assets/add.svg";
import filter from "../assets/filter.svg";
import search from "../assets/search.svg";

export function Ambiente() {
    // ------------------------ Estados ------------------------
    // Aqui eu crio os estados principais que vão controlar os dados dos ambientes, o texto da busca, 
    // e a abertura dos modais para adicionar, filtrar e editar/deletar
    const [dados, setDados] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [modalAdd, setModalAdd] = useState(false);
    const [modalFilter, setModalFilter] = useState(false);
    const [modalDeleteEdit, setModalDeleteEdit] = useState(false);
    const [ambienteSelecionado, setAmbienteSelecionado] = useState(null);

    // ------------------------ Token de autenticação ------------------------
    // Pego o token do localStorage para autenticar as requisições na API
    const token = localStorage.getItem('token');

    // ------------------------ Efeito para buscar dados ------------------------
    // Uso o useEffect para buscar os dados da API sempre que o token mudar
    // Faço a requisição com axios e atualizo o estado com a resposta
    useEffect(() => {
        if (!token) return;

        const fetchData = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/ambientes/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDados(response.data);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };
        fetchData();
    }, [token]);

    // ------------------------ Filtragem dos ambientes ------------------------
    // Faço o filtro dos ambientes para mostrar somente aqueles que contém o texto digitado no campo de busca
    const ambientesFiltrados = dados.filter((ambiente) =>
        ambiente.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ------------------------ JSX de renderização ------------------------
    // Aqui construo a interface, dividida em:
    // - Cabeçalho com gráfico mostrando total de ambientes
    // - Barra de ações com botões para abrir modais de adicionar e filtrar
    // - Grid que mostra os ambientes filtrados, com botão para abrir modal de editar/deletar
    // - Inclusão dos modais de adicionar, filtrar e editar/deletar
    return (
        <main className="flex flex-col items-center bg-[#faf9f9] min-h-screen w-full px-4 sm:px-6">

            {/* Cabeçalho com gráfico */}
            <header className="z-10 flex items-center justify-center !mt-30 !mb-4 w-full max-w-[1160px]">
                <GraficoQnt total={dados.length} max={200} title="Ambientes Cadastrados" />
            </header>

            {/* Barra de ações */}
            <section className="flex items-center justify-center w-full max-w-[1100px] !mb-5">
                <div className="flex gap-3">
                    <button
                        onClick={() => setModalAdd(true)}
                        className="bg-white shadow-md rounded lg:!p-2 hover:shadow-lg transition-all cursor-pointer"
                        aria-label="Criar novo ambiente"
                    >
                        <img src={add} alt="" className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => setModalFilter(true)}
                        className="bg-white shadow-md rounded lg:!p-2 hover:shadow-lg transition-all cursor-pointer"
                        aria-label="Filtrar ambientes"
                    >
                        <img src={filter} alt="" className="w-6 h-6" />
                    </button>
                </div>
            </section>

            {/* Grid com ambientes */}
            <section className="grid place-items-center grid-cols-1 lg:grid-cols-2 gap-3 w-full max-w-[1100px]">

                {/* Modal para adicionar ambiente */}
                <ModalAdd 
                    isOpen={modalAdd} 
                    onClose={() => setModalAdd(false)} 
                    titulo="Ambientes" 
                    url="ambientes" 
                    campos={["sig", "descricao", "ni", "responsavel"]} 
                />

                {/* Modal para filtrar ambientes */}
                <ModalFilter 
                    isOpen={modalFilter} 
                    onClose={() => setModalFilter(false)} 
                    url="ambientes" 
                    campos={["id", "sig", "ni", "responsavel"]} 
                    setDados={setDados} 
                />

                {/* Mapeamento dos ambientes filtrados */}
                {ambientesFiltrados.map((ambiente) => (
                    <article
                        key={ambiente.id}
                        className="flex justify-between items-center bg-white shadow-md rounded !p-3 w-full hover:shadow-lg transition-all"
                    >
                        <div>
                            <h2 className="text-sm text-[#226D13]">SIG #{ambiente.sig}</h2>
                            <p className="text-lg font-semibold text-[#226D13]">{ambiente.descricao}</p>
                        </div>

                        {/* Botão que abre modal de editar/deletar e define o ambiente selecionado */}
                        <button
                            onClick={() => { setAmbienteSelecionado(ambiente); setModalDeleteEdit(true); }}
                            className="cursor-pointer"
                            aria-label={`Opções do ambiente ${ambiente.sig}`}
                        >
                            <img src={menu} alt="" className="w-[35px] h-auto" />
                        </button>
                    </article>
                ))}

                {/* Modal para editar ou deletar o ambiente selecionado */}
                <ModalEditDel 
                    isOpen={modalDeleteEdit} 
                    onClose={() => setModalDeleteEdit(false)} 
                    url="ambi" 
                    dados={ambienteSelecionado} 
                    camposUpdate={["sig", "descricao", "ni", "responsavel"]} 
                />
            </section>
        </main>
    );
}
