import { Entity, Column, BaseEntity, PrimaryColumn } from 'typeorm';
import { StoredLocation } from '@tutorify/shared';

@Entity()
export class UserPreferences extends BaseEntity {
    @PrimaryColumn()
    userId: string;

    @Column('jsonb')
    preferences: UserPreferencesData;
}

interface UserPreferencesData {
    classCategoryIds: string[];
    location: StoredLocation;
}