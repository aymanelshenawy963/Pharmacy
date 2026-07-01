import { apiGet, apiPost, apiPut, apiRequest } from './apiClient';

const CACHE_TTL = 5 * 60 * 1000;
let categoriesCache = null;
let categoriesCacheTime = 0;

export const categoryService = {
    async getAll() {
        const now = Date.now();
        if (categoriesCache && (now - categoriesCacheTime) < CACHE_TTL) {
            return categoriesCache;
        }
        const data = await apiGet('/api/Categories');
        categoriesCache = data;
        categoriesCacheTime = now;
        return data;
    },

    invalidateCache() {
        categoriesCache = null;
        categoriesCacheTime = 0;
    },

    async getById(id) {
        return apiGet(`/api/Categories/${id}`);
    },

    async create({ name, description }) {
        const result = await apiPost('/api/Categories', { name, description });
        this.invalidateCache();
        return result;
    },

    async update(id, { name, description }) {
        const result = await apiPut(`/api/Categories/${id}`, { name, description });
        this.invalidateCache();
        return result;
    },

    async remove(id) {
        const result = await apiRequest(`/api/Categories/${id}`, { method: 'DELETE' });
        this.invalidateCache();
        return result;
    },
};
