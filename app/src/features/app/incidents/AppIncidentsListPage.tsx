import { Segmented } from "antd";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AppPage from "../components/AppPage";
import { SortIcons } from "../../../core/components/SortIcons";
import { IncidentTable } from "../../../features/app/incidents/components/IncidentTable";
import { useCleanup } from "../../../core/hooks/useCleanup";
import { ApiQueryParams } from "../../../core/lib/api";
import { dispatch } from "../../../store/store";
import {
  handleIncidentStatus,
  IncidentSortBy,
  IncidentStatusSearch
} from "../../../types/incidents";
import { StoreState } from "../../../types/store";
import { loadIncidents } from "../../../features/app/incidents/state/actions";
import { useParams } from "react-router-dom";
import { SortOrder } from "../../../types/api";
import { PagePanel } from "../../../core/components/PagePanel";
import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { SearchWrapper } from "../../../core/components/SearchWrapper";
import { EmptyIncidentsList } from "./components/EmptyIncidentsList";
import PageHeader from "../../../core/components/PageHeader";
import { BarChartOutlined, BugOutlined, LineChartOutlined } from "@ant-design/icons";
import {
  getLocalStorageIncidentPlotType,
  setLocalStorageIncidentPlotType
} from "../../../core/utils/localStorage";
import { INCIDENT_PLOT_TYPE } from "../../../types/metrics";
import { InputSearch } from "../../../core/ui-components/Input/InputSearch";
import { Select } from "core/ui-components/Select/Select";

const handlIncidentSortName: Record<IncidentSortBy, string> = {
  [IncidentSortBy.FIRST_SEEN]: "First seen",
  [IncidentSortBy.LAST_SEEN]: "Last seen",
  [IncidentSortBy.ERRORS_COUNT]: "Errors count",
  [IncidentSortBy.STATUS]: "Status"
};

const statusOptions = Object.values(IncidentStatusSearch).map((status) => ({
  label: handleIncidentStatus[status],
  value: status
}));

const sortOptions = Object.values(IncidentSortBy).map((sort) => ({
  label: handlIncidentSortName[sort],
  value: sort
}));

const changeBarOptions = [
  {
    icon: <BarChartOutlined />,
    value: "bar"
  },
  {
    icon: <LineChartOutlined />,
    value: "line"
  }
];

export const AppIncidentsListPage = () => {
  useCleanup((state: StoreState) => state.incident);

  const { id } = useParams();
  const { incidents, hasFetched } = useSelector((state: StoreState) => state.incidents);

  const [search, setSearch] = useState<string>(null);
  const [order, setOrder] = useState<SortOrder>("DESC");
  const [sortBy, setSortBy] = useState<IncidentSortBy>(IncidentSortBy.LAST_SEEN);
  const [status, setStatus] = useState<IncidentStatusSearch>(IncidentStatusSearch.ALL);

  const plot = getLocalStorageIncidentPlotType();
  const [plotType, setPlotType] = useState<INCIDENT_PLOT_TYPE>(plot);

  const queryParams: ApiQueryParams = {
    id,
    search: search ?? null,
    order,
    sortBy,
    status
  };

  useEffect(() => fetchIncidents(), []);

  useEffect(() => {
    fetchIncidents();
  }, [order, sortBy, status, search]);

  const fetchIncidents = () => dispatch(loadIncidents(queryParams));

  const onChangePlotType = (type: INCIDENT_PLOT_TYPE) => {
    setPlotType(type);
    setLocalStorageIncidentPlotType(type);
  };

  return (
    <AppPage>
      <PageHeader
        icon={<BugOutlined />}
        title="Incidents"
        subTitle="List of incidents catched by Traceo SDK"
      />
      <PagePanel>
        <SearchWrapper className="pt-2 pb-12">
          <InputSearch
            placeholder="Search incidents by type, message, status or assigned user"
            value={search}
            onChange={setSearch}
          />
          <Select
            placeholder="Select status"
            width={150}
            options={statusOptions}
            value={status}
            onChange={(opt) => setStatus(opt?.value)}
            isClearable
          />
          <Select
            placeholder="Sort by"
            width={150}
            options={sortOptions}
            value={sortBy}
            onChange={(opt) => setSortBy(opt?.value)}
            isClearable
          />
          <Segmented
            onResize={undefined}
            onResizeCapture={undefined}
            value={plotType}
            onChange={(v) => onChangePlotType(v as INCIDENT_PLOT_TYPE)}
            options={changeBarOptions}
          />
          <SortIcons order={order} setOrder={setOrder} />
        </SearchWrapper>

        <ConditionalWrapper
          isEmpty={incidents?.length === 0}
          isLoading={!hasFetched}
          emptyView={<EmptyIncidentsList constraints={search} />}
        >
          <IncidentTable isLoading={!hasFetched} incidents={incidents} />
        </ConditionalWrapper>
      </PagePanel>
    </AppPage>
  );
};

export default AppIncidentsListPage;
