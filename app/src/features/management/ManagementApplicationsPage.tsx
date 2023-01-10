import { PlusOutlined } from "@ant-design/icons";
import { SearchWrapper } from "../../core/components/SearchWrapper";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { CreateApplicationModal } from "../../core/components/Modals/CreateApplicationModal";
import { ApiQueryParams } from "../../core/lib/api";
import { dispatch } from "../../store/store";
import { StoreState } from "../../types/store";
import { ApplicationsTable } from "./components/ApplicationManagement/ApplicationsTable";
import { ManagementNavigation } from "./components/ManagementNavigation";
import { loadServerApplications } from "./state/applications/actions";
import { ConditionalWrapper } from "../../core/components/ConditionLayout";
import { DataNotFound } from "../../core/components/DataNotFound";
import { InputSearch } from "core/ui-components/Input/InputSearch";
import { Button } from "core/ui-components/Button/Button";
import { Card } from "core/ui-components/Card/Card";

export const ManagementApplicationsPage = () => {
  const { applications, hasFetched } = useSelector(
    (state: StoreState) => state.serverApplications
  );
  const [search, setSearch] = useState<string>(null);
  const [openNewAppDrawer, setOpenNewAppDrawer] = useState<boolean>(false);

  const queryParams: ApiQueryParams = { search, order: "DESC", sortBy: "createdAt" };

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [search]);

  const fetchApplications = () => {
    dispatch(loadServerApplications(queryParams));
  };

  return (
    <ManagementNavigation>
      <Card
        title="Applications list"
        extra={
          <Button onClick={() => setOpenNewAppDrawer(true)} icon={<PlusOutlined />}>
            New aplication
          </Button>
        }
      >
        <SearchWrapper className="pb-5">
          <InputSearch
            placeholder="Search application by name"
            value={search}
            onChange={setSearch}
          />
        </SearchWrapper>
        <ConditionalWrapper
          isEmpty={applications?.length === 0}
          isLoading={!hasFetched}
          emptyView={<DataNotFound label="Applications not found. Create first one!" />}
        >
          <ApplicationsTable applications={applications} hasFetched={hasFetched} />
        </ConditionalWrapper>
      </Card>

      <CreateApplicationModal
        isOpen={openNewAppDrawer}
        onCancel={() => setOpenNewAppDrawer(false)}
        isAdmin={true}
      />
    </ManagementNavigation>
  );
};

export default ManagementApplicationsPage;
