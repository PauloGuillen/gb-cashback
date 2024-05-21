import { Purchase } from 'src/purchases/entities/purchase.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ unique: true })
  cpf: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @OneToMany(() => Purchase, purchase => purchase.user)
  purchases: Purchase[]
}
