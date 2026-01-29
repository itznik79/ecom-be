import { Model } from 'sequelize-typescript';
export declare class Category extends Model {
    id: string;
    name: string;
    description: string;
    slug: string;
    icon: string;
    parentId: string;
    isActive: boolean;
    displayOrder: number;
}
