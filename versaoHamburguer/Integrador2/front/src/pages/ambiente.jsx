import React, { useState, useEffect } from "react";
import axios from 'axios';
import { ModalAdd } from "../components/modalAdd";
import { ModalEditDel } from "../components/modalEditDel";
import { ModalFilter } from "../components/modalFilter";
import { GraficoQnt } from "../components/graficoQnt";
import menu from "../assets/settings.svg"
import add from "../assets/add.svg"
import filter from "../assets/filter.svg"
import search from "../assets/search.svg"

export function Ambiente() {

    const [dados, setDados] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [modalAdd, setModalAdd] = useState(false);
    const [modalFilter, setModalFilter] = useState(false);
    const [modalDeleteEdit, setModalDeleteEdit] = useState(false);
    const [ambienteSelecionado, setAmbienteSelecionado] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) return;

        const fetchData = async () => {
            console.log("token", token);
            try {
                const response = await axios.get("http://127.0.0.1:8000/ambientes/", {
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

    const ambientesFiltrados = dados.filter((ambiente) =>
        ambiente.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col items-center justify-center bg-[#faf9f9]">

            {/* Inicio - Gráfico de Quantidade de Cadastros */}
            <div className="z-10 flex items-center justify-center !mt-5 !mb-4 w-[81%] sm:w-[86%] lg:w-[97%] xl:w-[1160px] 2xl:w-[1255px] sm:!pl-40">
                <GraficoQnt total={dados.length} max={200} title="Ambientes Cadastrados" />
            </div>
            {/* -- Fim -- */}

            {/* Inicio - Barra de criação, filtro e pesquisa de dado */}
            <div className="flex items-center justify-between w-[81%] sm:w-[60%] md:w-[65%] lg:w-[81%] xl:w-[1000px] 2xl:w-[1100px] !mb-5 sm:!ml-39">

                <div className="flex gap-3">

                    <img src={add} alt="Ícone para criar novo Ambiente"
                        className="bg-white shadow-md rounded !p-1 lg:!p-2 hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => setModalAdd(true)} />

                    <img src={filter} alt="Ícone para filtrar Ambiente"
                        className="bg-white shadow-md rounded !p-1 lg:!p-2 hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => setModalFilter(true)} />

                </div>

                <div className="flex items-center bg-white shadow-md rounded w-[67%] sm:w-[60%] lg:w-[65%] h-12 lg:h-14">
                    <img src={search} alt="Ícone da barra de pesquisa" className="w-5 h-5 !ml-5" />
                    <input
                        type="text" placeholder="Buscar..." className="!ml-2 w-full outline-none text-sm"
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

            </div>
            {/* -- Fim -- */}

            <div className="grid place-items-center grid-cols-1 lg:grid-cols-2 gap-3 w-full sm:!pl-40 lg:!pl-42">

                <ModalAdd isOpen={modalAdd} onClose={() => setModalAdd(false)} titulo="Ambientes" url="ambientes" campos={["sig", "descricao", "ni", "responsavel"]} />
                <ModalFilter isOpen={modalFilter} onClose={() => setModalFilter(false)} url="ambientes" campos={["id", "sig", "ni", "responsavel"]} />

                {/* Inicio - Renderização dos dados */}
                {ambientesFiltrados.map((ambientes) => (
                    <div
                        key={ambientes.id}
                        className="flex justify-between items-center bg-white shadow-md rounded !p-3 w-[80%] md:w-[83%] lg:w-[95%] hover:shadow-lg transition-all"
                    >
                        <div>
                            <p className="text-sm text-gray-500">SIG #{ambientes.sig}</p>
                            <p className="text-lg font-semibold text-gray-800">{ambientes.descricao}</p>
                        </div>

                        <img src={menu} alt="Menu"
                            onClick={() => { setAmbienteSelecionado(ambientes); setModalDeleteEdit(true); }}
                            className="cursor-pointer w-[35px] h-auto" />

                    </div>
                ))}
                {/* -- Fim -- */}

                <ModalEditDel isOpen={modalDeleteEdit} onClose={() => setModalDeleteEdit(false)} url="ambi" dados={ambienteSelecionado} camposUpdate={["sig", "descricao", "ni", "responsavel"]} />
            </div>
        </div>
    );
}
