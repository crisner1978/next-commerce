
export interface IProduct extends ProductBody {
  _id: string
}

export type ProductBody = {
  name: string;
  price: number;
  description: string;
  sku: string;
  mediaUrl: string;
};

