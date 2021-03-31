import { Request, Response, NextFunction } from 'express'
import {
  addMonths,
  addDays,
  isAfter,
  isToday,
  differenceInCalendarDays,
  format,
  parseISO
} from 'date-fns'

import asaasAPI from '../helpers/asaasApi'
import removeCPFChars from '../helpers/removeCPFchars'
import checkPaymentType from '../helpers/checkPaymentType'
import Charge from '../interfaces/Charge'
import db from '../database/connection'

import PaymentDocument from '../database/interfaces/PaymentDocument'

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

  static async paymentWebhook (req: Request, res: Response, next: NextFunction) {
    const { body } = req
    const { event } = body

    const PAYMENT_RECEIVED = 'PAYMENT_RECEIVED'

    if (event === PAYMENT_RECEIVED) {
      req.asaasPaymentInformation = body
      return next()
    } else {
      process.stdout.write('\n>> [Asaas Controller] Payment still not confirmed. Skipping\n')
      return res.status(200).json({ message: 'Payment still not confirmed. Skipping' })
    }
  }

  static async savePaymentToDB (req: Request, res: Response, next: NextFunction) {
    const INVOICING_DEADLINE_DAYS = 10
    const { asaasPaymentInformation } = req
    const { payment } = asaasPaymentInformation
    const { paymentDate, confirmedDate } = payment

    const effectivePaymentDay = paymentDate || confirmedDate

    const scheduledInvoiceDate = addDays(parseISO(effectivePaymentDay), INVOICING_DEADLINE_DAYS)

    try {
      const payment = await db.Payment.create({
        scheduledInvoiceDate: scheduledInvoiceDate,
        payload: asaasPaymentInformation
      })

      return res.status(200).json({ message: 'Payment received:' + payment })
    } catch (err) {
      return next(err)
    }
  }

  static async checkIfPaymentIsProcessed (req: Request, res: Response, next: NextFunction) {
    try {
      const payments: PaymentDocument[] = await db.Payment.find()
      const unprocessedPayments: PaymentDocument[] = payments.filter((paymentDocument: PaymentDocument) => {
        const { processed } = paymentDocument
        return !processed
      })

      req.unprocessedPayments = unprocessedPayments
      return next()
    } catch (err) {
      return next(err)
    }
  }

  static async checkPaymentDate (req: Request, res: Response, next: NextFunction) {
    const { unprocessedPayments } = req
    const TODAY = new Date()

    const paymentsReadyToInvoice: PaymentDocument[] = unprocessedPayments.filter((paymentDocument: PaymentDocument) => {
      const { scheduledInvoiceDate } = paymentDocument
      return differenceInCalendarDays(scheduledInvoiceDate, TODAY) <= 0
    })

    req.paymentsReadyToInvoice = paymentsReadyToInvoice
    return next()
  }

  static async createInvoice (req: Request, res: Response, next: NextFunction) {
    const { paymentsReadyToInvoice } = req
    try {
      for (const p of paymentsReadyToInvoice) {
        const body = {
          payment: 1,
          serviceDescription: `[Auto] Nota Fiscal da Fatura ${p.payload.payment.id}`,
          observations: '',
          value: p.payload.payment.value,
          deductions: 0,
          effectiveDate: p.scheduledInvoiceDate,
          municipalServiceCode: '17.02',
          municipalServiceName: 'Datilografia, digitação, estenografia, expediente, secretaria em geral, resposta audível, redação, edição, interpretação, revisão, tradução, apoio e infra estrutura administrativa e congêneres.',
          taxes: {
            retainIss: false,
            iss: 0.2,
            cofins: 0,
            csll: 0,
            inss: 0,
            ir: 0,
            pis: 0
          }
        }
        // await asaasAPI.post('/api/v3/invoices', {})
        console.log(body)
      }
      return res.end()
    } catch (err) {
      return next(err)
    }
  }
}
