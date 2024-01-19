import React, { useState } from "react";
import "../styles/Worker.css";
import axios from "axios";
import xml2js, { parseString } from "xml2js";
import { toast } from "react-toastify";
const UpdateWorkerForm = ({ worker, onUpdateWorker, loadData }) => {
  const [updatedWorker, setUpdatedWorker] = useState({ ...worker });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...updatedWorker };
    const [property, subproperty] = name.split(".");
    if (subproperty) {
      if (!updated[property]) {
        updated[property] = {};
      }
      updated[property][subproperty] = value;
    } else {
      updated[name] = value;
    }

    setUpdatedWorker(updated);
  };

  const handleSubmit = () => {
    onUpdateWorker(updatedWorker);
  };
  const handleCancel = () => {
    onUpdateWorker();
  };
  const handleDelete = async () => {
    const response = await axios
      .delete(`https://localhost:5678/company/workers/${updatedWorker.id}`)
      .catch((error) => {
        error.response?.data
          ? parseString(error.response.data, (err, result) => {
              if (err) {
                console.log("Ошибка при парсинге XML:", err);
                toast("Ошибка удаления");
              } else {
                console.log("Не Ошибка при парсинге XML:", result);
                toast(result.Error.message[0]);
              }
            })
          : toast("Ошибка удаления");
        // toast("Ошибка удаления");
      });
    onUpdateWorker();
  };
  const handleHrDelere = async () => {
    onUpdateWorker();
    const response = await axios
      .delete(`https://localhost:5678/server2/hr/fire/${updatedWorker.id}`)
      .catch((error) => {
        error.response?.data
          ? parseString(error.response.data, (err, result) => {
              if (err) {
                console.log("Ошибка при парсинге XML:", err);
                toast("Ошибка увольнения");
              } else {
                console.log("Не Ошибка при парсинге XML:", result);
                toast(result.Error.message[0]);
              }
            })
          : console.log("Ошибка увольнения");
        // toast("Ошибка увольнения");
      });
    loadData(1);
  };
  return (
    <div className="">
      <div className="worker__inner">
        <div className="worker__id">
          <div className="id" style={{ marginRight: 5 }}>
            <span>№{updatedWorker.id}</span>
          </div>
        </div>

        <div className="name__id">
          <span>Position</span>
          <input
            className="update-input"
            type="text"
            name="position"
            value={updatedWorker.position}
            onChange={handleInputChange}
          />
        </div>
        <div className="name__id">
          <span>Name</span>
          <input
            type="text"
            name="name"
            value={updatedWorker.name}
            onChange={handleInputChange}
          />
        </div>

        <div className="">
          <div className="">
            <span>Coord</span>
          </div>

          <div className="">
            <span>X</span>
            <input
              type="text"
              name="Coordinate.x"
              value={updatedWorker.Coordinate.x}
              onChange={handleInputChange}
            />
          </div>
          <div className="">
            <span>Y</span>
            <input
              type="text"
              name="Coordinate.y"
              value={updatedWorker.Coordinate.y}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="name__id">
          <span>Salary</span>
          <input
            type="text"
            name="salary"
            value={updatedWorker.salary}
            onChange={handleInputChange}
          />
        </div>
        <div class="line-horizontal"></div>
        <div style={{ display: "none" }} className="name__id">
          <span>Creation Date</span>
          <input
            style={{ textAlign: "center" }}
            type="text"
            name="creationDate"
            value={updatedWorker.creationDate}
            onChange={handleInputChange}
            readOnly
          />
        </div>
        <div className="">
          <div className="name__id">
            <span>Start Date</span>
            <input
              type="text"
              name="startDate"
              value={updatedWorker.startDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="name__id">
            <span>End Date</span>
            <input
              type="text"
              name="endDate"
              value={updatedWorker.endDate}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div class="line-horizontal"></div>
        {updatedWorker.Organization ? (
          <div style={{ display: "none" }} className="">
            <div style={{ marginTop: 5, marginBottom: 5 }}>Organization</div>
            <span>id</span>
            <div className="">
              <input
                style={{ textAlign: "center" }}
                type="text"
                name="Organization.id"
                value={updatedWorker.Organization.id}
                onChange={handleInputChange}
                readOnly
              />
            </div>
            <span>name</span>
            <div className="">
              <input
                style={{ textAlign: "center" }}
                type="text"
                name="Organization.fullName"
                value={updatedWorker.Organization.fullName}
                onChange={handleInputChange}
                readOnly
              />
            </div>
            <span>annualTurnover</span>
            <div className="">
              <input
                style={{ textAlign: "center" }}
                type="text"
                name="Organization.annualTurnover"
                value={updatedWorker.Organization.annualTurnover}
                onChange={handleInputChange}
                readOnly
              />
            </div>{" "}
          </div>
        ) : (
          <>
            <div style={{ marginTop: 5, marginBottom: 5 }}>Organization</div>
            <div>Hired</div>
          </>
        )}
      </div>
      <div className="but_wrap">
        <button className="click" onClick={handleSubmit}>
          Сохранить
        </button>
        <button
          className="click"
          onClick={handleDelete}
          style={{ color: "red" }}
        >
          Удалить!
        </button>
        <button
          className="click"
          onClick={handleHrDelere}
          style={{ color: "red" }}
        >
          Уволить!
        </button>
        <button className="click" onClick={handleCancel}>
          Отмена
        </button>
      </div>
    </div>
  );
};

export default UpdateWorkerForm;
