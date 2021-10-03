export interface IPayloadBase {
  [key: string]: any;
  discountPercentage: number;
  discountStartMonth: number;
  discountEndMonth: number;
  deleteOlderThan: number;
}
