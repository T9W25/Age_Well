import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api/prescriptions" });

export const getPrescriptions = async (userId) => {
  try {
    const res = await API.get(`/${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data;
  } catch (error) {
    return [];
  }
};
