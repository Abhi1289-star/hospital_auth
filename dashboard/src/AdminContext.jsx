import { createContext, useState } from "react";

export const AdminContext = createContext({
  isAuthenticated: false,
});

const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        admin,
        setAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
