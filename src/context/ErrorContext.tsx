import React, { createContext, useContext, useState } from "react";

const ErrorContext = createContext<{
  error: string | null;
  setError: (msg: string | null) => void;
}>({
  error: null,
  setError: () => {},
});

export const useError = () => useContext(ErrorContext);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [error, setError] = useState<string | null>(null);
  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  );
};
