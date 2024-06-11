import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataSource, DataSourceOptions } from 'typeorm'
import { startPostgres } from '../../../test/test-helpers'
import * as request from 'supertest'
import { Purchase } from '../../purchases/entities/purchase.entity'
import { PurchasesPerMonth } from '../../purchases/entities/purchases-per-month.entity'
import { CreatePurchaseDto } from '../dto/create-purchase.dto'
import { PurchasesModule } from '../purchases.module'
import { User } from '../../users/entities/user.entity'
import { CreateUserDto } from '../../users/dto/create-user.dto'
import { LoginUserDto } from '../../users/dto/login-user.dto'
import { UsersModule } from '../../users/users.module'

describe('PurchasesController - end-to-end (e2e) tests ', () => {
  let app: INestApplication
  const dataAccount: CreateUserDto = {
    name: 'John Doe',
    cpf: '123.456.789-01',
    email: 'john.doe@email.com',
    password: 'password',
  }
  const data: CreatePurchaseDto = {
    code: '123',
    valueInCents: 99123,
    dateOfPurchase: new Date(),
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
        PurchasesModule,
        UsersModule,
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
  }, 40000)

  describe('/purchases (POST) - e2e tests ', () => {
    it('Not authorized', () => {
      return request(app.getHttpServer())
        .post('/purchases')
        .expect(403)
        .then(response => {
          expect(response.body).toEqual({
            message: 'Forbidden resource',
            error: 'Forbidden',
            statusCode: 403,
          })
        })
    })

    it('should band request error', async () => {
      const token = await getToken(dataAccount)
      return request(app.getHttpServer())
        .post('/purchases')
        .set('authorization', `token ${token}`)
        .expect(400)
        .then(response => {
          expect(response.body).toEqual({
            message: [
              'code should not be empty',
              'code must be a string',
              'valueInCents should not be empty',
              'valueInCents must be an integer number',
              'dateOfPurchase should not be empty',
            ],
            error: 'Bad Request',
            statusCode: 400,
          })
        })
    })

    it('should create a purchase', async () => {
      const token = await getToken(dataAccount)
      return request(app.getHttpServer())
        .post('/purchases')
        .set('authorization', `token ${token}`)
        .send(data)
        .expect(201)
        .then(response => {
          expect(response.body).toEqual({
            code: data.code,
            valueInCents: data.valueInCents,
            dateOfPurchase: expect.any(String),
            user: {
              name: dataAccount.name,
              cpf: dataAccount.cpf,
            },
          })
        })
    })
  })

  describe('/purchases (GET) findAll  - e2e tests ', () => {
    it('Not authorized', () => {
      return request(app.getHttpServer())
        .get('/purchases')
        .expect(403)
        .then(response => {
          expect(response.body).toEqual({
            message: 'Forbidden resource',
            error: 'Forbidden',
            statusCode: 403,
          })
        })
    })

    it('No purchases', async () => {
      const token = await getToken(dataAccount)
      return request(app.getHttpServer())
        .get('/purchases')
        .set('authorization', `token ${token}`)
        .expect(200)
        .then(response => {
          expect(response.body).toEqual([])
        })
    })

    it('one purchase - cashback 10%', async () => {
      const token = await getToken(dataAccount)
      return request(app.getHttpServer())
        .post('/purchases')
        .set('authorization', `token ${token}`)
        .send({
          code: '123',
          valueInCents: 99123,
          dateOfPurchase: new Date(),
        })
        .expect(201)
        .then(() => {
          return request(app.getHttpServer())
            .get('/purchases')
            .set('authorization', `token ${token}`)
            .expect(200)
            .then(response => {
              expect(response.body).toEqual([
                {
                  code: '123',
                  valueInCents: 99123,
                  dateOfPurchase: expect.any(String),
                  cachbackPerc: 10,
                  cachbackInCents: 9912,
                },
              ])
            })
        })
    })

    test.each([
      [90013, 9001, 10],
      [140000, 21000, 15],
      [300099, 60020, 20],
    ])(
      'valueInCents %d - cachbackInCents %d - achbackPerc %d%',
      async (valueInCents, cachbackInCents, cachbackPerc) => {
        const token = await getToken(dataAccount)
        return request(app.getHttpServer())
          .post('/purchases')
          .set('authorization', `token ${token}`)
          .send({
            code: '123',
            valueInCents,
            dateOfPurchase: new Date(),
          })
          .expect(201)
          .then(() => {
            return request(app.getHttpServer())
              .get('/purchases')
              .set('authorization', `token ${token}`)
              .expect(200)
              .then(response => {
                expect(response.body).toEqual([
                  {
                    code: '123',
                    valueInCents,
                    dateOfPurchase: expect.any(String),
                    cachbackPerc,
                    cachbackInCents,
                  },
                ])
              })
          })
      },
    )

    it('two purchase - cashback 20%', async () => {
      const token = await getToken(dataAccount)
      return request(app.getHttpServer())
        .post('/purchases')
        .set('authorization', `token ${token}`)
        .send({
          code: '123',
          valueInCents: 99000,
          dateOfPurchase: new Date(),
        })
        .expect(201)
        .then(() => {
          return request(app.getHttpServer())
            .post('/purchases')
            .set('authorization', `token ${token}`)
            .send({
              code: '456',
              valueInCents: 100000,
              dateOfPurchase: new Date(),
            })
            .expect(201)
            .then(() => {
              return request(app.getHttpServer())
                .get('/purchases')
                .set('authorization', `token ${token}`)
                .expect(200)
                .then(response => {
                  expect(response.body).toEqual([
                    {
                      code: '123',
                      valueInCents: 99000,
                      dateOfPurchase: expect.any(String),
                      cachbackPerc: 20,
                      cachbackInCents: 19800,
                    },
                    {
                      code: '456',
                      valueInCents: 100000,
                      dateOfPurchase: expect.any(String),
                      cachbackPerc: 20,
                      cachbackInCents: 20000,
                    },
                  ])
                })
            })
        })
    })

    it('two purchase - different month  - cashback 10%', async () => {
      const token = await getToken(dataAccount)
      const dateOfPurchase: Date = new Date()
      dateOfPurchase.setMonth(dateOfPurchase.getMonth() - 1)

      return request(app.getHttpServer())
        .post('/purchases')
        .set('authorization', `token ${token}`)
        .send({
          code: '123',
          valueInCents: 99000,
          dateOfPurchase,
        })
        .expect(201)
        .then(() => {
          return request(app.getHttpServer())
            .post('/purchases')
            .set('authorization', `token ${token}`)
            .send({
              code: '456',
              valueInCents: 100000,
              dateOfPurchase: new Date(),
            })
            .expect(201)
            .then(() => {
              return request(app.getHttpServer())
                .get('/purchases')
                .set('authorization', `token ${token}`)
                .expect(200)
                .then(response => {
                  expect(response.body).toEqual([
                    {
                      code: '123',
                      valueInCents: 99000,
                      dateOfPurchase: expect.any(String),
                      cachbackPerc: 10,
                      cachbackInCents: 9900,
                    },
                    {
                      code: '456',
                      valueInCents: 100000,
                      dateOfPurchase: expect.any(String),
                      cachbackPerc: 10,
                      cachbackInCents: 10000,
                    },
                  ])
                })
            })
        })
    })
  })

  afterEach(async () => {
    await app?.close()
  })

  function getToken(dataAccount: CreateUserDto) {
    const dataLogin: LoginUserDto = {
      cpf: dataAccount.cpf,
      password: dataAccount.password,
    }
    return request(app.getHttpServer())
      .post('/users/accounts')
      .send(dataAccount)
      .expect(201)
      .then(() => {
        return request(app.getHttpServer())
          .post('/users/login')
          .send(dataLogin)
          .expect(200)
          .then(response => {
            return response.body.token
          })
      })
  }
})
