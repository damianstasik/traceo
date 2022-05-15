import { GenericEntity } from "src/core/generic.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Account } from "./account.entity";

export enum GitProviderType {
    GITHUB = "github",
    GITLAB = "gitlab"
}

@Entity()
export class Github extends GenericEntity {
    @Column({
        type: 'varchar',
        nullable: true
    })
    name: string;

    @Column({
        type: 'varchar',
        nullable: true
    })
    login: string;

    @Column({
        type: 'varchar',
        nullable: true
    })
    avatar: string;

    @Column({
        type: 'varchar',
        nullable: true
    })
    profileUrl: string;

    @Column({
        type: 'varchar',
        nullable: true
    })
    accessToken: string;
}