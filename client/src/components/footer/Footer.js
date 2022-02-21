import React from 'react';
import './Footer.scss'

function Footer(props) {
  return (
    <footer className="footer-distributed">
      <div className="footer-left">
        <h3>
          <img
            src="/images/logo-black.png"
            className="d-inline-block align-top"
            alt="Flowerworks logo"
          />
        </h3>
        <p className="footer-links">
          <a href="/" className="link-1">Home</a>
          <a href="/do-it-yourself">DIY</a>
          <a href="/contact">Contact Us</a>
        </p>
        {/* <p className="footer-company-name">Flowerworks © 2021</p> */}
      </div>
      <div className="footer-center">
        <div>
          <i className="fa fa-map-marker" />
          <p><span>Shop 1, Plot 3C, Main Khayaban Mujahid,</span>Khadda Market, Phase 5, DHA</p>
        </div>
        <div>
          <i className="fa fa-phone" />
          <p><span>021 38940093</span></p>
        </div>
        <div>
          <i className="fa fa-envelope" />
          <p><a href="mailto:info@flowerworks.pk">info@flowerworks.pk</a></p>
        </div>
      </div>
      <div className="footer-right">
        {/* <p className="footer-company-about">
          <span>About Flowerworks</span>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum pharetra sagittis lectus sed lacinia. Suspendisse potenti. Fusce quis dignissim ligula, vel facilisis nulla. Donec id velit ac massa dignissim faucibus quis eu libero. Nulla metus nisl, mollis non nulla quis, accumsan tincidunt est. Curabitur hendrerit, turpis non suscipit facilisis, neque eros tempus ligula, vitae congue elit enim nec magna. Vivamus in libero sed nunc ornare fermentum a eget nisl. Aliquam non tincidunt turpis.
        </p> */}
        {/* <div className="footer-icons">
            <a rel="noreferrer" target="_blank" href="https://www.facebook.com/fefsmp"><i className="fab fa-facebook" /></a>
            <a rel="noreferrer" target="_blank" href="https://wa.me/+923089602202"><i className="fab fa-whatsapp" /></a>
            <a rel="noreferrer" target="_blank" href="https://www.instagram.com/fefsmp/"><i className="fab fa-instagram" /></a>
          </div> */}
      </div>
    </footer>
  );
}

export default Footer;