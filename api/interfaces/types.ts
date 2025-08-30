export type VerifyToken = { userId: string; email: string; expired?: boolean };
export type OrderCreateRequestBody = { productId: string; quantity: number }[];
