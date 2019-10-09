import { BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Index()
  email: string

  @Column()
  password: string
}

export { User }
