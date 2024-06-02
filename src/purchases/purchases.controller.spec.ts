import { Test, TestingModule } from '@nestjs/testing'
import { PurchasesController } from './purchases.controller'
import { PurchasesService } from './purchases.service'
import { CreatePurchaseDto } from './dto/create-purchase.dto'
import { AuthService } from '../auth/auth.service'
import { OutputPurchaseDto } from './dto/output-purchase.dto'

describe('PurchasesController', () => {
  let controller: PurchasesController
  const cpf = '911.188.233-11'
  const mockToken = 'mockToken'

  const mockPurchasesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findCredit: jest.fn(),
  }

  const mockAuthService = {
    tokenCpf: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchasesController],
      providers: [
        { provide: PurchasesService, useValue: mockPurchasesService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile()

    controller = module.get<PurchasesController>(PurchasesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('create purchases', async () => {
    const puchaseDto: CreatePurchaseDto = {
      code: 'Code01',
      valueInCents: 1234,
      dateOfPurchase: new Date(),
    }

    mockAuthService.tokenCpf.mockReturnValue(cpf)
    await controller.create(puchaseDto, cpf)

    expect(mockAuthService.tokenCpf).toHaveBeenCalled()
    expect(mockPurchasesService.create).toHaveBeenCalledWith(cpf, puchaseDto)
  })

  it('should find all purchases', async () => {
    const mockOutputPurchaseDto: OutputPurchaseDto[] = [
      {
        code: 'Code01',
        dateOfPurchase: new Date(),
        valueInCents: 1234,
        cachbackPerc: 10,
        cachbackInCents: 123,
      },
    ]

    jest.spyOn(mockAuthService, 'tokenCpf').mockResolvedValue(cpf)
    jest
      .spyOn(mockPurchasesService, 'findAll')
      .mockResolvedValue(mockOutputPurchaseDto)

    const result = await controller.findAll(mockToken)

    expect(mockAuthService.tokenCpf).toHaveBeenCalledWith(mockToken)
    expect(mockPurchasesService.findAll).toHaveBeenCalledWith(cpf)
    expect(result).toEqual(mockOutputPurchaseDto)
  })

  it('should find credit', async () => {
    jest.spyOn(mockAuthService, 'tokenCpf').mockResolvedValue(cpf)
    jest.spyOn(mockPurchasesService, 'findCredit').mockResolvedValue(100)

    const result = await controller.findCredit(mockToken)

    expect(mockAuthService.tokenCpf).toHaveBeenCalledWith(mockToken)
    expect(mockPurchasesService.findCredit).toHaveBeenCalledWith(cpf)
    expect(result).toEqual(100)
  })
})
