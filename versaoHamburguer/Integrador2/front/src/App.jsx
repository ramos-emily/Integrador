import { Routes, Route, useLocation } from 'react-router-dom'
import { Navbar } from './components/Navbar'

import { Login } from './pages/login'
import { Cadastro } from './pages/cadastro'

import { Ambiente } from './pages/ambiente'
import { Home } from './pages/home'
import { Sensores } from './pages/sensores'
import { Historico } from './pages/historico'

import './App.css'

export default function App() {
  const location = useLocation()

  const hideNavbarRoutes = ["/", "/cadastro"] 
  const hideNavbar = hideNavbarRoutes.includes(location.pathname)

  return (
    <>

      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/ambiente" element={<Ambiente />} />
        <Route path="/sensores" element={<Sensores />} />
        <Route path="/historico" element={<Historico />} />

        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </>
  )
}
