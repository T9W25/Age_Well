import axios from "axios";

const BASE_URL = "http://localhost:5000/api/prescriptions";

export const getPrescriptions = async (userId) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${BASE_URL}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const markMedicationTaken = async (prescriptionId) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(`${BASE_URL}/mark-taken/${prescriptionId}`, null, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
