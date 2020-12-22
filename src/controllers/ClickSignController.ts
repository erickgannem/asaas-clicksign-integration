import { clickSignSandboxAPI } from '../helpers/clickSignApi'
import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'

export default class ClickSignController {
  static async listenWebhook (req: Request, res: Response, next: NextFunction) {
    const { headers, rawBody, body } = req
    const { HMAC_SECRET_KEY } = process.env

    try {
      if (!HMAC_SECRET_KEY) return res.status(500).end(() => { process.stdout.write('HMAC Secret Key does not exist!') })

      const hmac = crypto.createHmac('sha256', HMAC_SECRET_KEY)
      hmac.update(rawBody)
      const hash = hmac.digest('hex')

      const sha256matches = (`sha256=${hash}` === headers['content-hmac'])

      if (!sha256matches) return res.status(400).end(() => { process.stdout.write('SHA256 does not match!') })

      const triggeringData = body
      const { document } = triggeringData

      const documentIsClosed = (document.status === 'closed')

      if (!documentIsClosed) return res.status(200).end()

      req.clicksignDocumentKey = triggeringData.document.key

      return res.status(200).end(() => next())
    } catch (err) {
      return next(err)
    }
  }

  static async getDocument (req: Request, res: Response, next: NextFunction) {
    const { clicksignDocumentKey } = req
    try {
      const documentRequest = await clickSignSandboxAPI.get(`/api/v1/documents/${clicksignDocumentKey}?access_token=${process.env.CLICKSIGN_SANDBOX_TOKEN}`)
      const { data } = documentRequest
      req.clicksignDocumentData = data

      return res.status(200).end(() => next())
    } catch (err) {
      return next(err)
    }
  }

  static async createDocument (req: Request, res: Response, next: NextFunction) {
    const { TEMPLATE_KEY, CLICKSIGN_SANDBOX_TOKEN } = process.env
    try {
      const {
        cpf
      } = req.body

      const { data } = await clickSignSandboxAPI.post(`/api/v1/templates/${TEMPLATE_KEY}/documents?access_token=${CLICKSIGN_SANDBOX_TOKEN}`, {
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
