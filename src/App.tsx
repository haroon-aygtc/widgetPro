import { Suspense } from "react";

function GlobalLoading() {
  return null;
}
import { useRoutes, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import AdminLayout from "./components/layout/AdminLayout";
import Dashboard from "./components/dashboard/Dashboard";
import AIModelConfig from "./components/dashboard/AIModelConfig";
import AIProviders from "./components/dashboard/AIProviders";
import KnowledgeBaseConfig from "./components/dashboard/KnowledgeBaseConfig";
import WidgetConfiguration from "./components/dashboard/WidgetConfiguration";
import AnalyticsDashboard from "./components/dashboard/AnalyticsDashboard";
import SettingsPage from "./components/dashboard/SettingsPage";
import EmbedCode from "./components/dashboard/EmbedCode";
import PromptTemplates from "./components/dashboard/PromptTemplates";
import UserManagement from "./components/dashboard/user-management/UserManagement";
import routes from "tempo-routes";

function App() {
  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="widgets" element={<WidgetConfiguration />} />
            <Route path="ai-providers" element={<AIProviders />} />
            <Route path="ai-models" element={<AIModelConfig />} />
            <Route path="knowledge-base" element={<KnowledgeBaseConfig />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
            <Route path="prompt-templates" element={<PromptTemplates />} />
            <Route path="embed" element={<EmbedCode />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="user-management" element={<UserManagement />} />
          </Route>
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </Suspense>
      <GlobalLoading />
    </>
  );
}

export default App;
