import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MarketingPage } from "@/pages/MarketingPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { CoursePage } from "@/pages/CoursePage";
import { PracticePage } from "@/pages/PracticePage";
import { ProgressPage } from "@/pages/ProgressPage";
import { SettingsPage } from "@/pages/SettingsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MarketingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/course" element={<CoursePage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
