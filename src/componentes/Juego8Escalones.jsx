import React, { useState, useEffect, useCallback } from 'react';
import preguntasData from '../data/preguntas8Escalones.json';
import '../assets/scss/_03-Componentes/_Juego8Escalones.scss';

const Juego8Escalones = () => {
  // Estados del juego
  const [nombreJugador, setNombreJugador] = useState('');
  const [juegoIniciado, setJuegoIniciado] = useState(false);
  const [mostrarTutorial, setMostrarTutorial] = useState(true);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [preguntas, setPreguntas] = useState([]);
  const [escalonActual, setEscalonActual] = useState(0);
  const [preguntaActual, setPreguntaActual] = useState(null);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState('');
  const [preguntasMostradas, setPreguntasMostradas] = useState([]);
  const [puntos, setPuntos] = useState(0);
  const [puntuacionMaxima, setPuntuacionMaxima] = useState(
    parseInt(localStorage.getItem('puntuacionMaxima')) || 0
  );
  const [tiempoRestante, setTiempoRestante] = useState(30);
  const [mensaje, setMensaje] = useState('');
  const [animacionCorrecto, setAnimacionCorrecto] = useState(false);
  const [animacionIncorrecto, setAnimacionIncorrecto] = useState(false);
  const [comodinesDisponibles, setComodinesDisponibles] = useState({
    cincuentaCincuenta: 2,
    tiempoExtra: 2,
    salvarEscalon: 1
  });
  const [mostrarRanking, setMostrarRanking] = useState(false);
  const [ranking, setRanking] = useState(
    JSON.parse(localStorage.getItem('ranking')) || []
  );

  // Función para usar comodín 50/50
  const usarComodin5050 = useCallback(() => {
    if (comodinesDisponibles.cincuentaCincuenta <= 0 || !preguntaActual || respuestaSeleccionada) return;

    const opcionesIncorrectas = preguntaActual.opciones
      .filter(opcion => opcion !== preguntaActual.respuestaCorrecta)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    setPreguntaActual({
      ...preguntaActual,
      opciones: [
        preguntaActual.respuestaCorrecta,
        ...opcionesIncorrectas
      ].sort(() => Math.random() - 0.5)
    });

    setComodinesDisponibles(prev => ({
      ...prev,
      cincuentaCincuenta: prev.cincuentaCincuenta - 1
    }));
  }, [comodinesDisponibles.cincuentaCincuenta, preguntaActual, respuestaSeleccionada]);

  // Función para usar comodín tiempo extra
  const usarComodinTiempoExtra = useCallback(() => {
    if (comodinesDisponibles.tiempoExtra <= 0) return;

    setTiempoRestante(prev => prev + 15);
    setComodinesDisponibles(prev => ({
      ...prev,
      tiempoExtra: prev.tiempoExtra - 1
    }));
    setMensaje('+15 segundos añadidos');
    setTimeout(() => setMensaje(''), 1500);
  }, [comodinesDisponibles.tiempoExtra]);

  // Función para usar comodín salvar escalón
  const usarComodinSalvarEscalon = useCallback(() => {
    if (comodinesDisponibles.salvarEscalon <= 0 || !juegoTerminado) return;

    setJuegoTerminado(false);
    setTiempoRestante(30);
    setMensaje('¡Escalón salvado! Continúa jugando');
    setComodinesDisponibles(prev => ({
      ...prev,
      salvarEscalon: prev.salvarEscalon - 1
    }));
    setTimeout(() => setMensaje(''), 1500);
  }, [comodinesDisponibles.salvarEscalon, juegoTerminado]);

  // Función para avanzar al siguiente escalón
  const avanzarEscalon = useCallback(() => {
    setEscalonActual(prev => prev + 1);
    setPreguntasMostradas(prev => [...prev, preguntaActual.id]);

    const preguntaNoMostrada = preguntas.find(
      p => !preguntasMostradas.includes(p.id) && p.dificultad <= (escalonActual + 2)
    );

    setPreguntaActual(preguntaNoMostrada || preguntas[escalonActual + 1]);
    setRespuestaSeleccionada('');
    setTiempoRestante(30);
    setMensaje('');
  }, [preguntas, preguntaActual, preguntasMostradas, escalonActual]);

  // Función para finalizar el juego
  const finalizarJuego = useCallback((victoria) => {
    setJuegoTerminado(true);

    const resultado = {
      nombre: nombreJugador,
      puntos: victoria ? puntos + 100 * (escalonActual + 1) : puntos,
      fecha: new Date().toLocaleDateString(),
      escalones: escalonActual + 1,
      victoria
    };

    const nuevoRanking = [...ranking, resultado]
      .sort((a, b) => b.puntos - a.puntos)
      .slice(0, 10);

    setRanking(nuevoRanking);
    localStorage.setItem('ranking', JSON.stringify(nuevoRanking));

    if (resultado.puntos > puntuacionMaxima) {
      setPuntuacionMaxima(resultado.puntos);
      localStorage.setItem('puntuacionMaxima', resultado.puntos.toString());
    }

    setMensaje(victoria
      ? `¡Felicidades ${nombreJugador}! Has completado los 8 escalones con ${resultado.puntos} puntos.`
      : `Juego terminado en el escalón ${escalonActual + 1}. Puntos obtenidos: ${resultado.puntos}`);
  }, [nombreJugador, puntos, escalonActual, ranking, puntuacionMaxima]);

  // Función para manejar la respuesta del jugador
  const manejarRespuesta = useCallback((respuesta) => {
    const esCorrecta = respuesta === preguntaActual?.respuestaCorrecta;

    if (esCorrecta) {
      setAnimacionCorrecto(true);
      const puntosGanados = 100 * (escalonActual + 1);
      setPuntos(puntos + puntosGanados);
      setMensaje(`¡Correcto! +${puntosGanados} puntos`);

      setTimeout(() => {
        setAnimacionCorrecto(false);
        if (escalonActual < 7) {
          avanzarEscalon();
        } else {
          finalizarJuego(true);
        }
      }, 1500);
    } else {
      setAnimacionIncorrecto(true);
      setMensaje(`Incorrecto. La respuesta era: ${preguntaActual?.respuestaCorrecta}`);
      setTimeout(() => {
        setAnimacionIncorrecto(false);
        finalizarJuego(false);
      }, 2000);
    }
  }, [preguntaActual, escalonActual, puntos, avanzarEscalon, finalizarJuego]);

  // Función para reiniciar juego
  const reiniciarJuego = useCallback(() => {
    setNombreJugador('');
    setJuegoIniciado(false);
    setMostrarTutorial(true);
    setEscalonActual(0);
    setPuntos(0);
    setJuegoTerminado(false);
    setTiempoRestante(30);
    setMensaje('');
  }, []);

  // Función para iniciar juego
  const iniciarJuego = useCallback(() => {
    if (!nombreJugador.trim()) {
      setMensaje('Por favor ingresa tu nombre');
      return;
    }

    const preguntasMezcladas = [...preguntasData]
      .sort(() => Math.random() - 0.5)
      .slice(0, 8);

    setPreguntas(preguntasMezcladas);
    setPreguntaActual(preguntasMezcladas[0]);
    setJuegoIniciado(true);
    setMensaje('');
    setMostrarTutorial(false);
    setEscalonActual(0);
    setPuntos(0);
    setJuegoTerminado(false);
    setTiempoRestante(30);
    setComodinesDisponibles({
      cincuentaCincuenta: 2,
      tiempoExtra: 2,
      salvarEscalon: 1
    });
    setPreguntasMostradas([]);
  }, [nombreJugador]);

  // Efecto para cargar preguntas al montar el componente
  useEffect(() => {
    const preguntasMezcladas = [...preguntasData].sort(() => Math.random() - 0.5);
    setPreguntas(preguntasMezcladas);
  }, []);

  // Efecto para el temporizador del juego
  useEffect(() => {
    if (!juegoIniciado || juegoTerminado) return;

    const timer = setInterval(() => {
      setTiempoRestante(prev => {
        if (prev <= 1) {
          manejarRespuesta('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [juegoIniciado, juegoTerminado, manejarRespuesta]);

  // Efecto para manejar atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!juegoIniciado || juegoTerminado) return;

      if (e.key >= '1' && e.key <= '4' && !respuestaSeleccionada) {
        const index = parseInt(e.key) - 1;
        if (index < preguntaActual?.opciones.length) {
          setRespuestaSeleccionada(preguntaActual.opciones[index]);
        }
      }
      else if (e.key === 'Enter' && respuestaSeleccionada) {
        manejarRespuesta(respuestaSeleccionada);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [juegoIniciado, juegoTerminado, respuestaSeleccionada, preguntaActual, manejarRespuesta]);

  return (
    <div className={`juego-contenedor ${animacionCorrecto ? 'animacion-correcto' : ''} ${animacionIncorrecto ? 'animacion-incorrecto' : ''}`}>
      {/* Modal de Tutorial */}
      {mostrarTutorial && (
        <div className="tutorial-modal">
          <div className="modal-contenido">
            <h2>📚 Cómo Jugar a los 8 Escalones</h2>
            <div className="tutorial-pasos">
              {[1, 2, 3, 4, 5].map((paso) => (
                <div key={`paso-${paso}`} className="paso">
                  <div className="paso-numero">{paso}</div>
                  <p>
                    {paso === 1 && "Responde preguntas de 8 categorías diferentes"}
                    {paso === 2 && "Cada escalón tiene mayor dificultad y vale más puntos"}
                    {paso === 3 && "Tienes 30 segundos por pregunta"}
                    {paso === 4 && "Usa los comodines estratégicamente"}
                    {paso === 5 && "Una respuesta incorrecta termina el juego"}
                  </p>
                </div>
              ))}
            </div>
            <div className="comodines-tutorial">
              <h3>Comodines Disponibles:</h3>
              {[
                { icono: "50/50", texto: "Elimina 2 respuestas incorrectas (2 usos)" },
                { icono: "⏱️+15s", texto: "Añade 15 segundos al temporizador (2 usos)" },
                { icono: "🛡️", texto: "Salva el escalón al fallar (1 uso)" }
              ].map((comodin, idx) => (
                <div key={`comodin-${idx}`} className="comodin-item">
                  <span className="comodin-icono">{comodin.icono}</span>
                  <p>{comodin.texto}</p>
                </div>
              ))}
            </div>
            <div className="atajos-teclado">
              <h3>Atajos de teclado:</h3>
              {[
                { tecla: "1-4", accion: "Seleccionar respuesta" },
                { tecla: "Enter", accion: "Confirmar respuesta" },
                { tecla: "5", accion: "Usar 50/50" },
                { tecla: "6", accion: "Usar tiempo extra" }
              ].map((atajo, idx) => (
                <p key={`atajo-${idx}`}><strong>{atajo.tecla}:</strong> {atajo.accion}</p>
              ))}
            </div>
            <button
              className="btn-empezar"
              onClick={() => setMostrarTutorial(false)}
            >
              ¡Entendido, quiero jugar!
            </button>
          </div>
        </div>
      )}

      {/* Modal de Ranking */}
      {mostrarRanking && (
        <div className="ranking-modal">
          <div className="modal-contenido">
            <h2>🏆 Mejores Puntuaciones</h2>
            <div className="ranking-list">
              {ranking.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Posición</th>
                      <th>Nombre</th>
                      <th>Puntos</th>
                      <th>Escalones</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranking.map((jugador, index) => (
                      <tr key={`jugador-${index}`} className={jugador.victoria ? 'ganador' : ''}>
                        <td>{index + 1}</td>
                        <td>{jugador.nombre}</td>
                        <td>{jugador.puntos}</td>
                        <td>{jugador.escalones}/8</td>
                        <td>{jugador.fecha}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No hay puntuaciones registradas aún</p>
              )}
            </div>
            <div className="puntuacion-maxima">
              <h3>Récord Actual: {puntuacionMaxima} puntos</h3>
            </div>
            <button
              className="btn-cerrar"
              onClick={() => setMostrarRanking(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Pantalla Principal */}
      {!juegoIniciado ? (
        <div className="pantalla-inicio">
          <h2 className="titulo-juego">
            <span className="numero">8</span> Escalones del Conocimiento
          </h2>
          <div className="input-container">
            <input
              type="text"
              placeholder="Tu nombre"
              value={nombreJugador}
              onChange={(e) => setNombreJugador(e.target.value)}
              className="input-nombre"
              maxLength="20"
            />
            <div className="botones-inicio">
              <button
                className="btn-tutorial"
                onClick={() => setMostrarTutorial(true)}
              >
                ¿Cómo se juega?
              </button>
              <button
                className="btn-ranking"
                onClick={() => setMostrarRanking(true)}
              >
                Ver Ranking
              </button>
            </div>
          </div>
          <button
            className="btn-comenzar"
            onClick={iniciarJuego}
            disabled={!nombreJugador.trim()}
          >
            Comenzar Juego
          </button>
          {mensaje && <p className="mensaje-error">{mensaje}</p>}
        </div>
      ) : (
        <div className="pantalla-juego">
          {!juegoTerminado ? (
            <>
              <div className="barra-superior">
                <div className="jugador-info">
                  <span className="nombre">{nombreJugador}</span>
                  <span className="puntos">Puntos: {puntos}</span>
                </div>
                <div className="escalones-progreso">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={`escalon-${i}`}
                      className={`escalon ${i < escalonActual ? 'completado' : ''} ${i === escalonActual ? 'actual' : ''}`}
                    >
                      {i+1}
                    </div>
                  ))}
                </div>
              </div>
              <div className="comodines-container">
                {[
                  {
                    tipo: 'cincuentaCincuenta',
                    texto: '50/50',
                    disponible: comodinesDisponibles.cincuentaCincuenta > 0,
                    deshabilitado: respuestaSeleccionada,
                    accion: usarComodin5050,
                    title: 'Elimina 2 respuestas incorrectas'
                  },
                  {
                    tipo: 'tiempoExtra',
                    texto: '+15s',
                    disponible: comodinesDisponibles.tiempoExtra > 0,
                    deshabilitado: false,
                    accion: usarComodinTiempoExtra,
                    title: 'Añade 15 segundos al temporizador'
                  }
                ].map((comodin) => (
                  <button
                    key={`comodin-${comodin.tipo}`}
                    className={`comodin ${!comodin.disponible ? 'agotado' : ''}`}
                    onClick={comodin.accion}
                    disabled={!comodin.disponible || comodin.deshabilitado}
                    title={comodin.title}
                  >
                    {comodin.texto} <span>({comodinesDisponibles[comodin.tipo]})</span>
                  </button>
                ))}
              </div>
              <div className="pregunta-contenedor">
                <div className="temporizador">
                  <div
                    className={`barra-tiempo ${tiempoRestante <= 10 ? 'poco-tiempo' : ''}`}
                    style={{ width: `${(tiempoRestante / 30) * 100}%` }}
                  ></div>
                  <span>{tiempoRestante}s</span>
                </div>
                <div className="info-pregunta">
                  <span className="dificultad">Dificultad: {preguntaActual?.dificultad || 1}/8</span>
                  <span className="categoria">Categoría: {preguntaActual?.categoria || 'General'}</span>
                </div>
                <h3 className="pregunta-texto">{preguntaActual?.pregunta}</h3>
                <div className="opciones">
                  {preguntaActual?.opciones.map((opcion, i) => (
                    <button
                      key={`opcion-${i}`}
                      onClick={() => !respuestaSeleccionada && setRespuestaSeleccionada(opcion)}
                      className={`opcion ${respuestaSeleccionada === opcion ? 'seleccionada' : ''}`}
                      disabled={respuestaSeleccionada}
                    >
                      <span className="tecla-rapida">{i+1}</span>
                      {opcion}
                    </button>
                  ))}
                </div>
                {respuestaSeleccionada && (
                  <button
                    onClick={() => manejarRespuesta(respuestaSeleccionada)}
                    className="btn-confirmar"
                  >
                    Confirmar Respuesta (Enter)
                  </button>
                )}
              </div>
              {mensaje && (
                <div className={`mensaje ${animacionCorrecto ? 'correcto' : animacionIncorrecto ? 'incorrecto' : ''}`}>
                  {mensaje}
                </div>
              )}
            </>
          ) : (
            <div className="pantalla-final">
              <h2 className="titulo-final">
                {puntos >= 800 ? '🏆 ¡Ganador!' : '🎮 Juego Terminado'}
              </h2>
              <p className="mensaje-final">{mensaje}</p>
              <div className="estadisticas-final">
                {[
                  { valor: escalonActual + 1, label: 'Escalones alcanzados' },
                  { valor: puntos, label: 'Puntos totales' },
                  { valor: puntuacionMaxima, label: 'Récord actual' }
                ].map((estadistica, idx) => (
                  <div key={`estadistica-${idx}`} className="estadistica">
                    <span className="valor">{estadistica.valor}</span>
                    <span className="label">{estadistica.label}</span>
                  </div>
                ))}
              </div>
              <div className="botones-final">
                {comodinesDisponibles.salvarEscalon > 0 && (
                  <button
                    onClick={usarComodinSalvarEscalon}
                    className="btn-comodin-salvar"
                  >
                    Usar Comodín 🛡️ (1 disponible)
                  </button>
                )}
                <button
                  onClick={reiniciarJuego}
                  className="btn-reiniciar"
                >
                  Jugar de Nuevo
                </button>
                <button
                  onClick={() => setMostrarRanking(true)}
                  className="btn-ranking"
                >
                  Ver Ranking
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Juego8Escalones;
