import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';
import { roleService } from '../services/roleService';
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
    roles: [],
};

const INITIAL_EDIT_FORM = {
    email: '',
    userName: '',
    firstName: '',
    lastName: '',
    roles: [],
};

const getRoleName = (role) => {
    if (typeof role === 'string') return role;
    return role?.name || role?.roleName || '';
};

const filterUsers = (user, q) =>
    (user.firstName || '').toLowerCase().includes(q) ||
    (user.lastName || '').toLowerCase().includes(q) ||
    (user.userName || '').toLowerCase().includes(q) ||
    (user.email || '').toLowerCase().includes(q);

export default function useUserCrud() {
    const fetchFn = useCallback(() => userService.getAll(), []);
    const { data: users, setData: setUsers, filtered: filteredUsers, isLoading, error, search, setSearch, refetch } = useAdminCrud(fetchFn, {
        errorMessage: 'Failed to load users',
        filterFn: filterUsers,
    });

    const [availableRoles, setAvailableRoles] = useState([]);

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

    const fetchRoles = useCallback(async () => {
        try {
            const data = await roleService.getAll();
            setAvailableRoles(Array.isArray(data) ? data : []);
        } catch {
            // Roles are optional
        }
    }, []);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

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
        const result = createUserSchema.safeParse(createForm);
        if (!result.success) {
            setCreateErrors(parseZodError(result.error));
            return;
        }
        setCreateErrors({});

        setIsCreating(true);
        try {
            await userService.create(createForm);
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
        const result = updateUserSchema.safeParse(editForm);
        if (!result.success) {
            setEditErrors(parseZodError(result.error));
            return;
        }
        setEditErrors({});

        setIsEditing(true);
        try {
            await userService.update(editUserId, editForm);
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
            notify.errorFromApi(err, 'Failed to unlock user');
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
        availableRoles,
        getRoleName,
        showCreateModal,
        setShowCreateModal,
        openCreateModal,
        createForm,
        createErrors,
        isCreating,
        handleCreateChange,
        handleCreateRoleToggle,
        handleCreateSubmit,
        showEditModal,
        setShowEditModal,
        openEditModal,
        editForm,
        editErrors,
        isEditing,
        handleEditChange,
        handleEditRoleToggle,
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
