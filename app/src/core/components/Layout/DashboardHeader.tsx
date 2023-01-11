import { useNavigate } from "react-router-dom";
import { TraceoLogo } from "../Icons/TraceoLogo";
import { Space } from "core/ui-components/Space/Space";

export const DashboardHeader = () => {
  const navigate = useNavigate();

  const breadcrumb = window.location.pathname.split("/");
  const isApp = breadcrumb.includes("app");
  const isDashboard = breadcrumb.includes("dashboard");

  if (!isApp && !isDashboard) {
    return null;
  }

  return (
    <nav className="flex h-12 max-h-12 items-center justify-between py-2 px-5 border-l-0 border-t-0 border-r-0 border-b border-solid border-secondary z-10 bg-canvas">
      <Space className="w-full">
        <TraceoLogo
          name={true}
          size="small"
          className="cursor-pointer"
          onClick={() => navigate("/dashboard/overview")}
        />
      </Space>
      <Space></Space>
    </nav>
  );
};
