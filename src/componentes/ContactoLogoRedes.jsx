import React from "react";
import "../assets/scss/_03-Componentes/_ContactoLogoRedes.scss";

const ContactoLogoRedes = () => {
  return (
    // Contenedor principal 2 columnas en desktop
    <section className="contacto-logo-redes">
      {/* Columna izquierda: logo, redes y banner */}
      <div className="contact-left">
        <div className="contact-logo">
          <a href="#">
            <img
              src="/img/02-logos/logochulusgames1.png"
              alt="Logo"
              className="logo-img"
            />
          </a>
        </div>

        <div className="social-links">
          <a href="#" target="_blank" rel="noopener noreferrer" className="social-btn">
            <i className="bi bi-facebook"></i>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="social-btn">
            <i className="bi bi-instagram"></i>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="social-btn">
            <i className="bi bi-youtube"></i>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="social-btn">
            <i className="bi bi-envelope"></i>
          </a>
        </div>

  
      </div>

      {/* Columna derecha: formulario */}
      <div className="contact-right">
        <form
          className="contact-form"
          action="https://formspree.io/f/xbjnlgzz"
          method="POST"
          target="_blank"
        >
          <h3 className="form-title">Contáctanos</h3>

          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="tel"
                name="telefono"
                placeholder="Teléfono"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="asunto"
                placeholder="Asunto"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <textarea
              name="mensaje"
              rows={4}
              placeholder="Escribe tu mensaje..."
              required
            />
          </div>

          <button type="submit" className="btn-submit">Enviar Mensaje</button>
        </form>
      </div>
    </section>
  );
};

export default ContactoLogoRedes;
