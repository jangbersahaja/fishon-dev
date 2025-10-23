"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type AuthModalContextType = {
  isOpen: boolean;
  defaultTab: "signin" | "register";
  next?: string;
  showHomeButton: boolean;
  openModal: (
    tab?: "signin" | "register",
    nextUrl?: string,
    options?: { showHomeButton?: boolean }
  ) => void;
  closeModal: () => void;
};

const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined
);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState<"signin" | "register">("signin");
  const [next, setNext] = useState<string | undefined>(undefined);
  const [showHomeButton, setShowHomeButton] = useState(false);

  const openModal = (
    tab: "signin" | "register" = "signin",
    nextUrl?: string,
    options?: { showHomeButton?: boolean }
  ) => {
    setDefaultTab(tab);
    setNext(nextUrl);
    setShowHomeButton(options?.showHomeButton ?? false);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setShowHomeButton(false); // Reset when closing
  };

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        defaultTab,
        next,
        showHomeButton,
        openModal,
        closeModal,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within AuthModalProvider");
  }
  return context;
}
