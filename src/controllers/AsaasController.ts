import asaasAPI from '../helpers/asaasApi'
import { Request, Response, NextFunction } from 'express'

export default class AsaasController {
  static async fetchClients (req: Request, res: Response, next: NextFunction) {
    const { clicksignDocumentData } = req
    const cpfCnpj = clicksignDocumentData.document.template.data.cpf
    const formattedCpfCnpj = cpfCnpj.split('.').join('').split('-').join('')
    try {
      const { data } = await asaasAPI.get(`/api/v3/customers?cpfCnpj=${formattedCpfCnpj}`)
      const { data: clientDataArray } = data

      const asaasClient = clientDataArray[0] ? clientDataArray[0] : {}

      req.asaasClient = asaasClient

      next()
    } catch (err) {
      return next(err)
    }
  }

  static async checkIfClientExists (req: Request, res: Response, next: NextFunction) {
    const { asaasClient, clicksignDocumentData } = req
    const clientExists = !!Object.keys(asaasClient).length

    if (clientExists) {
      next()
    } else {
      try {
        const { data } = clicksignDocumentData.document.template
        const name = clicksignDocumentData.document.template.data['nome completo']
        const phone = clicksignDocumentData.document.template.data['telefone residencial']
        const addressNumber = clicksignDocumentData.document.template.data['número']
        const mobilePhone = clicksignDocumentData.document.template.data['numero whatsapp']

        const body = {
          name,
          cpfCnpj: data.cpf,
          email: data.email,
          mobilePhone,
          phone: phone || '',
          address: data.logradouro,
          addressNumber,
          complement: data.complemento,
          province: data.bairro,
          postalCode: data.cep
        }
        const newClient = await asaasAPI.post('/api/v3/customers', body)
        req.asaasClient = newClient
        next()
      } catch (err) {
        return next(err)
      }
    }
  }

  static async createCharge (req: Request, res: Response, next:NextFunction) {
    debugger
    try {
      const { id: clientId } = req.asaasClient.data
      const { data: documentData } = req.clicksignDocumentData.document.template

      const value = documentData['valor negociado']
      const installmentValue = documentData['valor parcela']
      const installmentcount = documentData.parcelas
      const paymentType = documentData['forma de pagamento']
      const installmentDay = documentData['vencimento da parcela']

      return clientId
    } catch (err) {
      return err
    }
  }
}
