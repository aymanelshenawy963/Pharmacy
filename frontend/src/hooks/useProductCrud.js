import { useState, useEffect, useRef, useCallback } from 'react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { productSchema } from '../validation/admin';
import { parseZodError } from '../utils/validation';
import notify from '../utils/notifications';
import { getPhotoUrl, urlToFile } from '../utils/photoHelpers';
import { useClickOutside } from './admin';

const INITIAL_FORM = {
    name: '',
    description: '',
    newPrice: '',
    oldPrice: '',
    stock: '',
    categoryId: '',
    requiresPrescription: false,
    hasStrips: false,
    stripCount: '',
    topSelling: false,
};

const INITIAL_ERRORS = {
    name: '',
    description: '',
    newPrice: '',
    oldPrice: '',
    stock: '',
    categoryId: '',
    photos: '',
};

export default function useProductCrud() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('nameasc');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [form, setForm] = useState(INITIAL_FORM);
    const [formErrors, setFormErrors] = useState(INITIAL_ERRORS);
    const [photos, setPhotos] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);

    const sortRef = useRef(null);
    const categoryRef = useRef(null);
    const searchTimeout = useRef(null);

    const closeSort = useCallback(() => setSortOpen(false), []);
    const closeCategory = useCallback(() => setCategoryOpen(false), []);
    useClickOutside(sortRef, closeSort);
    useClickOutside(categoryRef, closeCategory);

    const fetchCategories = useCallback(async () => {
        try {
            const data = await categoryService.getAll();
            setCategories(data);
        } catch {
            notify.error('Failed to load categories');
        }
    }, []);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = {
                PageSize: 6,
                PageNumber: pageIndex,
                Sort: sort,
            };
            if (search.trim()) params.Search = search.trim();
            if (categoryFilter) params.CategoryId = categoryFilter;

            const res = await productService.getAll(params);
            setProducts(res.data || []);
            setTotalPages(res.totalPages || 1);
            setTotalCount(res.totalCount || 0);
        } catch (err) {
            notify.errorFromApi(err, 'Failed to load products');
            setError('Failed to load products');
        } finally {
            setIsLoading(false);
        }
    }, [pageIndex, sort, search, categoryFilter]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            setPageIndex(1);
        }, 300);
        return () => clearTimeout(searchTimeout.current);
    }, [search]);

    function resetForm() {
        setForm(INITIAL_FORM);
        setFormErrors(INITIAL_ERRORS);
        setPhotos([]);
    }

    function openCreateModal() {
        resetForm();
        setShowCreateModal(true);
    }

    async function openEditModal(product) {
        setSelectedProduct(product);
        setForm({
            name: product.name || '',
            description: product.description || '',
            newPrice: product.newPrice ?? '',
            oldPrice: product.oldPrice ?? '',
            stock: product.stock ?? '',
            categoryId: categories.find(c => c.name === product.categoryName)?.id || '',
            requiresPrescription: product.requiresPrescription || false,
            hasStrips: product.hasStrips || false,
            stripCount: product.stripCount ?? '',
            topSelling: product.topSelling || false,
        });
        setFormErrors(INITIAL_ERRORS);

        if (product.photos?.length > 0) {
            const existingFiles = await Promise.all(
                product.photos.map((url, i) =>
                    urlToFile(getPhotoUrl(url), `existing-${i}.jpg`).catch(() => null)
                )
            );
            setPhotos(existingFiles.filter(Boolean));
        } else {
            setPhotos([]);
        }

        setShowEditModal(true);
    }

    function openDeleteDialog(product) {
        setSelectedProduct(product);
        setShowDeleteDialog(true);
    }

    function handleFormChange(e) {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    }

    function validate() {
        const result = productSchema.safeParse({ ...form, photos });
        if (!result.success) {
            const errors = parseZodError(result.error);
            setFormErrors({ ...INITIAL_ERRORS, ...errors });
            return false;
        }
        setFormErrors(INITIAL_ERRORS);
        return true;
    }

    function buildFormData() {
        const fd = new FormData();
        fd.append('Name', form.name.trim());
        fd.append('Description', form.description.trim());
        fd.append('NewPrice', Number(form.newPrice));
        fd.append('OldPrice', form.oldPrice ? Number(form.oldPrice) : 0);
        fd.append('Stock', Number(form.stock));
        fd.append('RequiresPrescription', form.requiresPrescription);
        fd.append('HasStrips', form.hasStrips);
        if (form.hasStrips && form.stripCount) fd.append('StripCount', Number(form.stripCount));
        fd.append('TopSelling', form.topSelling);
        fd.append('CategoryId', Number(form.categoryId));
        photos.forEach(file => {
            if (file instanceof File) fd.append('Photos', file);
        });
        return fd;
    }

    async function handleCreate() {
        if (!validate()) return;
        setIsSubmitting(true);
        try {
            const fd = buildFormData();
            await productService.create(fd);
            notify.success('Product created successfully');
            setShowCreateModal(false);
            resetForm();
            fetchProducts();
        } catch (err) {
            notify.errorFromApi(err, 'Failed to create product');
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleUpdate() {
        if (!validate()) return;
        setIsSubmitting(true);
        try {
            const fd = buildFormData();
            await productService.update(selectedProduct.id, fd);
            notify.success('Product updated successfully');
            setShowEditModal(false);
            resetForm();
            fetchProducts();
        } catch (err) {
            notify.errorFromApi(err, 'Failed to update product');
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete() {
        setIsSubmitting(true);
        try {
            await productService.remove(selectedProduct.id);
            notify.success('Product deleted successfully');
            setShowDeleteDialog(false);
            setSelectedProduct(null);
            fetchProducts();
        } catch (err) {
            notify.errorFromApi(err, 'Failed to delete product');
        } finally {
            setIsSubmitting(false);
        }
    }

    return {
        products,
        categories,
        totalCount,
        totalPages,
        pageIndex,
        setPageIndex,
        sort,
        setSort,
        categoryFilter,
        setCategoryFilter,
        search,
        setSearch,
        isLoading,
        error,
        fetchProducts,
        showCreateModal,
        setShowCreateModal,
        openCreateModal,
        showEditModal,
        setShowEditModal,
        openEditModal,
        showDeleteDialog,
        setShowDeleteDialog,
        openDeleteDialog,
        selectedProduct,
        form,
        formErrors,
        photos,
        setPhotos,
        isSubmitting,
        handleFormChange,
        handleCreate,
        handleUpdate,
        handleDelete,
        sortOpen,
        setSortOpen,
        categoryOpen,
        setCategoryOpen,
        sortRef,
        categoryRef,
    };
}
