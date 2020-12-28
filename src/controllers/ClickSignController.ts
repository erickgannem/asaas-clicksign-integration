import clickSignAPI from '../helpers/clickSignApi'
import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'
import cache from '../cache'

export default class ClickSignController {
  static async listenWebhook (req: Request, res: Response, next: NextFunction) {
    const { headers, rawBody, body } = req
    const { HMAC_SECRET_KEY } = process.env

    try {
      if (!HMAC_SECRET_KEY) {
        process.stdout.write('\n>> [ClickSign Controller] HMAC Secret Key does not exist! \n')
        return res.status(500).end()
      }

      const hmac = crypto.createHmac('sha256', HMAC_SECRET_KEY)
      hmac.update(rawBody)
      const hash = hmac.digest('hex')

      const sha256matches = (`sha256=${hash}` === headers['content-hmac'])

      if (!sha256matches) {
        process.stdout.write('\n>> [ClickSign Controller] SHA256 does not match!\n')
        return res.status(400).end()
      }

      const data = body
      const { key: documentKey, status: documentStatus } = data.document

      const documentIsClosed = (documentStatus === 'closed')

      if (!documentIsClosed) return res.status(200).end()

      req.clicksignDocumentKey = documentKey

      // Look for cached document
      let documentIsCached
      const redisGetResponse = await cache.get(documentKey)
      if (redisGetResponse !== null) {
        documentIsCached = true
      } else {
        documentIsCached = false
      }

      // If document is not cached
      if (!documentIsCached) {
        // Cache it
        await cache.set(documentKey, '0')
        // Return 200 and process the payment
        res.status(200).end()
        return next()
      } else {
        // If it's cached. Then return 200
        // and exit because it was already payed
        return res.status(200).end()
      }
    } catch (err) {
      return res.status(500).end(() => next(err))
    }
  }

  static async getDocument (req: Request, res: Response, next: NextFunction) {
    const { clicksignDocumentKey } = req
    process.stdout.write(`\n>> [ClickSign Controller] Closed document: ${clicksignDocumentKey} being processed`)

    try {
      const documentRequest = await clickSignAPI.get(`/api/v1/documents/${clicksignDocumentKey}?access_token=${process.env.CLICKSIGN_API_TOKEN}`)
      const { data } = documentRequest
      req.clicksignDocumentData = data

      return next()
    } catch (err) {
      return next(err)
    }
  }

  static async createDocument (req: Request, res: Response, next: NextFunction) {
    const { TEMPLATE_KEY, CLICKSIGN_API_TOKEN } = process.env
    try {
      const {
        cpf
      } = req.body

      const { data } = await clickSignAPI.post(`/api/v1/templates/${TEMPLATE_KEY}/documents?access_token=${CLICKSIGN_API_TOKEN}`, {
        document: {
          path: `/Modelos/FORM-${cpf}.docx`,
          template: {
            data: req.body
          }
        }
      })
      return res.status(200).json(data.document)
    } catch (err) {
      return next(err)
    }
  }
}
