import { apiGet, apiPost, apiPut } from './apiClient';

const CACHE_TTL = 5 * 60 * 1000;
let rolesCache = null;
let rolesCacheTime = 0;
let rolesCacheKey = null;

export const roleService = {
    async getAll(includeDisabled = false) {
        const cacheKey = String(includeDisabled);
        const now = Date.now();
        if (rolesCache && rolesCacheKey === cacheKey && (now - rolesCacheTime) < CACHE_TTL) {
            return rolesCache;
        }
        const data = await apiGet('/api/Roles', includeDisabled ? { includeDisabled: 'true' } : {});
        rolesCache = data;
        rolesCacheTime = now;
        rolesCacheKey = cacheKey;
        return data;
    },

    invalidateCache() {
        rolesCache = null;
        rolesCacheTime = 0;
        rolesCacheKey = null;
    },

    async create({ name }) {
        const result = await apiPost('/api/Roles', { name });
        this.invalidateCache();
        return result;
    },

    async update(id, { name }) {
        const result = await apiPut(`/api/Roles/${id}`, { name });
        this.invalidateCache();
        return result;
    },

    async toggleStatus(id) {
        const result = await apiPut(`/api/Roles/${id}/toggle-status`);
        this.invalidateCache();
        return result;
    },
};
