import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api/checkin" });

// ✅ Save a new check-in
export const saveCheckIn = async (data) => {
  try {
    const res = await API.post("/", data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data;
  } catch (error) {
    return error.response?.data?.message || "Failed to save check-in";
  }
};

// ✅ Get user's check-in history
export const getCheckIns = async () => {
  try {
    const res = await API.get("/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data;
  } catch (error) {
    return [];
  }
};
