export default function checkPaymentType (input: string) {
  let paymentType: string

  if (~input.indexOf('Bol')) {
    paymentType = 'BOLETO'
  } else if (~input.indexOf('Cart')) {
    paymentType = 'CREDIT_CARD'
  } else {
    paymentType = 'undefined'
  }
  return paymentType
}
