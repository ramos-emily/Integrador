import { Link } from "react-router-dom";
import React from "react";

import home from "../assets/home.svg";
import history from "../assets/history.svg";
import location from "../assets/location.svg";
import logout from "../assets/logout.svg";
import sensors from "../assets/sensors.svg";

export function Navbar() {
  let linkNav = [
    {
      img: home,
      link: "/home",
      altImg: "Icone para localizar a página Home",
      titulo: "Home"
    },
    {
      img: location,
      link: "/ambiente",
      altImg: "Icone para localizar a página de Ambientes",
      titulo: "Ambientes"
    },
    {
      img: sensors,
      link: "/sensores",
      altImg: "Icone para localizar a página de Sensores",
      titulo: "Sensores"
    },
    {
      img: history,
      link: "/historico",
      altImg: "Icone para localizar a página de Histórico",
      titulo: "Histórico"
    }
  ];

  return (
    <nav className="text-[#226D13] bg-white shadow-bottom w-full fixed top-0 z-10 h-20">
  <div className="container mx-auto flex items-center h-full px-8">
    {/* Título alinhado à esquerda (não muda) */}
    <div className="text-2xl font-bold mr-auto">Smart City</div> {/* mr-auto empurra o resto para a direita */}
    
    {/* Conteúdo alinhado à direita */}
    <div className="flex justify-end flex-1"> {/* flex-1 + justify-end alinha tudo à direita */}
      <ul className="flex gap-6 items-center h-full">
        {linkNav.map((navRender, index) => (
          <Link key={index} to={navRender.link}>
            <li className="flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-all px-4 py-2 rounded-md cursor-pointer h-full">
              <img src={navRender.img} alt={navRender.altImg} className="w-6 h-6"/>
              <p className="text-[17px] font-medium">{navRender.titulo}</p>
            </li>
          </Link>
        ))}

        <Link to="/" onClick={() => localStorage.removeItem("token")}>
          <li className="flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-all px-4 py-2 rounded-md cursor-pointer">
            <img src={logout} alt="Icone para localizar a saída da plataforma" className="w-6 h-6"/>
            <p className="text-[17px] font-medium">Sair</p>
          </li>
        </Link>
      </ul>
    </div>
  </div>
</nav>
  );
}