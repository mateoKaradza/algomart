import { Model } from 'objection'
import { DirectusLanguageTemplate } from '@algomart/schemas'

export class CMSCacheLanguageModel extends Model {
  static tableName = 'CmsCacheLanguages'

  code!: string
  content!: string
  createdAt!: string
  updatedAt!: string

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString()
  }

  static async insert(languageTemplate: DirectusLanguageTemplate) {
    await CMSCacheLanguageModel.query()
      .insert({
        code: languageTemplate.code,
        content: JSON.stringify(languageTemplate),
      })
      .returning('code')

    return languageTemplate
  }

  static async update(languageTemplate: DirectusLanguageTemplate) {
    await CMSCacheLanguageModel.query()
      .where({ code: languageTemplate.code })
      .update({ content: JSON.stringify(languageTemplate) })
      .returning('code')

    return languageTemplate
  }

  static async upsert(languageTemplate: DirectusLanguageTemplate) {
    const record = await this.getById(languageTemplate.code)
    if (record) {
      this.update(languageTemplate)
    } else {
      this.insert(languageTemplate)
    }

    return languageTemplate
  }

  static async getById(code: string) {
    return await CMSCacheLanguageModel.query().findOne('code', code)
  }
}
