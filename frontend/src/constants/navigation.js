import { Pill, FileText, Info, HelpCircle, Phone } from 'lucide-react';

export const shoppingLinks = [
    { label: 'Products', to: '/products', icon: Pill },
    { label: 'Prescription', to: '/prescription', icon: FileText },
];

export const supportLinks = [
    { label: 'About', to: '/about', icon: Info },
    { label: 'FAQ', to: '/faq', icon: HelpCircle },
    { label: 'Contact', to: '/contact', icon: Phone },
];
