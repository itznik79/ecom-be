import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'categories',
  timestamps: true,
  underscored: true,
})
export class Category extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  slug: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  icon: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  parentId: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  displayOrder: number;
}
