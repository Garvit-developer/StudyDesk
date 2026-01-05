import { useEffect, useState, createContext, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);


   const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me", {
          withCredentials: true,
        });
        if (res.data.message === "Not authenticated") {
          setUser(null);
        }else{
           setUser(res.data);
           console.log(res.data)
                      console.log("check")

        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };
    
  useEffect(() => {
   

    fetchUser();
  }, []);

  const logout = async () => {
    await axios.post(
      "/api/auth/logout",
      {},
      { withCredentials: true }
    );
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, setUser,fetchUser, logout, loadingUser }}>
      {children}
    </AuthContext.Provider>
  );
};
