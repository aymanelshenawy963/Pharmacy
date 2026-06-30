import { useEffect } from 'react';

export default function useClickOutside(refs, onClose) {
    useEffect(() => {
        function handleClickOutside(e) {
            const refsArray = Array.isArray(refs) ? refs : [refs];
            const isInside = refsArray.some(
                (ref) => ref.current && ref.current.contains(e.target)
            );
            if (!isInside) onClose();
        }

        function handleEscape(e) {
            if (e.key === 'Escape') onClose();
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [refs, onClose]);
}
