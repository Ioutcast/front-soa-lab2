import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateWorkerForm from "./CreateWorkerForm";
import { useTranslation } from "react-i18next";

const Menu = () => {
  const { t, i18n } = useTranslation();
  const [myOpacity, setMyOpacity] = useState(Math.random());
  const navigate = useNavigate();
  const [create, setCreate] = useState(false);

  const [currentLanguage, setCurrentLanguage] = useState("ru");

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
  const changeLanguage = () => {
    const newLanguage = currentLanguage === "ru" ? "en" : "ru";
    setCurrentLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };
  return (
    <>
      <div className="menu">
        <div className="menu__container">
          <div className="menu__inner" style={{ padding: 20 }}>
            <div style={{ opacity: myOpacity }} className="paintsvg">
              {t("creator.0")} & {t("creator.1")}
            </div>
            <div style={{ display: "flex" }}>
              <div className="nav">
                <div className="nav__inner">
                  <div className="nav__hr click" onClick={goTable}>
                    <span class="icon-stack"></span>
                    {t("menu.table")}
                  </div>
                  <div className="nav__hr click" onClick={goHr}>
                    <span class="icon-briefcase"></span>
                    {t("menu.hr")}
                  </div>
                  <div className="nav__extra click" onClick={goExtra}>
                    <span class="icon-embed"></span>
                    {t("menu.extra")}
                  </div>
                  <div className="nav_create click" onClick={changeCreate}>
                    <span class="icon-user"></span>
                    {t("menu.create")}
                  </div>
                </div>
              </div>
              <div
                className="nav__hr click flag_wrap"
                onClick={() => changeLanguage()}
              >
                <img
                  className="flag"
                  src={`/images/${currentLanguage.toUpperCase()}.png`}
                  alt="asd"
                />
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
