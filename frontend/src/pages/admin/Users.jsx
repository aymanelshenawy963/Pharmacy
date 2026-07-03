import { motion } from 'framer-motion';
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
import { pageVariants, itemVariants } from '../../constants/animations';
import useUserCrud from '../../hooks/useUserCrud';
import PageHeader from '../../components/admin/PageHeader';
import SearchInput from '../../components/admin/SearchInput';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import StatusBadge from '../../components/admin/StatusBadge';
import ModalFooter from '../../components/admin/ModalFooter';
import UserForm from '../../components/admin/UserForm';
import UserViewModal from '../../components/admin/UserViewModal';

function hasAdminRole(user) {
    return (user.roles || []).some((r) => {
        const name = typeof r === 'string' ? r : r?.name || r?.roleName || '';
        return name === 'Admin';
    });
}

export default function Users() {
    const {
        filteredUsers,
        isLoading,
        error,
        search,
        setSearch,
        refetch,
        showCreateModal,
        setShowCreateModal,
        openCreateModal,
        createForm,
        createErrors,
        isCreating,
        handleCreateChange,
        handleCreateAdminToggle,
        handleCreateSubmit,
        showEditModal,
        setShowEditModal,
        openEditModal,
        editForm,
        editErrors,
        isEditing,
        handleEditChange,
        handleEditAdminToggle,
        handleEditSubmit,
        showViewModal,
        setShowViewModal,
        openViewModal,
        viewUser,
        viewLoading,
        showToggleDialog,
        setShowToggleDialog,
        openToggleDialog,
        toggleTarget,
        isToggling,
        handleToggleConfirm,
        showUnlockDialog,
        setShowUnlockDialog,
        openUnlockDialog,
        unlockTarget,
        isUnlocking,
        handleUnlockConfirm,
    } = useUserCrud();

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
            header: 'Role',
            render: (row) => {
                const isAdmin = hasAdminRole(row);
                return (
                    <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            isAdmin
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                        }`}
                    >
                        <Shield size={10} />
                        {isAdmin ? 'Admin' : 'Customer'}
                    </span>
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
                        className={`rounded-lg p-2 text-[rgb(var(--color-text-muted))] transition-all duration-200 min-w-[40px] min-h-[40px] flex items-center justify-center ${
                            row.isDisabled
                                ? 'hover:bg-emerald-500/10 hover:text-emerald-500'
                                : 'hover:bg-amber-500/10 hover:text-amber-500'
                        }`}
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
                    onClick={refetch}
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
                    onRetry={refetch}
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
                    <UserForm
                        type="create"
                        form={createForm}
                        formErrors={createErrors}
                        onFormChange={handleCreateChange}
                        onAdminToggle={handleCreateAdminToggle}
                    />
                    <ModalFooter
                        onCancel={() => setShowCreateModal(false)}
                        onSubmit={handleCreateSubmit}
                        isSubmitting={isCreating}
                        cancelText="Cancel"
                        submitText="Create User"
                        loadingText="Creating..."
                        submitIcon={UserPlus}
                        className="pt-4 border-t border-[rgb(var(--color-border))]"
                    />
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
                    <UserForm
                        type="edit"
                        form={editForm}
                        formErrors={editErrors}
                        onFormChange={handleEditChange}
                        onAdminToggle={handleEditAdminToggle}
                    />
                    <ModalFooter
                        onCancel={() => setShowEditModal(false)}
                        onSubmit={handleEditSubmit}
                        isSubmitting={isEditing}
                        cancelText="Cancel"
                        submitText="Save Changes"
                        loadingText="Saving..."
                        submitIcon={Pencil}
                        className="pt-4 border-t border-[rgb(var(--color-border))]"
                    />
                </form>
            </Modal>

            <UserViewModal
                isOpen={showViewModal}
                onClose={() => setShowViewModal(false)}
                viewUser={viewUser}
                viewLoading={viewLoading}
                onEdit={openEditModal}
            />

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
