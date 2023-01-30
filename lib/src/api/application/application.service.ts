import { Injectable, Logger } from '@nestjs/common';
import { AmrService } from '../application-member/amr.service';
import { EntityManager } from 'typeorm';
import * as crypto from "crypto";
import { ApplicationQueryService } from './application-query/application-query.service';
import { AccountQueryService } from '../account/account-query/account-query.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import dayjs from 'dayjs';
import { ADMIN_NAME, ADMIN_EMAIL, INTERNAL_SERVER_ERROR } from '@common/helpers/constants';
import dateUtils from '@common/helpers/dateUtils';
import { gravatar } from '@common/helpers/gravatar';
import { uuidService } from '@common/helpers/uuid';
import { CreateApplicationDto, ApplicationDto } from '@common/types/dto/application.dto';
import { Application } from '@db/entities/application.entity';
import { ApiResponse } from '@common/types/dto/response.dto';
import { Log } from '@db/entities/log.entity';
import { MemberRole } from '@traceo/types';
import { MetricsService } from '../metrics/metrics.service';
import { RequestContext } from '@common/middlewares/request-context/request-context.model';


const MAX_RETENTION_LOGS = 3;

@Injectable()
export class ApplicationService {
  private readonly logger: Logger;

  constructor(
    private readonly entityManager: EntityManager,
    private readonly awrService: AmrService,
    private readonly applicationQueryService: ApplicationQueryService,
    private readonly accountQueryService: AccountQueryService,
    private readonly metricsService: MetricsService
  ) {
    this.logger = new Logger(ApplicationService.name)
  }

  public async create(
    data: CreateApplicationDto
  ): Promise<ApiResponse<Application>> {
    const { id, username } = RequestContext.user;

    return this.entityManager.transaction(async (manager) => {
      const app = await this.applicationQueryService.getDtoBy({ name: data.name });
      if (app) {
        return new ApiResponse("error", "Application with this name already exists");
      }

      const account = await this.accountQueryService.getDtoBy({ id });
      if (!account) {
        throw new Error('Owner account is required!');
      }

      const url = gravatar.url(data.name, "identicon");
      const applicationPayload: Partial<Application> = {
        ...data,
        id: uuidService.generate(),
        owner: account,
        gravatar: url,
        createdAt: dateUtils.toUnix(),
        updatedAt: dateUtils.toUnix(),
        incidentsCount: 0,
        errorsCount: 0,
        isIntegrated: false
      };

      const application = await manager
        .getRepository(Application)
        .save(applicationPayload);

      if (username !== ADMIN_NAME) {
        const admin = await this.accountQueryService.getDtoBy({ email: ADMIN_EMAIL });
        await this.awrService.createAmr(
          admin,
          application,
          MemberRole.ADMINISTRATOR,
          manager,
        );
      }

      await this.awrService.createAmr(
        account,
        application,
        MemberRole.ADMINISTRATOR,
        manager,
      );

      await this.metricsService.addDefaultMetrics(application, manager);

      return new ApiResponse("success", "Application successfully created", application);
    }).catch((err: Error) => {
      this.logger.error(`[${this.create.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    });
  }

  public async generateApiKey(id: string): Promise<ApiResponse<string>> {
    const user = RequestContext.user;
    const apiKey = crypto.randomUUID();
    try {
      await this.update(id, {
        security: {
          apiKey,
          lastUpdate: dateUtils.toUnix(),
          generatedBy: user.username
        }
      });
      return new ApiResponse("success", "API Key Generated.", apiKey);
    } catch (err) {
      this.logger.error(`[${this.generateApiKey.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }

  public async removeApiKey(id: string): Promise<ApiResponse<unknown>> {
    try {
      await this.update(id, { security: null });
      return new ApiResponse("success", "API Key Removed.");
    } catch (err) {
      this.logger.error(`[${this.removeApiKey.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }

  public async update(
    id: string,
    update: Partial<Application>,
    manager: EntityManager = this.entityManager
  ): Promise<void> {
    await manager.getRepository(Application).update(
      { id },
      {
        updatedAt: dateUtils.toUnix(),
        ...update
      },
    );
  }

  public async updateApplication(appBody: ApplicationDto | Partial<Application>) {
    const { id, ...rest } = appBody;

    try {
      await this.update(id, rest);
      return new ApiResponse("success", "Application updated")
    } catch (err) {
      this.logger.error(`[${this.update.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }

  public async delete(
    appId: string
  ): Promise<ApiResponse<unknown>> {
    try {
      await this.entityManager
        .getRepository(Application)
        .createQueryBuilder('application')
        .where('application.id = :appId', { appId })
        .delete()
        .execute();

      return new ApiResponse("success", "Application removed");
    } catch (err) {
      this.logger.error(`[${this.delete.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }

  @Cron(CronExpression.EVERY_6_HOURS)
  private async handleLogDelete() {
    try {
      const maxRetentionDate = dayjs().subtract(MAX_RETENTION_LOGS, 'd').unix();
      const logs = await this.entityManager.getRepository(Log)
        .createQueryBuilder('log')
        .where('log.receiveTimestamp < :maxRetentionDate', { maxRetentionDate })
        .getMany();

      await this.entityManager.getRepository(Log).remove(logs);

      this.logger.log(`[handleLogDelete] Deleted logs: ${logs.length}`);
    } catch (error) {
      throw new Error(error);
    }
  }
}
