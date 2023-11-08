import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateWorkerForm from "./CreateWorkerForm";

const Menu = () => {
  const [myOpacity, setMyOpacity] = useState(Math.random());
  const navigate = useNavigate();
  const [create, setCreate] = useState(false);
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setMyOpacity(Math.random());
    }, Math.random() * 500 + 200);
    return () => {
      clearInterval(blinkInterval);
    };
  }, []);
  const goHr = () => {
    navigate("/hr");
  };
  const goExtra = () => {
    navigate("/extra");
  };
  const goTable = () => {
    navigate("/");
  };
  const goCreate = () => {
    navigate("/create");
  };
  const changeCreate = () => {
    setCreate(!create);
  };
  return (
    <>
      <div className="menu">
        <div className="menu__container">
          <div className="menu__inner">
            <div style={{ opacity: myOpacity }} className="paintsvg">
              Васильков & Ихун
            </div>
            <div className="nav">
              <div className="nav__inner">
                <div className="nav__hr click" onClick={goTable}>
                  <span class="icon-stack"></span>
                  Table
                </div>
                <div className="nav__hr click" onClick={goHr}>
                  <span class="icon-briefcase"></span>
                  Hr
                </div>
                <div className="nav__extra click" onClick={goExtra}>
                  <span class="icon-embed"></span>
                  Extra
                </div>
                <div className="nav_create click" onClick={changeCreate}>
                  <span class="icon-user"></span>
                  Create
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateWorkerForm create={create} onChangeCreate={changeCreate} />
    </>
  );
};

export default Menu;
