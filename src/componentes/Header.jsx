// Importaciones de React
import React from 'react';
// Importación de Link para navegación
import { Link } from 'react-router-dom';
// Importación de estilos específicos del header
import '../assets/scss/_03-Componentes/_Header.scss';

const Header = () => {
  return (
    // Contenedor principal del header
    <header className="app-header">
      {/* Contenedor interno para alineación */}
      <div className="header-container">
        {/* Logo que enlaza a la página principal */}
        <Link to="/" className="logo">
          <img 
            src="/img/02-logos/logochulusgames1.png" 
            alt="8 Escalones del Conocimiento" 
            className="logo-img"
          />
        </Link>
        
        {/* Navegación principal */}
        <nav className="main-nav">
          <ul>
            {/* Enlace a inicio */}
            <li><Link to="/">Jugar</Link></li>
        
            {/* Enlace a ranking (pendiente implementación) */}
            <li><Link to="/ranking">Ranking</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;