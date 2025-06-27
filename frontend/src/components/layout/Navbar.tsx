import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  Brain, Home, Settings, MessageSquare, LogOut, User,
  LogIn, Book, Minus, Menu, X
} from 'lucide-react';

import {
  authState, userSelector, isAdminSelector,
} from '../../store/auth';
import { authService } from '../../services/auth';
import { Button } from '../ui/Button';
import Timer from './Timer';
import { sessionState } from '../../store/session';
import { toast } from 'react-toastify';
import { clearAuthData, clearQuestionData, clearsessionData } from '../../utils/auth';
import { sessionService } from '../../services/sesssion';
import { questionDataState } from '../../store/questionData';
import { userQuestionService } from '../../services/UserQuestion';

export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const user = useRecoilValue(userSelector);
  const isAdmin = useRecoilValue(isAdminSelector);
  const session = useRecoilValue(sessionState);
  const setSession = useSetRecoilState(sessionState);
  const questionData = useRecoilValue(questionDataState);
  const setAuth = useSetRecoilState(authState);
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    setAuth({
      user: null,
      token: null,
      isAuthenticated: false,
      role: null,
    });
    navigate('/login');
  };

  const endSession = (id: string) => async () => {
    try {
      await sessionService.endsession(id);
      await userQuestionService.deleteUserQuestion(questionData.id);
      setSession({
        id: "",
        domain: { id: 0, name: "" },
        description: "",
        userDomain: 0,
        started_at: "",
      });
      clearsessionData();
      clearQuestionData();
      toast.success("Session ended successfully");
    } catch (error) {
          clearsessionData();
      clearQuestionData();
      clearAuthData();
      navigate('/login');
      console.error("Error ending session:", error);
      toast.error("Failed to end session. Please try again.");
  
    } finally {
      navigate('/app');
    }
  };

  const handleBlockedNav = (e: React.MouseEvent, warning: string) => {
    if (session.started_at !== "") {
      toast.warning(warning);
      e.preventDefault();
    }
  };

  const navLinkClass = (disabled: boolean) =>
    `flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
      disabled
        ? 'cursor-not-allowed text-gray-400'
        : 'hover:bg-blue-50 text-gray-700 hover:text-blue-600'
    }`;

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-md border-b border-white/20">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/dashboard"
            onClick={(e) =>
              handleBlockedNav(e, "Interview is ongoing, can't leave this session")
            }
            className={navLinkClass(session.started_at !== "")}
          >
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Interview Prep
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {!isAdmin && (
              <>
                <Link
                  to="/app/About"
                  onClick={(e) => handleBlockedNav(e, "Interview is ongoing, can't leave this session")}
                  className={navLinkClass(session.started_at !== "")}
                >
                  <Home className="h-4 w-4" />
                  <span>About</span>
                </Link>
                <Link
                  to="/app/question"
                  onClick={(e) => handleBlockedNav(e, "Interview is ongoing, can't leave this session")}
                  className={navLinkClass(session.started_at !== "")}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Question</span>
                </Link>
                <Link
                  to="/app/interview"
                  onClick={(e) => handleBlockedNav(e, "Interview is ongoing, can't start new one")}
                  className={navLinkClass(session.started_at !== "")}
                >
                  <Book className="h-4 w-4" />
                  <span>Session</span>
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                to="/app/admin"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-600"
              >
                <Settings className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* User Info & Session Controls */}
          {user ? (
            <div className="hidden md:flex items-center space-x-4">
              {session.started_at !== "" && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                  <Timer />
                  <Button
                    onClick={endSession(session.id)}
                    className="flex items-center space-x-2"
                  >
                    <div className='flex justify-center'><Minus className="h-4 w-4" />
                    <span>End session</span></div>
                    
                  </Button>
                </div>
              )}
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                <User className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {user.name || user.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/login"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Items */}
        {menuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            {!isAdmin && (
              <>
                <Link to="/app/About" onClick={(e) => handleBlockedNav(e, "Interview is ongoing, can't leave this session")} className={navLinkClass(session.started_at !== "")}>
                  <Home className="h-4 w-4" />
                  <span>About</span>
                </Link>
                <Link to="/app/question" onClick={(e) => handleBlockedNav(e, "Interview is ongoing, can't leave this session")} className={navLinkClass(session.started_at !== "")}>
                  <MessageSquare className="h-4 w-4" />
                  <span>Question</span>
                </Link>
                <Link to="/app/interview" onClick={(e) => handleBlockedNav(e, "Interview is ongoing, can't start new one")} className={navLinkClass(session.started_at !== "")}>
                  <Book className="h-4 w-4" />
                  <span>Session</span>
                </Link>
              </>
            )}
            {isAdmin && (
              <Link to="/app/admin" className={navLinkClass(false)}>
                <Settings className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}

            {user ? (
              <div className="space-y-2">
                {session.started_at !== "" && (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <Timer />
                    <Button onClick={endSession(session.id)} size="sm">
                      <Minus className="h-4 w-4" />
                      <span>End</span>
                    </Button>
                  </div>
                )}
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">{user.name || user.email}</span>
                </div>
                <Button onClick={handleLogout}  size="sm" className="w-full">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
             <div className="space-y-2 flex flex-col">
                <Link to="/login">
                  <Button size="sm" className="w-full">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="w-full">Get Started</Button>
                </Link>  
              </div> 

            )}
          </div>
        )}
      </div>
    </nav>
  );
};
