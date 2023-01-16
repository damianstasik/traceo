import {
  CheckCircleFilled,
  LockFilled,
  SafetyCertificateFilled
} from "@ant-design/icons";
import { Avatar } from "core/ui-components/Avatar";
import { Space } from "core/ui-components/Space";
import { Tooltip } from "core/ui-components/Tooltip";
import { Typography } from "core/ui-components/Typography";
import { FC } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AccountStatusTag } from "../../../../core/components/AccountStatusTag";
import { PaginatedTable } from "../../../../core/components/PaginatedTable";
import { Account, AccountStatus } from "../../../../types/accounts";
import { StoreState } from "../../../../types/store";

interface Props {
  accounts: Account[];
  hasFetched?: boolean;
}
export const AccountsTable: FC<Props> = ({ accounts, hasFetched }) => {
  const { account } = useSelector((state: StoreState) => state.account);
  const navigate = useNavigate();

  const columns = [
    {
      width: 50,
      render: (account: Account) => (
        <Avatar size="sm" src={account?.gravatar} alt={account?.username} />
      )
    },
    {
      title: "Username",
      render: (account: Account) => <RenderProfile {...account} />
    },
    {
      title: "Name",
      dataIndex: "name"
    },
    {
      title: "Email",
      dataIndex: "email"
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: AccountStatus) => <AccountStatusTag status={status} />
    }
  ];

  const RenderProfile = (currentAccount: Account) => {
    return (
      <Space>
        <Typography className="text-primary">{currentAccount?.username}</Typography>
        {currentAccount?.id === account?.id && (
          <Tooltip placement="left" title="It's you!">
            <CheckCircleFilled className="p-1 text-amber-600" />
          </Tooltip>
        )}
        {currentAccount.isAdmin && (
          <Tooltip placement="top" title="Server admin">
            <SafetyCertificateFilled />
          </Tooltip>
        )}
        {currentAccount?.status === AccountStatus.DISABLED && (
          <Tooltip placement="top" title="Account disabled">
            <LockFilled />
          </Tooltip>
        )}
      </Space>
    );
  };

  return (
    <>
      <PaginatedTable
        onRowClick={(account) => navigate(`/dashboard/management/accounts/${account.id}`)}
        loading={!hasFetched}
        columns={columns}
        pageSize={15}
        dataSource={accounts}
        className="cursor-pointer"
      />
    </>
  );
};
