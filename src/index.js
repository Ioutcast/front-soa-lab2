import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./fonts/VisbyRoundCFDemiBold.ttf";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter basename="/~s284699/soa-front">
    <App />
  </BrowserRouter>
);
// basename="/~s284699/soa-front"
// package
// "homepage": "https://se.ifmo.ru/~s284699/soa-front/",
//webpack serve --mode development
