import { Country, DEFAULT_LOCALE } from '@algomart/schemas'
import { CMSCacheAdapter } from '@algomart/shared/adapters'
import { invariant } from '@algomart/shared/utils'
import { Knex } from 'knex'
import pino from 'pino'

export default class ApplicationService {
  logger: pino.Logger<unknown>

  constructor(
    private readonly cms: CMSCacheAdapter,
    logger: pino.Logger<unknown>
  ) {
    this.logger = logger.child({ context: this.constructor.name })
  }

  async getCountries(
    locale = DEFAULT_LOCALE,
    knexRead?: Knex
  ): Promise<Country[]> {
    // Find application details and compile IDs of supported countries
    const countries = await this.cms.findAllCountries(locale, knexRead)

    invariant(countries.length > 0, 'No countries found')

    return countries
  }
}
