import { Column, DataType, Default, Model, PrimaryKey, Table, HasMany } from "sequelize-typescript";
import { IBrand } from "../types";
import { v4 as uuidv4 } from 'uuid';
import { Product } from './product.model';


@Table({ tableName: 'brands', timestamps: true, underscored: true })
export class Brand extends Model<IBrand> {
    @PrimaryKey
    @Default(() => uuidv4())
    @Column(DataType.UUID)
    id?: string

    @HasMany(() => Product)
    products?: Product[];

    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    slug: string;

    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    is_active: boolean;

    @Column(DataType.STRING)
    logo_url: string;
}