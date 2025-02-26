import React, { createContext, useEffect, useState, ReactNode } from "react";
import { ToastContainer } from "react-toastify";

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export interface AuthContextProps {
  user: any | null;
  loading: boolean;
  signIn: (emailOrMBNo: string | number, pin: string) => Promise<any>;
  signOut: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const response = await fetch(
            "https://mfs-web-app-backend.vercel.app/auth/check-auth",
            {
              headers: {
                Authorization: token,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            console.log(data);
            setUser(data.data);
          } else {
            console.error("Error fetching user details");
            localStorage.removeItem("token");
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user details", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  const signIn = async (emailOrMBNo: string | number, pin: string) => {
    setLoading(true);
    let mobileNumber = 0;
    let email = "";
    let service = {};
    if (typeof emailOrMBNo === "string") {
      email = emailOrMBNo;
      service = { email, pin };
    } else {
      mobileNumber = emailOrMBNo;
      service = { mobileNumber, pin };
    }
    // const service = { emailOrMBNo, pin };

    try {
      const response = await fetch(
        "https://mfs-web-app-backend.vercel.app/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(service),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        localStorage.setItem("token", data.data.token);
        setUser(data.data.user);
        return data;
      } else {
        return Promise.reject("Invalid emailOrMBNo or pin");
      }
    } catch (error) {
      console.error("Error during login", error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    try {
      fetch("https://mfs-web-app-backend.vercel.app/auth/logout", {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });
      localStorage.removeItem("token");
    } catch (e) {
      console.error("Error during logout");
    }
    setUser(null);
  };

  const authInfo: AuthContextProps = {
    user,
    loading,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
      <ToastContainer />
    </AuthContext.Provider>
  );
};

export default AuthProvider;
