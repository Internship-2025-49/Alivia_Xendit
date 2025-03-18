export interface invoiceValues {
  invoiceId: string;
  externalId: string;
  userId: string;
  status: string;
  merchantName: string;
  merchantProfilePictureUrl: string;
  amount: number;
  expiryDate: Date;
  invoiceUrl: string;
  created: Date;
  updated: Date;
  currency: string;
  customer: object;
  items: object;
  fees?: object;
  availableBanks?: object;
  availableRetailOutlets?: object;
  availableEwallets?: object;
  availableQrCodes?: object;
  availableDirectDebits?: object;
  availablePaylaters?: object;
}
