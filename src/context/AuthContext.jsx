import React, { createContext, useContext, useState, useEffect } from "react";
import { ROLES, DEFAULT_GRADE_CONFIG } from "../constants/rules";
import { DEFAULT_USERS, initializeStorage } from "../services/storage";

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = "oniongrade_auth_state_v1";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Initialize storage and recover session if present
  useEffect(() => {
    initializeStorage();
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.isLoggedIn && data.user) {
          setUser(data.user);
          setRole(data.role || data.user.role);
          setIsLoggedIn(true);
          return;
        }
      }
    } catch (e) {
      console.error("Auth hydration error:", e);
    }
    // Starts in clean unauthenticated state per user specification
  }, []);

  const saveAuthState = (loggedIn, activeUser, activeRole) => {
    try {
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ isLoggedIn: loggedIn, user: activeUser, role: activeRole })
      );
    } catch (e) {}
  };

  const login = (selectedRole, credentials = {}) => {
    const baseUser = DEFAULT_USERS[selectedRole] || DEFAULT_USERS[ROLES.FARMER];
    const newUser = {
      ...baseUser,
      name: credentials.name || baseUser.name,
      phone: credentials.phone || baseUser.phone,
      email: credentials.email || baseUser.email,
      mandi: credentials.mandi || baseUser.mandi,
      role: selectedRole
    };

    setUser(newUser);
    setRole(selectedRole);
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    saveAuthState(true, newUser, selectedRole);

    showToast(`Authenticated as ${newUser.name} (${selectedRole.toUpperCase()})`, "success");
    return newUser;
  };

  const guestLogin = (targetRole = ROLES.FARMER) => {
    const template = DEFAULT_USERS[targetRole] || DEFAULT_USERS[ROLES.FARMER];
    const guestUser = {
      ...template,
      isDemo: true
    };
    setUser(guestUser);
    setRole(targetRole);
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    saveAuthState(true, guestUser, targetRole);

    showToast(`Entered as ${template.name} (${targetRole.toUpperCase()} Demo)`, "info");
    return guestUser;
  };

  const switchRole = (newRole) => {
    if (!ROLES[newRole.toUpperCase()]) return;
    const template = DEFAULT_USERS[newRole];
    setUser(template);
    setRole(newRole);
    setIsLoggedIn(true);
    saveAuthState(true, template, newRole);
    showToast(`Switched view to ${template.role.toUpperCase()}: ${template.name}`, "info");
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setIsLoggedIn(false);
    saveAuthState(false, null, null);
    showToast("Signed out. Returned to public overview.", "info");
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 3800);
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openScanner = () => setIsScannerOpen(true);
  const closeScanner = () => setIsScannerOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoggedIn,
        isLoginModalOpen,
        isScannerOpen,
        toast,
        login,
        logout,
        switchRole,
        guestLogin,
        openLoginModal,
        closeLoginModal,
        openScanner,
        closeScanner,
        showToast
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
