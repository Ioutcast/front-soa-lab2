import React, { useEffect, useState } from "react";
import axios from "axios";
import xml2js, { parseString } from "xml2js";
import { toast } from "react-toastify";

const CreateWorkerForm = ({ create, onChangeCreate }) => {
  const [createw, setCreatew] = useState(false);

  const [newWorker, setNewWorker] = useState({
    position: "",
    name: "",
    salary: "",
    x: "",
    y: "",
    startDate: "",
    endDate: "",
    organizationId: "",
    organizationName: "",
    organizationAnnualTurnover: "",
    Organization: {},
    Coordinates: {},
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewWorker({ ...newWorker, [name]: value });
  };
  const onCancel = (e) => {
    setNewWorker({
      position: "",
      name: "",
      salary: "",
      x: "",
      y: "",
      startDate: "",
      endDate: "",
      organizationId: "",
      organizationName: "",
      organizationAnnualTurnover: "",
      Organization: {},
      Coordinates: {},
    });
    onChangeCreate();
  };
  const handleCreateWorker = async () => {
    const updatedWorker = { ...newWorker };
    updatedWorker.position = updatedWorker.position.toUpperCase();
    updatedWorker.Organization = {
      id: updatedWorker.organizationId,
      fullName: updatedWorker.organizationName,
      annualTurnover: updatedWorker.organizationAnnualTurnover,
    };
    delete updatedWorker.organizationAnnualTurnover;
    delete updatedWorker.organizationName;
    delete updatedWorker.organizationId;
    updatedWorker.Coordinates = {
      x: updatedWorker.x,
      y: updatedWorker.y,
    };
    delete updatedWorker.x;
    delete updatedWorker.y;
    const xmlBuilder = new xml2js.Builder({ rootName: "CreateWorkerRequest" });
    const xmlData = xmlBuilder.buildObject(updatedWorker);

    try {
      const response = await axios.post(
        "https://localhost:9000/company/workers",
        xmlData,
        {
          headers: {
            "Content-Type": "text/xml",
          },
        }
      );

      setNewWorker({
        position: "",
        name: "",
        salary: "",
        x: "",
        y: "",
        startDate: "",
        endDate: "",
        organizationId: "",
        organizationName: "",
        organizationAnnualTurnover: "",
        Organization: {},
        Coordinates: {},
      });
      onChangeCreate();
    } catch (error) {
      parseString(error.response.data, (err, result) => {
        if (err) {
          console.log("Ошибка при парсинге XML:", err);
          toast("Ошибка");
        } else {
          console.log("Не Ошибка при парсинге XML:", result);
          toast(result.Error.message[0]);
        }
      });
      setNewWorker({
        position: "",
        name: "",
        salary: "",
        x: "",
        y: "",
        startDate: "",
        endDate: "",
        organizationId: "",
        organizationName: "",
        organizationAnnualTurnover: "",
        Organization: {},
        Coordinates: {},
      });
      onChangeCreate();
    }
  };

  return (
    <div
      className="create-worker-form"
      style={{ display: create ? "" : "none" }}
    >
      <div>
        <h2>Create Worker</h2>
      </div>
      <div>
        <form>
          <div className="form-group">
            <label>Position</label>
            <input
              type="text"
              name="position"
              value={newWorker.position}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={newWorker.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Coord_X</label>
            <input
              type="number"
              name="x"
              value={newWorker.x}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Coord_Y</label>
            <input
              type="number"
              name="y"
              value={newWorker.y}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Salary</label>
            <input
              type="number"
              name="salary"
              value={newWorker.salary}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={newWorker.startDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={newWorker.endDate}
              onChange={handleChange}
            />
          </div>
          <div>Organization</div>
          <div className="form-group">
            <label>id</label>
            <input
              type="number"
              name="organizationId"
              value={newWorker.organizationId}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="organizationName"
              value={newWorker.organizationName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>annual Turnove</label>
            <input
              type="number"
              name="organizationAnnualTurnover"
              value={newWorker.organizationAnnualTurnover}
              onChange={handleChange}
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={onCancel}>
              Отменить
            </button>
            <button type="button" onClick={handleCreateWorker}>
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkerForm;
