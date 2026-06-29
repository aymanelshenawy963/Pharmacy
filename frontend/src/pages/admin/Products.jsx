import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Pencil, Trash2, RefreshCw, Filter, ChevronDown, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { formatPrice } from '../../utils/currency';
import { parseApiError } from '../../utils/apiErrorHandler';
import { BASE_URL } from '../../config/api';
import PageHeader from '../../components/admin/PageHeader';
import SearchInput from '../../components/admin/SearchInput';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import FormField from '../../components/admin/FormField';
import ImageUploader from '../../components/admin/ImageUploader';

const SORT_OPTIONS = [
    { value: 'priceasc', label: 'Price: Low to High' },
    { value: 'pricedesc', label: 'Price: High to Low' },
    { value: 'nameasc', label: 'Name: A to Z' },
    { value: 'namedesc', label: 'Name: Z to A' },
];

function getPhotoUrl(photo) {
    if (!photo) return '';
    if (photo.startsWith('http://') || photo.startsWith('https://')) return photo;
    return `${BASE_URL}${photo.startsWith('/') ? photo : `/${photo}`}`;
}

async function urlToFile(url, filename) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
}

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

const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

function StockIndicator({ stock }) {
    let color, bg, label;
    if (stock <= 0) {
        color = 'text-red-500';
        bg = 'bg-red-500/10';
        label = 'Out of Stock';
    } else if (stock <= 10) {
        color = 'text-amber-500';
        bg = 'bg-amber-500/10';
        label = 'Low Stock';
    } else {
        color = 'text-emerald-500';
        bg = 'bg-emerald-500/10';
        label = 'In Stock';
    }
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${bg} ${color}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
            {stock} ({label})
        </span>
    );
}

export default function Products() {
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

    const fetchCategories = useCallback(async () => {
        try {
            const data = await categoryService.getAll();
            setCategories(data);
        } catch {
            toast.error('Failed to load categories');
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
            const msgs = parseApiError(err);
            setError(msgs.join(' '));
        } finally {
            setIsLoading(false);
        }
    }, [pageIndex, sort, search, categoryFilter]);

    useEffect(() => {
        const controller = new AbortController();
        fetchCategories();
        return () => controller.abort();
    }, [fetchCategories]);

    useEffect(() => {
        const controller = new AbortController();
        fetchProducts();
        return () => controller.abort();
    }, [fetchProducts]);

    useEffect(() => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            setPageIndex(1);
        }, 300);
        return () => clearTimeout(searchTimeout.current);
    }, [search]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
            if (categoryRef.current && !categoryRef.current.contains(e.target)) setCategoryOpen(false);
        }
        function handleEsc(e) {
            if (e.key === 'Escape') {
                setSortOpen(false);
                setCategoryOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEsc);
        };
    }, []);

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
        const errors = {};
        if (!form.name.trim()) errors.name = 'Name is required';
        if (!form.description.trim()) errors.description = 'Description is required';
        if (!form.newPrice || Number(form.newPrice) <= 0) errors.newPrice = 'Valid price is required';
        if (form.oldPrice && Number(form.oldPrice) < 0) errors.oldPrice = 'Old price cannot be negative';
        if (!form.stock || Number(form.stock) < 0) errors.stock = 'Valid stock is required';
        if (!form.categoryId) errors.categoryId = 'Category is required';
        if (photos.length === 0) errors.photos = 'At least one photo is required';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
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
            toast.success('Product created successfully');
            setShowCreateModal(false);
            resetForm();
            fetchProducts();
        } catch (err) {
            const msgs = parseApiError(err);
            toast.error(msgs.join(' '));
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
            toast.success('Product updated successfully');
            setShowEditModal(false);
            resetForm();
            fetchProducts();
        } catch (err) {
            const msgs = parseApiError(err);
            toast.error(msgs.join(' '));
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete() {
        setIsSubmitting(true);
        try {
            await productService.remove(selectedProduct.id);
            toast.success('Product deleted successfully');
            setShowDeleteDialog(false);
            setSelectedProduct(null);
            fetchProducts();
        } catch (err) {
            const msgs = parseApiError(err);
            toast.error(msgs.join(' '));
        } finally {
            setIsSubmitting(false);
        }
    }

    const columns = [
        {
            key: 'product',
            header: 'Product',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 overflow-hidden rounded-xl border border-[rgb(var(--color-border))] shadow-sm">
                        {row.photos?.[0] ? (
                            <img src={getPhotoUrl(row.photos[0])} alt={row.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-[rgb(var(--color-bg-subtle))]">
                                <Package size={18} className="text-[rgb(var(--color-text-muted))]" />
                            </div>
                        )}
                    </div>
                    <span className="font-medium truncate">{row.name}</span>
                </div>
            ),
        },
        {
            key: 'categoryName',
            header: 'Category',
            render: (row) => (
                <span className="inline-block rounded-lg bg-[rgb(var(--color-primary))]/10 px-2 py-0.5 text-xs font-medium text-[rgb(var(--color-primary))]">
                    {row.categoryName}
                </span>
            ),
        },
        {
            key: 'newPrice',
            header: 'Price',
            render: (row) => (
                <div className="flex items-center gap-1">
                    <span className="font-semibold text-sm">{formatPrice(row.newPrice)}</span>
                    {row.oldPrice > row.newPrice && (
                        <span className="text-xs text-[rgb(var(--color-text-muted))] line-through">{formatPrice(row.oldPrice)}</span>
                    )}
                </div>
            ),
        },
        {
            key: 'stock',
            header: 'Stock',
            render: (row) => <StockIndicator stock={row.stock} />,
        },
        {
            key: 'requiresPrescription',
            header: 'Rx',
            render: (row) => (
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                    row.requiresPrescription
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800/30 dark:text-gray-400'
                }`}>
                    {row.requiresPrescription ? 'Rx' : 'OTC'}
                </span>
            ),
        },
        {
            key: 'topSelling',
            header: 'Top',
            render: (row) => (
                row.topSelling ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        <Star size={10} fill="currentColor" />
                        Top
                    </span>
                ) : (
                    <span className="text-xs text-[rgb(var(--color-text-muted))]">-</span>
                )
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            width: 'auto',
            render: (row) => (
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => openEditModal(row)}
                        className="rounded-lg p-2 text-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))]/10 transition-all duration-200 min-w-[40px] min-h-[40px] flex items-center justify-center"
                        title="Edit"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={() => openDeleteDialog(row)}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-500/10 transition-all duration-200 min-w-[40px] min-h-[40px] flex items-center justify-center"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
        },
    ];

    const renderForm = () => (
        <div className="flex flex-col gap-4">
            <FormField
                label="Name"
                name="name"
                value={form.name}
                onChange={handleFormChange}
                error={formErrors.name}
                required
                placeholder="Product name"
            />

            <FormField
                label="Description"
                name="description"
                type="textarea"
                value={form.description}
                onChange={handleFormChange}
                error={formErrors.description}
                required
                placeholder="Product description"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                    label="New Price"
                    name="newPrice"
                    type="number"
                    value={form.newPrice}
                    onChange={handleFormChange}
                    error={formErrors.newPrice}
                    required
                    placeholder="0.00"
                />
                <FormField
                    label="Old Price"
                    name="oldPrice"
                    type="number"
                    value={form.oldPrice}
                    onChange={handleFormChange}
                    error={formErrors.oldPrice}
                    required
                    placeholder="0.00"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                    label="Stock"
                    name="stock"
                    type="number"
                    value={form.stock}
                    onChange={handleFormChange}
                    error={formErrors.stock}
                    required
                    placeholder="0"
                />
                <FormField
                    label="Category"
                    name="categoryId"
                    type="select"
                    value={form.categoryId}
                    onChange={handleFormChange}
                    error={formErrors.categoryId}
                    required
                    placeholder="Select category"
                    options={categories.map(c => ({ value: c.id, label: c.name }))}
                />
            </div>

            <div className="flex flex-wrap gap-4 sm:gap-6">
                <FormField
                    label="Requires Prescription"
                    name="requiresPrescription"
                    type="checkbox"
                    value={form.requiresPrescription}
                    onChange={handleFormChange}
                />
                <FormField
                    label="Has Strips"
                    name="hasStrips"
                    type="checkbox"
                    value={form.hasStrips}
                    onChange={handleFormChange}
                />
                <FormField
                    label="Top Selling"
                    name="topSelling"
                    type="checkbox"
                    value={form.topSelling}
                    onChange={handleFormChange}
                />
            </div>

            {form.hasStrips && (
                <FormField
                    label="Strip Count"
                    name="stripCount"
                    type="number"
                    value={form.stripCount}
                    onChange={handleFormChange}
                    placeholder="Number of strips"
                />
            )}

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[rgb(var(--color-text))]">
                    Photos <span className="ml-1 text-red-500">*</span>
                </label>
                {selectedProduct && photos.length > 0 && (
                    <p className="text-xs text-amber-500">
                        Note: Saving will re-upload all images. Existing images will be replaced.
                    </p>
                )}
                <ImageUploader
                    files={photos}
                    onChange={setPhotos}
                    maxFiles={5}
                    error={formErrors.photos}
                />
            </div>
        </div>
    );

    const currentSortLabel = SORT_OPTIONS.find(o => o.value === sort)?.label || 'Sort';
    const currentCategoryLabel = categoryFilter
        ? categories.find(c => String(c.id) === String(categoryFilter))?.name || 'Category'
        : 'All';

    return (
        <motion.div
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-4 sm:gap-6"
        >
            <motion.div variants={itemVariants}>
                <PageHeader
                    title="Products"
                    description={`${totalCount} total products`}
                    action={
                        <div className="flex items-center gap-2">
                            <button
                                onClick={fetchProducts}
                                className="glass-button-secondary flex items-center gap-2 !px-3 min-h-[44px] text-sm"
                                title="Refresh"
                            >
                                <RefreshCw size={16} />
                                <span className="hidden sm:inline">Refresh</span>
                            </button>
                            <button
                                onClick={openCreateModal}
                                className="glass-button-primary flex items-center gap-2 !px-3 sm:!px-4 min-h-[44px] text-sm"
                            >
                                <Plus size={16} />
                                <span className="hidden sm:inline">Add Product</span>
                            </button>
                        </div>
                    }
                />
            </motion.div>

            <motion.div
                variants={itemVariants}
                className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search products..."
                    className="w-full sm:max-w-xs"
                />

                <div className="flex items-center gap-2">
                    <div className="relative" ref={sortRef}>
                        <button
                            onClick={() => setSortOpen(!sortOpen)}
                            className="glass-button-secondary flex items-center gap-2 !px-3 min-h-[44px] text-sm"
                        >
                            <Filter size={14} />
                            <span className="hidden sm:inline">{currentSortLabel}</span>
                            <span className="sm:hidden">Sort</span>
                            <ChevronDown size={14} className={`transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {sortOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.15, ease: 'easeOut' }}
                                className="absolute left-0 z-20 mt-1 w-56 overflow-hidden rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] shadow-xl"
                            >
                                {SORT_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => { setSort(opt.value); setSortOpen(false); }}
                                        className={`flex w-full items-center px-4 py-3 text-left text-sm transition-all duration-150 min-h-[44px] ${
                                            sort === opt.value
                                                ? 'bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]'
                                                : 'text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-subtle))]'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </div>

                    <div className="relative" ref={categoryRef}>
                        <button
                            onClick={() => setCategoryOpen(!categoryOpen)}
                            className="glass-button-secondary flex items-center gap-2 !px-3 min-h-[44px] text-sm"
                        >
                            <Package size={14} />
                            <span className="hidden sm:inline">{currentCategoryLabel}</span>
                            <span className="sm:hidden">Cat</span>
                            <ChevronDown size={14} className={`transition-transform duration-200 ${categoryOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {categoryOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.15, ease: 'easeOut' }}
                                className="absolute left-0 z-20 mt-1 w-56 overflow-hidden rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] shadow-xl max-h-60 overflow-y-auto"
                            >
                                <button
                                    onClick={() => { setCategoryFilter(''); setCategoryOpen(false); }}
                                    className={`flex w-full items-center px-4 py-3 text-left text-sm transition-all duration-150 min-h-[44px] ${
                                        !categoryFilter
                                            ? 'bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]'
                                            : 'text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-subtle))]'
                                    }`}
                                >
                                    All Categories
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => { setCategoryFilter(String(cat.id)); setCategoryOpen(false); }}
                                        className={`flex w-full items-center px-4 py-3 text-left text-sm transition-all duration-150 min-h-[44px] ${
                                            String(categoryFilter) === String(cat.id)
                                                ? 'bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]'
                                                : 'text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-subtle))]'
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>

            <motion.div variants={itemVariants}>
                <DataTable
                    columns={columns}
                    data={products}
                    isLoading={isLoading}
                    error={error}
                    onRetry={fetchProducts}
                    emptyTitle="No products found"
                    emptyDescription="Start by adding your first product."
                    pageIndex={pageIndex}
                    totalPages={totalPages}
                    onPageChange={setPageIndex}
                />
            </motion.div>

            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Add Product"
                maxWidth="max-w-full sm:max-w-2xl"
            >
                {renderForm()}
                <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-3">
                    <button
                        onClick={() => setShowCreateModal(false)}
                        disabled={isSubmitting}
                        className="glass-button-secondary !px-4 !py-2.5 text-sm min-h-[44px] w-full sm:w-auto"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={isSubmitting}
                        className="glass-button-primary !px-4 !py-2.5 text-sm min-h-[44px] w-full sm:w-auto flex items-center justify-center"
                    >
                        {isSubmitting ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        ) : (
                            'Create Product'
                        )}
                    </button>
                </div>
            </Modal>

            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Product"
                maxWidth="max-w-full sm:max-w-2xl"
            >
                {renderForm()}
                <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-3">
                    <button
                        onClick={() => setShowEditModal(false)}
                        disabled={isSubmitting}
                        className="glass-button-secondary !px-4 !py-2.5 text-sm min-h-[44px] w-full sm:w-auto"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdate}
                        disabled={isSubmitting}
                        className="glass-button-primary !px-4 !py-2.5 text-sm min-h-[44px] w-full sm:w-auto flex items-center justify-center"
                    >
                        {isSubmitting ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </Modal>

            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                title="Delete Product"
                message={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                variant="danger"
                isLoading={isSubmitting}
            />
        </motion.div>
    );
}
