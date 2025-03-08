export interface RefundOrderHistory {
  id: number;
  status: 'CREATED' | 'PROCESSED' | 'TRANSFERED';
  created_at: string;
}

export type RefundStatus = 'CREATED' | 'PROCESSED' | 'TRANSFERED' | 'REQUEST_CHANGE' | 'REJECTED';

export interface RefundOrder {
  id: number;
  refund_date: string;
  refund_amount: number;
  status: RefundStatus;
  transfered_date: string | null;
  customer_name: string;
  order_key: string;
  payment_method: string;
  provider: string;
  customer_bank_account_name: string;
  customer_bank_name: string;
  customer_bank_number: string;
  rejected_reason: string;
  proof_of_transfer_refund: string;
  currency: string;
  order_type_id: number;
  order_transaction_key: string;
  without_driver: boolean;
  customer_id: string;
  refund_order_histories: RefundOrderHistory[];
}
