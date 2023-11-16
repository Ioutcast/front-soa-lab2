import React, { useEffect, useRef, useState, createRef } from "react";
import { useNavigate } from "react-router-dom";
import welcome from "../mp3f/osu.mp3";
import useSound from "use-sound";
import { useTranslation } from "react-i18next";

export const WelcomeP = ({ updateData }) => {
  const { t, i18n } = useTranslation();

  const [play] = useSound(welcome);
  const navigate = useNavigate();
  const smallDotsRefs = Array.from({ length: 33 }, () => createRef());
  const downDotsRefs = Array.from({ length: 36 }, () => createRef());
  const [mouseDown, setMouseDown] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [transformValue, setTransformValue] = useState(
    "matrix(1, 0, 0, 1, 0, 0)"
  );
  const [isHovered, setIsHovered] = useState(false);
  const circleRef = useRef();
  const handleMouseDown = (event) => {
    setMouseDown(event.clientY);
    setIsPressed(true);
    setTransformValue("matrix(0.5, 0, 0, 0.5, 0, 0)");
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
    // setTimeout(() => {
    //   setTransformValue("matrix(0.9, 0, 0, 0.9, 0, 0)");
    // }, 100);
  };
  const handleMouseUp = () => {
    setIsPressed(false);
    setIsHovered(false);
    setTimeout(() => {
      setTransformValue("matrix(1, 0, 0, 1, 0, 0)");
    }, 100);
    handleMouseLeave();
  };
  const handleMouseLeave = () => {
    if (isHovered && !isPressed) {
      setTimeout(() => {
        setTransformValue("matrix(1, 0, 0, 1, 0, 0)");
      }, 100);
      // setIsPressed(false);
    }
  };
  let newY = 0;
  const handleMouseMove = (event) => {
    if (isPressed) {
      requestAnimationFrame(() => {
        // let newCircleY = parseFloat(
        //   circleRef.current.getBoundingClientRect().y
        // );
        // console.log(newCircleY - event.clientY);
        // console.log(event.clientY - mouseDown);
        if (newY < 190) newY = event.clientY - mouseDown;
        if (newY < 0) newY = 0;
        setTransformValue(`matrix(0.5, 0, 0, 0.5, 0, ${newY})`);
        if (newY > 180) {
          updateData(true);
          setTransformValue(`matrix(1, 0, 0, 1, 0, 0)`);
          setIsPressed(false);
          setIsHovered(false);
          setMouseDown(0);
          play();
        }
      });
    }
  };
  const handleMouseLeaveNav = () => {
    setIsPressed(false);
    setIsHovered(false);
    setTimeout(() => {
      setTransformValue("matrix(1, 0, 0, 1, 0, 0)");
    }, 100);
  };
  return (
    <div
      className="falter-nav"
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <div
        className="falter-intro"
        onMouseLeave={handleMouseLeaveNav}
        onMouseUp={handleMouseUp}
        style={{ paddingTop: 60 }}
      >
        <div
          className="top-circle"
          style={{
            visibility: "inherit",
            opacity: 1,
            transform: transformValue,
          }}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          ref={circleRef}
        >
          <div
            className="circle main"
            style={{ borderRadius: 50, height: 50, width: 50 }}
          />
          <div
            className="pulsate circle"
            style={{
              visibility: "hidden",
              opacity: 0,
              borderRadius: 200,
              height: 150,
              width: 150,
            }}
          />
        </div>
        <div className="connecting-line">
          {smallDotsRefs.map((dotRef, index) => (
            <span
              className="small-dot"
              key={index}
              ref={dotRef}
              style={{
                visibility: "inherit",
                opacity: index * 0.03125,
                transform: `matrix(1, 0, 0, 1, 0, ${index * 5})`,
              }}
            />
          ))}
        </div>
        <div className="target-circle">
          {downDotsRefs.map((dotRef, index) => {
            const angle = (index / 36) * (2 * Math.PI);
            const x = 25 * Math.cos(angle);
            const y = 25 * Math.sin(angle);
            return (
              <span
                key={index}
                className="circle-small-dot"
                style={{
                  visibility: "inherit",
                  opacity: 1,
                  transform: `matrix(1, 0, 0, 1, ${x}, ${y})`,
                }}
                ref={dotRef}
              />
            );
          })}
        </div>
        <div
          className="falter-intro-description"
          style={{ visibility: "inherit", opacity: 1, marginTop: 75 }}
        >
          <div
            style={{
              display: "block",
              textAlign: "center",
              position: "relative",
              visibility: "inherit",
              opacity: 1,
              transform: "matrix(1, 0, 0, 1, 0, 0)",
            }}
          >
            {t("welcome.0")}
          </div>
          <div
            style={{
              display: "block",
              textAlign: "center",
              position: "relative",
              visibility: "inherit",
              opacity: 1,
              transform: "matrix(1, 0, 0, 1, 0, 0)",
            }}
          >
            {t("welcome.1")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeP;
