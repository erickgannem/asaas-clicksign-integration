import asaasAPI from '../helpers/asaasApi'
import { Request, Response, NextFunction } from 'express'

export default class AsaasController {
  static async fetchClients (req: Request, res: Response, next: NextFunction) {
    const { cpfCnpj } = req.body
    const { clicksignDocumentData } = req
    try {
      const { data: dataKey } = await asaasAPI.get(`/api/v3/customers?cpfCnpj=${cpfCnpj}`)
      const { data: clientDataArray } = dataKey

      const asaasClient = clientDataArray[0] ? clientDataArray[0] : {}

      req.asaasClient = asaasClient

      next()
    } catch (err) {
      return next(err)
    }
  }

  static async checkIfClientExists (req: Request, res: Response, next: NextFunction) {
    const { asaasClient } = req
    const clientExists = !!Object.keys(asaasClient).length

    if (clientExists) {
      next()
    } else {
      // make call to create user
      // with data on the req
      next()
    }
  }

  static async createCharge (req: Request, res: Response, next:NextFunction) {

  }
}
