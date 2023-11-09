import React, { useState } from "react";
import "../styles/Worker.css";
import UpdateWorkerForm from "./UpdateWorkerForm";
import axios from "axios";
import xml2js, { parseString } from "xml2js";
import { toast } from "react-toastify";

const WorkerFrame = ({ worker, loadData }) => {
  const [isUpdateFormVisible, setUpdateFormVisible] = useState(false);

  const handleUpdateClick = () => {
    setUpdateFormVisible(!isUpdateFormVisible);
  };

  const handleUpdateWorker = async (updatedWorker) => {
    try {
      if (!updatedWorker.id) {
        throw new Error("No ID found");
      }
    } catch (error) {
      loadData(1);
      setUpdateFormVisible(false);
      return;
    }
    let values = updatedWorker;
    let id = values.id;
    delete values.id;
    const organization = {
      id: values.organization_id,
      fullName: values.organization_fullName,
      annualTurnover: values.organization_annualTurnover,
    };
    delete values.key;
    values.Coordinates = values.Coordinate;
    delete values.Coordinate;
    values.creationDate = values.creationDate + "Z";
    console.log("values=", values);
    const builder = new xml2js.Builder({ rootName: "WorkerInfo" });
    const xmlData = builder.buildObject(values);
    const response = await axios
      .put(`https://localhost:9000/company/workers/${id}`, xmlData, {
        headers: {
          "Content-Type": "application/xml",
        },
      })
      .catch((error) => {
        error.response?.data
          ? parseString(error.response.data, (err, result) => {
              if (err) {
                console.log("Ошибка при парсинге XML:", err);
                toast("Ошибка обновления");
              } else {
                console.log("Не Ошибка при парсинге XML:", result);
                toast(result.Error.message[0]);
              }
            })
          : toast("Ошибка");
      });
    loadData(1);
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
          {worker.Organization != null ? (
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
                loadData={loadData}
              />
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
