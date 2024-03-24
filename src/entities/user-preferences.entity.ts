import { Entity, Column, BaseEntity, PrimaryColumn } from 'typeorm';
import { Geometry } from 'geojson';

@Entity()
export class UserPreferences extends BaseEntity {
    @PrimaryColumn()
    userId: string;

    @Column('jsonb')
    preferences: UserPreferencesData;
}

interface UserPreferencesData {
    classCategoryIds: string[];
    locations?: Geometry[];
}