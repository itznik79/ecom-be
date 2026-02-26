import { Column, DataType, Model, Table, Index, ForeignKey, BelongsTo } from "sequelize-typescript";
import { IAttributeValues } from "../types";
import { Attributes } from './attributes.model';

@Table({
  tableName: "attribute_values",
  timestamps: false,
  underscored: true,
})
export class AttributeValue extends Model<IAttributeValues> {

  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Index
  @ForeignKey(() => Attributes)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  attribute_id: string;

  @BelongsTo(() => Attributes)
  attribute?: Attributes;

  @Index
  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  value_text?: string;

  @Index
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  value_number?: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  sort_order: number;
}
