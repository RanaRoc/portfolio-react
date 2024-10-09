import React, { useRef, useState, useEffect } from 'react';
import './Browser.css';

const translations = {
  en: {
    title: "Who Am I?",
    intro1: "I am a 21-year-old student in my last year of my engineering degree in computer science.",
    intro2: "I am currently looking for an internship outside of France. I am very passionate about",
    intro3: "web development, but I also have a lot of experience in mobile and software development.",
    educationTitle: "My Education",
    education1: "I obtained my two-year associate degree in 2022 in computer science.",
    education2: "I then decided to obtain my engineering degree in the same specialty at Polytech Grenoble.",
    cvTitle: "My CV",
    viewCv: "View CV",
    home: "Home",
    about: "About",
    contact: "Contact"
  },
  fr: {
    title: "Qui suis-je ?",
    intro1: "Je suis un étudiant de 21 ans en dernière année de mon diplôme d'ingénieur en informatique.",
    intro2: "Je recherche actuellement un stage à l'extérieur de la France. Je suis très passionné par",
    intro3: "le développement web, mais j'ai aussi beaucoup d'expérience en développement mobile et logiciel.",
    educationTitle: "Mon Parcours Scolaire",
    education1: "J'ai obtenu mon diplôme de deux ans en 2022 en informatique.",
    education2: "J'ai ensuite décidé d'obtenir mon diplôme d'ingénieur dans la même spécialité à Polytech Grenoble.",
    cvTitle: "Mon CV",
    viewCv: "Voir le CV",
    home: "Accueil",
    about: "À propos",
    contact: "Contact"
  }
};

const Browser = () => {
  const introRef = useRef(null);
  const educationRef = useRef(null);
  const [isDragging, setIsDragging] = useState({ intro: false, education: false });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [currentElement, setCurrentElement] = useState(null);
  const [language, setLanguage] = useState('en'); // Default language is English

  // Handle mouse down (when dragging starts)
  const handleMouseDown = (e, element) => {
    const selectedElement = element === 'intro' ? introRef.current : educationRef.current;

    // Calculate the initial offset between the mouse and the element
    const rect = selectedElement.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    setIsDragging({ ...isDragging, [element]: true });
    setCurrentElement(element);

    // Add 'dragging' class for visual feedback
    selectedElement.classList.add('dragging');
  };

  // Handle mouse move (while dragging)
  const handleMouseMove = (e) => {
    if (currentElement) {
      const elementRef = currentElement === 'intro' ? introRef.current : educationRef.current;

      if (isDragging[currentElement]) {
        // Calculate new coordinates
        const rect = elementRef.getBoundingClientRect();
        const newX = (e.clientX - offset.x - rect.left) * 2;
        const newY = (e.clientY - offset.y - rect.top) * 2;
        // Set new position
        elementRef.style.transform = `translate(${newX}px, ${newY}px)`;
      }
    }
  };

  // Handle mouse up (when dragging stops)
  const handleMouseUp = () => {
    if (currentElement) {
      const elementRef = currentElement === 'intro' ? introRef.current : educationRef.current;

      setIsDragging({ ...isDragging, [currentElement]: false });
      elementRef.classList.remove('dragging');
      setCurrentElement(null); // Reset current element
    }
  };

  // Adding dynamic background elements
  useEffect(() => {
    // Create background elements on page load
    function createBackgroundElements() {
      const wrapper = document.querySelector(".browser-wrapper");

      for (let i = 0; i < 100; i++) {
        const element = document.createElement("div");
        element.classList.add("background-element");

        // Randomly assign class for size (small, default, or large)
        const sizeClass = Math.random() < 0.3 ? 'small' : Math.random() > 0.7 ? 'large' : null;
        if (sizeClass) {
          element.classList.add(sizeClass);
        }

        // Place the elements outside of the browser but within the wrapper
        element.style.top = `${Math.random() * 150 - 25}%`;  // Ranges from -25% to 125%
        element.style.left = `${Math.random() * 150 - 25}%`;
        element.style.position = 'absolute';

        wrapper.appendChild(element); // Append to the wrapper
      }
    }

    // Move elements on mouse movement
    function handleMouseMove(event) {
      const elements = document.querySelectorAll(".background-element");

      elements.forEach((element) => {
        const speed = element.classList.contains('large') ? 50 : element.classList.contains('small') ? 150 : 100;
        const x = (window.innerWidth - event.pageX * speed / 100) / 20;
        const y = (window.innerHeight - event.pageY * speed / 100) / 20;

        element.style.transform = `translate(${x}px, ${y}px)`;
      });
    }

    createBackgroundElements();
    document.addEventListener("mousemove", handleMouseMove);

    // Cleanup event listeners and elements on unmount
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      const elements = document.querySelectorAll(".background-element");
      elements.forEach(el => el.remove()); // Remove background elements on cleanup
    };
  }, []);

  // Function to handle language change
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  return (
    <div className="browser-wrapper">
      <div
        className="browser"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="browser-header">
          <div className="controls">
            <button className="control close"><span className="control-icon">✕</span></button>
            <button className="control minimize"><span className="control-icon">◻</span></button>
            <button className="control maximize"><span className="control-icon">-</span></button>
          </div>
          <span className="Name">Rana Rochdi</span>
          <div className="tabs">
            <span className="tab active">{translations[language].home}</span>
            <span className="tab">{translations[language].about}</span>
            <span className="tab">{translations[language].contact}</span>
          </div>
          <div className="language-selector">
            <button className={`language-button ${language === 'en' ? 'active' : ''}`} onClick={() => handleLanguageChange('en')}>EN</button>
            <button className={`language-button ${language === 'fr' ? 'active' : ''}`} onClick={() => handleLanguageChange('fr')}>FR</button>
          </div>
        </div>

        <div className="browser-content">
          <div
            className="Intro"
            ref={introRef}
            onMouseDown={(e) => handleMouseDown(e, 'intro')}
            style={{ userSelect: 'none', position: 'absolute' }}
          >
            <h2 className="title">{translations[language].title}</h2>
            <span className="textI">
              <span className="line one">{translations[language].intro1} <br/></span>
              <span className="line two">{translations[language].intro2} <br/></span>
              <span className="line three">{translations[language].intro3}</span>
            </span>
          </div>

          <div
            className="education"
            ref={educationRef}
            onMouseDown={(e) => handleMouseDown(e, 'education')}
            style={{ userSelect: 'none', position: 'absolute' }}
          >
            <span className="textE">
              <span className="line four">{translations[language].education1}</span> <span className="line seven">{translations[language].education2}</span>
            </span>
            <h2 className="title">{translations[language].educationTitle}</h2>

          </div>
          
          <div className="cv-section">
            <h2 className="title">{translations[language].cvTitle}</h2>
            <a href="/CV-web-en-2024.pdf" className="cv-button" target="_blank" rel="noopener noreferrer">
              <button className="neon-button">{translations[language].viewCv}</button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browser;
