import {
  HomeOutlined,
  BugOutlined,
  CompassOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  LoadingOutlined
} from "@ant-design/icons";
import { Divider } from "antd";
import { logout } from "../.../../../../../core/utils/logout";
import { useSelector } from "react-redux";
import { MenuRoute } from "../.../../../../../types/navigation";
import { StoreState } from "../.../../../../../types/store";
import { NavBarItem } from "./NavBarItem";
import { NavbarWrapper } from "./NavbarWrapper";
import { Avatar } from "core/ui-components/Avatar/Avatar";
import { isEmptyObject } from "core/utils/object";

export const AppNavBar = () => {
  const { application } = useSelector((state: StoreState) => state.application);
  const { account } = useSelector((state: StoreState) => state.account);

  const renderAppIcon = () => {
    if (!application || isEmptyObject(application)) {
      return <LoadingOutlined />;
    }

    return <Avatar size="sm" alt={application.name} src={application.gravatar} />;
  };

  const topRoutes: MenuRoute[] = [
    {
      key: "overview",
      href: "/app/:id/overview",
      label: "Overview",
      icon: <HomeOutlined />
    }
  ];

  const mainRoutes: MenuRoute[] = [
    {
      key: "incidents",
      href: "/app/:id/incidents",
      label: "Incidents",
      icon: <BugOutlined />
    },
    {
      key: "explore",
      href: "/app/:id/explore/logs",
      label: "Explore",
      icon: <CompassOutlined />
    },
    {
      key: "metrics",
      href: "/app/:id/metrics",
      label: "Metrics",
      icon: <BarChartOutlined />
    }
  ];

  const settingsRoutes: MenuRoute[] = [
    {
      key: "settings",
      href: "/app/:id/settings/details",
      label: "Settings",
      icon: <SettingOutlined />
    }
  ];

  const userRoutes: MenuRoute[] = [
    {
      key: "account",
      href: "/dashboard/account/settings",
      label: "Account",
      icon: <UserOutlined />
    },
    {
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: () => logout()
    },
    {
      label: application.name,
      icon: renderAppIcon()
    }
  ];

  const filterRoutes = (routes: MenuRoute[]) =>
    !account.isAdmin ? routes.filter((r) => !r.adminRoute) : routes;

  return (
    <NavbarWrapper>
      <ul className="p-0 pt-5 h-full">
        {filterRoutes(topRoutes).map((route, index) => (
          <NavBarItem key={index} route={route} />
        ))}

        <Divider />

        {filterRoutes(mainRoutes).map((route, index) => (
          <NavBarItem key={index} route={route} />
        ))}

        <Divider />

        {filterRoutes(settingsRoutes).map((route, index) => (
          <NavBarItem key={index} route={route} />
        ))}
      </ul>

      <ul className="p-0 pt-5">
        {filterRoutes(userRoutes).map((route, index) => (
          <NavBarItem key={index} route={route} />
        ))}
      </ul>
    </NavbarWrapper>
  );
};
