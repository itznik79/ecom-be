import { Table, Column, Model, DataType, PrimaryKey, Default } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

@Table({ tableName: 'products', timestamps: true, underscored: true })
export class Product extends Model<Product> {
    @PrimaryKey
    @Default(uuidv4)
    @Column(DataType.UUID)
    id: string;

    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    slug: string;

    @Column(DataType.TEXT)
    description: string;

    @Default(true)
    @Column(DataType.BOOLEAN)
    is_active: boolean;
}