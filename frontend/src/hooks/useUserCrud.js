import { useState, useCallback } from 'react';
import { userService } from '../services/userService';
import { createUserSchema, updateUserSchema } from '../validation/admin';
import { parseZodError } from '../utils/validation';
import notify from '../utils/notifications';
import useAdminCrud from './useAdminCrud';

const INITIAL_CREATE_FORM = {
    email: '',
    userName: '',
    firstName: '',
    lastName: '',
    password: '',
    isAdmin: false,
};

const INITIAL_EDIT_FORM = {
    email: '',
    userName: '',
    firstName: '',
    lastName: '',
    isAdmin: false,
};

const filterUsers = (user, q) =>
    (user.firstName || '').toLowerCase().includes(q) ||
    (user.lastName || '').toLowerCase().includes(q) ||
    (user.userName || '').toLowerCase().includes(q) ||
    (user.email || '').toLowerCase().includes(q);

function buildRolesPayload(isAdmin) {
    const roles = ['Customer'];
    if (isAdmin) roles.push('Admin');
    return roles;
}

function hasAdminRole(user) {
    return (user.roles || []).some((r) => {
        const name = typeof r === 'string' ? r : r?.name || r?.roleName || '';
        return name === 'Admin';
    });
}

export default function useUserCrud() {
    const fetchFn = useCallback(() => userService.getAll(), []);
    const { data: users, filtered: filteredUsers, isLoading, error, search, setSearch, refetch } = useAdminCrud(fetchFn, {
        errorMessage: 'Failed to load users',
        filterFn: filterUsers,
    });

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

    const handleCreateAdminToggle = () => {
        setCreateForm((prev) => ({ ...prev, isAdmin: !prev.isAdmin }));
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        const result = createUserSchema.safeParse(createForm);
        if (!result.success) {
            setCreateErrors(parseZodError(result.error));
            return;
        }
        setCreateErrors({});

        setIsCreating(true);
        try {
            const payload = {
                ...createForm,
                roles: buildRolesPayload(createForm.isAdmin),
            };
            delete payload.isAdmin;
            await userService.create(payload);
            notify.success('User created successfully');
            setShowCreateModal(false);
            refetch();
        } catch (err) {
            notify.errorFromApi(err, 'Failed to create user');
        } finally {
            setIsCreating(false);
        }
    };

    const openEditModal = (user) => {
        setEditUserId(user.id);
        setEditForm({
            email: user.email || '',
            userName: user.userName || '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            isAdmin: hasAdminRole(user),
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

    const handleEditAdminToggle = () => {
        setEditForm((prev) => ({ ...prev, isAdmin: !prev.isAdmin }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const result = updateUserSchema.safeParse(editForm);
        if (!result.success) {
            setEditErrors(parseZodError(result.error));
            return;
        }
        setEditErrors({});

        setIsEditing(true);
        try {
            const payload = {
                ...editForm,
                roles: buildRolesPayload(editForm.isAdmin),
            };
            delete payload.isAdmin;
            await userService.update(editUserId, payload);
            notify.success('User updated successfully');
            setShowEditModal(false);
            refetch();
        } catch (err) {
            notify.errorFromApi(err, 'Failed to update user');
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
            notify.success(
                toggleTarget.isDisabled
                    ? 'User enabled successfully'
                    : 'User disabled successfully'
            );
            setShowToggleDialog(false);
            refetch();
        } catch (err) {
            notify.errorFromApi(err, 'Failed to toggle user status');
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
            notify.success('User account unlocked successfully');
            setShowUnlockDialog(false);
            refetch();
        } catch (err) {
            notify.errorFromApi(err, 'Failed to unlock user account');
        } finally {
            setIsUnlocking(false);
        }
    };

    return {
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
    };
}
