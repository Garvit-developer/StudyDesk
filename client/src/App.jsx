import React from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Authlayout from "./layouts/Authlayout";
import CustomCursor from "./components/CustomCursor";
import Dashboardlayout from "./layouts/Dashboardlayout";
import Question from "./pages/Question";
import Settings from "./pages/Settings";
import History from "./pages/History";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import ForgotPassword from "./pages/ForgotPassword";
import EmailVerfication from "./pages/EmailVerfication";
import ResetPassword from "./pages/ResetPassword";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PomodoroTimer from "./components/PomodoroTimer";
import Flashcards from "./pages/Flashcards";

const App = () => {
  return (
    <>
      <Toaster />
      <div className="md:block hidden">
        <CustomCursor />
      </div>
      <BrowserRouter>
        <PomodoroTimer />
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="/dashboard" element={<Dashboardlayout />}>
              <Route index element={<Navigate to="question" replace />} />
              <Route path="question" element={<Question />} />

              <Route element={<ProtectedRoutes />}>
                <Route path="history" element={<History />} />
                <Route path="settings" element={<Settings />} />
                <Route path="flashcards" element={<Flashcards />} />
              </Route>
            </Route>
          </Route>

          <Route element={<Authlayout />}>
            <Route path="/login" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/email-verification" element={<EmailVerfication />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
