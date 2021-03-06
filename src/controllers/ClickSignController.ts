import clickSignAPI from '../helpers/clickSignApi'
import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'
import cache from '../cache'

export default class ClickSignController {
  static async documentWebhook (req: Request, res: Response, next: NextFunction) {
    const { headers, rawBody, body } = req
    const { HMAC_SECRET_KEY } = process.env

    try {
      if (!HMAC_SECRET_KEY) {
        process.stdout.write('\n>> [ClickSign Controller] HMAC Secret Key does not exist! \n')
        throw new Error('HMAC Secret Key does not exist!')
      }

      const hmac = crypto.createHmac('sha256', HMAC_SECRET_KEY)
      hmac.update(rawBody)
      const hash = hmac.digest('hex')

      const sha256matches = (`sha256=${hash}` === headers['content-hmac'])

      if (!sha256matches) {
        process.stdout.write('\n>> [ClickSign Controller] SHA256 does not match!\n')
        throw new Error('SHA256 does not match!')
      }

      const { event } = headers
      const { key: documentKey } = body.document

      if (event === 'auto_close' || event === 'close') {
        const redisGetResponse = await cache.get(documentKey)
        const documentIsCached = (redisGetResponse !== null)

        setTimeout(async function () {
          if (documentIsCached) {
            return res.status(200).end()
          } else {
            await cache.set(documentKey, 0)
            req.clicksignDocumentKey = documentKey

            return next()
          }
        }, 0)
      }
      return res.status(200).end()
    } catch (err) {
      return next(err)
    }
  }

  static async getDocument (req: Request, res: Response, next: NextFunction) {
    const { clicksignDocumentKey } = req
    const { CLICKSIGN_API_TOKEN } = process.env
    try {
      process.stdout.write(`\n>> [ClickSign Controller] Closed document: ${clicksignDocumentKey} being processed`)

      const documentRequest = await clickSignAPI.get(`/api/v1/documents/${clicksignDocumentKey}?access_token=${CLICKSIGN_API_TOKEN}`)
      const { data } = documentRequest
      req.clicksignDocumentData = data

      return next()
    } catch (err) {
      return next(err)
    }
  }
}
