import axios from "axios";

const BASE_URL = "https://job-chain-backend.onrender.com/api";
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (data) => apiClient.post("/auth/login", data),
  signup: (data) => apiClient.post("/auth/signup", data),
};

export const vacancyApi = {
  createVacancy: (data) => apiClient.post("/vacancies", data),
  getAllVacancies: () => apiClient.get("/vacancies"),
  getVacancyById: (id) => apiClient.get(`/vacancies/${id}`),
};

export const applicationApi = {
  submitApplication: (data) => apiClient.post("/applications", data),
  getApplicationsByVacancy: (vacancyId) =>
    apiClient.get(`/applications/vacancy/${vacancyId}`),
};

export const paperApi = {
  generatePaperSets: (vacancyId) =>
    apiClient.post(`/paper/generate-sets?vacancyId=${vacancyId}`),
  lockPaper: (vacancyId, centerId) =>
    apiClient.post(`/paper/lock?vacancyId=${vacancyId}&centerId=${centerId}`),
  getPaperSets: (vacancyId) =>
    apiClient.get(`/paper/${vacancyId}`),
};

export const examApi = {
  recordExamScore: (data) =>
    apiClient.post("/exam/record-score", data),
  publishMerit: (vacancyId) =>
    apiClient.post(`/exam/publish-merit?vacancyId=${vacancyId}`),
  getMeritList: (vacancyId) =>
    apiClient.get(`/exam/merit?vacancyId=${vacancyId}`),
  verifyMeritIntegrity: (vacancyId) =>
    apiClient.get(`/exam/verify?vacancyId=${vacancyId}`),
};

export const fraudApi = {
  getFraudAlerts: (vacancyId) =>
    apiClient.get(`/fraud/${vacancyId}`),
  analyzeFraud: (vacancyId) =>
    apiClient.post(`/fraud/analyze?vacancyId=${vacancyId}`),
};

export default apiClient;
