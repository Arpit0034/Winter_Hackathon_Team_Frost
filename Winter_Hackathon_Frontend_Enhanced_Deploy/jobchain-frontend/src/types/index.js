export const Vacancy = {
  id: "",
  title: "",
  totalPosts: 0,
  createdAt: "",
  blockchainTxHash: "",
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
  examScore: false,
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
