
  import { RecoilRoot, useRecoilValue, useSetRecoilState } from 'recoil';
  import './App.css'
  import { authState } from './store/auth';
  import { useEffect, useState } from 'react';
  import { getStoredAuthData, getUserRole } from './utils/auth';
  import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
  import {LoginPage} from './pages/LoginPage';
  import {RegisterPage }from './pages/RegisterPage';
  import {LandingPage} from './pages/LandingPage';
  import { ProtectedRoute } from './components/auth/Protected';
  import {Layout} from './components/layout/Layout';
  import {InterviewPage} from './pages/InterviewPage';
  import {AdminPage} from './pages/AdminPage';
  import { QuestionPage } from './pages/QuestionPagee';
  import { QuestionPageId } from './pages/QuestionPageId';
  import {InterviewSessionId} from './pages/InterviewSessionId';
import { sessionState } from './store/session';
import { ToastContainer } from 'react-toastify';
import { SratedInterview } from './pages/SratedInterview';
import { ResponseAndFeedback } from './pages/Resopnceandfeedback';
import { About } from './pages/About';

  const AppContent: React.FC = () => {
    const setAuth = useSetRecoilState(authState);
    const setSessions = useSetRecoilState(sessionState);
    const sessionData = useRecoilValue(sessionState) ;
      const [loading, setLoading] = useState(true); 
    useEffect(() => {
      // Initialize auth state from localStorage
      const { token, user } = getStoredAuthData();
      
      if (token && user) {
        const role = getUserRole(user);
        setAuth({
          user,
          token,
          isAuthenticated: true,
          role,
        });
      }
      if (sessionData) {
        setSessions(sessionData);
      }
      setLoading(false); 
    }, [setAuth]);
     if (loading) return (
  <div className="flex flex-col items-center justify-center min-h-96 space-y-4">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
    <div className="text-xl font-medium text-gray-700">Loading, please wait...</div>
  </div>
);

    return (
    <Router>
  <Routes>
    {/* Public */}
    <Route element={<Layout />}>
      <Route index element={<LandingPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
    </Route>

    {/* Protected */}
    <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
      <Route index element={<Navigate to="/app/question" replace />} />
      <Route path ="About" element={<About/>} />
      <Route path="question" element={<QuestionPage/>} />
      <Route path="question/:id" element={<QuestionPageId />} />
      <Route path="interview" element={<InterviewPage />} />
      <Route path="interview/:sessionId" element={<InterviewSessionId/>} />
      <Route path="ResponseAndFeedback/:id" element={<ResponseAndFeedback/>} />
      <Route path="interviewstarted/:sessionId/question/:questionId" element={<SratedInterview/>} />
      <Route path="admin/*" element={
        <ProtectedRoute requireAdmin>
          <AdminPage />
        </ProtectedRoute>
      } />
    </Route>

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
</Router>

    );
  };

  function App() {
    return (
      <RecoilRoot>
        <AppContent />
        <ToastContainer position="top-right" autoClose={3000}></ToastContainer> 
      </RecoilRoot>
    );
  }
  export default App
