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
import KnowledgeBaseConfig from "./components/dashboard/KnowledgeBaseConfig";
import WidgetConfiguration from "./components/dashboard/WidgetConfiguration";
import AnalyticsDashboard from "./components/dashboard/AnalyticsDashboard";
import SettingsPage from "./components/dashboard/SettingsPage";
import EmbedCode from "./components/dashboard/EmbedCode";
import PromptTemplates from "./components/dashboard/PromptTemplates";
import Users from "./components/dashboard/user-management/Users";
import Roles from "./components/dashboard/user-management/Roles";
import Permissions from "./components/dashboard/user-management/Permissions";
import AssignRole from "./components/dashboard/user-management/AssignRole";
import AssignPermission from "./components/dashboard/user-management/AssignPermission";
import UserActivity from "./components/dashboard/user-management/UserActivity";
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
            <Route path="ai-models" element={<AIModelConfig />} />
            <Route path="knowledge-base" element={<KnowledgeBaseConfig />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
            <Route path="prompt-templates" element={<PromptTemplates />} />
            <Route path="embed" element={<EmbedCode />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="users" element={<Users />} />
            <Route path="roles" element={<Roles />} />
            <Route path="permissions" element={<Permissions />} />
            <Route path="assign-role" element={<AssignRole />} />
            <Route path="assign-permission" element={<AssignPermission />} />
            <Route path="user-activity" element={<UserActivity />} />
          </Route>
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </Suspense>
      <GlobalLoading />
    </>
  );
}

export default App;
