import { Types } from 'mongoose';

// Order type
export type TOrder = {
  user: Types.ObjectId;
  product: string;
  quantity: number;
  totalPrice: number;
  address: string;
  city: string;
  phone: string;
  status: 'Pending' | 'Paid' | 'Shipped' | 'Completed' | 'Cancelled';
  estimatedDeliveryDate: Date;
  transaction: {
    id: string;
    transactionStatus: string;
    bank_status: string;
    sp_code: string;
    sp_message: string;
    method: string;
    date_time: string;
  };
};
