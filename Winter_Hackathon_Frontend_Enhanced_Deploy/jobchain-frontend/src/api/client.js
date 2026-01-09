import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://job-chain-backend.onrender.com/api";
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
  getPaperSets: (vacancyId) => apiClient.get(`/paper/${vacancyId}`),
};

export const examApi = {
  recordExamScore: async (data) => apiClient.post("/exam/record-score", data),

  recordOmrOnChain: async (data) => {
    return apiClient.post('/exam/record-omr', {  
      applicationId: data.applicationId,
      qrData: data.qrData
    });
  },

  publishMerit: async (vacancyId) =>
    apiClient.post(`/exam/publish-merit?vacancyId=${vacancyId}`),

  getMeritList: async (vacancyId) =>
    apiClient.get(`/exam/merit?vacancyId=${vacancyId}`),

  verifyMeritIntegrity: async (vacancyId) =>
    apiClient.get(`/exam/verify?vacancyId=${vacancyId}`),

  isEligible: (applicationId) =>
    apiClient.get(`/exam/is-eligible/${applicationId}`),

  getPaper: (vacancyId) => apiClient.get(`/exam/paper/${vacancyId}`),

  submitOmr: async (data) => apiClient.post("/exam/submit-omr", data),
};

export const fraudApi = {
  getFraudAlerts: (vacancyId) => apiClient.get(`/fraud/${vacancyId}`),
  analyzeFraud: (vacancyId) =>
    apiClient.post(`/fraud/analyze?vacancyId=${vacancyId}`),
};

export const Application = {
  id: "",
  vacancyId: "",
  candidateName: "",
  email: "",
  category: "",
  appHash: "",
  status: "",
  blockchainTxHash: "",
  createdAt: "",
  testAttempted: false,
  marks: null, 
};
export const ExamScore = {
  id: "",
  vacancyId: "",
  applicationId: "",
  marks: 0,
  markingHash: "",
  blockchainTxHash: "",
};
export const MeritItem = { rank: 0, candidateName: "", marks: 0, category: "" };
export const MeritList = {
  meritList: [],
  meritHash: "",
  blockchainTxHash: "",
  verified: false,
};
export const FraudAlert = {
  vacancyId: "",
  alertType: "",
  suspectCount: 0,
  patternHash: "",
  timestamp: "",
};
export const PaperSet = {
  id: "",
  vacancyId: "",
  setId: "",
  paperHash: "",
  isLocked: false,
  timestamp: "",
  blockchainTxHash: "",
};
export const LoginRequest = { username: "", password: "" };
export const SignupRequest = { username: "", password: "" };
export const JwtResponse = { token: "" };
export const CreateVacancyRequest = { title: "", totalPosts: 0 };
export const CreateApplicationRequest = {
  vacancyId: "",
  candidateName: "",
  email: "",
  category: "",
  marks10: 0,
  marks12: 0,
};
export const RecordExamScoreRequest = {
  vacancyId: "",
  applicationId: "",
  marks: 0,
  markingJson: "",
};
export const PublishMeritResponse = {
  vacancyId: "",
  meritList: [],
  meritHash: "",
  blockchainTxHash: "",
};
export const VerifyMeritResponse = { verified: false };

export default apiClient;