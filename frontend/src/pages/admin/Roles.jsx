import { useState, useEffect, useCallback, useMemo } from 'react';
import { Shield, Plus, Pencil, ToggleLeft, ToggleRight, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { roleService } from '../../services/roleService';
import PageHeader from '../../components/admin/PageHeader';
import SearchInput from '../../components/admin/SearchInput';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import StatusBadge from '../../components/admin/StatusBadge';
import FormField from '../../components/admin/FormField';

const INITIAL_FORM = { name: '' };

export default function Roles() {
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [showDeleted, setShowDeleted] = useState(false);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isToggleOpen, setIsToggleOpen] = useState(false);

    const [form, setForm] = useState(INITIAL_FORM);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [editingRole, setEditingRole] = useState(null);
    const [togglingRole, setTogglingRole] = useState(null);

    const fetchRoles = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await roleService.getAll(showDeleted);
            setRoles(data);
        } catch (err) {
            setError(err.message || 'Failed to load roles');
        } finally {
            setIsLoading(false);
        }
    }, [showDeleted]);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const filteredRoles = useMemo(() => {
        if (!search.trim()) return roles;
        const q = search.toLowerCase();
        return roles.filter((r) => r.name.toLowerCase().includes(q));
    }, [roles, search]);

    function validateName(value) {
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 3) return 'Name must be at least 3 characters';
        if (value.trim().length > 50) return 'Name must be at most 50 characters';
        return '';
    }

    function handleFormChange(e) {
        const { value } = e.target;
        setForm({ name: value });
        if (formErrors.name) {
            setFormErrors({ name: validateName(value) });
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

    async function handleCreate() {
        const error = validateName(form.name);
        if (error) {
            setFormErrors({ name: error });
            return;
        }
        setIsSubmitting(true);
        try {
            await roleService.create({ name: form.name.trim() });
            toast.success('Role created successfully');
            setIsCreateOpen(false);
            fetchRoles();
        } catch (err) {
            toast.error(err.message || 'Failed to create role');
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleEdit() {
        const error = validateName(form.name);
        if (error) {
            setFormErrors({ name: error });
            return;
        }
        setIsSubmitting(true);
        try {
            await roleService.update(editingRole.id, { name: form.name.trim() });
            toast.success('Role updated successfully');
            setIsEditOpen(false);
            setEditingRole(null);
            fetchRoles();
        } catch (err) {
            toast.error(err.message || 'Failed to update role');
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleToggleStatus() {
        if (!togglingRole) return;
        setIsSubmitting(true);
        try {
            await roleService.toggleStatus(togglingRole.id);
            toast.success(togglingRole.isDeleted ? 'Role restored successfully' : 'Role deactivated successfully');
            setIsToggleOpen(false);
            setTogglingRole(null);
            fetchRoles();
        } catch (err) {
            toast.error(err.message || 'Failed to toggle role status');
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleCreateKeyDown(e) {
        if (e.key === 'Enter' && !isSubmitting) handleCreate();
    }

    function handleEditKeyDown(e) {
        if (e.key === 'Enter' && !isSubmitting) handleEdit();
    }

    const columns = [
        {
            key: 'name',
            header: 'Name',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgb(var(--color-primary))]/10">
                        <Shield className="h-4 w-4 text-[rgb(var(--color-primary))]" />
                    </div>
                    <span className="font-medium">{row.name}</span>
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
                    inactiveText="Deleted"
                />
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            width: '120px',
            render: (row) => (
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => openEdit(row)}
                        className="rounded-lg p-2 text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-bg-subtle))] hover:text-[rgb(var(--color-primary))] transition-colors"
                        title="Edit"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={() => openToggle(row)}
                        className="rounded-lg p-2 text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-bg-subtle))] hover:text-[rgb(var(--color-primary))] transition-colors"
                        title={row.isDeleted ? 'Restore' : 'Deactivate'}
                    >
                        {row.isDeleted ? <ToggleLeft size={16} /> : <ToggleRight size={16} />}
                    </button>
                </div>
            ),
        },
    ];

    const headerAction = (
        <div className="flex items-center gap-3">
            <button
                onClick={fetchRoles}
                className="glass-button-secondary flex items-center gap-2 !px-3 !py-2 text-sm"
            >
                <RefreshCw size={16} />
                Refresh
            </button>
            <button onClick={openCreate} className="glass-button-primary flex items-center gap-2 !px-4 !py-2 text-sm">
                <Plus size={16} />
                Add Role
            </button>
        </div>
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Roles Management"
                description="Manage user roles and their permissions"
                action={headerAction}
            />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search roles..."
                    className="sm:max-w-xs"
                />
                <button
                    onClick={() => setShowDeleted(!showDeleted)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                        showDeleted
                            ? 'bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]'
                            : 'bg-[rgb(var(--color-bg-subtle))] text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))]'
                    }`}
                >
                    {showDeleted ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    {showDeleted ? 'Showing Deleted' : 'Show Deleted'}
                </button>
            </div>

            <DataTable
                columns={columns}
                data={filteredRoles}
                isLoading={isLoading}
                error={error}
                onRetry={fetchRoles}
                emptyTitle="No roles found"
                emptyDescription={
                    search
                        ? 'No roles match your search criteria.'
                        : 'Get started by creating your first role.'
                }
            />

            {/* Create Modal */}
            <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create Role">
                <div className="space-y-4" onKeyDown={handleCreateKeyDown}>
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
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={() => setIsCreateOpen(false)}
                            disabled={isSubmitting}
                            className="glass-button-secondary !px-4 !py-2 text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={isSubmitting}
                            className="glass-button-primary !px-4 !py-2 text-sm"
                        >
                            {isSubmitting ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            ) : (
                                'Create'
                            )}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Role">
                <div className="space-y-4" onKeyDown={handleEditKeyDown}>
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
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={() => setIsEditOpen(false)}
                            disabled={isSubmitting}
                            className="glass-button-secondary !px-4 !py-2 text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleEdit}
                            disabled={isSubmitting}
                            className="glass-button-primary !px-4 !py-2 text-sm"
                        >
                            {isSubmitting ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </div>
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
        </div>
    );
}
