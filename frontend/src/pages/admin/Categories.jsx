import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FolderTree, Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { categoryService } from '../../services/categoryService';
import { categorySchema } from '../../validation/admin';
import { parseZodError } from '../../utils/validation';
import notify from '../../utils/notifications';
import { pageVariants, itemVariants } from '../../constants/animations';
import useAdminCrud from '../../hooks/useAdminCrud';
import PageHeader from '../../components/admin/PageHeader';
import SearchInput from '../../components/admin/SearchInput';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import FormField from '../../components/admin/FormField';
import ModalFooter from '../../components/admin/ModalFooter';

const emptyForm = { name: '', description: '' };

export default function Categories() {
    const fetchFn = useCallback(() => categoryService.getAll(), []);
    const { data: categories, setData: setCategories, filtered, isLoading, error, search, setSearch, refetch } = useAdminCrud(fetchFn, {
        errorMessage: 'Failed to load categories',
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [deletingCategory, setDeletingCategory] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    function openCreate() {
        setEditingCategory(null);
        setForm(emptyForm);
        setFormErrors({});
        setIsModalOpen(true);
    }

    function openEdit(cat) {
        setEditingCategory(cat);
        setForm({ name: cat.name, description: cat.description });
        setFormErrors({});
        setIsModalOpen(true);
    }

    function openDelete(cat) {
        setDeletingCategory(cat);
        setIsDeleteOpen(true);
    }

    function validateForm() {
        const result = categorySchema.safeParse(form);
        if (!result.success) {
            setFormErrors(parseZodError(result.error));
            return false;
        }
        setFormErrors({});
        return true;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        try {
            if (editingCategory) {
                await categoryService.update(editingCategory.id, {
                    name: form.name.trim(),
                    description: form.description.trim(),
                });
                notify.success('Category updated successfully');
            } else {
                await categoryService.create({
                    name: form.name.trim(),
                    description: form.description.trim(),
                });
                notify.success('Category created successfully');
            }
            setIsModalOpen(false);
            await refetch();
        } catch (err) {
            notify.errorFromApi(err, 'Failed to save category');
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete() {
        if (!deletingCategory) return;
        setIsSubmitting(true);
        try {
            await categoryService.remove(deletingCategory.id);
            notify.success('Category deleted successfully');
            setIsDeleteOpen(false);
            setDeletingCategory(null);
            await refetch();
        } catch (err) {
            notify.errorFromApi(err, 'Failed to delete category');
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }

    const columns = [
        {
            key: 'name',
            header: 'Name',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[rgb(var(--color-primary))]/10 ring-1 ring-[rgb(var(--color-primary))]/10">
                        <FolderTree size={16} className="text-[rgb(var(--color-primary))]" />
                    </div>
                    <span className="font-medium">{row.name}</span>
                </div>
            ),
        },
        {
            key: 'description',
            header: 'Description',
            render: (row) => (
                <span className="text-[rgb(var(--color-text-muted))] text-sm line-clamp-2">
                    {row.description}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            width: 'auto',
            render: (row) => (
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => openEdit(row)}
                        className="rounded-lg p-2 text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-primary))]/10 hover:text-[rgb(var(--color-primary))] transition-all duration-200 min-w-[40px] min-h-[40px] flex items-center justify-center"
                        title="Edit"
                    >
                        <Pencil size={14} />
                    </button>
                    <button
                        onClick={() => openDelete(row)}
                        className="rounded-lg p-2 text-[rgb(var(--color-text-muted))] hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 min-w-[40px] min-h-[40px] flex items-center justify-center"
                        title="Delete"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <motion.div
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4 sm:space-y-6"
        >
            <motion.div variants={itemVariants}>
                <PageHeader
                    title="Categories"
                    description="Manage your product categories"
                    action={
                        <div className="flex items-center gap-2">
                            <button onClick={refetch} className="glass-button-secondary !p-2.5 !rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center" title="Refresh">
                                <RefreshCw size={16} />
                            </button>
                            <button onClick={openCreate} className="glass-button-primary !px-3 sm:!px-4 min-h-[44px] text-sm flex items-center gap-2">
                                <Plus size={16} />
                                <span className="hidden sm:inline">Add Category</span>
                            </button>
                        </div>
                    }
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search categories..."
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <DataTable
                    columns={columns}
                    data={filtered}
                    isLoading={isLoading}
                    error={error}
                    onRetry={refetch}
                    emptyTitle="No categories found"
                    emptyDescription={
                        search
                            ? 'No categories match your search.'
                            : 'Create your first category to get started.'
                    }
                />
            </motion.div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCategory ? 'Edit Category' : 'Create Category'}
                maxWidth="max-w-full sm:max-w-lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormField
                        label="Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        error={formErrors.name}
                        required
                        placeholder="e.g. Pain Relief"
                    />
                    <FormField
                        label="Description"
                        name="description"
                        type="textarea"
                        value={form.description}
                        onChange={handleChange}
                        error={formErrors.description}
                        required
                        placeholder="Brief description of this category"
                    />
                    <ModalFooter
                        onCancel={() => setIsModalOpen(false)}
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                        submitText={editingCategory ? 'Update' : 'Create'}
                    />
                </form>
            </Modal>

            <ConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setDeletingCategory(null); }}
                onConfirm={handleDelete}
                title="Delete Category"
                message={`Are you sure you want to delete "${deletingCategory?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                variant="danger"
                isLoading={isSubmitting}
            />
        </motion.div>
    );
}
