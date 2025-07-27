import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/scss/_03-Componentes/_Ranking.scss';

const Ranking = () => {
  // ==============================================
  // SECCIÓN 1: ESTADOS Y DATOS
  // ==============================================
  
  // 1.1 Estado del ranking
  const [ranking, setRanking] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 1.2 Tipos de ranking disponibles
  const [tipoRanking, setTipoRanking] = useState('general');
  const [filtroNombre, setFiltroNombre] = useState('');

  // ==============================================
  // SECCIÓN 2: EFECTOS SECUNDARIOS
  // ==============================================
  
  // 2.1 Cargar datos del ranking al montar el componente
  useEffect(() => {
    try {
      const datosRanking = JSON.parse(localStorage.getItem('ranking')) || [];
      setRanking(datosRanking);
      setIsLoading(false);
    } catch (err) {
      setError('Error al cargar el ranking');
      setIsLoading(false);
      console.error('Error loading ranking:', err);
    }
  }, []);

  // ==============================================
  // SECCIÓN 3: FUNCIONES DE MANEJO
  // ==============================================
  
  // 3.1 Filtrar ranking según tipo seleccionado
  const filtrarRanking = () => {
    let rankingFiltrado = [...ranking];
    
    // Aplicar filtro por tipo
    switch(tipoRanking) {
      case 'ganadores':
        rankingFiltrado = rankingFiltrado.filter(jugador => jugador.victoria);
        break;
      case 'semana':
        const unaSemanaAtras = new Date();
        unaSemanaAtras.setDate(unaSemanaAtras.getDate() - 7);
        rankingFiltrado = rankingFiltrado.filter(jugador => {
          const fechaJugador = new Date(jugador.fecha);
          return fechaJugador >= unaSemanaAtras;
        });
        break;
      case 'nombre':
        if (filtroNombre.trim()) {
          rankingFiltrado = rankingFiltrado.filter(jugador => 
            jugador.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
          );
        }
        break;
      default:
        // 'general' - no se aplica filtro adicional
        break;
    }
    
    // Ordenar por puntos (mayor a menor)
    return rankingFiltrado.sort((a, b) => b.puntos - a.puntos);
  };

  // 3.2 Formatear fecha para mostrar
  const formatearFecha = (fechaStr) => {
    const opciones = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(fechaStr).toLocaleDateString('es-ES', opciones);
  };

  // 3.3 Reiniciar filtros
  const reiniciarFiltros = () => {
    setTipoRanking('general');
    setFiltroNombre('');
  };

  // ==============================================
  // SECCIÓN 4: RENDERIZADO DEL COMPONENTE
  // ==============================================
  
  // 4.1 Mostrar estado de carga
  if (isLoading) {
    return (
      <div className="ranking-container">
        <div className="cargando">
          <div className="spinner"></div>
          <p>Cargando ranking...</p>
        </div>
      </div>
    );
  }

  // 4.2 Mostrar error si ocurrió
  if (error) {
    return (
      <div className="ranking-container">
        <div className="error-ranking">
          <p>⚠️ {error}</p>
          <button onClick={() => window.location.reload()} className="btn-reintentar">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // 4.3 Obtener ranking filtrado
  const rankingFiltrado = filtrarRanking();

  return (
    <div className="ranking-container">
      {/* 4.4 Encabezado del ranking */}
      <header className="ranking-header">
        <h1>🏆 Ranking de Jugadores</h1>
        <Link to="/casino/conocimiento" className="btn-volver">
          Volver al Juego
        </Link>
      </header>
      
      {/* 4.5 Controles de filtrado */}
      <div className="controles-filtro">
        <div className="filtros">
          <label>
            <input 
              type="radio" 
              name="tipoRanking" 
              checked={tipoRanking === 'general'} 
              onChange={() => setTipoRanking('general')}
            />
            General
          </label>
          
          <label>
            <input 
              type="radio" 
              name="tipoRanking" 
              checked={tipoRanking === 'ganadores'} 
              onChange={() => setTipoRanking('ganadores')}
            />
            Solo Ganadores
          </label>
          
          <label>
            <input 
              type="radio" 
              name="tipoRanking" 
              checked={tipoRanking === 'semana'} 
              onChange={() => setTipoRanking('semana')}
            />
            Última Semana
          </label>
          
          <label>
            <input 
              type="radio" 
              name="tipoRanking" 
              checked={tipoRanking === 'nombre'} 
              onChange={() => setTipoRanking('nombre')}
            />
            Buscar por Nombre:
          </label>
          
          {tipoRanking === 'nombre' && (
            <input
              type="text"
              placeholder="Ingresa nombre..."
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
              className="input-buscar"
            />
          )}
          
          <button onClick={reiniciarFiltros} className="btn-reiniciar">
            Reiniciar Filtros
          </button>
        </div>
      </div>
      
      {/* 4.6 Lista de ranking */}
      <div className="ranking-list">
        {rankingFiltrado.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Posición</th>
                <th>Nombre</th>
                <th>Puntos</th>
                <th>Escalones</th>
                <th>Resultado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {rankingFiltrado.map((jugador, index) => (
                <tr key={index} className={jugador.victoria ? 'ganador' : ''}>
                  <td>{index + 1}</td>
                  <td>{jugador.nombre}</td>
                  <td>{jugador.puntos}</td>
                  <td>{jugador.escalones}/8</td>
                  <td>
                    {jugador.victoria ? (
                      <span className="resultado-ganador">Ganador 🏆</span>
                    ) : (
                      <span className="resultado-perdedor">Perdió</span>
                    )}
                  </td>
                  <td>{formatearFecha(jugador.fecha)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="sin-resultados">
            <p>No hay resultados que coincidan con los filtros seleccionados.</p>
            <button onClick={reiniciarFiltros} className="btn-reiniciar">
              Mostrar Ranking Completo
            </button>
          </div>
        )}
      </div>
      
      {/* 4.7 Estadísticas resumen */}
      <div className="estadisticas-resumen">
        <div className="estadistica">
          <span className="valor">{ranking.length}</span>
          <span className="label">Partidas Jugadas</span>
        </div>
        <div className="estadistica">
          <span className="valor">
            {ranking.filter(j => j.victoria).length}
          </span>
          <span className="label">Victorias</span>
        </div>
        <div className="estadistica">
          <span className="valor">
            {ranking.length > 0 ? 
              Math.round(ranking.reduce((sum, j) => sum + j.puntos, 0) / ranking.length) : 0
            }
          </span>
          <span className="label">Puntos Promedio</span>
        </div>
      </div>
    </div>
  );
};

export default Ranking;