export interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  category: 'Saree' | 'Dress' | 'Pattu Saree' | string;
  description?: string;
  inStock?: boolean;
  createdAt?: any;
}

export interface Order {
  id: string;
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  pincode: string;
  productId: string;
  productTitle: string;
  productPrice: number;
  paymentScreenshot?: string;
  transactionId?: string;
  status: 'Pending' | 'Paid' | 'Shipped' | 'Delivered';
  createdAt: any;
}
