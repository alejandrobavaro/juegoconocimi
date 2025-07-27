// Importación de React
import React from "react";
// Importación del componente del juego
import Juego8Escalones from "./Juego8Escalones";
// Importación de estilos específicos
import "../assets/scss/_03-Componentes/_MainContent.scss";

// Componente contenedor principal
function MainContent({ children }) {
  return (
    // Contenedor principal con clase para estilos
    <main className="mainContent">
      {/* Contenedor interno para alineación y márgenes */}
      <div className="content-container">
        {/* Sección del juego - Incorporación directa del componente */}
        <section className="gameSection">
          <Juego8Escalones />
        </section>
        
     
      </div>
    </main>
  );
}

export default MainContent;