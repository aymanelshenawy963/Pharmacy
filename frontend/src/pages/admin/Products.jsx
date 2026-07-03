import { motion } from 'framer-motion';
import { Package, Plus, Pencil, Trash2, RefreshCw, Filter, ChevronDown, Star } from 'lucide-react';
import { formatPrice } from '../../utils/currency';
import { getPhotoUrl } from '../../utils/photoHelpers';
import { pageVariants, itemVariants, dropdownVariants } from '../../constants/animations';
import useProductCrud from '../../hooks/useProductCrud';
import PageHeader from '../../components/admin/PageHeader';
import SearchInput from '../../components/admin/SearchInput';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import StockIndicator from '../../components/admin/StockIndicator';
import ModalFooter from '../../components/admin/ModalFooter';
import ProductForm from '../../components/admin/ProductForm';

const SORT_OPTIONS = [
    { value: 'priceasc', label: 'Price: Low to High' },
    { value: 'pricedesc', label: 'Price: High to Low' },
    { value: 'nameasc', label: 'Name: A to Z' },
    { value: 'namedesc', label: 'Name: Z to A' },
];

export default function Products() {
    const {
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
    } = useProductCrud();

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
                            aria-label="Sort products"
                            aria-expanded={sortOpen}
                        >
                            <Filter size={14} />
                            <span className="hidden sm:inline">{currentSortLabel}</span>
                            <span className="sm:hidden">Sort</span>
                            <ChevronDown size={14} className={`transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {sortOpen && (
                            <motion.div
                                initial={dropdownVariants.initial}
                                animate={dropdownVariants.animate}
                                transition={dropdownVariants.transition}
                                className="absolute left-0 z-20 mt-1 w-56 overflow-hidden rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] shadow-xl"
                                role="menu"
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
                                        role="menuitem"
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
                            aria-label="Filter by category"
                            aria-expanded={categoryOpen}
                        >
                            <Package size={14} />
                            <span className="hidden sm:inline">{currentCategoryLabel}</span>
                            <span className="sm:hidden">Cat</span>
                            <ChevronDown size={14} className={`transition-transform duration-200 ${categoryOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {categoryOpen && (
                            <motion.div
                                initial={dropdownVariants.initial}
                                animate={dropdownVariants.animate}
                                transition={dropdownVariants.transition}
                                className="absolute left-0 z-20 mt-1 w-56 overflow-hidden rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] shadow-xl max-h-60 overflow-y-auto"
                                role="menu"
                            >
                                <button
                                    onClick={() => { setCategoryFilter(''); setCategoryOpen(false); }}
                                    className={`flex w-full items-center px-4 py-3 text-left text-sm transition-all duration-150 min-h-[44px] ${
                                        !categoryFilter
                                            ? 'bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]'
                                            : 'text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-subtle))]'
                                    }`}
                                    role="menuitem"
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
                                        role="menuitem"
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
                <ProductForm
                    form={form}
                    formErrors={formErrors}
                    photos={photos}
                    setPhotos={setPhotos}
                    categories={categories}
                    selectedProduct={selectedProduct}
                    onFormChange={handleFormChange}
                />
                <ModalFooter
                    onCancel={() => setShowCreateModal(false)}
                    onSubmit={handleCreate}
                    isSubmitting={isSubmitting}
                    submitText="Create Product"
                />
            </Modal>

            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Product"
                maxWidth="max-w-full sm:max-w-2xl"
            >
                <ProductForm
                    form={form}
                    formErrors={formErrors}
                    photos={photos}
                    setPhotos={setPhotos}
                    categories={categories}
                    selectedProduct={selectedProduct}
                    onFormChange={handleFormChange}
                />
                <ModalFooter
                    onCancel={() => setShowEditModal(false)}
                    onSubmit={handleUpdate}
                    isSubmitting={isSubmitting}
                    submitText="Save Changes"
                />
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
