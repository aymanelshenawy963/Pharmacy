import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
    Pencil,
    ToggleLeft,
    ToggleRight,
    Unlock,
    RefreshCw,
    UserPlus,
    Shield,
    Eye,
} from 'lucide-react';
import { userService } from '../../services/userService';
import { roleService } from '../../services/roleService';
import { validators } from '../../utils/validators';
import { parseApiError } from '../../utils/apiErrorHandler';
import PageHeader from '../../components/admin/PageHeader';
import SearchInput from '../../components/admin/SearchInput';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import StatusBadge from '../../components/admin/StatusBadge';
import FormField from '../../components/admin/FormField';
import LoadingSpinner from '../../components/admin/LoadingSpinner';

const INITIAL_CREATE_FORM = {
    email: '',
    userName: '',
    firstName: '',
    lastName: '',
    password: '',
    roles: [],
};

const INITIAL_EDIT_FORM = {
    email: '',
    userName: '',
    firstName: '',
    lastName: '',
    roles: [],
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

function validateCreateForm(form) {
    const errors = {};
    const emailErr = validators.email(form.email);
    if (emailErr) errors.email = emailErr;
    const userNameErr = validators.userName(form.userName);
    if (userNameErr) errors.userName = userNameErr;
    const firstNameErr = validators.firstName(form.firstName);
    if (firstNameErr) errors.firstName = firstNameErr;
    const lastNameErr = validators.lastName(form.lastName);
    if (lastNameErr) errors.lastName = lastNameErr;
    const passwordErr = validators.password(form.password);
    if (passwordErr) errors.password = passwordErr;
    if (!form.roles || form.roles.length === 0) {
        errors.roles = 'At least one role is required';
    }
    return errors;
}

function validateEditForm(form) {
    const errors = {};
    const emailErr = validators.email(form.email);
    if (emailErr) errors.email = emailErr;
    const userNameErr = validators.userName(form.userName);
    if (userNameErr) errors.userName = userNameErr;
    const firstNameErr = validators.firstName(form.firstName);
    if (firstNameErr) errors.firstName = firstNameErr;
    const lastNameErr = validators.lastName(form.lastName);
    if (lastNameErr) errors.lastName = lastNameErr;
    if (!form.roles || form.roles.length === 0) {
        errors.roles = 'At least one role is required';
    }
    return errors;
}

export default function Users() {
    const [users, setUsers] = useState([]);
    const [availableRoles, setAvailableRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createForm, setCreateForm] = useState(INITIAL_CREATE_FORM);
    const [createErrors, setCreateErrors] = useState({});
    const [isCreating, setIsCreating] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editUserId, setEditUserId] = useState(null);
    const [editForm, setEditForm] = useState(INITIAL_EDIT_FORM);
    const [editErrors, setEditErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    const [showViewModal, setShowViewModal] = useState(false);
    const [viewUser, setViewUser] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);

    const [showToggleDialog, setShowToggleDialog] = useState(false);
    const [toggleTarget, setToggleTarget] = useState(null);
    const [isToggling, setIsToggling] = useState(false);

    const [showUnlockDialog, setShowUnlockDialog] = useState(false);
    const [unlockTarget, setUnlockTarget] = useState(null);
    const [isUnlocking, setIsUnlocking] = useState(false);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await userService.getAll();
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(parseApiError(err).join(' '));
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchRoles = useCallback(async () => {
        try {
            const data = await roleService.getAll();
            setAvailableRoles(Array.isArray(data) ? data : []);
        } catch {
            // Roles are optional
        }
    }, []);

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, [fetchUsers, fetchRoles]);

    const filteredUsers = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return users;
        return users.filter(
            (u) =>
                (u.firstName || '').toLowerCase().includes(q) ||
                (u.lastName || '').toLowerCase().includes(q) ||
                (u.userName || '').toLowerCase().includes(q) ||
                (u.email || '').toLowerCase().includes(q)
        );
    }, [users, search]);

    const getRoleName = (role) => {
        if (typeof role === 'string') return role;
        return role?.name || role?.roleName || '';
    };

    const openCreateModal = () => {
        setCreateForm(INITIAL_CREATE_FORM);
        setCreateErrors({});
        setShowCreateModal(true);
    };

    const handleCreateChange = (e) => {
        const { name, value } = e.target;
        setCreateForm((prev) => ({ ...prev, [name]: value }));
        if (createErrors[name]) {
            setCreateErrors((prev) => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        }
    };

    const handleCreateRoleToggle = (roleName) => {
        setCreateForm((prev) => {
            const roles = prev.roles.includes(roleName)
                ? prev.roles.filter((r) => r !== roleName)
                : [...prev.roles, roleName];
            return { ...prev, roles };
        });
        if (createErrors.roles) {
            setCreateErrors((prev) => {
                const next = { ...prev };
                delete next.roles;
                return next;
            });
        }
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        const errors = validateCreateForm(createForm);
        setCreateErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setIsCreating(true);
        try {
            await userService.create(createForm);
            toast.success('User created successfully');
            setShowCreateModal(false);
            fetchUsers();
        } catch (err) {
            const msgs = parseApiError(err);
            toast.error(msgs.join(' '));
        } finally {
            setIsCreating(false);
        }
    };

    const openEditModal = (user) => {
        setEditUserId(user.id);
        const userRoleNames = (user.roles || []).map(getRoleName);
        const availableRoleNames = availableRoles.map(getRoleName);
        setEditForm({
            email: user.email || '',
            userName: user.userName || '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            roles: userRoleNames.filter((r) => availableRoleNames.includes(r)),
        });
        setEditErrors({});
        setShowEditModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
        if (editErrors[name]) {
            setEditErrors((prev) => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        }
    };

    const handleEditRoleToggle = (roleName) => {
        setEditForm((prev) => {
            const roles = prev.roles.includes(roleName)
                ? prev.roles.filter((r) => r !== roleName)
                : [...prev.roles, roleName];
            return { ...prev, roles };
        });
        if (editErrors.roles) {
            setEditErrors((prev) => {
                const next = { ...prev };
                delete next.roles;
                return next;
            });
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const errors = validateEditForm(editForm);
        setEditErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setIsEditing(true);
        try {
            await userService.update(editUserId, editForm);
            toast.success('User updated successfully');
            setShowEditModal(false);
            fetchUsers();
        } catch (err) {
            const msgs = parseApiError(err);
            toast.error(msgs.join(' '));
        } finally {
            setIsEditing(false);
        }
    };

    const openViewModal = async (user) => {
        setShowViewModal(true);
        setViewLoading(true);
        setViewUser(null);
        try {
            const data = await userService.getById(user.id);
            setViewUser(data);
        } catch {
            setViewUser(user);
        } finally {
            setViewLoading(false);
        }
    };

    const openToggleDialog = (user) => {
        setToggleTarget(user);
        setShowToggleDialog(true);
    };

    const handleToggleConfirm = async () => {
        setIsToggling(true);
        try {
            await userService.toggleStatus(toggleTarget.id);
            toast.success(
                toggleTarget.isDisabled
                    ? 'User enabled successfully'
                    : 'User disabled successfully'
            );
            setShowToggleDialog(false);
            fetchUsers();
        } catch (err) {
            const msgs = parseApiError(err);
            toast.error(msgs.join(' '));
        } finally {
            setIsToggling(false);
        }
    };

    const openUnlockDialog = (user) => {
        setUnlockTarget(user);
        setShowUnlockDialog(true);
    };

    const handleUnlockConfirm = async () => {
        setIsUnlocking(true);
        try {
            await userService.unlock(unlockTarget.id);
            toast.success('User account unlocked successfully');
            setShowUnlockDialog(false);
            fetchUsers();
        } catch (err) {
            const msgs = parseApiError(err);
            toast.error(msgs.join(' '));
        } finally {
            setIsUnlocking(false);
        }
    };

    const columns = [
        {
            key: 'name',
            header: 'Name',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] text-sm font-semibold">
                        {(row.firstName || '?')[0]?.toUpperCase()}
                        {(row.lastName || '')[0]?.toUpperCase()}
                    </div>
                    <span className="font-medium truncate">
                        {row.firstName} {row.lastName}
                    </span>
                </div>
            ),
        },
        {
            key: 'userName',
            header: 'Username',
        },
        {
            key: 'email',
            header: 'Email',
            render: (row) => (
                <span className="text-[rgb(var(--color-text-muted))] text-sm truncate block max-w-full">{row.email}</span>
            ),
        },
        {
            key: 'roles',
            header: 'Roles',
            render: (row) => {
                const roles = row.roles || [];
                if (roles.length === 0) {
                    return <span className="text-[rgb(var(--color-text-muted))] text-xs">No roles</span>;
                }
                return (
                    <div className="flex flex-wrap gap-1">
                        {roles.map((role, i) => (
                            <span
                                key={i}
                                className="inline-flex items-center gap-0.5 rounded-full bg-[rgb(var(--color-primary))]/10 px-1.5 py-0.5 text-[11px] font-medium text-[rgb(var(--color-primary))]"
                            >
                                <Shield size={9} />
                                {getRoleName(role)}
                            </span>
                        ))}
                    </div>
                );
            },
        },
        {
            key: 'status',
            header: 'Status',
            render: (row) => (
                <StatusBadge
                    active={!row.isDisabled}
                    activeText="Active"
                    inactiveText="Disabled"
                />
            ),
        },
        {
            key: 'actions',
            header: '',
            width: 'auto',
            render: (row) => (
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => openViewModal(row)}
                        className="rounded-lg p-2 text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-primary))]/10 hover:text-[rgb(var(--color-primary))] transition-all duration-200 min-w-[40px] min-h-[40px] flex items-center justify-center"
                        title="View details"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={() => openEditModal(row)}
                        className="rounded-lg p-2 text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-primary))]/10 hover:text-[rgb(var(--color-primary))] transition-all duration-200 min-w-[40px] min-h-[40px] flex items-center justify-center"
                        title="Edit user"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={() => openToggleDialog(row)}
                        className="rounded-lg p-2 text-[rgb(var(--color-text-muted))] hover:bg-amber-500/10 hover:text-amber-500 transition-all duration-200 min-w-[40px] min-h-[40px] flex items-center justify-center"
                        title={row.isDisabled ? 'Enable user' : 'Disable user'}
                    >
                        {row.isDisabled ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                    </button>
                    <button
                        onClick={() => openUnlockDialog(row)}
                        className="rounded-lg p-2 text-[rgb(var(--color-text-muted))] hover:bg-emerald-500/10 hover:text-emerald-500 transition-all duration-200 min-w-[40px] min-h-[40px] flex items-center justify-center"
                        title="Unlock account"
                    >
                        <Unlock size={16} />
                    </button>
                </div>
            ),
        },
    ];

    const renderRoleCheckboxes = (selectedRoles, onToggle, error) => (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[rgb(var(--color-text))]">
                Roles <span className="ml-1 text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-3">
                {availableRoles.length === 0 ? (
                    <p className="col-span-1 sm:col-span-2 text-xs text-[rgb(var(--color-text-muted))]">
                        No roles available
                    </p>
                ) : (
                    availableRoles.map((role) => {
                        const roleName = getRoleName(role);
                        const isChecked = selectedRoles.includes(roleName);
                        return (
                            <label
                                key={roleName}
                                className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 min-h-[44px] ${
                                    isChecked
                                        ? 'bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] shadow-sm'
                                        : 'text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-subtle))] hover:shadow-sm'
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => onToggle(roleName)}
                                    className="h-4 w-4 rounded border-[rgb(var(--color-border))] text-[rgb(var(--color-primary))] focus:ring-[rgb(var(--color-primary))]"
                                />
                                {roleName}
                            </label>
                        );
                    })
                )}
            </div>
            {error && <span className="text-xs font-medium text-red-500">{error}</span>}
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
                    title="Users Management"
                    description="Manage user accounts, roles, and access permissions"
                    action={
                        <button
                            onClick={openCreateModal}
                            className="glass-button-primary flex items-center gap-2 !px-3 sm:!px-4 min-h-[44px]"
                        >
                            <UserPlus size={18} />
                            <span className="hidden sm:inline">Add User</span>
                        </button>
                    }
                />
            </motion.div>

            <motion.div
                variants={itemVariants}
                className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search users..."
                    className="w-full sm:max-w-sm"
                />
                <button
                    onClick={fetchUsers}
                    className="glass-button-secondary flex items-center gap-2 !px-3 min-h-[44px] text-sm self-start"
                >
                    <RefreshCw size={16} />
                    <span className="hidden sm:inline">Refresh</span>
                </button>
            </motion.div>

            <motion.div variants={itemVariants}>
                <DataTable
                    columns={columns}
                    data={filteredUsers}
                    isLoading={isLoading}
                    error={error}
                    onRetry={fetchUsers}
                    emptyTitle="No users found"
                    emptyDescription={
                        search
                            ? 'No users match your search. Try a different query.'
                            : 'There are no users in the system yet.'
                    }
                />
            </motion.div>

            {/* Create User Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Create New User"
                maxWidth="max-w-full sm:max-w-lg"
            >
                <form onSubmit={handleCreateSubmit} className="space-y-4">
                    <FormField
                        label="Email"
                        name="email"
                        type="email"
                        value={createForm.email}
                        onChange={handleCreateChange}
                        error={createErrors.email}
                        required
                        placeholder="user@example.com"
                    />
                    <FormField
                        label="Username"
                        name="userName"
                        value={createForm.userName}
                        onChange={handleCreateChange}
                        error={createErrors.userName}
                        required
                        placeholder="johndoe"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            label="First Name"
                            name="firstName"
                            value={createForm.firstName}
                            onChange={handleCreateChange}
                            error={createErrors.firstName}
                            required
                            placeholder="John"
                        />
                        <FormField
                            label="Last Name"
                            name="lastName"
                            value={createForm.lastName}
                            onChange={handleCreateChange}
                            error={createErrors.lastName}
                            required
                            placeholder="Doe"
                        />
                    </div>
                    <FormField
                        label="Password"
                        name="password"
                        type="password"
                        value={createForm.password}
                        onChange={handleCreateChange}
                        error={createErrors.password}
                        required
                        placeholder="Minimum 8 chars, mixed case, number & special char"
                    />
                    {renderRoleCheckboxes(
                        createForm.roles,
                        handleCreateRoleToggle,
                        createErrors.roles
                    )}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-[rgb(var(--color-border))]">
                        <button
                            type="button"
                            onClick={() => setShowCreateModal(false)}
                            className="glass-button-secondary !px-4 !py-2.5 text-sm min-h-[44px] w-full sm:w-auto"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isCreating}
                            className="glass-button-primary !px-4 !py-2.5 text-sm flex items-center justify-center gap-2 min-h-[44px] w-full sm:w-auto"
                        >
                            {isCreating ? (
                                <LoadingSpinner size="sm" />
                            ) : (
                                <UserPlus size={16} />
                            )}
                            {isCreating ? 'Creating...' : 'Create User'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit User Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit User"
                maxWidth="max-w-full sm:max-w-lg"
            >
                <form onSubmit={handleEditSubmit} className="space-y-4">
                    <FormField
                        label="Email"
                        name="email"
                        type="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        error={editErrors.email}
                        required
                        placeholder="user@example.com"
                    />
                    <FormField
                        label="Username"
                        name="userName"
                        value={editForm.userName}
                        onChange={handleEditChange}
                        error={editErrors.userName}
                        required
                        placeholder="johndoe"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            label="First Name"
                            name="firstName"
                            value={editForm.firstName}
                            onChange={handleEditChange}
                            error={editErrors.firstName}
                            required
                            placeholder="John"
                        />
                        <FormField
                            label="Last Name"
                            name="lastName"
                            value={editForm.lastName}
                            onChange={handleEditChange}
                            error={editErrors.lastName}
                            required
                            placeholder="Doe"
                        />
                    </div>
                    {renderRoleCheckboxes(
                        editForm.roles,
                        handleEditRoleToggle,
                        editErrors.roles
                    )}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-[rgb(var(--color-border))]">
                        <button
                            type="button"
                            onClick={() => setShowEditModal(false)}
                            className="glass-button-secondary !px-4 !py-2.5 text-sm min-h-[44px] w-full sm:w-auto"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isEditing}
                            className="glass-button-primary !px-4 !py-2.5 text-sm flex items-center justify-center gap-2 min-h-[44px] w-full sm:w-auto"
                        >
                            {isEditing ? (
                                <LoadingSpinner size="sm" />
                            ) : (
                                <Pencil size={16} />
                            )}
                            {isEditing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* View User Modal */}
            <Modal
                isOpen={showViewModal}
                onClose={() => setShowViewModal(false)}
                title="User Details"
                maxWidth="max-w-full sm:max-w-md"
            >
                {viewLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : viewUser ? (
                    <div className="space-y-4 sm:space-y-5">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="flex h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] text-lg sm:text-xl font-bold ring-2 ring-[rgb(var(--color-primary))]/10">
                                {(viewUser.firstName || '?')[0]?.toUpperCase()}
                                {(viewUser.lastName || '')[0]?.toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-serif text-base sm:text-lg font-bold text-[rgb(var(--color-text))] truncate">
                                    {viewUser.firstName} {viewUser.lastName}
                                </h3>
                                <p className="text-sm text-[rgb(var(--color-text-muted))] truncate">
                                    @{viewUser.userName}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-[rgb(var(--color-border))] divide-y divide-[rgb(var(--color-border))] overflow-hidden">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 gap-1">
                                <span className="text-xs sm:text-sm text-[rgb(var(--color-text-muted))]">Email</span>
                                <span className="text-xs sm:text-sm font-medium text-[rgb(var(--color-text))] break-all">{viewUser.email}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 gap-1">
                                <span className="text-xs sm:text-sm text-[rgb(var(--color-text-muted))]">Username</span>
                                <span className="text-xs sm:text-sm font-medium text-[rgb(var(--color-text))]">{viewUser.userName}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 gap-1">
                                <span className="text-xs sm:text-sm text-[rgb(var(--color-text-muted))]">Status</span>
                                <StatusBadge
                                    active={!viewUser.isDisabled}
                                    activeText="Active"
                                    inactiveText="Disabled"
                                />
                            </div>
                            <div className="px-4 py-3">
                                <span className="text-xs sm:text-sm text-[rgb(var(--color-text-muted))]">Roles</span>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    {(viewUser.roles || []).length === 0 ? (
                                        <span className="text-xs text-[rgb(var(--color-text-muted))]">No roles assigned</span>
                                    ) : (
                                        (viewUser.roles || []).map((role, i) => (
                                            <span
                                                key={i}
                                                className="inline-flex items-center gap-1 rounded-full bg-[rgb(var(--color-primary))]/10 px-2.5 py-0.5 text-xs font-medium text-[rgb(var(--color-primary))]"
                                            >
                                                <Shield size={10} />
                                                {getRoleName(role)}
                                            </span>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
                            <button
                                onClick={() => {
                                    setShowViewModal(false);
                                    openEditModal(viewUser);
                                }}
                                className="glass-button-secondary flex items-center justify-center gap-2 !px-4 !py-2.5 text-sm min-h-[44px] w-full sm:w-auto"
                            >
                                <Pencil size={14} />
                                Edit
                            </button>
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="glass-button-primary !px-4 !py-2.5 text-sm min-h-[44px] w-full sm:w-auto"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                ) : null}
            </Modal>

            <ConfirmDialog
                isOpen={showToggleDialog}
                onClose={() => setShowToggleDialog(false)}
                onConfirm={handleToggleConfirm}
                title={toggleTarget?.isDisabled ? 'Enable User' : 'Disable User'}
                message={
                    toggleTarget?.isDisabled
                        ? `Are you sure you want to enable "${toggleTarget?.userName}"? They will regain access to the system.`
                        : `Are you sure you want to disable "${toggleTarget?.userName}"? They will lose access to the system.`
                }
                confirmText={toggleTarget?.isDisabled ? 'Enable' : 'Disable'}
                variant={toggleTarget?.isDisabled ? 'primary' : 'danger'}
                isLoading={isToggling}
            />

            <ConfirmDialog
                isOpen={showUnlockDialog}
                onClose={() => setShowUnlockDialog(false)}
                onConfirm={handleUnlockConfirm}
                title="Unlock User Account"
                message={`Are you sure you want to unlock the account for "${unlockTarget?.userName}"? This will reset failed login attempts.`}
                confirmText="Unlock"
                variant="primary"
                isLoading={isUnlocking}
            />
        </motion.div>
    );
}
