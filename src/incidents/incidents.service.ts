import { Injectable } from "@nestjs/common";
import { Account } from "src/db/entities/account.entity";
import { Incident } from "src/db/entities/incident.entity";
import { IncidentBatchUpdateDto, IncidentUpdateDto } from "src/db/models/incident";
import { EntityManager } from "typeorm";

@Injectable()
export class IncidentsService {
    constructor(
        private entityManger: EntityManager
    ) { }

    async updateIncident(incidentId: string, update: IncidentUpdateDto): Promise<void> {
        await this.entityManger.transaction(async (manager) => {
            if (update.assignedId) {
                const account = await manager.getRepository(Account).findOneBy({ id: update.assignedId });
                await manager.getRepository(Incident).update({ id: incidentId }, { assigned: account });
                return;
            }

            await manager.getRepository(Incident).update({ id: incidentId }, update);
        });
    }

    async updateBatchIncidents(update: IncidentBatchUpdateDto): Promise<void> {
        const { incidentsIds, ...rest } = update;

        await this.entityManger.getRepository(Incident)
            .createQueryBuilder('incident')
            .whereInIds(incidentsIds)
            .update(rest)
            .execute();
    }
}