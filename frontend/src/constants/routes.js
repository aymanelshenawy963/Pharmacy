export const ROUTES = {
    HOME: '/',
    PRODUCTS: '/products',
    PRODUCT_DETAIL: '/products/:id',
    CART: '/cart',
    CHECKOUT: '/checkout',
    PAYMENT: '/payment',
    PAYMENT_SUCCESS: '/payment/success',
    PAYMENT_FAILED: '/payment/failed',
    ABOUT: '/about',
    FAQ: '/faq',
    CONTACT: '/contact',
    PRIVACY_POLICY: '/privacy-policy',
    TERMS_CONDITIONS: '/terms-conditions',
    CANCEL_ORDER: '/cancel-order',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    CONFIRM_EMAIL: '/confirm-email',
    RESEND_CONFIRMATION: '/resend-confirmation',
    CHECK_EMAIL: '/check-email',
    ADMIN: '/admin',
    ADMIN_PRODUCTS: '/admin/products',
    ADMIN_USERS: '/admin/users',
    ADMIN_ROLES: '/admin/roles',
    ADMIN_CATEGORIES: '/admin/categories',
    ADMIN_ORDERS: '/admin/orders',
    ADMIN_ORDER_DETAIL: '/admin/orders/:id',
    ADMIN_NOTIFICATIONS: '/admin/notifications',
    ACCOUNT: '/account',
    ACCOUNT_PROFILE: '/account/profile',
    ACCOUNT_SECURITY: '/account/security',
    ACCOUNT_ORDERS: '/account/orders',
    ACCOUNT_ORDER_DETAIL: '/account/orders/:id',
};

export const buildProductUrl = (id) => `/products/${id}`;
export const buildOrderUrl = (id) => `/account/orders/${id}`;
export const buildAdminOrderUrl = (id) => `/admin/orders/${id}`;
export const buildCategoryProductsUrl = (category) => `/products?category=${encodeURIComponent(category)}`;
export const buildProductSearchUrl = (query) => `/products?q=${encodeURIComponent(query)}`;
