import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Shield, Plus, Pencil, ToggleLeft, ToggleRight, RefreshCw, Info } from 'lucide-react';
import { roleService } from '../../services/roleService';
import { roleSchema } from '../../validation/admin';
import { parseZodError } from '../../utils/validation';
import notify from '../../utils/notifications';
import { pageVariants, itemVariants } from '../../constants/animations';
import useAdminCrud from '../../hooks/useAdminCrud';
import PageHeader from '../../components/admin/PageHeader';
import SearchInput from '../../components/admin/SearchInput';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import StatusBadge from '../../components/admin/StatusBadge';
import FormField from '../../components/admin/FormField';
import ModalFooter from '../../components/admin/ModalFooter';

const INITIAL_FORM = { name: '' };

const SYSTEM_ROLES = [
    { name: 'Admin', isSystem: true, isDeleted: false },
    { name: 'Customer', isSystem: true, isDeleted: false },
];

export default function Roles() {
    const [showDeleted, setShowDeleted] = useState(false);

    const fetchFn = useCallback(() => roleService.getAll(showDeleted), [showDeleted]);
    const { data: roles, filtered: filteredRoles, isLoading, error, search, setSearch, refetch } = useAdminCrud(fetchFn, {
        errorMessage: 'Failed to load roles',
        filterFn: (role, q) => role.name.toLowerCase().includes(q),
    });

    const allRoles = [
        ...SYSTEM_ROLES.filter((sr) => {
            if (!search) return true;
            return sr.name.toLowerCase().includes(search.toLowerCase());
        }),
        ...(filteredRoles || []).filter((r) => !SYSTEM_ROLES.some((sr) => sr.name === r.name)),
    ];

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isToggleOpen, setIsToggleOpen] = useState(false);

    const [form, setForm] = useState(INITIAL_FORM);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [editingRole, setEditingRole] = useState(null);
    const [togglingRole, setTogglingRole] = useState(null);

    function handleFormChange(e) {
        const { value } = e.target;
        setForm({ name: value });
        if (formErrors.name) {
            setFormErrors({ name: '' });
        }
    }

    function openCreate() {
        setForm(INITIAL_FORM);
        setFormErrors({});
        setIsCreateOpen(true);
    }

    function openEdit(role) {
        setEditingRole(role);
        setForm({ name: role.name });
        setFormErrors({});
        setIsEditOpen(true);
    }

    function openToggle(role) {
        setTogglingRole(role);
        setIsToggleOpen(true);
    }

    function validateForm() {
        const result = roleSchema.safeParse(form);
        if (!result.success) {
            setFormErrors(parseZodError(result.error));
            return false;
        }
        const nameLower = form.name.trim().toLowerCase();
        if (SYSTEM_ROLES.some((sr) => sr.name.toLowerCase() === nameLower)) {
            setFormErrors({ name: `"${form.name.trim()}" is a system role and cannot be created.` });
            return false;
        }
        setFormErrors({});
        return true;
    }

    async function handleCreate(e) {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        try {
            await roleService.create({ name: form.name.trim() });
            notify.success('Role created successfully');
            setIsCreateOpen(false);
            refetch();
        } catch (err) {
            notify.errorFromApi(err, 'Failed to create role');
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleEdit(e) {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        try {
            await roleService.update(editingRole.id, { name: form.name.trim() });
            notify.success('Role updated successfully');
            setIsEditOpen(false);
            setEditingRole(null);
            refetch();
        } catch (err) {
            notify.errorFromApi(err, 'Failed to update role');
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleToggleStatus() {
        if (!togglingRole) return;
        setIsSubmitting(true);
        try {
            await roleService.toggleStatus(togglingRole.id);
            notify.success(togglingRole.isDeleted ? 'Role restored successfully' : 'Role deactivated successfully');
            setIsToggleOpen(false);
            setTogglingRole(null);
            refetch();
        } catch (err) {
            notify.errorFromApi(err, 'Failed to toggle role status');
        } finally {
            setIsSubmitting(false);
        }
    }

    const columns = [
        {
            key: 'name',
            header: 'Name',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[rgb(var(--color-primary))]/10 ring-1 ring-[rgb(var(--color-primary))]/10">
                        <Shield className="h-4 w-4 text-[rgb(var(--color-primary))]" />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium">{row.name}</span>
                        {row.isSystem && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[rgb(var(--color-bg-subtle))] px-2 py-0.5 text-[10px] font-semibold text-[rgb(var(--color-text-muted))] border border-[rgb(var(--color-border))]">
                                <Info size={10} />
                                System
                            </span>
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            render: (row) => (
                <StatusBadge
                    active={!row.isDeleted}
                    activeText="Active"
                    inactiveText={row.isSystem ? 'System' : 'Deleted'}
                />
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            width: 'auto',
            render: (row) => {
                if (row.isSystem) {
                    return (
                        <span className="text-xs text-[rgb(var(--color-text-muted))] italic">
                            Managed by system
                        </span>
                    );
                }
                return (
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => openEdit(row)}
                            className="rounded-lg p-2 text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-primary))]/10 hover:text-[rgb(var(--color-primary))] transition-all duration-200 min-w-[40px] min-h-[40px] flex items-center justify-center"
                            title="Edit"
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            onClick={() => openToggle(row)}
                            className={`rounded-lg p-2 text-[rgb(var(--color-text-muted))] transition-all duration-200 min-w-[40px] min-h-[40px] flex items-center justify-center ${
                                row.isDeleted
                                    ? 'hover:bg-emerald-500/10 hover:text-emerald-500'
                                    : 'hover:bg-amber-500/10 hover:text-amber-500'
                            }`}
                            title={row.isDeleted ? 'Restore' : 'Deactivate'}
                        >
                            {row.isDeleted ? <ToggleLeft size={16} /> : <ToggleRight size={16} />}
                        </button>
                    </div>
                );
            },
        },
    ];

    const headerAction = (
        <div className="flex items-center gap-2">
            <button
                onClick={refetch}
                className="glass-button-secondary flex items-center gap-2 !px-3 min-h-[44px] text-sm"
            >
                <RefreshCw size={16} />
                <span className="hidden sm:inline">Refresh</span>
            </button>
            <button onClick={openCreate} className="glass-button-primary flex items-center gap-2 !px-3 sm:!px-4 min-h-[44px] text-sm">
                <Plus size={16} />
                <span className="hidden sm:inline">Add Role</span>
            </button>
        </div>
    );

    return (
        <motion.div
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4 sm:space-y-6"
        >
            <motion.div variants={itemVariants}>
                <PageHeader
                    title="Roles Management"
                    description="Manage user roles and their permissions"
                    action={headerAction}
                />
            </motion.div>

            {/* Info about system roles */}
            <motion.div
                variants={itemVariants}
                className="flex items-start gap-3 rounded-xl border border-[rgb(var(--color-primary))]/20 bg-[rgb(var(--color-primary))]/5 p-4"
            >
                <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-[rgb(var(--color-primary))]" />
                <div className="text-sm text-[rgb(var(--color-text-muted))]">
                    <p>
                        <strong className="text-[rgb(var(--color-text))]">System roles</strong> (Admin, Customer) are managed automatically and cannot be edited or deleted. They are always active in the system.
                    </p>
                </div>
            </motion.div>

            <motion.div
                variants={itemVariants}
                className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search roles..."
                    className="sm:max-w-xs"
                />
                <button
                    onClick={() => setShowDeleted(!showDeleted)}
                    className={`flex items-center gap-2 rounded-xl px-4 text-sm font-medium transition-all duration-300 min-h-[44px] ${
                        showDeleted
                            ? 'bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] shadow-sm ring-1 ring-[rgb(var(--color-primary))]/20'
                            : 'bg-[rgb(var(--color-bg-subtle))] text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] hover:shadow-sm'
                    }`}
                >
                    {showDeleted ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    <span className="hidden sm:inline">{showDeleted ? 'Showing Deleted' : 'Show Deleted'}</span>
                    <span className="sm:hidden">{showDeleted ? 'Deleted' : 'Deleted'}</span>
                </button>
            </motion.div>

            <motion.div variants={itemVariants}>
                <DataTable
                    columns={columns}
                    data={allRoles}
                    isLoading={isLoading}
                    error={error}
                    onRetry={refetch}
                    emptyTitle="No roles found"
                    emptyDescription={
                        search
                            ? 'No roles match your search criteria.'
                            : 'Get started by creating your first role.'
                    }
                />
            </motion.div>

            {/* Create Modal */}
            <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create Role" maxWidth="max-w-full sm:max-w-lg">
                <form onSubmit={handleCreate} className="space-y-4">
                    <FormField
                        label="Role Name"
                        name="name"
                        value={form.name}
                        onChange={handleFormChange}
                        error={formErrors.name}
                        required
                        placeholder="e.g. Administrator"
                        disabled={isSubmitting}
                    />
                    <ModalFooter
                        onCancel={() => setIsCreateOpen(false)}
                        onSubmit={handleCreate}
                        isSubmitting={isSubmitting}
                        submitText="Create"
                    />
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Role" maxWidth="max-w-full sm:max-w-lg">
                <form onSubmit={handleEdit} className="space-y-4">
                    <FormField
                        label="Role Name"
                        name="name"
                        value={form.name}
                        onChange={handleFormChange}
                        error={formErrors.name}
                        required
                        placeholder="e.g. Administrator"
                        disabled={isSubmitting}
                    />
                    <ModalFooter
                        onCancel={() => setIsEditOpen(false)}
                        onSubmit={handleEdit}
                        isSubmitting={isSubmitting}
                        submitText="Save Changes"
                    />
                </form>
            </Modal>

            {/* Toggle Status Confirmation */}
            <ConfirmDialog
                isOpen={isToggleOpen}
                onClose={() => {
                    setIsToggleOpen(false);
                    setTogglingRole(null);
                }}
                onConfirm={handleToggleStatus}
                title={togglingRole?.isDeleted ? 'Restore Role' : 'Deactivate Role'}
                message={
                    togglingRole?.isDeleted
                        ? `Are you sure you want to restore "${togglingRole?.name}"? It will become active again.`
                        : `Are you sure you want to deactivate "${togglingRole?.name}"? It will be marked as deleted.`
                }
                confirmText={togglingRole?.isDeleted ? 'Restore' : 'Deactivate'}
                variant={togglingRole?.isDeleted ? 'primary' : 'danger'}
                isLoading={isSubmitting}
            />
        </motion.div>
    );
}
