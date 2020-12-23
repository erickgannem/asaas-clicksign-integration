import clickSignAPI from '../helpers/clickSignApi'
import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'

export default class ClickSignController {
  static async listenWebhook (req: Request, res: Response, next: NextFunction) {
    const { headers, rawBody, body } = req
    const { HMAC_SECRET_KEY } = process.env

    try {
      // Send status 500
      // Clicksign will keep sending the same information for 12 hours
      if (!HMAC_SECRET_KEY) return res.status(500).end(() => { process.stdout.write('HMAC Secret Key does not exist!') })

      const hmac = crypto.createHmac('sha256', HMAC_SECRET_KEY)
      hmac.update(rawBody)
      const hash = hmac.digest('hex')

      const sha256matches = (`sha256=${hash}` === headers['content-hmac'])

      // Send status 400
      // Clicksign will keep sending the same information for 12 hours
      if (!sha256matches) return res.status(400).end(() => { process.stdout.write('SHA256 does not match!') })

      const triggeringData = body
      const { document } = triggeringData

      const documentIsClosed = (document.status === 'closed')

      // Document still not closed
      // Send status 200
      // Prevent clicksign from keep triggering webhook with same information
      if (!documentIsClosed) return res.status(200).end()

      req.clicksignDocumentKey = triggeringData.document.key

      // We got the document close and it's ready to continue
      // Send status 200
      // Prevent clicksign from trigger the webhook with same information again
      res.sendStatus(200).end(() => next())
    } catch (err) {
      return next(err)
    }
  }

  static async getDocument (req: Request, res: Response, next: NextFunction) {
    const { clicksignDocumentKey } = req
    try {
      const documentRequest = await clickSignAPI.get(`/api/v1/documents/${clicksignDocumentKey}?access_token=${process.env.CLICKSIGN_API_TOKEN}`)
      const { data } = documentRequest
      req.clicksignDocumentData = data

      next()
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
