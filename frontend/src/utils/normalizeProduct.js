export function normalizeProduct(p) {
    return {
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.newPrice,
        mrp: p.oldPrice,
        stock: p.stock,
        category: p.categoryName,
        categoryId: p.categoryId,
        image: p.photos?.[0] || null,
        requiresPrescription: p.requiresPrescription,
        topSelling: p.topSelling,
    };
}
