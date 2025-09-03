import { ENV, isProductionEnv } from '#config/config.mjs'
import { updateStatusPlatforms as updateStatusPlatformsAppsheet } from '#apps/appsheet/config/statusPlatforms.mjs'

export async function updateStatusPlatforms(platform, { accountId, status }) {
  if (isProductionEnv()) {
    if (ENV.APP_FRONTEND === 'appsheet') {
      await updateStatusPlatformsAppsheet(platform, { accountId, status })
    }
  }
}
