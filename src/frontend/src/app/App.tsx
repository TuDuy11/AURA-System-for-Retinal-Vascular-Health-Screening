import { useState } from "react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { ServicesSection } from "./components/ServicesSection";
import { AppointmentSection } from "./components/AppointmentSection";
import { AboutSection } from "./components/AboutSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { ForgotPasswordPage } from "./components/ForgotPasswordPage";
import { ResetPasswordPage } from "./components/ResetPasswordPage";
import { DoctorDashboard } from "./components/DoctorDashboard";
import { PatientDashboard } from "./components/PatientDashboard";
import { DevNotes } from "./components/DevNotes";
import { LoginResponse } from "./services/auth/types";
import { AuthController } from "./services/auth/AuthController";

type UserRole = "doctor" | "patient" | "guest";
type ViewMode =
  | "website"
  | "login"
  | "register"
  | "forgot-password"
  | "reset-password"
  | "dev-notes";

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>("guest");
  const [userId, setUserId] = useState<string | null>(null);
  const [loginResponse, setLoginResponse] =
    useState<LoginResponse | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("website");
  const [resetEmail, setResetEmail] = useState("");

  // Dev Easter Egg: Make showDevNotes available in browser console
  if (typeof window !== "undefined") {
    (window as any).showDevNotes = () =>
      setViewMode("dev-notes");
    (window as any).auraDebug = {
      showDevNotes: () => setViewMode("dev-notes"),
      showLogin: () => setViewMode("login"),
      demoAccounts: {
        patient: {
          email: "patient@example.com",
          password: "password",
        },
        doctor: {
          email: "doctor@aura.vn",
          password: "password",
        },
      },
    };
  }

  const handleLogin = (
    role: "doctor" | "patient",
    id: string,
    response: LoginResponse,
  ) => {
    setUserRole(role);
    setUserId(id);
    setLoginResponse(response);
    setViewMode("website");
  };

  const handleLogout = () => {
    AuthController.logout();
    setUserRole("guest");
    setUserId(null);
    setLoginResponse(null);
    setViewMode("website");
  };

  const handleBackToHome = () => {
    setViewMode("website");
  };

  const handleBackToPublic = () => {
    // Navigate back to public landing page
    setViewMode("website");
  };

  const showLogin = () => {
    setViewMode("login");
  };

  const showRegister = () => {
    setViewMode("register");
  };

  const backToLogin = () => {
    setViewMode("login");
  };

  const showForgotPassword = () => {
    setViewMode("forgot-password");
  };

  const handleResetLinkSent = (email: string) => {
    setResetEmail(email);
    setViewMode("reset-password");
  };

  const handleResetSuccess = () => {
    setViewMode("login");
  };

  const showDevNotes = () => {
    setViewMode("dev-notes");
  };

  // Show reset password page
  if (viewMode === "reset-password") {
    return (
      <ResetPasswordPage
        email={resetEmail}
        onResetSuccess={handleResetSuccess}
        onBackToLogin={backToLogin}
      />
    );
  }

  // Show forgot password page
  if (viewMode === "forgot-password") {
    return (
      <ForgotPasswordPage
        onBackToLogin={backToLogin}
        onResetLinkSent={handleResetLinkSent}
      />
    );
  }

  // Show register page
  if (viewMode === "register") {
    return (
      <RegisterPage
        onBackToLogin={backToLogin}
        onRegisterSuccess={handleLogin}
      />
    );
  }

  // Show login page
  if (viewMode === "login") {
    return (
      <LoginPage
        onLogin={handleLogin}
        onRegisterClick={showRegister}
        onForgotPassword={showForgotPassword}
        onBackToPublic={handleBackToPublic}
      />
    );
  }

  // Show doctor dashboard
  if (userRole === "doctor") {
    return (
      <DoctorDashboard
        onLogout={handleLogout}
        onBackToHome={handleBackToHome}
        onBackToPublic={handleBackToPublic}
        loginResponse={loginResponse}
      />
    );
  }

  // Show patient dashboard
  if (userRole === "patient") {
    return (
      <PatientDashboard
        onLogout={handleLogout}
        onBackToHome={handleBackToHome}
        onBackToPublic={handleBackToPublic}
        loginResponse={loginResponse}
      />
    );
  }

  // Show dev notes
  if (viewMode === "dev-notes") {
    return <DevNotes onBack={() => setViewMode("website")} />;
  }

  // Default: show public website
  return (
    <div className="min-h-screen bg-white">
      <Header onLoginClick={showLogin} />
      <main>
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <AppointmentSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}