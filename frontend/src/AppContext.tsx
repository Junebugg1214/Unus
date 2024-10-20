import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  username: string;
  email: string;
}

interface ClonedRepo {
  repo_path: string;
}

interface AppContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  clonedRepo: ClonedRepo | null;
  setClonedRepo: React.Dispatch<React.SetStateAction<ClonedRepo | null>>;
  inferenceResult: string;
  setInferenceResult: React.Dispatch<React.SetStateAction<string>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [clonedRepo, setClonedRepo] = useState<ClonedRepo | null>(null);
  const [inferenceResult, setInferenceResult] = useState<string>('');

  return (
    <AppContext.Provider value={{ 
      user, 
      setUser, 
      clonedRepo, 
      setClonedRepo, 
      inferenceResult, 
      setInferenceResult 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};