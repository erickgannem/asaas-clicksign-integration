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

      const data = body
      const { key: documentKey } = data.document

      if (headers.event !== 'auto_close') {
        return res.status(200).end()
      }
      req.clicksignDocumentKey = documentKey

      const redisGetResponse = await cache.get(documentKey)

      const documentIsCached = (redisGetResponse !== null)

      setTimeout(async function () {
        if (documentIsCached) {
          return res.status(200).end()
        } else {
          await cache.set(documentKey, '0')
          return next()
        }
      }, 0)
    } catch (err) {
      return next(err)
    }
  }

  static async getDocument (req: Request, res: Response, next: NextFunction) {
    const { clicksignDocumentKey } = req
    try {
      process.stdout.write(`\n>> [ClickSign Controller] Closed document: ${clicksignDocumentKey} being processed`)

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
