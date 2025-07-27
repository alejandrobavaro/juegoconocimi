// Importaciones de React
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Importaciones de estilos
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/scss/_01-General/_App.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Importaciones de componentes
import Header from "./componentes/Header";
import MainContent from "./componentes/MainContent";
import MainPublicidadSlider from "./componentes/MainPublicidadSlider";
import Footer from "./componentes/Footer";
import ContactoLogoRedes from "./componentes/ContactoLogoRedes";
import Juego8Escalones from "./componentes/Juego8Escalones";
import Ranking from "./componentes/Ranking"; // Nuevo componente importado

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Header />
        
        <div className="main-content">
          <div className="content-container centered">
            <Routes>
              <Route path="/" element={<MainContent />} />
              <Route path="/contacto" element={<ContactoLogoRedes />} />
              <Route path="/casino/conocimiento" element={<Juego8Escalones />} />
              <Route path="/ranking" element={<Ranking />} /> {/* Nueva ruta */}
            </Routes>
          </div>
        </div>
        
        <MainPublicidadSlider />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;