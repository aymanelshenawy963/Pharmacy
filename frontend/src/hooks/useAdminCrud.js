import { useState, useEffect, useCallback, useMemo } from 'react';
import notify from '../utils/notifications';

export default function useAdminCrud(fetchFn, {
    immediate = true,
    errorMessage = 'Failed to load data',
    filterFn = null,
} = {}) {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetchFn();
            setData(Array.isArray(result) ? result : result?.data ?? []);
        } catch (err) {
            notify.errorFromApi(err, errorMessage);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [fetchFn, errorMessage]);

    useEffect(() => {
        if (immediate) fetchData();
    }, [immediate, fetchData]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return data;
        if (filterFn) return data.filter((item) => filterFn(item, q));
        return data.filter((item) =>
            (item.name ?? '').toLowerCase().includes(q) ||
            (item.description ?? '').toLowerCase().includes(q) ||
            (item.email ?? '').toLowerCase().includes(q) ||
            (item.userName ?? '').toLowerCase().includes(q)
        );
    }, [data, search, filterFn]);

    return {
        data,
        setData,
        filtered,
        isLoading,
        error,
        setError,
        search,
        setSearch,
        refetch: fetchData,
    };
}
