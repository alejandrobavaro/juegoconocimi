import React from "react";
import { Link } from "react-router-dom"; 
import "../assets/scss/_03-Componentes/_Footer.scss";

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-grid">
        <div className="footer-content">
          <div className="footer-column">
            <img
              className="footer-logo"
              src="/img/05-img-costados-larga/4.png"
              alt="Logo Izquierda"
            />
          </div>

          <div className="footer-column">
            <div className="social-links">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-instagram" /> 
              </a>
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-youtube" />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-facebook" /> 
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-twitter" /> 
              </a>
            </div>
          </div>

          <div className="footer-column">
            <img
              className="footer-logo"
              src="/img/05-img-costados-larga/4.png"
              alt="Logo Derecha"
            />
          </div>
        </div>
      </div>

      <hr className="footer-divider" />

      <div className="footer-bottom">
        <div className="footer-contact-button">
          <Link to="/contacto" className="btn-contacto">
            Contacto
          </Link>
        </div>
        
        <div className="trademarkFooter">
          <h6>
            <a
              href="https://alejandrobavaro.github.io/gondraworld-dev/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-brilliance" /> - Gondra World Dev -{" "}
              <i className="bi bi-brilliance" />
            </a>
          </h6>
        </div>
      </div>
    </footer>
  );
}

export default Footer;