import { Injectable, Logger } from '@nestjs/common';
import { BaseDtoQuery } from '@common/base/query/base-query.model';
import { INTERNAL_SERVER_ERROR } from '@common/helpers/constants';
import { ApplicationDtoQuery } from '@common/types/dto/application.dto';
import { ApiResponse } from '@common/types/dto/response.dto';
import { AccountMemberRelationship } from '@db/entities/account-member-relationship.entity';
import { EntityManager } from 'typeorm';
import { RequestContext } from '@common/middlewares/request-context/request-context.model';


@Injectable()
export class AmrQueryService {
  private logger: Logger;
  constructor(private readonly entityManager: EntityManager) {
    this.logger = new Logger(AmrQueryService.name);
  }

  /**
   * Return pageable list of the members assigned to app
   *
   * @param appId
   * @param pageOptionsDto
   * @returns
   */
  public async getApplicationMembers(
    appId: string,
    pageOptionsDto: BaseDtoQuery,
  ): Promise<ApiResponse<AccountMemberRelationship[]>> {
    const { order, take, search, page } = pageOptionsDto;

    try {
      const queryBuilder = this.entityManager
        .getRepository(AccountMemberRelationship)
        .createQueryBuilder('amr')
        .innerJoin('amr.application', 'app', 'app.id = :appId', { appId })
        .leftJoin('amr.account', 'account');

      if (search) {
        queryBuilder.where("LOWER(account.name) LIKE LOWER(:name)", {
          name: `%${search}%`
        });
      }

      queryBuilder
        .addSelect([
          "account.name",
          "account.username",
          "account.email",
          "account.id",
          "account.gravatar",
        ])
        .orderBy("amr.createdAt", order, "NULLS LAST")
        .skip((page - 1) * take)
        .take(take);

      const members = await queryBuilder.getMany();
      const response = members.map(({ id, role, account, createdAt }) => ({ createdAt, ...account, id, accountId: account.id, role, }));

      return new ApiResponse("success", undefined, response);
    } catch (error) {
      this.logger.error(`[${this.getApplicationMembers.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Return pageable list of the Apps assigned to account
   *
   * @param accountId
   * @param pageOptionsDto
   * @returns
   */

  public async getApplicationsForAccount(
    accountId: string,
    pageOptionsDto: ApplicationDtoQuery
  ): Promise<ApiResponse<AccountMemberRelationship[]>> {
    const { page, take, order, search, sortBy } = pageOptionsDto;

    let id = accountId;
    if (!accountId) {
      id = RequestContext.user.id;
    }

    try {
      const queryBuilder = this.entityManager
        .getRepository(AccountMemberRelationship)
        .createQueryBuilder("amr")
        .innerJoin("amr.account", "account", "account.id = :accountId", { accountId: id })
        .leftJoinAndSelect("amr.application", "application")
        .loadRelationCountAndMap("application.incidentsCount", "application.incidents")
        .leftJoin("application.owner", "owner");

      if (search) {
        queryBuilder
          .where("LOWER(application.name) LIKE LOWER(:name)", {
            name: `%${search}%`
          })
          .orWhere("LOWER(owner.name) LIKE LOWER(:name)", {
            name: `%${search}%`
          });
      }

      const apps = await queryBuilder
        .addSelect(["owner.name", "owner.email", "owner.id", "owner.gravatar"])
        .orderBy(`application.${sortBy || "lastIncidentAt"}`, order, "NULLS LAST")
        .skip((page - 1) * take)
        .limit(take)
        .getMany();

      const response = apps.map((app) => ({
        ...app.application,
        id: app.id,
        appId: app.application.id,
        role: app.role,
      }))

      return new ApiResponse("success", undefined, response);
    } catch (error) {
      this.logger.error(`[${this.getApplicationsForAccount.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR);
    }
  }

  public async amrExists(
    { accountId, applicationId }: { accountId: string; applicationId: string },
    manager: EntityManager = this.entityManager,
  ): Promise<boolean> {
    const count = await manager
      .getRepository(AccountMemberRelationship)
      .createQueryBuilder("amr")
      .where('amr.account = :accountId AND amr.application = :applicationId', { accountId, applicationId })
      .getCount();
    return count > 0;
  }

  public async getPermission(appId: string): Promise<any> {
    const { id } = RequestContext.user;
    try {
      const applicationQuery = await this.entityManager
        .getRepository(AccountMemberRelationship)
        .createQueryBuilder("amr")
        .where('amr.application = :appId', { appId })
        .innerJoin("amr.account", "account", "account.id = :id", { id })
        .getOne();

      if (!applicationQuery) {
        return new ApiResponse("error", undefined, "No permissions for this application!");
      }

      return new ApiResponse("success", undefined, {
        role: applicationQuery.role
      });
    } catch (error) {
      this.logger.error(`[${this.getPermission.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR);
    }
  }
}
