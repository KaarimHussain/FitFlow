import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";

import Home from "./views/Home";
import { Navbar } from "@/components/Navbar";
import SignUp from "./views/Auth/Sign-up";
import SignIn from "./views/Auth/Sign-In";

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <Navbar />
      <Routes>
        {/* Base Route */}
        <Route path="/" element={<Home />} />
        {/* Auth Routes */}
        <Route path="/auth/sign-up" element={<SignUp />} />
        <Route path="/auth/sign-in" element={<SignIn />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
