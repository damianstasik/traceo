export type IMetric = {
    id?: string;
    name: string;
    description: string;
    showDescription: boolean;
    isDefault: boolean;
    show: boolean;
    unit: string;
    series: IMetricSerie[],
    config: IMetricConfiguration;
};

export type IMetricSerie = {
    name: string;
    field: string;
    type: MetricValueEnum | string;
    config: {
        type: PLOT_TYPE | string;
        color: string;
    }
}

export type IMetricConfiguration = {
    line?: {
        width?: number;
        marker?: {
            show?: boolean;
        };
    },
    area: {
        show?: boolean;
        opacity?: number;
    },
    tooltip: {
        show: boolean;
        position: string;
    };
    legend: {
        show: boolean;
        orient: string;
    }
}

export type TOOLTIP_POSITION = "bottom" | "inside" | "left" | "right" | "top";
export enum PLOT_TYPE {
    BAR = "bar",
    LINE = "line",
    POINTS = "points"
}
export enum METRIC_UNIT {
    PERCENTAGE = "%",
    MEGABYTES = "MB",
    KILOBYTES = "kb",
    SECONDS = "s",
    MILISECONDS = "ms",
    NONE = ""
};

export type LegendOrientType = "vertical" | "horizontal";

export type IDefaultSDKMetrics = {
    cpu_usage: number;
    load_avg: number;
} & EventLoopMetricType & HeapMetricType & MemoryUsageMetricType;

export type ISDKMetrics = {
    default: IDefaultSDKMetrics;
    counter: Record<string, number>;
    meauserement: Record<string, number>;
    gauge: Record<string, number>;
    timeSeries: Record<string, number>;
};

export type MemoryUsageMetricType = {
    memory_usage_mb: number;
    memory_usage_percentage: number;
};

export type EventLoopMetricType = {
    loop_min: number;
    loop_max: number;
    loop_mean: number;
    loop_stddev: number;
};

export type HeapMetricType = {
    heap_used: number;
    heap_total: number;
    heap_rss: number;
    heap_native_contexts: number;
    heap_detached_contexts: number;
};

export interface MetricsQuery {
    id: string;
    fields: string[];
    hrCount: number;
}

export type MetricsResponse = {
    _time: string;
} & {
    [key: string]: number;
};

export enum MetricValueEnum {
    FLOAT_FIELD = "floatField",
    INT_FIELD = "intField"
};

export type MetricPreviewType = {
    options: IMetric,
    datasource: MetricsResponse[]
}
