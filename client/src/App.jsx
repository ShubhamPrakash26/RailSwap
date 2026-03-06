import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import LandingPage from "./pages/LandingPage";
// import Profile from "./pages/profile";
import SeatSwap from "./pages/SeatSwap";
import RoutePlanner from "./pages/RoutePlanner";
import Community from "./pages/Community";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/seat-swap" element={<SeatSwap />} />
      <Route path="/route-planner" element={<RoutePlanner />} />
      <Route path="/community" element={<Community />} />
      
      {/* <Route path="/profile" element={<Profile />} /> */}
      
    </Routes>
  );
}

export default App;