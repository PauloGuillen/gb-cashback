import { Test, TestingModule } from '@nestjs/testing'
import { PurchasesService } from './purchases.service'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { HttpService } from '@nestjs/axios'
import { Logger } from '@nestjs/common'
import { of } from 'rxjs'
import { Purchase } from './entities/purchase.entity'
import { User } from '../users/entities/user.entity'
import { PurchasesPerMonth } from './entities/purchases-per-month.entity'
import { CreatePurchaseDto } from './dto/create-purchase.dto'
import { MockType } from '../utils/mocktype'
import { repositoryMockFactory } from '../utils/repositorymockfactory'
import { OutputPurchaseDto } from './dto/output-purchase.dto'

describe('PurchasesService', () => {
  let service: PurchasesService
  let repository: MockType<Repository<Purchase>>
  let repositoryPerMonth: MockType<Repository<PurchasesPerMonth>>
  let logger: Logger

  const user = new User()
  user.id = 1
  user.name = 'John Doe'
  user.cpf = '123.456.789-00'
  user.email = 'john.doe@email.com'
  user.password = '123456'

  const cpf = '123.456.789-00'

  const perMonth = new PurchasesPerMonth()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchasesService,
        {
          provide: getRepositoryToken(Purchase),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(PurchasesPerMonth),
          useFactory: repositoryMockFactory,
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(() => of({ data: { body: 'credit' } })),
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<PurchasesService>(PurchasesService)
    repository = module.get(getRepositoryToken(Purchase))
    repositoryPerMonth = module.get(getRepositoryToken(PurchasesPerMonth))
    logger = module.get<Logger>(Logger)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a purchase and return the output purchase DTO', async () => {
      const createPurchaseDto: CreatePurchaseDto = {
        code: 'Code01',
        valueInCents: 1234,
        dateOfPurchase: new Date(),
      }

      const findUserMock = jest
        .spyOn(service, 'findUser')
        .mockResolvedValueOnce(user)

      const createMock = jest.spyOn(repository, 'create')
      const saveMock = jest.spyOn(repository, 'save')

      const totalPerMonthMock = jest.spyOn(service, 'totalPerMonth')

      const loggerMock = jest.spyOn(logger, 'log')

      const result = await service.create(cpf, createPurchaseDto)

      expect(findUserMock).toHaveBeenCalledWith(cpf)
      expect(createMock).toHaveBeenCalledWith({
        ...createPurchaseDto,
        status: 'Em validação',
        cpf,
        user: user,
      })
      expect(saveMock).toHaveBeenCalledWith(expect.anything())
      expect(totalPerMonthMock).toHaveBeenCalledWith(
        user,
        expect.any(Date),
        expect.any(Number),
      )
      expect(loggerMock).toHaveBeenCalledWith(
        `Purchase created successfully - ${cpf}`,
        'PurchasesService',
      )
      expect(result).toEqual(
        expect.objectContaining({
          code: expect.anything(),
          valueInCents: expect.any(Number),
          dateOfPurchase: expect.any(Date),
          user: {
            name: expect.any(String),
            cpf: expect.any(String),
          },
        }),
      )
    })
  })

  describe('findAll', () => {
    const purchases = [
      {
        code: 'Code01',
        valueInCents: 10123,
        dateOfPurchase: new Date(),
        user,
      },
    ]

    const outPurchases: OutputPurchaseDto[] = [
      {
        code: purchases[0].code,
        valueInCents: purchases[0].valueInCents,
        dateOfPurchase: purchases[0].dateOfPurchase,
        cachbackPerc: 10,
        cachbackInCents: Math.round((purchases[0].valueInCents * 10) / 100),
      },
    ]

    perMonth.id = 1
    perMonth.year = purchases[0].dateOfPurchase.getFullYear()
    perMonth.month = purchases[0].dateOfPurchase.getMonth() + 1
    perMonth.valueInCents = purchases[0].valueInCents
    perMonth.cpf = cpf
    perMonth.user = user

    it('should find all purchases for a given CPF and return an array of output purchase DTOs', async () => {
      const findMock = jest.spyOn(repository, 'find') as jest.MockedFunction<
        () => Promise<OutputPurchaseDto[]>
      >
      findMock.mockResolvedValueOnce(outPurchases)

      const perMothMock = jest.spyOn(
        repositoryPerMonth,
        'findOne',
      ) as jest.MockedFunction<() => Promise<PurchasesPerMonth>>
      perMothMock.mockResolvedValueOnce(perMonth)

      const result = await service.findAll(cpf)

      expect(findMock).toHaveBeenCalledWith({
        where: { cpf },
        order: {
          dateOfPurchase: 'ASC',
        },
      })
      expect(perMothMock).toHaveBeenCalled()
      expect(result).toEqual(outPurchases)
    })

    it('should find all purchases - 15%', async () => {
      purchases[0].valueInCents = 140444
      outPurchases[0].valueInCents = purchases[0].valueInCents
      outPurchases[0].cachbackPerc = 15
      outPurchases[0].cachbackInCents = 21067
      perMonth.valueInCents = purchases[0].valueInCents

      const findMock = jest.spyOn(repository, 'find') as jest.MockedFunction<
        () => Promise<OutputPurchaseDto[]>
      >
      findMock.mockResolvedValueOnce(outPurchases)

      const perMothMock = jest.spyOn(
        repositoryPerMonth,
        'findOne',
      ) as jest.MockedFunction<() => Promise<PurchasesPerMonth>>
      perMothMock.mockResolvedValueOnce(perMonth)

      const result = await service.findAll(cpf)

      expect(findMock).toHaveBeenCalledWith({
        where: { cpf },
        order: {
          dateOfPurchase: 'ASC',
        },
      })
      expect(perMothMock).toHaveBeenCalled()
      expect(result).toEqual(outPurchases)
    })

    it('should find all purchases - 20%', async () => {
      purchases[0].valueInCents = 200222
      outPurchases[0].valueInCents = purchases[0].valueInCents
      outPurchases[0].cachbackPerc = 20
      outPurchases[0].cachbackInCents = 40044
      perMonth.valueInCents = purchases[0].valueInCents

      const findMock = jest.spyOn(repository, 'find') as jest.MockedFunction<
        () => Promise<OutputPurchaseDto[]>
      >
      findMock.mockResolvedValueOnce(outPurchases)

      const perMothMock = jest.spyOn(
        repositoryPerMonth,
        'findOne',
      ) as jest.MockedFunction<() => Promise<PurchasesPerMonth>>
      perMothMock.mockResolvedValueOnce(perMonth)

      const result = await service.findAll(cpf)

      expect(findMock).toHaveBeenCalledWith({
        where: { cpf },
        order: {
          dateOfPurchase: 'ASC',
        },
      })
      expect(perMothMock).toHaveBeenCalled()
      expect(result).toEqual(outPurchases)
    })
  })
})
