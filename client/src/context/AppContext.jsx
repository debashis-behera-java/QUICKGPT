import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

// ✅ Base URL from env
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loadingUser, setLoadingUser] = useState(true);

  // 🔐 Helper: auth header
  const authHeader = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  // ✅ Fetch logged-in user
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/data", {
        headers: authHeader,
      });

      if (data.success) {
        setUser(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      setToken(null);
      localStorage.removeItem("token");
    } finally {
      setLoadingUser(false);
    }
  };

  // ✅ Create new chat
 const createNewChat = async () => {
  try {
    if (!user) return toast("Login to create a new chat");

    navigate("/");

    const { data } = await axios.post(
      "/api/chat/create",
      {},
      {
        headers: authHeader,
      }
    );

    if (data.success) {
      await fetchUserChats(); // ✅ ONLY ONCE
    }

  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};

  // ✅ Fetch user chats
  const fetchUserChats = async () => {
    try {
      const { data } = await axios.get("/api/chat/get", {
        headers: authHeader,
      });

      if (data.success) {
        setChats(data.chats);

        if (data.chats.length === 0) {
          await createNewChat();
          return;
        } else {
          setSelectedChat(data.chats[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // 🌗 Theme handling
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 🔄 Fetch chats when user changes
  useEffect(() => {
    if (user) {
      fetchUserChats();
    } else {
      setChats([]);
      setSelectedChat(null);
    }
  }, [user]);

  // 🔁 Initial load
  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setUser(null);
      setLoadingUser(false);
    }
  }, [token]);

  // 🔓 Logout / reset
  const resetApp = () => {
    setUser(null);
    setChats([]);
    setSelectedChat(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("theme");
  };

  const value = {
    navigate,
    user,
    setUser,
    fetchUser,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    theme,
    setTheme,
    resetApp,
    createNewChat,
    loadingUser,
    fetchUserChats,
    token,
    setToken,
    axios,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
