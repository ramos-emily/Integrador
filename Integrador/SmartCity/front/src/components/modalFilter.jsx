import React, { useState } from "react";
import axios from "axios";
import { Home } from "../pages/Home";

export function ModalFilter({
  isOpen,
  onClose,
  url,
  campos = [],
  relacoes = {},
  onSensorSelect,
  setDados,
}) {
  if (!isOpen) return null;

  const [campoSelecionado, setCampoSelecionado] = useState("");
  const [valorFiltro, setValorFiltro] = useState("");
  const [resultados, setResultados] = useState([]);
  const [filtrado, setFiltrado] = useState(false);
  const token = localStorage.getItem("token");

  const formatDateTimeLocal = (isoString) => {
    if (!isoString) return "";
    const dt = new Date(isoString);
    const offset = dt.getTimezoneOffset();
    const localDate = new Date(dt.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  };

  const formatValue = (key, value) => {
    if (!value) return "";
    if (key === "timestamp") {
      return formatDateTimeLocal(value).replace("T", " ");
    }
    if (relacoes[key]) {
      if (typeof value === "object" && value !== null) {
        return value.nome || value.id || JSON.stringify(value);
      }
    }
    return String(value);
  };

  const handleFiltrar = async () => {
    if (!valorFiltro.trim()) return;

    try {
      const response = await axios.get(`http://127.0.0.1:8000/${url}/search/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: valorFiltro.trim() },
      });

      const termoNumerico = Number(valorFiltro.trim());
      const camposExatos = ["id", "sensor_id", "ambiente_id"];

      const filtrado = campoSelecionado
        ? response.data.filter((item) => {
            let campoValor = item[campoSelecionado];
            if (campoSelecionado === "timestamp" && campoValor) {
              campoValor = formatDateTimeLocal(campoValor);
            }
            if (
              relacoes[campoSelecionado] &&
              campoValor &&
              typeof campoValor === "object"
            ) {
              campoValor = campoValor.nome || campoValor.id || "";
            }
            if (camposExatos.includes(campoSelecionado)) {
              return Number(campoValor) === termoNumerico;
            }
            return String(campoValor ?? "")
              .toLowerCase()
              .includes(valorFiltro.toLowerCase());
          })
        : response.data;

      setResultados(filtrado);
      setFiltrado(true);

      if (setDados) {
        setDados(filtrado);
        onClose();
      }
    } catch (error) {
      console.error("Erro ao aplicar filtro:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500/30 z-50">
      <div className="bg-white rounded-lg !p-6 w-[400px] sm:w-[510px] lg:w-[640px] xl:w-[800px] overflow-y-auto shadow-lg max-h-[80vh]">
        <h2 className="text-xl font-bold !mb-2 text-gray-800">Filtro</h2>

        <div className="!mb-4">
          <label
            htmlFor="campo-select"
            className="block !mb-1 text-sm font-medium text-gray-700"
          >
            Filtrar por:
          </label>
          <select
            id="campo-select"
            value={campoSelecionado}
            onChange={(e) => setCampoSelecionado(e.target.value)}
            className="w-full px-3 py-2 rounded shadow focus:outline-none !p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Todos os campos --</option>
            {campos.map((campo) => (
              <option key={campo} value={campo}>
                {campo}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder={`Buscar por ${campoSelecionado || "qualquer campo"}`}
          className="w-full outline-none text-sm shadow !p-2 !mb-3"
          value={valorFiltro}
          onChange={(e) => setValorFiltro(e.target.value)}
          aria-label="Campo de busca"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleFiltrar();
            }
          }}
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md !p-2"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleFiltrar}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md !p-2"
          >
            Filtrar
          </button>
        </div>

        {resultados.length > 0 && (
          <>
            <h3 className="text-lg font-semibold !mb-2 text-gray-800">Resultados:</h3>
            <ul className="space-y-2 max-h-[300px] overflow-y-auto">
              {resultados.map((item, index) => (
                <li
                  key={index}
                  className="!p-2 rounded text-sm bg-gray-50 shadow !mb-1.5 cursor-pointer hover:bg-gray-100"
                  onClick={() => onSensorSelect?.(item)}
                >
                  {Object.entries(item).map(([key, value]) => (
                    <div key={key}>
                      <strong>{key}:</strong> {formatValue(key, value)}
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
