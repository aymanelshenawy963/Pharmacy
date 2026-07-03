import { useEffect } from 'react';

const setMeta = (selector, content, attr = 'property') => {
    if (!content) return;
    let meta = document.querySelector(selector);
    if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, selector.replace('meta[', '').replace(']', ''));
        document.head.appendChild(meta);
    }
    meta.content = content;
};

export default function Seo({ title, description, image, url, type = 'website' }) {
    useEffect(() => {
        if (title) {
            document.title = `${title} | Medical Store`;
        }

        if (description) {
            setMeta('meta[name="description"]', description, 'name');
        }

        const fullTitle = title ? `${title} | Medical Store` : 'Medical Store';

        setMeta('meta[property="og:title"]', fullTitle);
        setMeta('meta[property="og:description"]', description);
        setMeta('meta[property="og:type"]', type);

        if (image) {
            setMeta('meta[property="og:image"]', image);
        }

        if (url) {
            setMeta('meta[property="og:url"]', url);
        }

        setMeta('meta[name="twitter:card"]', image ? 'summary_large_image' : 'summary', 'name');
        setMeta('meta[name="twitter:title"]', fullTitle, 'name');
        setMeta('meta[name="twitter:description"]', description, 'name');

        if (image) {
            setMeta('meta[name="twitter:image"]', image, 'name');
        }
    }, [title, description, image, url, type]);

    return null;
}
