import React, { useState } from "react";
import "../styles/Worker.css";
import UpdateWorkerForm from "./UpdateWorkerForm";

const WorkerFrame = ({ worker }) => {
  const [isUpdateFormVisible, setUpdateFormVisible] = useState(false);

  const handleUpdateClick = () => {
    setUpdateFormVisible(!isUpdateFormVisible);
  };

  const handleUpdateWorker = (updatedWorker) => {
    console.log("Обновленные данные работника:", updatedWorker);

    setUpdateFormVisible(false);
  };
  return (
    <>
      <div className="worker" onClick={handleUpdateClick}>
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
            <i>Salary </i>
            <span>{worker.salary}</span>
          </div>
          <div class="line-horizontal"></div>
          <div className="creation_date">
            <i style={{ marginRight: 20 }}>CR </i>
            <span>{worker.creationDate}</span>
          </div>
          <div className="date">
            <div className="start__date date-new">
              <i>Start Date</i>
              <span>{worker.startDate}</span>
            </div>
            <div className="end__date date-new">
              <i>End Date </i>
              <span>{worker.endDate}</span>
            </div>
          </div>
          <div class="line-horizontal"></div>
          <div style={{ marginTop: 5, marginBottom: 5 }}>Organization</div>
          {worker.Organization ? (
            <div className="organization">
              <div className="organization__id">
                <span>id {worker.Organization.id} </span>
              </div>
              <div class="dotted-dot"></div>
              <div className="organization__name">
                <span className="org__name">
                  {worker.Organization.fullName}{" "}
                </span>
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
      {isUpdateFormVisible ? (
        <>
          <div className="modal-overlay">
            <div className="modal">
              <UpdateWorkerForm
                worker={worker}
                onUpdateWorker={handleUpdateWorker}
              />
              <button>Сохранить</button>
              <button
                onClick={() => {
                  setUpdateFormVisible(false);
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default WorkerFrame;
