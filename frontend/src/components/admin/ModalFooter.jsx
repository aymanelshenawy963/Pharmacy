export default function ModalFooter({
    onCancel,
    onSubmit,
    isSubmitting = false,
    cancelText = 'Cancel',
    submitText = 'Submit',
    loadingText = 'Saving...',
    submitIcon: SubmitIcon = null,
    className = '',
}) {
    return (
        <div className={`mt-6 flex flex-col-reverse sm:flex-row justify-end gap-3 ${className}`}>
            <button
                onClick={onCancel}
                disabled={isSubmitting}
                className="glass-button-secondary !px-4 !py-2.5 text-sm min-h-[44px] w-full sm:w-auto"
            >
                {cancelText}
            </button>
            <button
                onClick={onSubmit}
                disabled={isSubmitting}
                className="glass-button-primary !px-4 !py-2.5 text-sm min-h-[44px] w-full sm:w-auto flex items-center justify-center gap-2"
            >
                {isSubmitting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : SubmitIcon ? (
                    <SubmitIcon size={16} />
                ) : null}
                {isSubmitting ? loadingText : submitText}
            </button>
        </div>
    );
}
