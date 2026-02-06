import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { ICategory } from '../../types';

@Table({ tableName: 'categories', timestamps: true, underscored: true })
export class Category extends Model<ICategory> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id: string;

    @ForeignKey(() => Category)
    @Column({ type: DataType.UUID, allowNull: true })
    parent_id: string;

    @BelongsTo(() => Category)
    parent: Category;

    @HasMany(() => Category)
    children: Category[];

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
