import asaasAPI from '../helpers/asaasApi'
import { Request, Response, NextFunction } from 'express'

export default class AsaasController {
  static async lookForClients (req: Request, res: Response, next: NextFunction) {
    const query = (req.body.name ? 'name' : 'cpfCnpj')
    const parameter = (req.body.name ? req.body.name : req.body.cpfCnpj)

    try {
      const { data } = await asaasAPI.get(`/api/v3/customers?${query}=${parameter}`)

      req.clients = data
      next()
    } catch (err) {
      return next(err)
    }
  }

  static async getSingleClient (req: Request, res: Response, next: NextFunction) {
    const { data } = req.clients
    const client = data[0]

    const { id } = client

    return res.status(200).json(id)
  }

  static async createClient (req: Request, res: Response, next: NextFunction) { return process.stdout.write('createClient') }
}
