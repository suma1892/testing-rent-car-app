interface Image {
  id: number;
  file_name: string;
}

export interface Variety {
  id: number;
  color: string;
  max_order: number;
  stock: number;
  available_stock: number;
  input_order: number;
  images: Image[];
}

export interface AdditonalProduct {
  id: number;
  name: string;
  description: string;
  unit_price: number;
  created_at: string;
  warehouse_id: number;
  varieties: Variety[];
}
