import React, { useState, useEffect } from "react";

const Menu = () => {
  const [myOpacity, setMyOpacity] = useState(Math.random());
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setMyOpacity(Math.random());
    }, Math.random() * 500 + 400);
    return () => {
      clearInterval(blinkInterval);
    };
  }, []);
  return (
    <>
      <div className="menu">
        <div className="menu__container">
          <div className="menu__inner">
            <div style={{ opacity: myOpacity }} className="paintsvg">
              Васильков & Ихун{" "}
            </div>
            <div className="nav">
              <div className="nav__inner">
                <div className="nav__hr click">Hr</div>
                <div className="nav__extra click">Extra</div>
                <div className="nav_create click">Create</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
