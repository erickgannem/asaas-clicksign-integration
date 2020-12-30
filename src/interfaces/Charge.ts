export default interface Charge {
  customer: string;
  billingType: string;
  dueDate: string;
  value: string;
  installmentCount?: string;
  installmentValue?: string;
}
