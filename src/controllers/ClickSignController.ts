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

      if (!sha256matches) return res.status(404).end(() => { process.stdout.write('SHA256 does not match!') })

      // body.document.template.data
      const { data: documentData } = body.document.template

      process.stdout.write('Data succesfully sent')
      // save this data on req
      return res.status(200).json(documentData)
    } catch (err) {
      return next(err)
    }
  }

  static async createDocument (req: Request, res: Response, next: NextFunction) {
    const { TEMPLATE_KEY, CLICKSIGN_SANDBOX_TOKEN } = process.env
    try {
      const {
        nome, cpf, telefone, endereco, email
      } = req.body

      const { data } = await clickSignSandboxAPI.post(`/api/v1/templates/${TEMPLATE_KEY}/documents?access_token=${CLICKSIGN_SANDBOX_TOKEN}`, {
        document: {
          path: `/Modelos/FORM-${nome.split(' ').join('_').toUpperCase()}-${cpf}.docx`,
          template: {
            data: {
              nome, cpf, telefone, endereco, email
            }
          }
        }
      })
      return res.status(200).json(data.document)
    } catch (err) {
      return next(err)
    }
  }
}
