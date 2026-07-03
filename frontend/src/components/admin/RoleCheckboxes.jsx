export default function RoleCheckboxes({
    selectedRoles = [],
    availableRoles = [],
    onToggle,
    error,
    getRoleName = (role) => (typeof role === 'string' ? role : role?.name || role?.roleName || ''),
}) {
    return (
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
                        const isSystem = role?.isSystem;
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
                                {isSystem && (
                                    <span className="ml-auto text-[10px] font-medium text-[rgb(var(--color-text-muted))] bg-[rgb(var(--color-bg-subtle))] px-1.5 py-0.5 rounded-full border border-[rgb(var(--color-border))]">
                                        System
                                    </span>
                                )}
                            </label>
                        );
                    })
                )}
            </div>
            {error && <span className="text-xs font-medium text-red-500">{error}</span>}
        </div>
    );
}
