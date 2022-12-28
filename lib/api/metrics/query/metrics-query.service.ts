import { Injectable, Logger } from "@nestjs/common";
import { DataSourceService } from "lib/api/data-source/dataSource.service";
import { INTERNAL_SERVER_ERROR } from "lib/common/helpers/constants";
import { MetricQueryDto } from "lib/common/types/dto/metrics.dto";
import { ApiResponse } from "lib/common/types/dto/response.dto";
import { TSDB_PROVIDER } from "lib/common/types/enums/tsdb.enum";
import { IMetric, MetricsResponse } from "lib/common/types/interfaces/metrics.interface";
import { Metric } from "lib/db/entities/metric.entity";
import { InfluxService } from "lib/providers/influx/influx.service";
import { EntityManager } from "typeorm";

@Injectable()
export class MetricsQueryService {
    private readonly logger: Logger;

    constructor(
        private readonly entityManager: EntityManager,
        private readonly influxService: InfluxService,
        private readonly dataSourceService: DataSourceService
    ) {
        this.logger = new Logger(MetricsQueryService.name)
    }

    async getMetricData(appId: string, query: MetricQueryDto): Promise<ApiResponse<MetricsResponse[]>> {
        const app = await this.dataSourceService.getDataSourceOrThrowError(appId);
        if (!app) {
            return;
        }

        switch (app.connectedTSDB) {
            case TSDB_PROVIDER.INFLUX2: {
                const response = await this.influxService.queryData(appId, app.influxDS, query);
                return new ApiResponse("success", undefined, response);
            }
            default:
                return new ApiResponse("error", undefined, []);
        }
    }

    public async getApplicationMetrics(applicationId: string): Promise<ApiResponse<IMetric[]>> {
        try {
            const metrics = await this.entityManager.getRepository(Metric).find({
                where: {
                    application: {
                        id: applicationId
                    }
                }
            });

            return new ApiResponse("success", undefined, metrics);
        } catch (err) {
            this.logger.error(`[${this.getApplicationMetrics.name}] Caused by: ${err}`);
            return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
        }
    }
}