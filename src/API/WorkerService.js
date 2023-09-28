import axios from "axios";

export default class WorkerService{
    static async getAll(){
        return await axios.get("http://localhost:8080/comp")
    }
    static async getByEndDateGl(data,condition){
        return await axios.get(`http://localhost:9000/company/workers/count?enddate=${data}&condition=${condition}`)
    }
    static async getCount(){
        return await axios.get("http://localhost:9000/company/workers/salary/max")
    }
    static async postMove(workerId, idFrom, idTo){
        return await axios.get(`http://localhost:9090/move/${workerId}/${idFrom}/${idTo}`)
    }
}