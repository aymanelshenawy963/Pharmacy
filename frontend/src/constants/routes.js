export const ROUTES = {
    HOME: '/',
    PRODUCTS: '/products',
    PRODUCT_DETAIL: '/products/:id',
    PRESCRIPTION: '/prescription',
    CART: '/cart',
    CHECKOUT: '/checkout',
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
    ACCOUNT: '/account',
    ACCOUNT_PROFILE: '/account/profile',
    ACCOUNT_SECURITY: '/account/security',
    ACCOUNT_ORDERS: '/account/orders',
    ACCOUNT_ORDER_DETAIL: '/account/orders/:id',
};

export const buildProductUrl = (id) => `/products/${id}`;
export const buildOrderUrl = (id) => `/account/orders/${id}`;
export const buildCategoryProductsUrl = (category) => `/products?category=${encodeURIComponent(category)}`;
export const buildProductSearchUrl = (query) => `/products?q=${encodeURIComponent(query)}`;
