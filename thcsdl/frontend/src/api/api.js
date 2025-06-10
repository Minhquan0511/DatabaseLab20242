import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Customers
export const getCustomers = async () => {
  const response = await api.get('/customers');
  return response.data;
};

export const addCustomer = async (customerData) => {
  const response = await api.post('/customers', customerData);
  return response.data;
};

export const updateCustomer = async (customerID, customerData) => {
  const response = await api.put(`/customers/${customerID}`, customerData);
  return response.data;
};

export const deleteCustomer = async (customerID) => {
  await api.delete(`/customers/${customerID}`);
};

// Vehicles
export const getVehicles = async () => {
  const response = await api.get('/vehicles');
  return response.data;
};

export const addVehicle = async (vehicleData) => {
  const response = await api.post('/vehicles', vehicleData);
  return response.data;
};

export const updateVehicle = async (licensePlate, vehicleData) => {
  const response = await api.put(`/vehicles/${licensePlate}`, vehicleData);
  return response.data;
};

export const deleteVehicle = async (licensePlate) => {
  await api.delete(`/vehicles/${licensePlate}`);
};

// Services
export const getServices = async () => {
  const response = await api.get('/services');
  return response.data;
};

export const addService = async (serviceData) => {
  const response = await api.post('/services', serviceData);
  return response.data;
};

export const updateService = async (serviceID, serviceData) => {
  const response = await api.put(`/services/${serviceID}`, serviceData);
  return response.data;
};

export const deleteService = async (serviceID) => {
  await api.delete(`/services/${serviceID}`);
};

// Service Registrations
export const getServiceRegistrations = async () => {
  const response = await api.get('/service-registrations');
  return response.data;
};

// Parking Spots
export const getParkingSpots = async () => {
  const response = await api.get('/parking-spots');
  return response.data;
};

export const updateParkingSpot = async (parkingSpotID, spotData) => {
  const response = await api.put(`/parking-spots/${parkingSpotID}`, spotData);
  return response.data;
};

// Tickets
export const getTickets = async () => {
  const response = await api.get('/tickets');
  return response.data;
};

export const addTicket = async (ticketData) => {
  const response = await api.post('/tickets', ticketData);
  return response.data;
};

export const updateTicket = async (ticketID, ticketData) => {
  const response = await api.put(`/tickets/${ticketID}`, ticketData);
  return response.data;
};

// Employees
export const getEmployees = async () => {
  const response = await api.get('/employees');
  return response.data;
};

export const addEmployee = async (employeeData) => {
  const response = await api.post('/employees', employeeData);
  return response.data;
};

export const updateEmployee = async (employeeID, employeeData) => {
  const response = await api.put(`/employees/${employeeID}`, employeeData);
  return response.data;
};

export const deleteEmployee = async (employeeID) => {
  await api.delete(`/employees/${employeeID}`);
};

// Dashboard Stats
export async function getDashboardStats() {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

// --- AUTHENTICATION / USERS ---
// Register a new user
export const signUp = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// Login user
export const signIn = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export default api;