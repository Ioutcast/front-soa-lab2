import axios from "axios";

export default class WorkerService{
    static async getAll(){
        return await axios.get("http://localhost:8080/comp")
    }
    static async getMax(){
        return await axios.get("http://localhost:8080/comp/max")
    }
    static async getCount(){
        return await axios.get("http://localhost:8080/comp/count")
    }
}