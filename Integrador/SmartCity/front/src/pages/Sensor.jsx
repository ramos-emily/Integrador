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

export function Sensores() {
    // Estados principais para dados, controle de modais, filtro e seleção de sensor
    const [dados, setDados] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [modalAdd, setModalAdd] = useState(false);
    const [modalFilter, setModalFilter] = useState(false);
    const [modalDeleteEdit, setModalDeleteEdit] = useState(false);
    const [sensorSelecionado, setSensorSelecionado] = useState(null);

    const token = localStorage.getItem('token'); // Token para autenticação

    // Efeito para buscar dados dos sensores ao montar o componente e quando o token muda
    useEffect(() => {
        if (!token) return;

        const fetchData = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/sensores/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDados(response.data);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };
        fetchData();
    }, [token]);

    // Filtra os sensores de acordo com o termo de busca nos campos sensor e mac_address
    const sensoresFiltrados = dados.filter((sensor) =>
        sensor.sensor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sensor.mac_address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Função para exibir nome amigável do tipo do sensor
    const getDisplayName = (sensorType) => {
        switch(sensorType) {
            case 'contador':
                return 'Contador de Pessoas';
            case 'temperatura':
                return 'Sensor de Temperatura';
            case 'umidade':
                return 'Sensor de Umidade';
            case 'luminosidade':
                return 'Sensor de Luminosidade';
            default:
                return sensorType;
        }
    };

    return (
        <div className="flex flex-col items-center bg-[#faf9f9] min-h-screen w-full px-4 sm:px-6">

            {/* Cabeçalho com gráfico e botão de exportar Excel */}
            <header className="z-10 flex items-center justify-between !mt-30 !mb-4 w-full max-w-[1160px]">
                <GraficoQnt total={dados.length} max={2000} title="Sensores Cadastrados" />

                {/* Botão para exportar os dados dos sensores em Excel */}
                <button
                    onClick={async () => {
                        try {
                            const token = localStorage.getItem('token');
                            const response = await fetch("http://127.0.0.1:8000/exportar-sensores/", {
                                method: "GET",
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            });

                            if (!response.ok) {
                                throw new Error("Erro ao exportar dados.");
                            }

                            const blob = await response.blob();
                            const url = window.URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', 'sensores.xlsx');
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                            window.URL.revokeObjectURL(url);
                        } catch (error) {
                            console.error("Erro ao exportar Excel:", error);
                            alert("Erro ao exportar Excel. Verifique sua autenticação.");
                        }
                    }}
                    className="bg-white shadow-md rounded px-10 py-2 text-sm text-[#226D13] hover:shadow-lg transition-all"
                >
                    Exportar Excel
                </button>
            </header>

            {/* Barra de ações com botões para adicionar e filtrar sensores */}
            <section className="flex items-center justify-center w-full max-w-[1100px] !mb-5">
                <div className="flex gap-3">
                    <button 
                        onClick={() => setModalAdd(true)}
                        className="bg-white shadow-md rounded lg:!p-2 hover:shadow-lg transition-all cursor-pointer"
                    >
                        <img 
                            src={add} 
                            alt="Ícone para criar novo Sensor"
                            className="w-6 h-6"
                        />
                    </button>
                    <button
                        onClick={() => setModalFilter(true)}
                        className="bg-white shadow-md rounded lg:!p-2 hover:shadow-lg transition-all cursor-pointer"
                    >
                        <img 
                            src={filter} 
                            alt="Ícone para filtrar Sensores"
                            className="w-6 h-6"
                        />
                    </button>
                </div>
            </section>

            {/* Grid de sensores exibidos na tela, com opções de editar/excluir */}
            <section className="grid place-items-center grid-cols-1 lg:grid-cols-2 gap-3 w-full max-w-[1100px]">
                {/* Modal para adicionar sensor */}
                <ModalAdd
                    isOpen={modalAdd}
                    onClose={() => setModalAdd(false)}
                    titulo="Sensores"
                    url="sensores"
                    campos={["sensor", "mac_address", "unidade_medida", "latitude", "longitude", "status"]}
                />
                {/* Modal para filtro avançado */}
                <ModalFilter
                    isOpen={modalFilter}
                    onClose={() => setModalFilter(false)}
                    url="sensores"
                    campos={["id", "sensor", "mac_address", "unidade_medida", "latitude", "longitude", "status"]}
                    setDados={setDados} 
                />

                {/* Lista os sensores filtrados com botão para abrir menu de edição/exclusão */}
                {sensoresFiltrados.map((sensor) => (
                    <article
                        key={sensor.id}
                        className="flex justify-between items-center bg-white shadow-md rounded !p-3 w-full hover:shadow-lg transition-all"
                    >
                        <div>
                            <h2 className="text-sm text-[#226D13]">{getDisplayName(sensor.sensor)}</h2>
                            <p className="text-lg font-semibold text-[#226D13]">#{sensor.mac_address}</p>
                        </div>

                        <button
                            onClick={() => { setSensorSelecionado(sensor); setModalDeleteEdit(true); }}
                            className="cursor-pointer"
                        >
                            <img 
                                src={menu} 
                                alt="Menu de opções do sensor"
                                className="w-[35px] h-auto" 
                            />
                        </button>
                    </article>
                ))}

                {/* Modal para editar ou deletar sensor selecionado */}
                <ModalEditDel
                    isOpen={modalDeleteEdit}
                    onClose={() => setModalDeleteEdit(false)}
                    url="sensores"
                    dados={sensorSelecionado}
                    camposUpdate={["sensor", "mac_address", "unidade_medida", "latitude", "longitude", "status"]}
                />
            </section>
        </div>
    );
}
