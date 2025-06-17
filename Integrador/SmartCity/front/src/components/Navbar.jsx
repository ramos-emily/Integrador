import { Link } from "react-router-dom";
import React, { useState } from "react";
import home from "../assets/home.svg";
import history from "../assets/history.svg";
import location from "../assets/location.svg";
import logout from "../assets/logout.svg";
import sensors from "../assets/sensors.svg";
import search from "../assets/search.svg";

export function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");

  let linkNav = [
    {
      img: home,
      link: "/home",
      altImg: "Ícone para localizar a página Home",
      titulo: "Home",
    },
    {
      img: location,
      link: "/ambiente",
      altImg: "Ícone para localizar a página de Ambientes",
      titulo: "Ambientes",
    },
    {
      img: sensors,
      link: "/sensores",
      altImg: "Ícone para localizar a página de Sensores",
      titulo: "Sensores",
    },
    {
      img: history,
      link: "/historico",
      altImg: "Ícone para localizar a página de Histórico",
      titulo: "Histórico",
    },
        {
      img: history,
      link: "/map",
      altImg: "Ícone para localizar a página de Mapa",
      titulo: "Mapa",
    },
  ];

  return (
    <header className="text-[#226D13] bg-white shadow-bottom w-full fixed top-0 z-10 h-20">
      <nav className="mx-auto flex items-center justify-center h-full gap-150" aria-label="Navegação principal">
        <div className="flex items-center gap-4">
          <form className="flex items-center shadow-md rounded w-100 h-10 ml-4 bg-[#faf9f9] gap-2" role="search">
            <img
              src={search}
              alt="Ícone de pesquisa"
              className="w-4 h-4 ml-3"
            />
            <input
              type="text"
              placeholder="Buscar..."
              className="ml-2 w-full outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Campo de busca"
            />
          </form>
        </div>

        <ul className="flex gap-10 items-center" role="list">
          {linkNav.map((navRender, index) => (
            <li key={index} role="listitem">
              <Link to={navRender.link}>
                <div className="flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-all px-4 py-2 rounded-md cursor-pointer">
                  <img
                    src={navRender.img}
                    alt={navRender.altImg}
                    className="w-6 h-6"
                  />
                  <p className="text-lg font-semibold">{navRender.titulo}</p>
                </div>
              </Link>
            </li>
          ))}

          <li role="listitem">
            <Link to="/" onClick={() => localStorage.removeItem("token")}>
              <div className="flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-all px-4 py-2 rounded-md cursor-pointer">
                <img
                  src={logout}
                  alt="Ícone para sair do sistema"
                  className="w-6 h-6"
                />
                <p className="text-lg font-semibold">Sair</p>
              </div>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
