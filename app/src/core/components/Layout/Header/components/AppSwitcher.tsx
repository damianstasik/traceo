import { CheckCircleFilled, LoadingOutlined } from "@ant-design/icons";
import { List, Popover, Space } from "antd";
import { useSelector } from "react-redux";
import { Avatar } from "../../../../../core/components/Avatar";
import { StoreState } from "../../../../../types/store";
import { Application, ApplicationMember } from "../../../../../types/application";
import { slugifyForUrl } from "../../../../../core/utils/stringUtils";
import { useEffect } from "react";
import { dispatch } from "../../../../../store/store";
import { loadApplications } from "../../../../../features/dashboard/state/actions";
import { ConditionalWrapper } from "../../../../../core/components/ConditionLayout";
import { Typography } from "core/ui-components/Typography/Typography";

export const AppSwitcher = () => {
  const { application, hasFetched } = useSelector(
    (state: StoreState) => state.application
  );
  const { applications, hasFetched: fetchedApps } = useSelector(
    (state: StoreState) => state.applications
  );

  useEffect(() => {
    dispatch(loadApplications());
  }, []);

  const selectApp = (application: Application) => {
    // TODO: for some reason with using navigate first is 404 view and then go to the app overview
    // navigate(`/app/${application.id}/${slugifyForUrl(application.name)}/overview`);
    window.location.href = `/app/${application.id}/${slugifyForUrl(
      application.name
    )}/overview`;
  };

  const appSelector = () => (
    <ConditionalWrapper isLoading={!fetchedApps}>
      <List
        dataSource={applications}
        style={{ height: "240px", overflowY: "scroll" }}
        renderItem={(item: ApplicationMember) => (
          <List.Item
            onClick={() => selectApp(item.application)}
            className="cursor-pointer hover:bg-secondary px-3"
          >
            <Space>
              <Avatar name={item.application.name} url={item.application.gravatar} />
              <Typography>{item.application.name}</Typography>
              {item.application.id === application.id && (
                <CheckCircleFilled className="pl-2 text-yellow-600" />
              )}
            </Space>
          </List.Item>
        )}
      />
    </ConditionalWrapper>
  );

  return (
    <Popover
      trigger={["click"]}
      placement="topRight"
      title="Change app"
      content={appSelector}
    >
      <Space className="cursor-pointer">
        {!hasFetched ? (
          <LoadingOutlined />
        ) : (
          <Avatar shape="circle" name={application.name} url={application?.gravatar} />
        )}
      </Space>
    </Popover>
  );
};
