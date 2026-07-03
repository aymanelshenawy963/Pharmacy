import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from './useDebounce';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import notify from '../utils/notifications';
import { normalizeProduct } from '../utils/normalizeProduct';

const PER_PAGE = 6;

export default function useProducts() {
    const [searchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('q') || '');
    const [category, setCategory] = useState(searchParams.get('category') || 'All');
    const [sortBy, setSortBy] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [products, setProducts] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [categories, setCategories] = useState([]);

    const debouncedSearch = useDebounce(search, 400);
    const categoriesRef = useRef(categories);
    categoriesRef.current = categories;

    useEffect(() => {
        (async () => {
            try {
                const data = await categoryService.getAll();
                setCategories(Array.isArray(data) ? data : []);
            } catch {
                // Categories will be empty; filter dropdown shows only "All"
            }
        })();
    }, []);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = { PageSize: PER_PAGE, PageNumber: currentPage };
            if (debouncedSearch.trim()) params.Search = debouncedSearch.trim();
            if (category !== 'All') {
                const match = categoriesRef.current.find(
                    (c) => c.name.toLowerCase() === category.toLowerCase(),
                );
                if (match) params.CategoryId = match.id;
            }
            if (sortBy) params.Sort = sortBy;

            const data = await productService.getAll(params);

            const items = (data.data || []).map(normalizeProduct);
            setProducts(items);
            setTotalCount(data.totalCount ?? items.length);
            setTotalPages(data.totalPages ?? 1);
        } catch (err) {
            notify.errorFromApi(err);
            setError(true);
            setProducts([]);
            setTotalCount(0);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, category, sortBy, currentPage]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, category, sortBy]);

    useEffect(() => {
        setCategory(searchParams.get('category') || 'All');
    }, [searchParams]);

    const resetFilters = () => {
        setSearch('');
        setCategory('All');
        setSortBy('');
        setCurrentPage(1);
    };

    return {
        search,
        setSearch,
        category,
        setCategory,
        sortBy,
        setSortBy,
        currentPage,
        setCurrentPage,
        loading,
        error,
        products,
        totalCount,
        totalPages,
        categories,
        resetFilters,
        fetchProducts,
    };
}
