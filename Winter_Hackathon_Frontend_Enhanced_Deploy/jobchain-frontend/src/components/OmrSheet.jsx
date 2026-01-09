import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { examApi } from "@/api/client";

export default function OmrSheet({
  applicationId,
  vacancyId,
  questions,
  mode,
}) {
  const navigate = useNavigate();

  const [answers, setAnswers] = useState(() => {
    const obj = {};
    questions.forEach((q) => {
      obj[q.qNo] =
        mode === "ALL_A"
          ? "A"
          : ["A", "B", "C", "D"][Math.floor(Math.random() * 4)];
    });
    return obj;
  });

  const [submitting, setSubmitting] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(1);

  const handleChange = (qNo, value) => {
    setAnswers((prev) => ({ ...prev, [qNo]: value }));
  };

  const submitOmr = async () => {
    if (!window.confirm("Are you sure you want to submit the exam? This action cannot be undone.")) {
      return;
    }

    setSubmitting(true);
    try {
      await examApi.submitOmr({
        applicationId,
        vacancyId,
        omrAnswers: answers,
      });

      alert("OMR submitted successfully");
      navigate("/candidate/apply");
    } catch (err) {
      alert("OMR submission failed");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate progress
  const answeredCount = Object.values(answers).filter(v => v).length;
  const progress = Math.round((answeredCount / questions.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">OMR Answer Sheet</h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${mode === "ALL_A" ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                  <span className="text-sm font-medium text-gray-600">
                    Mode: {mode === "ALL_A" ? 'All A' : 'Random'}
                  </span>
                </div>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-600">{questions.length} Questions</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full md:w-64">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">Progress</span>
                <span className="font-semibold text-blue-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {answeredCount} of {questions.length} answered
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Question Navigation Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="font-bold text-gray-800 mb-4">Question Navigation</h3>
              <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-4 gap-2 mb-6">
                {questions.map((q) => (
                  <button
                    key={q.qNo}
                    onClick={() => {
                      setSelectedQuestion(q.qNo);
                      document.getElementById(`question-${q.qNo}`)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-all ${
                      selectedQuestion === q.qNo
                        ? 'bg-blue-600 text-white shadow-md transform scale-105'
                        : answers[q.qNo]
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {q.qNo}
                  </button>
                ))}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">Answered</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  <span className="text-sm text-gray-600">Unanswered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main OMR Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {questions.map((q) => (
                  <div
                    key={q.qNo}
                    id={`question-${q.qNo}`}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                      selectedQuestion === q.qNo
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedQuestion(q.qNo)}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-bold">
                        {q.qNo}
                      </div>
                      <p className="text-gray-800 font-medium flex-1">{q.text}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {["A", "B", "C", "D"].map((opt) => {
                        const isSelected = answers[q.qNo] === opt;
                        return (
                          <label
                            key={opt}
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-blue-100 border-2 border-blue-500'
                                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? 'border-blue-600 bg-blue-600'
                                : 'border-gray-400'
                            }`}>
                              {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                              )}
                            </div>
                            <input
                              type="radio"
                              name={`q${q.qNo}`}
                              value={opt}
                              checked={isSelected}
                              onChange={() => handleChange(q.qNo, opt)}
                              className="hidden"
                            />
                            <span className={`font-medium ${
                              isSelected ? 'text-blue-700' : 'text-gray-700'
                            }`}>
                              {opt}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="mt-10 pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">Review your answers before submission.</p>
                    <p className="text-gray-500">Once submitted, changes cannot be made.</p>
                  </div>
                  <button
                    onClick={submitOmr}
                    disabled={submitting}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px] flex items-center justify-center gap-3"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Submit OMR Sheet
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}