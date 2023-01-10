import { useApi } from "../../../../core/lib/useApi";
import { SyncOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { IncidentsOverviewPlot } from "../../../../core/components/Plots/components/IncidentsOverviewPlot";
import { AppIncidentsStats, PieData } from "../../../../types/statistics";
import { dispatch } from "../../../../store/store";
import { ErrorDetails } from "../../../../types/incidents";
import { StatCards } from "./StatCards";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { loadApplication } from "../../../../features/app/state/application/actions";
import { Card } from "core/ui-components/Card/Card";

export interface TotalOverviewType {
  errors: ErrorDetails[];
  pie: PieData[];
}

export const OverviewSection = () => {
  const { id } = useParams();

  const {
    data: stats,
    isLoading,
    execute: get
  } = useApi<TotalOverviewType>({
    url: "/api/statistics/total",
    params: {
      id
    }
  });

  const {
    data: cardStats,
    isLoading: loadingCardStats,
    execute: getCardStats
  } = useApi<AppIncidentsStats>({
    url: "/api/statistics",
    params: {
      id
    }
  });

  const refresh = () => {
    get();
    getCardStats();
    dispatch(loadApplication());
  };

  return (
    <div className="grid grid-cols-3 w-full mb-1">
      <div className="col-span-3 h-full">
        <Card
          title="App overview"
          extra={<SyncOutlined className="text-xs" onClick={() => refresh()} />}
        >
          <ConditionalWrapper
            emptyView={<DataNotFound />}
            isEmpty={stats?.pie?.length === 0}
            isLoading={isLoading}
          >
            <StatCards stats={cardStats} isLoading={loadingCardStats} />
            <IncidentsOverviewPlot stats={stats?.errors} />
          </ConditionalWrapper>
        </Card>
      </div>
      {/* <div className="col-span-1 ml-2 h-full">
        <Card
          title="Incidents"
          extra={<SyncOutlined className="text-xs" onClick={() => refresh()} />}
        >
          <ConditionalWrapper
            emptyView={<DataNotFound />}
            isEmpty={stats?.pie?.length === 0}
            isLoading={isLoading}
          >
            <IncidentsPie data={stats?.pie} />
          </ConditionalWrapper>
        </Card>
      </div> */}
    </div>
  );
};
