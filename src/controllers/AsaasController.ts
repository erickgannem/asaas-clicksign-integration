import asaasAPI from '../helpers/asaasApi'
import { Request, Response, NextFunction } from 'express'
import removeCPFChars from '../helpers/removeCPFchars'
import { addMonths, isAfter, isToday, format } from 'date-fns'

export default class AsaasController {
  static async fetchClients (req: Request, res: Response, next: NextFunction) {
    const { clicksignDocumentData } = req
    const cpfCnpj = clicksignDocumentData.document.template.data.cpf
    const cleanCpfCnpj = removeCPFChars(cpfCnpj)
    try {
      const { data } = await asaasAPI.get(`/api/v3/customers?cpfCnpj=${cleanCpfCnpj}`)
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
    try {
      const { id: clientId } = req.asaasClient.data
      const { data: documentData } = req.clicksignDocumentData.document.template

      const installmentCount = documentData.parcelas
      const value = documentData['valor negociado']
      const installmentValue = documentData['valor parcela']
      const installmentDay = documentData['vencimento da parcela']
      const paymentType = (~documentData['forma de pagamento'].indexOf('Boleto')) ? 'BOLETO' : 'CREDIT_CARD'

      let installmentDate
      const today = new Date()
      const proposedInstallmentDateStr = `${today.getMonth() + 1}-${installmentDay}-${today.getFullYear()}`
      const proposedInstallmentDate = new Date(proposedInstallmentDateStr)
      const proposedIsAfterToday = isAfter(proposedInstallmentDate, today)
      const proposedIsToday = isToday(proposedInstallmentDate)

      const body: {
        customer: string;
        billingType: string;
        dueDate: string;
        value: string;
        installmentCount: string;
        installmentValue: string;
      } = {
        customer: clientId,
        billingType: paymentType,
        dueDate: '',
        value,
        installmentCount,
        installmentValue
      }

      if (proposedIsAfterToday || proposedIsToday) {
        body.dueDate = format(proposedInstallmentDate, 'yyyy-MM-dd')
        const payment = await asaasAPI.post('/api/v3/payments', body)
        return payment
      } else {
        installmentDate = format(addMonths(proposedInstallmentDate, 1), 'yyyy-MM-dd')
        body.dueDate = installmentDate
        const payment = await asaasAPI.post('/api/v3/payments', body)
        return payment
      }
    } catch (err) {
      return err
    }
  }
}
