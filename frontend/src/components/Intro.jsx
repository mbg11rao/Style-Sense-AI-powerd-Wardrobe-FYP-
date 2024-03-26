import React from "react";
import "./Intro.css";
import Vector1 from "../img/Vector1.png";
import Vector2 from "../img/Vector2.png";
import boy from "../img/2.png";
import glassesimoji from "../img/glassesimoji.png";
import thumbup from "../img/thumbup.png";
import Github from "../img/github.png";
import LinkedIn from "../img/linkedin.png";
import Instagram from "../img/instagram.png";
import { motion } from "framer-motion";
import { Link } from "react-scroll";
import NavBar from './NavBar';
const Intro = () => {
  // Transition
  const transition = { duration: 2, type: "spring" };

  return (
    <div className="Intro" id="Intro">
    <NavBar />
      {/* left name side */}
      <div className="i-left">
        <div className="i-name">
          {/* Simplified greeting without dark mode consideration */}
          <span>WELCOME TO </span>
          <span>STYLE SENSE</span>
          <span>
            The Style Sense project encompasses the development of an AI-powered wardrobe system
            that leverages Deep learning and image recognition technologies.
            The system will offer personalized outfit recommendations based on user preferences, 
            weather conditions, and event types. Users will be able to manage their wardrobe 
            inventory, including clothing items and accessories, through an intuitive interface.
            Additionally, advanced image recognition will allow users to easily add items 
            to their virtual wardrobe.
          </span>
        </div>
        <Link to="contact" smooth={true} spy={true}>
          <button className="button i-button">Try</button>
        </Link>
        {/* social icons */}
        <div className="i-icons">
          <img src={Github} alt="https://github.com/mbg11rao/Style-Sense-AI-powerd-Wardrobe-FYP-" />
          <img src={LinkedIn} alt="https://github.com/mbg11rao/Style-Sense-AI-powerd-Wardrobe-FYP-" />
          <img src={Instagram} alt="https://github.com/mbg11rao/Style-Sense-AI-powerd-Wardrobe-FYP-" />
        </div>
      </div>
      {/* right image side */}
      <div className="i-right">
        <img src={Vector1} alt="" />
        <img src={Vector2} alt="" />
        <img src={boy} alt="" />
        {/* animation */}
        <motion.img
          initial={{ left: "-36%" }}
          whileInView={{ left: "-24%" }}
          transition={transition}
          src={glassesimoji}
          alt=""
        />

        <div className="blur" style={{ background: "rgb(238 210 255)" }}></div>
        <div
          className="blur"
          style={{
            background: "#C1F5FF",
            top: "17rem",
            width: "21rem",
            height: "11rem",
            left: "-9rem",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Intro;
