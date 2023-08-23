import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const authContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")));
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  async function login(user) {
    const res = await axios.post("/auth/login", user);
    // Parse the response object
    // const parsedResponse = JSON.parse(JSON.stringify(res));
    setCurrentUser(res.data);
    // console.log("token: " + res.data.accessToken)
    localStorage.setItem("token", res.data.accessToken);
    navigate("/");
  }

  async function register(user) {
    const res = await axios.post("/auth/register", user);
    console.log(res.data)
    // setCurrentUser(res.data);
    // localStorage.setItem("token", res.data.accessToken);
    navigate("/login");
  }

  function logout() {
    setCurrentUser(null);
    localStorage.clear();
    navigate("/");
  }

  return (
    <authContext.Provider value={{ currentUser, setCurrentUser, login, logout, register }}>
      {children}
    </authContext.Provider>
  );
}
