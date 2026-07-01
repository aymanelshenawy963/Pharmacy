import FormField from './FormField';
import RoleCheckboxes from './RoleCheckboxes';

export default function UserForm({
    type,
    form,
    formErrors,
    onFormChange,
    onRoleToggle,
    availableRoles,
    getRoleName,
}) {
    const isCreate = type === 'create';

    return (
        <div className="space-y-4">
            <FormField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={onFormChange}
                error={formErrors.email}
                required
                placeholder="user@example.com"
            />
            <FormField
                label="Username"
                name="userName"
                value={form.userName}
                onChange={onFormChange}
                error={formErrors.userName}
                required
                placeholder="johndoe"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                    label="First Name"
                    name="firstName"
                    value={form.firstName}
                    onChange={onFormChange}
                    error={formErrors.firstName}
                    required
                    placeholder="John"
                />
                <FormField
                    label="Last Name"
                    name="lastName"
                    value={form.lastName}
                    onChange={onFormChange}
                    error={formErrors.lastName}
                    required
                    placeholder="Doe"
                />
            </div>
            {isCreate && (
                <FormField
                    label="Password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={onFormChange}
                    error={formErrors.password}
                    required
                    placeholder="Minimum 8 chars, mixed case, number & special char"
                />
            )}
            <RoleCheckboxes
                selectedRoles={form.roles}
                availableRoles={availableRoles}
                onToggle={onRoleToggle}
                error={formErrors.roles}
                getRoleName={getRoleName}
            />
        </div>
    );
}
