import React from "react";
import WorkerFrame from "./WorkerFrame";

const AwasomeTable = () => {
  return (
    <>
      <div className="statistics">
        <div className="statistics welcome-screen">
          <div className="count-stat click" style={{ paddingRight: 15 }}>
            <h1 style={{ color: "#65687B" }}>100</h1>
            <a style={{ color: "#65687B" }}>работников</a>
          </div>
          <div className="mini-statistics">
            <div className="positions click" style={{ marginTop: 10 }}>
              <h4>4</h4>
              <a style={{ color: "#65687B" }}>позиций</a>
            </div>
            <div class="dotted-dot"></div>
            <div className="organizations click" style={{ marginTop: 10 }}>
              <h4>1000</h4>
              <a style={{ color: "#65687B" }}>организаций</a>
            </div>
          </div>
        </div>
      </div>
      <div className="statistics">
        <div className="statistics welcome-screen">
          <div className="count-stat click" style={{ paddingRight: 15 }}>
            <h1 style={{ color: "#65687B" }}>100</h1>
            <a style={{ color: "#65687B" }}>работников</a>
          </div>
          <div className="mini-statistics">
            <div className="positions click" style={{ marginTop: 10 }}>
              <h4>4</h4>
              <a style={{ color: "#65687B" }}>позиций</a>
            </div>
            <div className="organizations click" style={{ marginTop: 10 }}>
              <h4>1000</h4>
              <a style={{ color: "#65687B" }}>организаций</a>
            </div>
          </div>
        </div>
      </div>
      <WorkerFrame />
    </>
  );
};

export default AwasomeTable;
