import { Link } from "react-router-dom";
import React, { useState } from "react";

import menu from "../assets/menu.svg";
import history from "../assets/history.svg"
import home from "../assets/home.svg"
import location from "../assets/location.svg"
import logout from "../assets/logout.svg"
import sensors from "../assets/sensors.svg"

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

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
    <nav className="text-[#3473BA]">
      <div className="sm:hidden !p-4 bg-white shadow-right flex justify-between items-center">
        <div className="text-2xl font-bold">Smart City</div>
        <img
          src={menu}
          alt="Menu Hamburguer"
          onClick={toggleMenu}
          className="w-8 h-8 cursor-pointer"
        />
      </div>

      {menuOpen && (
        <ul className="z-20 absolute sm:hidden bg-white px-6 pb-4 flex flex-col gap-4 shadow-md top-16 w-full">
          <Link to="/home" onClick={() => setMenuOpen(false)}><li className="hover:shadow-lg hover:scale-105 transition-all !p-2"><p className="!ml-7 text-[18px] font-medium">Home</p></li></Link>
          <Link to="/ambiente" onClick={() => setMenuOpen(false)}><li className="hover:shadow-lg hover:scale-105 transition-all !p-2"><p className="!ml-7 text-[18px] font-medium">Ambiente</p></li></Link>
          <Link to="/sensores" onClick={() => setMenuOpen(false)}><li className="hover:shadow-lg hover:scale-105 transition-all !p-2"><p className="!ml-7 text-[18px] font-medium">Sensores</p></li></Link>
          <Link to="/historico" onClick={() => setMenuOpen(false)}><li className="hover:shadow-lg hover:scale-105 transition-all !p-2"><p className="!ml-7 text-[18px] font-medium">Historico</p></li></Link>
          <Link to="/" onClick={() => { localStorage.removeItem("token"); setMenuOpen(false) }}><li className="hover:shadow-lg hover:scale-105 transition-all !p-2"><p className="!ml-7 text-[18px] font-medium">Sair</p></li></Link>
        </ul>
      )}

      <div className="hidden sm:flex flex-col w-39 h-[100vh] bg-white shadow-right !p-4 fixed top-0">
        <div className="sm:text-[21px] md:text-[24px] font-bold sm:!mb-10">Smart City</div>
        <ul className="flex flex-col gap-5">
          {linkNav.map((navRender, index) => (
            <Link key={index} to={navRender.link}>
              <li className="flex flex-col items-center justify-center hover:shadow-lg hover:scale-105 transition-all px-4 py-2 !p-1 rounded-md cursor-pointer">
                <img src={navRender.img} alt={navRender.altImg} className="sm:w-[30px] md:w-[41px]"/>
                <p className="sm:text-[15px] md:text-[17px] !mt-0.5 font-medium">{navRender.titulo}</p>
              </li>
            </Link>
          ))}

          <Link to="/" onClick={() => { localStorage.removeItem("token"); setMenuOpen(false) }}>
            <li className="flex flex-col items-center justify-center hover:shadow-lg hover:scale-105 transition-all px-4 py-2 !p-1 rounded-md cursor-pointer">
              <img src={logout} alt="Icone para localizar a saída da plataforma" className="sm:w-[30px] md:w-[41px]"/>
              <p className="sm:text-[15px] md:text-[17px] !mt-0.5 font-medium">Sair</p>
            </li>
          </Link>
        </ul>
      </div>
    </nav>
  );
}
