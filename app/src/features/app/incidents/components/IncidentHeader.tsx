import {
  ArrowLeftOutlined,
  DownOutlined,
  SyncOutlined,
  UserAddOutlined
} from "@ant-design/icons";
import { Space, Tooltip, Button as AntButton, Popover, Dropdown, Menu } from "antd";
import { AssignMemberPopover } from "../../../../core/components/AssignMemberPopover";
import { FC, useState } from "react";
import { dispatch } from "../../../../store/store";
import {
  handleIncidentStatus,
  Incident,
  IncidentStatus
} from "../../../../types/incidents";
import { handleIncidentColor } from "../../../../core/components/IncidentStatusTag";
import PageHeader from "../../../../core/components/PageHeader";
import { notify } from "../../../../core/utils/notify";
import { updateIncident } from "../state/actions";
import { joinClasses } from "../../../../core/utils/classes";
import { useNavigate } from "react-router-dom";
import { Button } from "core/ui-components/Button/Button";
import { Typography } from "core/ui-components/Typography/Typography";
import { Avatar } from "core/ui-components/Avatar/Avatar";

interface Props {
  incident: Incident;
  onExecute: () => void;
}
export const IncidentHeader: FC<Props> = ({ incident, onExecute }) => {
  const navigate = useNavigate();

  const refresh = () => {
    onExecute();
    notify.success("Refreshed");
  };

  return (
    <PageHeader
      title={
        <Space direction="vertical" className="gap-0 w-full">
          <Space
            className="text-2xs cursor-pointer font-semibold py-0 hover:text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftOutlined />
            <Typography size="xxs" weight="semibold" className="uppercase">
              incidents
            </Typography>
          </Space>
          <div className="flex flex-col gap-2 pt-2 pb-5">
            <Typography size="xxl" weight="semibold">
              {incident?.type}
            </Typography>
            <Typography>{incident?.message}</Typography>
          </div>
        </Space>
      }
      subTitle={<ButtonsSection incident={incident} />}
      suffix={
        <Tooltip title="Refresh">
          <SyncOutlined onClick={refresh} className="text-xs cursor-pointer" />
        </Tooltip>
      }
    />
  );
};

interface ButtonsProps {
  incident: Incident;
}
const ButtonsSection: FC<ButtonsProps> = ({ incident }) => {
  const [isVisible, setVisible] = useState<boolean>(false);

  const isAssigned = !!incident?.assigned;

  const update = (update: { [key: string]: any }) => {
    dispatch(updateIncident(update));
  };

  const changeStatus = (status: IncidentStatus) => update({ status });

  // const remove = async () => {
  //   const response: ApiResponse<string> = await api.delete(
  //     `/api/incidents/${incident.id}`
  //   );
  //   if (response.status === "success") {
  //     navigate(`/app/${application.id}/incidents`);
  //   }
  // };

  const overlay = (
    <Menu onClick={(v) => changeStatus(v.key as IncidentStatus)}>
      {Object.values(IncidentStatus).map((status) => (
        <Menu.Item key={status}>{handleIncidentStatus[status]}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Space className="w-full mt-2 justify-between">
      <Space>
        <Dropdown overlay={overlay} placement="bottom">
          <AntButton
            className={joinClasses(handleIncidentColor[incident.status], "text-xs")}
          >
            {handleIncidentStatus[incident.status]}
          </AntButton>
        </Dropdown>
        <Popover
          visible={isVisible}
          placement="bottom"
          content={<AssignMemberPopover setVisible={setVisible} />}
        >
          <Space
            className="w-full justify-start cursor-pointer"
            onClick={() => setVisible(!isVisible)}
          >
            {isAssigned ? (
              <Button
                icon={
                  <Avatar
                    size="sm"
                    src={incident?.assigned?.gravatar}
                    alt={incident?.assigned?.name}
                  />
                }
                variant="ghost"
              >
                <>
                  {incident?.assigned?.name}
                  <DownOutlined className="text-xs pl-2" />
                </>
              </Button>
            ) : (
              <Button variant="ghost">
                <UserAddOutlined />
              </Button>
            )}
          </Space>
        </Popover>
        {/* <Permissions statuses={[MemberRole.ADMINISTRATOR, MemberRole.MAINTAINER]}>
          <Confirm
            onOk={remove}
            description="Are you sure you want to delete this incident?"
          >
            <Button type="primary" icon={<ScissorOutlined />} danger className="text-xs">
              Delete
            </Button>
          </Confirm>
        </Permissions> */}
      </Space>
    </Space>
  );
};
