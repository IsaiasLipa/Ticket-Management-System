import "./App.css";
import TicketDashboard from "./components/TicketDashboard";
import { createContext, useState } from "react";
import type { ThemeContextValue } from "./types/types";

const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const changeTheme = () => {
    setIsDarkTheme((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkTheme, changeTheme }}>
      <div
        className={`min-h-screen transition-colors ${
          isDarkTheme
            ? "dark bg-slate-950 text-slate-100"
            : "bg-slate-50 text-slate-900"
        }`}
      >
        <TicketDashboard />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
export { ThemeContext };
