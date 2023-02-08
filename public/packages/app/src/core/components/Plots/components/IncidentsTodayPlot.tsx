import dayjs from "dayjs";
import { FC, lazy } from "react";
import { normalizePlotData, splitLine, tooltipOptions } from "../utils";
import { EChartsOption, graphic } from "echarts";
import { PlotData } from "../../../utils/statistics";

const ReactECharts = lazy(() => import("echarts-for-react"));

interface Props {
  stats: PlotData[];
}
const IncidentsTodayPlot: FC<Props> = ({ stats }) => {
  const plotData = normalizePlotData(stats);

  const option: EChartsOption = {
    dataset: {
      source: plotData
    },
    animation: false,
    tooltip: tooltipOptions,
    grid: {
      left: "24px",
      right: "24px",
      top: "15px",
      bottom: "30px",
      containLabel: true
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      axisLabel: {
        showMaxLabel: true,
        color: "#2d2d2d",
        fontSize: 11,
        padding: 0,
        interval: 2
      },
      splitLine,
      offset: 15,
      z: -3
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#2d2d2d",
        fontSize: 11
      },
      splitLine: {
        lineStyle: {
          color: "#ebebeb",
          width: 1
        }
      },
      z: -2,
      minInterval: 1,
      offset: 12
    },
    series: [
      {
        type: "line",
        name: "Errors",
        showSymbol: false,
        color: "#E24D42",
        symbolSize: 0,
        areaStyle: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "#641D2C"
            },
            {
              offset: 1,
              color: "#6B403A"
            }
          ])
        },
        lineStyle: {
          color: "#E24D42"
        },
        markLine: {
          itemStyle: {
            color: "#E24D42"
          },
          label: {
            show: false
          },
          tooltip: {
            show: false
          },
          symbol: ["none", "none"],
          data: [
            {
              xAxis: dayjs().local().hour()
            }
          ]
        },
        z: -1,
        markArea: {
          itemStyle: {
            color: "#111217",
            opacity: 0.6
          },
          data: [
            [
              {
                xAxis: dayjs().local().hour()
              },
              {
                xAxis: 999
              }
            ]
          ]
        }
      }
    ]
  };

  return (
    <ReactECharts
      style={{
        height: "200px"
      }}
      option={option}
    />
  );
};

export default IncidentsTodayPlot;
