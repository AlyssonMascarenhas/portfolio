/** Contrato da "API" de produtos usada pelos labs (busca, filtro por categoria). */
export const LAB_PRODUCT_CATEGORIES = [
  'keyboards',
  'monitors',
  'audio',
  'accessories',
] as const;

export type LabProductCategory = (typeof LAB_PRODUCT_CATEGORIES)[number];

export interface LabProduct {
  id: number;
  name: string;
  category: LabProductCategory;
}

/** Cenários do API Playground: cada um faz o mock de pedidos responder de um jeito. */
export const LAB_ORDER_SCENARIOS = [
  'ok',
  'bad-request',
  'unauthorized',
  'forbidden',
  'not-found',
  'conflict',
  'validation',
  'server',
  'timeout',
  'offline',
  'flaky',
] as const;

export type LabOrderScenario = (typeof LAB_ORDER_SCENARIOS)[number];

export interface LabOrder {
  id: string;
  status: 'created';
}

/** Corpo de erro da API de pedidos. A UI traduz `code`; nunca exibe texto vindo do servidor. */
export interface LabApiError {
  code: string;
  correlationId?: string;
  errors?: { field: string; code: string }[];
}

/** Resposta da validação de cupom (formulário do lab de formulários). */
export interface LabCouponResult {
  valid: boolean;
  discountPercent?: number;
}

export interface LabCheckoutRequest {
  name: string;
  email: string;
  quantity: number;
  coupon: string;
}

export interface LabCheckoutResult {
  id: string;
}

/** Erro de validação do servidor no envio do pedido, por campo (a UI traduz `code`). */
export interface LabCheckoutError {
  errors: { field: keyof LabCheckoutRequest; code: string }[];
}
