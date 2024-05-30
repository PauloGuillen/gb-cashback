import { Repository } from 'typeorm'
import { MockType } from './mocktype'

// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    create: jest.fn(entity => entity),
    save: jest.fn(entity => entity),
    find: jest.fn(entity => entity),
    findOne: jest.fn(entity => entity),
    findOneBy: jest.fn(entity => entity),
    preload: jest.fn(entity => entity),
    update: jest.fn(entity => entity),
    delete: jest.fn(entity => entity),
  }),
)
