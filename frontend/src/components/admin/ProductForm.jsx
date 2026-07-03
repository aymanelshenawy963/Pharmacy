import FormField from './FormField';
import ImageUploader from './ImageUploader';

export default function ProductForm({
    form,
    formErrors,
    photos,
    setPhotos,
    categories,
    selectedProduct,
    onFormChange,
}) {
    return (
        <div className="flex flex-col gap-4">
            <FormField
                label="Name"
                name="name"
                value={form.name}
                onChange={onFormChange}
                error={formErrors.name}
                required
                placeholder="Product name"
            />

            <FormField
                label="Description"
                name="description"
                type="textarea"
                value={form.description}
                onChange={onFormChange}
                error={formErrors.description}
                required
                placeholder="Product description"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                    label="New Price"
                    name="newPrice"
                    type="number"
                    value={form.newPrice}
                    onChange={onFormChange}
                    error={formErrors.newPrice}
                    required
                    placeholder="0.00"
                />
                <FormField
                    label="Old Price"
                    name="oldPrice"
                    type="number"
                    value={form.oldPrice}
                    onChange={onFormChange}
                    error={formErrors.oldPrice}
                    required
                    placeholder="0.00"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                    label="Stock"
                    name="stock"
                    type="number"
                    value={form.stock}
                    onChange={onFormChange}
                    error={formErrors.stock}
                    required
                    placeholder="0"
                />
                <FormField
                    label="Category"
                    name="categoryId"
                    type="select"
                    value={form.categoryId}
                    onChange={onFormChange}
                    error={formErrors.categoryId}
                    required
                    placeholder="Select category"
                    options={categories.map(c => ({ value: c.id, label: c.name }))}
                />
            </div>

            <div className="flex flex-wrap gap-4 sm:gap-6">
                <FormField
                    label="Has Strips"
                    name="hasStrips"
                    type="checkbox"
                    value={form.hasStrips}
                    onChange={onFormChange}
                />
                <FormField
                    label="Top Selling"
                    name="topSelling"
                    type="checkbox"
                    value={form.topSelling}
                    onChange={onFormChange}
                />
            </div>

            {form.hasStrips && (
                <FormField
                    label="Strip Count"
                    name="stripCount"
                    type="number"
                    value={form.stripCount}
                    onChange={onFormChange}
                    placeholder="Number of strips"
                />
            )}

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[rgb(var(--color-text))]">
                    Photos <span className="ml-1 text-red-500">*</span>
                </label>
                {selectedProduct && photos.length > 0 && (
                    <p className="text-xs text-amber-500">
                        Note: Saving will re-upload all images. Existing images will be replaced.
                    </p>
                )}
                <ImageUploader
                    files={photos}
                    onChange={setPhotos}
                    maxFiles={5}
                    error={formErrors.photos}
                />
            </div>
        </div>
    );
}
