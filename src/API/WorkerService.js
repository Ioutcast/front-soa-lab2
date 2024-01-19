import axios from "axios";

export default class WorkerService {
  static async getAll() {
    return await axios.get("https://localhost:5678/company");
  }
  static async getByEndDateGl(data, condition) {
    return await axios.get(
      `https://localhost:5678/company/workers/count?enddate=${data}&condition=${condition}`
    );
  }
  static async getCount() {
    return await axios.get("https://localhost:5678/company/workers/salary/max");
  }
  static async postMove(workerId, idFrom, idTo) {
    return await axios.put(
      `https://localhost:5678/server2/hr/move/${workerId}/${idFrom}/${idTo}`
    );
  }
}
