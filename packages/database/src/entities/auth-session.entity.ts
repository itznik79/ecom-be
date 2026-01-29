import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'auth_sessions',
  timestamps: true,
  underscored: true,
})
export class AuthSession extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  token: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  userAgent: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  ipAddress: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expiresAt: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isRevoked: boolean;
}
