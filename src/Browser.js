import React, { useRef, useState, useEffect } from 'react';
import './Browser.css';

const Browser = () => {
  const introRef = useRef(null);
  const educationRef = useRef(null);
  const [isDragging, setIsDragging] = useState({ intro: false, education: false });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [currentElement, setCurrentElement] = useState(null);

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
        const newX = (e.clientX - offset.x - rect.left)*2;
        const newY = (e.clientY - offset.y - rect.top)*2;
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
            <span className="tab active">Home</span>
            <span className="tab">About</span>
            <span className="tab">Contact</span>
          </div>
        </div>

        <div className="browser-content">
          <div
            className="Intro"
            ref={introRef}
            onMouseDown={(e) => handleMouseDown(e, 'intro')}
            style={{ userSelect: 'none', position: 'absolute' }}
          >
            <h2 className="title">Who Am I ?</h2>
            <span className="textI">
              <span className="line one">I am a 21-year-old student in my last year of my engineering degree in computer science. <br/></span>
              <span className="line two">I am currently looking for an internship outside of France. I am very passionate about <br/></span>
              <span className="line three"> web development, but I also have a lot of experience in mobile and software development.</span>
            </span>
          </div>

          <div
            className="education"
            ref={educationRef}
            onMouseDown={(e) => handleMouseDown(e, 'education')}
            style={{ userSelect: 'none', position: 'absolute' }}
          >
            <span className="textE">
              <span className="line four">I obtained my two-year   associate degree in 2022  in computer science  </span> <span className="line seven"> I then decided to obtain my  engineering degree in the same specialty at Polytech Grenoble. </span>
            </span>
            <h2 className="title">My Education</h2>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Browser;
