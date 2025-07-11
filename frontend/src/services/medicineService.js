import axios from 'axios';

const BASE_URL = 'http://localhost:8086/api/medicines';

export const getAllMedicines = () => axios.get(BASE_URL);
export const getMedicineById = (id) => axios.get(`${BASE_URL}/${id}`);
export const createMedicine = (data) => axios.post(BASE_URL, data);
export const updateMedicine = (id, data) => axios.put(`${BASE_URL}/${id}`, data);
export const deleteMedicine = (id) => axios.delete(`${BASE_URL}/${id}`);
