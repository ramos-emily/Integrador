import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import axios from "axios";
import { ModalFilter } from "../components/modalFilter";

// Aqui eu estou registrando os elementos do gráfico que vou utilizar, como linhas, pontos, escalas e legendas.
// Isso é necessário para o Chart.js funcionar corretamente com o gráfico de linha que eu uso no projeto.
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Esse é o componente principal da página, onde eu renderizo o dashboard.
export const Home = () => {
  // Aqui eu defino os estados que vou usar no componente: os dados recebidos da API, o ID do sensor digitado,
  // o ID aplicado no filtro, um booleano para loading e outro para controle do modal (ainda não implementado).
  const [dados, setDados] = useState([]);
  const [sensorIdInput, setSensorIdInput] = useState("");
  const [sensorIdFiltro, setSensorIdFiltro] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const url = "historico";

  // Essa função é responsável por buscar os dados do sensor na API.
  // Eu só faço a requisição se tiver algum ID digitado.
  // Uso o token do localStorage e passo o ID como parâmetro na URL da requisição.
  // Depois salvo os dados no estado e também atualizo o ID que foi usado no filtro.
  const fetchDados = () => {
    if (!sensorIdInput) return;
    setLoading(true);
    const token = localStorage.getItem("token");
    const filtro = `?sensor=${sensorIdInput}`;

    axios
      .get(`http://127.0.0.1:8000/${url}/search/${filtro}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setDados(res.data);
        setSensorIdFiltro(sensorIdInput);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar dados:", err);
        setDados([]);
        setLoading(false);
      });
  };

  // Aqui eu estou preparando os dados para o gráfico:
  // pego os timestamps e valores de cada item retornado e monto os arrays para o eixo X e Y.
  const labels = dados.map((item) => item.timestamp || "");
  const valores = dados.map((item) => Number(item.valor || 0));

  // Esse objeto `data` define como os dados vão aparecer no gráfico.
  // Eu coloco os rótulos, os valores e configuro as cores e o preenchimento da linha.
  const data = {
    labels,
    datasets: [
      {
        label: `Valor por Timestamp (Sensor ${sensorIdFiltro})`,
        data: valores,
        borderColor: "rgb(18, 85, 85)",
        backgroundColor: "rgba(13, 54, 54, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Aqui defino as opções de aparência do gráfico.
  // Faço com que ele seja responsivo, mantenha a proporção e exibo o título e a legenda.
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: true, text: "Gráfico de Leitura de Sensores" },
      legend: { position: "top" },
    },
  };

  // Essa é a parte visual do componente.
  // Eu uso tags semânticas como `main`, `header` e `section` pra deixar o HTML mais acessível.
  // Primeiro, coloco o título da página. Depois, crio o formulário onde o usuário digita o ID do sensor
  // e clica em "Filtrar" para buscar os dados.
  // Por fim, mostro o gráfico com os dados que foram buscados.
  return (
    <main className="min-h-screen flex flex-col justify-center items-center p- gap-6">
      <header>
        <h2 className="text-xl font-semibold mb-4 text-center">Dashboard</h2>
      </header>

      <section>
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); fetchDados(); }}>
          <label htmlFor="sensorId" className="sr-only">ID do Sensor</label>
          <input
            id="sensorId"
            type="text"
            placeholder="Digite o ID do sensor"
            value={sensorIdInput}
            onChange={(e) => setSensorIdInput(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Carregando..." : "Filtrar"}
          </button>
        </form>
      </section>

      <section className="w-full flex justify-center">
        <div className="w-full max-w-[1200px] h-[400px]">
          <Line data={data} options={options} />
        </div>
      </section>
    </main>
  );
};
