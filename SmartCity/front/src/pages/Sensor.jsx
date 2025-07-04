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

export function Sensores() {
    const [dados, setDados] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [modalAdd, setModalAdd] = useState(false);
    const [modalFilter, setModalFilter] = useState(false);
    const [modalDeleteEdit, setModalDeleteEdit] = useState(false);
    const [sensorSelecionado, setSensorSelecionado] = useState(null);

    const token = localStorage.getItem('token');

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

    const sensoresFiltrados = dados.filter((sensor) =>
        sensor.sensor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sensor.mac_address.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
        {/* Gráfico - Removido padding esquerdo e ajustado width */}
        <div className="z-10 flex items-center justify-center !mt-30 !mb-4 w-full max-w-[1160px]">
            <GraficoQnt total={dados.length} max={2000} title="Sensores Cadastrados" />
        </div>

        {/* Barra de ações - Centralizada com width limitado */}
        <div className="flex items-center justify-between w-full max-w-[1100px] !mb-5">
            <div className="flex gap-3">
                <img 
                    src={add} 
                    alt="Ícone para criar novo Sensor"
                    className="bg-white shadow-md rounded !p-1 lg:!p-2 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => setModalAdd(true)} 
                />
                <img 
                    src={filter} 
                    alt="Ícone para filtrar Sensores"
                    className="bg-white shadow-md rounded !p-1 lg:!p-2 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => setModalFilter(true)} 
                />
            </div>

            <div className="flex items-center bg-white shadow-md rounded w-[67%] sm:w-[60%] lg:w-[65%] h-12 lg:h-14">
                <img src={search} alt="Ícone da barra de pesquisa" className="w-5 h-5 !ml-5" />
                <input
                    type="text" 
                    placeholder="Buscar..." 
                    className="!ml-2 w-full outline-none text-sm"
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {/* Grid de sensores - Removido padding esquerdo */}
        <div className="grid place-items-center grid-cols-1 lg:grid-cols-2 gap-3 w-full max-w-[1100px]">
            <ModalAdd
                isOpen={modalAdd}
                onClose={() => setModalAdd(false)}
                titulo="Sensores"
                url="sensores"
                campos={["sensor", "mac_address", "unidade_medida", "latitude", "longitude", "status"]}
            />
            <ModalFilter
                isOpen={modalFilter}
                onClose={() => setModalFilter(false)}
                url="sensores"
                campos={["id", "sensor", "mac_address", "unidade_medida", "latitude", "longitude", "status"]}
            />

            {sensoresFiltrados.map((sensor) => (
                <div
                    key={sensor.id}
                    className="flex justify-between items-center bg-white shadow-md rounded !p-3 w-full hover:shadow-lg transition-all"
                >
                    <div>
                        <p className="text-sm text-[#226D13]">{getDisplayName(sensor.sensor)}</p>
                        <p className="text-lg font-semibold text-[#226D13]">#{sensor.mac_address}</p>
                    </div>

                    <img 
                        src={menu} 
                        alt="Menu"
                        onClick={() => { setSensorSelecionado(sensor); setModalDeleteEdit(true); }}
                        className="cursor-pointer w-[35px] h-auto" 
                    />
                </div>
            ))}

            <ModalEditDel
                isOpen={modalDeleteEdit}
                onClose={() => setModalDeleteEdit(false)}
                url="sensores"
                dados={sensorSelecionado}
                camposUpdate={["sensor", "mac_address", "unidade_medida", "latitude", "longitude", "status"]}
            />
        </div>
    </div>
);
}
