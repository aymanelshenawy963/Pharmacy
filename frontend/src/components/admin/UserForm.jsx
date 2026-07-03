import FormField from './FormField';

export default function UserForm({
    type,
    form,
    formErrors,
    onFormChange,
    onAdminToggle,
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

            {/* Role: Admin toggle */}
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[rgb(var(--color-text))]">
                    Role
                </label>
                <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
                    <label
                        className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm transition-all duration-200 min-h-[48px] ${
                            form.isAdmin
                                ? 'bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] shadow-sm'
                                : 'text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-subtle))]'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <span className="font-medium">Admin</span>
                            <span className="text-xs text-[rgb(var(--color-text-muted))]">
                                Full system access
                            </span>
                        </div>
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={form.isAdmin}
                                onChange={onAdminToggle}
                                className="sr-only peer"
                            />
                            <div className="h-6 w-11 rounded-full bg-[rgb(var(--color-border))] peer-checked:bg-[rgb(var(--color-primary))] transition-colors duration-200" />
                            <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 peer-checked:translate-x-5" />
                        </div>
                    </label>
                    <p className="mt-2 text-xs text-[rgb(var(--color-text-muted))] px-4">
                        All users are Customers by default. Toggle Admin to grant full system access.
                    </p>
                </div>
                {formErrors.roles && (
                    <span className="text-xs font-medium text-red-500">{formErrors.roles}</span>
                )}
            </div>
        </div>
    );
}
