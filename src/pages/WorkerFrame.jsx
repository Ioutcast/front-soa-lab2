import React from "react";
import "../styles/Worker.css";

const WorkerFrame = ({ worker }) => {
  return (
    <div className="worker">
      <div className="worker__inner">
        <div className="worker__id">
          <div className="id" style={{ marginRight: 5 }}>
            <span>№{worker.id}</span>
          </div>
        </div>
        <div className="position_w_name">
          <div className="position__inner">
            <span>{worker.position}</span>
          </div>
          <div className="name__id">
            <span>{worker.name}</span>
          </div>
        </div>
        <div className="position_w_name">
          <div className="position__inner">
            <span>Coord</span>
          </div>
          <div className="coordinate">
            <div className="coordinate__x">
              <span>x : {worker.Coordinate.x} </span>
            </div>
            <div className="coordinate__y">
              <span>y : {worker.Coordinate.y}</span>
            </div>
          </div>
        </div>
        <div className="salary">
          <i>S </i>
          <span>{worker.salary}</span>
        </div>
        <div class="line-horizontal"></div>
        <div className="creation_date">
          <i>CR </i>
          <span>{worker.creationDate}</span>
        </div>
        <div className="date">
          <div className="start__date date-new">
            <i>SD </i>
            <span>{worker.startDate}</span>
          </div>
          <div className="end__date date-new">
            <i>ED </i>
            <span>{worker.endDate}</span>
          </div>
        </div>
        <div class="line-horizontal"></div>
        {worker.Organization ? (
          <div className="organization">
            <div className="organization__id">
              <i>aa </i>
              <span>{worker.Organization.id} </span>
            </div>
            <div class="dotted-dot"></div>
            <div className="organization__name">
              <i>aa </i>
              <span>{worker.Organization.fullName} </span>
            </div>
            <div className="organization__annualTurnover">
              <span>{worker.Organization.annualTurnover}$ </span>
            </div>
          </div>
        ) : (
          <div>Hired</div>
        )}
      </div>
    </div>
  );
};

export default WorkerFrame;
