import { Navigate, Route, Routes } from "react-router-dom";
import Quests from "@/pages/Quests";

export default function App() {
  return (
    <Routes>
      <Route path="/quests" element={<Quests />} />
      <Route path="/quests/:slug" element={<Quests />} />
      <Route path="*" element={<Navigate to="/quests" replace />} />
    </Routes>
  );
}
