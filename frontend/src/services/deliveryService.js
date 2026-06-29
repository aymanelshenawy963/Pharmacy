// No backend API exists for delivery methods — these are static/fallback values.
export const deliveryMethods = [
    {
        id: 1,
        name: 'Fast Delivery',
        description: 'Get your order in 1-2 days',
        price: 9.99,
        deliveryTime: '1-2 days',
    },
    {
        id: 2,
        name: 'Standard Delivery',
        description: 'Get your order in 3-5 days',
        price: 4.99,
        deliveryTime: '3-5 days',
    },
    {
        id: 3,
        name: 'Economy Delivery',
        description: 'Get your order in 5-7 days',
        price: 2.99,
        deliveryTime: '5-7 days',
    },
];
