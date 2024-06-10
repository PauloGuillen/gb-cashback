import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql'

export function startPostgres() {
  let _postgresContainer: StartedPostgreSqlContainer

  beforeAll(async () => {
    do {
      try {
        _postgresContainer = await new PostgreSqlContainer()
          .withUsername('root')
          .withPassword('root')
          .withExposedPorts({
            container: 5432,
            host: 5433,
          })
          .withReuse()
          // .withTmpFs({ '/var/lib/postgresql/data': 'rw' })
          // .withCopyContentToContainer({
          //   './src/test/postgres/init.sql': '/docker-entrypoint-initdb.d/init.sql
          // })
          .start()
        break
      } catch (error) {
        if (!error.message.includes('port is already allocated')) {
          throw error
        }
      }
    } while (true)
  }, 20000)

  return {
    get postgresContainer() {
      return _postgresContainer
    },
  }
}
