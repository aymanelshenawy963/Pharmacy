import { Shield, Pencil } from 'lucide-react';
import Modal from './Modal';
import StatusBadge from './StatusBadge';
import LoadingSpinner from './LoadingSpinner';

export default function UserViewModal({ isOpen, onClose, viewUser, viewLoading, onEdit }) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
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
                            <h3 className="font-sans text-base sm:text-lg font-bold text-[rgb(var(--color-text))] truncate">
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
                                            {typeof role === 'string' ? role : role?.name || role?.roleName || ''}
                                        </span>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
                        <button
                            onClick={() => {
                                onClose();
                                onEdit(viewUser);
                            }}
                            className="glass-button-secondary flex items-center justify-center gap-2 !px-4 !py-2.5 text-sm min-h-[44px] w-full sm:w-auto"
                        >
                            <Pencil size={14} />
                            Edit
                        </button>
                        <button
                            onClick={onClose}
                            className="glass-button-primary !px-4 !py-2.5 text-sm min-h-[44px] w-full sm:w-auto"
                        >
                            Close
                        </button>
                    </div>
                </div>
            ) : null}
        </Modal>
    );
}
