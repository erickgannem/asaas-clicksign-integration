import asaasAPI from '../helpers/asaasApi'
import { Request, Response, NextFunction } from 'express'
import removeCPFChars from '../helpers/removeCPFchars'
import { addMonths, isAfter, isToday, format } from 'date-fns'
import Charge from '../interfaces/Charge'
import checkPaymentType from '../helpers/checkPaymentType'
import db from '../database/connection'

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

      return next()
    } catch (err) {
      return next(err)
    }
  }

  static async checkIfClientExists (req: Request, res: Response, next: NextFunction) {
    const { asaasClient, clicksignDocumentData } = req
    const clientExists = !!Object.keys(asaasClient).length

    if (clientExists) {
      return next()
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
        const asaasResponse = await asaasAPI.post('/api/v3/customers', body)
        const { data: newClient } = asaasResponse
        req.asaasClient = newClient

        return next()
      } catch (err) {
        return next(err)
      }
    }
  }

  static async createCharge (req: Request, res: Response, next: NextFunction) {
    try {
      const { id: clientId } = req.asaasClient
      const { data: documentData } = req.clicksignDocumentData.document.template

      const value: string = documentData['valor negociado']
      const installmentValue: string = documentData['valor parcela']
      const installmentDay: string = documentData['vencimento da parcela']
      const paymentType = checkPaymentType(documentData['forma de pagamento'])
      const installmentCount = documentData.parcelas

      let installmentDate

      const today = new Date()
      const proposedInstallmentDateStr: string = `${today.getMonth() + 1}-${installmentDay}-${today.getFullYear()}`
      const proposedInstallmentDate = new Date(proposedInstallmentDateStr)
      const proposedIsAfterToday = isAfter(proposedInstallmentDate, today)
      const proposedIsToday = isToday(proposedInstallmentDate)

      const body: Charge = {
        customer: clientId,
        billingType: paymentType,
        dueDate: '',
        value,
        installmentCount,
        installmentValue
      }

      if (proposedIsAfterToday || proposedIsToday) {
        body.dueDate = format(proposedInstallmentDate, 'yyyy-MM-dd')

        await asaasAPI.post('/api/v3/payments', body)

        process.stdout.write(`\n>> [Asaas Controller] Payment for document: ${req.clicksignDocumentKey} was succesfully generated`)

        return res.status(200).end()
      } else {
        installmentDate = format(addMonths(proposedInstallmentDate, 1), 'yyyy-MM-dd')
        body.dueDate = installmentDate
        await asaasAPI.post('/api/v3/payments', body)

        process.stdout.write(`\n>> [Asaas Controller] Payment for document: ${req.clicksignDocumentKey} was succesfully generated`)

        return res.status(200).end()
      }
    } catch (err) {
      return next({
        message: err.response.data.errors[0].description
      })
    }
  }

  static async createInvoice (req: Request, res: Response, next: NextFunction) {
    const body = {
      event: 'PAYMENT_RECEIVED',
      payment: {
        object: 'payment',
        id: 'pay_080225913252',
        dateCreated: '2017-03-10',
        customer: 'cus_G7Dvo4iphUNk',
        subscription: 'sub_VXJBYgP2u0eO', // somente quando pertencer a uma assinatura
        installment: 'ins_000000001031', // somente quando pertencer a um parcelamento
        dueDate: '2017-03-15',
        value: 100.00,
        netValue: 94.51,
        billingType: 'CREDIT_CARD',
        status: 'RECEIVED',
        description: 'Pedido 056984',
        externalReference: '056984',
        confirmedDate: '2017-03-15',
        originalValue: null,
        interestValue: null,
        originalDueDate: '2017-06-10',
        paymentDate: null,
        clientPaymentDate: null,
        invoiceUrl: 'https://www.asaas.com/i/080225913252',
        bankSlipUrl: null,
        invoiceNumber: '00005101',
        deleted: false,
        creditCard: {
          creditCardNumber: '8829',
          creditCardBrand: 'MASTERCARD',
          creditCardToken: 'a75a1d98-c52d-4a6b-a413-71e00b193c99'
        }
      }
    }

    const { event } = body
    const PAYMENT_RECEIVED = 'PAYMENT_RECEIVED'

    if (event === PAYMENT_RECEIVED) {
      console.log(event)
    }

    return res.status(200).end()
  }
}
