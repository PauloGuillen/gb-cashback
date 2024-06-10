import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataSource, DataSourceOptions } from 'typeorm'
import { User } from '../entities/user.entity'
import { UsersModule } from '../users.module'
import { startPostgres } from '../../../test/test-helpers'
import { CreateUserDto } from '../dto/create-user.dto'
import * as request from 'supertest'
import { Purchase } from '../../purchases/entities/purchase.entity'
import { PurchasesPerMonth } from '../../purchases/entities/purchases-per-month.entity'

describe('UsersController - end-to-end (e2e) tests ', () => {
  let app: INestApplication
  const data: CreateUserDto = {
    name: 'John Doe',
    cpf: '123.456.789-01',
    email: 'john.doe@email.com',
    password: 'password',
  }

  const startPostgresContainer = startPostgres()

  beforeEach(async () => {
    const postgresContainer = startPostgresContainer.postgresContainer
    const connOptions: DataSourceOptions = {
      type: 'postgres',
      host: postgresContainer.getHost(),
      port: postgresContainer.getMappedPort(5432),
      // logging: true,
    }

    const adminDataSource = new DataSource({
      ...connOptions,
      username: 'root',
      password: 'root',
      database: 'test',
    })

    await adminDataSource.initialize()

    const databaseName = 'test_' + Math.random().toString(36).substring(7)
    await adminDataSource.query(`CREATE DATABASE ${databaseName};`)
    await adminDataSource.destroy()

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: postgresContainer.getHost(),
          port: postgresContainer.getMappedPort(5432),
          username: 'root',
          password: 'root',
          database: databaseName,
          entities: [User, Purchase, PurchasesPerMonth],
          synchronize: true,
          // logging: true,
        }),
        UsersModule,
      ],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )
    await app.init()
  })

  describe('/users/accounts - e2e tests ', () => {
    it('should band request error', () => {
      return request(app.getHttpServer())
        .post('/users/accounts')
        .expect(400)
        .then(response => {
          expect(response.body).toEqual({
            message: [
              'name should not be empty',
              'name must be a string',
              'cpf should not be empty',
              'cpf must be a string',
              'email should not be empty',
              'email must be an email',
              'password should not be empty',
              'password must be a string',
            ],
            error: 'Bad Request',
            statusCode: 400,
          })
        })
    })

    it('should create a account', () => {
      return request(app.getHttpServer())
        .post('/users/accounts')
        .send(data)
        .expect(201)
        .then(response => {
          expect(response.body).toEqual({
            id: expect.any(Number),
            name: data.name,
            cpf: data.cpf,
            email: data.email,
          })
        })
    })

    it('CPF already exists', () => {
      return request(app.getHttpServer())
        .post('/users/accounts')
        .send(data)
        .expect(201)
        .then(() => {
          return request(app.getHttpServer())
            .post('/users/accounts')
            .send(data)
            .expect(409)
            .then(response => {
              expect(response.body).toEqual({
                statusCode: 409,
                message: 'cpf duplicate',
              })
            })
        })
    })
  })

  afterEach(async () => {
    await app.close()
  })
})
