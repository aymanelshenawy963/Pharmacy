**Architecture Fix Plan — Jaya Medical Store Frontend**  
***Generated:*** * 2026-06-30*  
 *  
 * ***Status:*** * Planning (Not Started)*  
 *  
 * ***Scope:*** * Frontend only — no API or backend changes*  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVR4nO3OMQ2AABAAsSNBCkJfFSqwwIgHRiywEZJWQZeZ2ao9AAD+4lyruzq+ngAA8Nr1AOH8BeZxN/IIAAAAAElFTkSuQmCC)  
**Table of Contents**  
1. [Overview](#anchor-1 "#anchor-1")  
2. [Architecture Audit Summary](#anchor-2 "#anchor-2")  
3. [Phase 1: Eliminate Duplication](#anchor-3 "#anchor-3")  
4. [Phase 2: Consolidate Validation](#anchor-4 "#anchor-4")  
5. [Phase 3: Refactor Admin Pages](#anchor-5 "#anchor-5")  
6. [Phase 4: Decompose Navbar](#anchor-6 "#anchor-6")  
7. [Phase 5: Extract Page-Level Hooks](#anchor-7 "#anchor-7")  
8. [Phase 6: Improve Infrastructure](#anchor-8 "#anchor-8")  
9. [Phase 7: Code Quality & Accessibility](#anchor-9 "#anchor-9")  
10. [Implementation Order](#anchor-10 "#anchor-10")  
11. [Risk Assessment](#anchor-11 "#anchor-11")  
12. [Architecture Scores (Current)](#anchor-12 "#anchor-12")  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OMQ2AUBBAsUfyRTCh9VRgEBGsWGAjJK2CbjNzVGcAAPzFtapV7V9PAAB47X4AEWgEMAY9+pUAAAAASUVORK5CYII=)  
**Overview**  
**Total Issues Found:** 25  
   
 **Total Phases:** 7  
   
 **Estimated Files to Create/Modify:** ~40-50  
   
 **Estimated Effort:** 2-3 days of focused work  
   
 **Risk Level:** Medium — no API changes, no UI redesign, purely structural refactoring  
   
 **All existing functionality must be preserved.**  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OMQ2AABAAsSNhZscYahheJwqQgQU2QtIq6DIze3UGAMBf3Gu1VcfXEwAAXrseoqcEQXyAWBgAAAAASUVORK5CYII=)  
**Architecture Audit Summary**  
**Critical Issues**  
| | | | |  
|-|-|-|-|  
| **#** | **Issue** | **Location** | **Impact** |   
| 1 | Duplicate src/admin/ directory | src/admin/ vs src/pages/admin/ + src/components/admin/ | Confusing module boundaries; unclear where admin code belongs |   
| 2 | Duplicate parseZodError function | src/validation/authSchemas.js:85 and src/admin/utils/validation.js:1 | DRY violation; identical implementations |   
| 3 | Triplicate animation constants | src/constants/animations.js, src/constants/auth.js:31-65, src/admin/constants/animations.js | Three files with overlapping animation variants |   
| 4 | Dual validation systems | src/validation/authSchemas.js (Zod) + src/utils/validators.js (manual) | Two approaches to the same problem |   
| 5 | No data-fetching abstraction | Every page manually manages loading/error/data state | Massive state boilerplate in every page |   
| 6 | Admin pages contain full CRUD logic | src/pages/admin/Products.jsx (686 lines), Users.jsx (697 lines) | Business logic, API calls, form handling, and UI all in one file |   
   
**High-Priority Issues**  
| | | |  
|-|-|-|  
| **#** | **Issue** | **Location** |   
| 7 | Navbar is 457 lines | src/components/Navbar.jsx — desktop nav, mobile drawer, profile, admin, logout, scroll detection |   
| 8 | No TypeScript | Entire project is JavaScript — no type safety |   
| 9 | Checkout has inline validation | src/pages/Checkout.jsx:76-86 — manually validates addresses instead of using Zod |   
| 10 | normalizeProduct function mapping inconsistency | src/utils/normalizeProduct.js maps price: p.newPrice but Products.jsx also uses product.price — fragile |   
| 11 | ThemeContext uses unprefixed localStorage key | ThemeContext.jsx:8 uses localStorage.getItem('theme') while all other keys are prefixed jaya- |   
| 12 | No error boundaries at route level | ErrorBoundary wraps <Outlet> but not individual routes — one error kills the whole layout |   
| 13 | apiFormData duplicates retry/refresh logic | apiClient.js:241-290 reimplements the same retry and 401 refresh logic from apiRequest |   
   
**Medium-Priority Issues**  
| | | |  
|-|-|-|  
| **#** | **Issue** | **Location** |   
| 14 | useAuthForm hook unused by most auth pages | Only partially used; Login, Register, ForgotPassword each implement their own form handling |   
| 15 | Admin useAdminCrud doesn't support pagination | src/admin/hooks/useAdminCrud.js — only handles client-side search filtering |   
| 16 | Hardcoded perPage = 6 | src/pages/Products.jsx:41 and src/pages/admin/Products.jsx:99 — not configurable |   
| 17 | deliveryMethods is hardcoded in data file | src/data/store.js:139-161 — should come from API |   
| 18 | Seo component is minimal | src/components/Seo.jsx — only sets title and basic meta; no structured data |   
| 19 | Missing alt text on many images | Home page hero, collection cards, owner image |   
   
**Low-Priority Issues**  
| | | |  
|-|-|-|  
| **#** | **Issue** | **Location** |   
| 20 | No test infrastructure | Zero test files, no testing libraries |   
| 21 | eslint-disable comment | AuthContext.jsx:72 |   
| 22 | config/api.js re-exports sleep | config/api.js:12 — sleep already exists in utils/sleep.js |   
| 23 | Unused config/api.js exports | maxRetries, retryBaseDelay, headers from API_CONFIG are never used |   
| 24 | No skip-to-content link | Accessibility gap for keyboard users |   
| 25 | Home page collectionCards is inline | Home.jsx:11-43 — should be in data/store.js |   
   
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OQQmAABRAsSeYxKS/kJkED6bwYAVvImwJtszMVu0BAPAXx1rd1fn1BACA164HHDwF+DpPyKwAAAAASUVORK5CYII=)  
**Phase 1: Eliminate Duplication**  
**Goal:** Remove all DRY violations before any structural changes.  
   
 **Dependencies:** None  
   
 **Estimated Effort:** 1-2 hours  
   
 **Files Touched:** ~20  
**Step 1.1 — Consolidate **parseZodError ** into a single utility**  
**Current State:**  
- src/validation/authSchemas.js:85-94 — contains parseZodError function  
- src/admin/utils/validation.js:1-10 — contains identical parseZodError function  
**Actions:**  
1. Create src/utils/validation.js with the shared parseZodError:  
export function parseZodError(error) {  
     const fieldErrors = {};  
     error.issues.forEach((issue) => {  
         const field = issue.path[0];  
         if (field && !fieldErrors[field]) {  
             fieldErrors[field] = issue.message;  
         }  
     });  
     return fieldErrors;  
 }  
   
1. Remove parseZodError from src/validation/authSchemas.js:85-94  
2. Delete src/admin/utils/validation.js  
3. Update imports in the following files:  
| | | |  
|-|-|-|  
| **File** | **Old Import** | **New Import** |   
| src/hooks/useAuthForm.js:3 | import { parseZodError } from '../validation/authSchemas' | import { parseZodError } from '../utils/validation' |   
| src/pages/admin/Products.jsx:8 | import { parseZodError } from '../../admin/utils/validation' | import { parseZodError } from '../../utils/validation' |   
| src/pages/admin/Users.jsx:16 | import { parseZodError } from '../../admin/utils/validation' | import { parseZodError } from '../../utils/validation' |   
| src/pages/admin/Roles.jsx:6 | import { parseZodError } from '../../admin/utils/validation' | import { parseZodError } from '../../utils/validation' |   
| src/pages/admin/Categories.jsx:6 | import { parseZodError } from '../../admin/utils/validation' | import { parseZodError } from '../../utils/validation' |   
   
**Verification:**  
- Run npm run build — should compile with zero errors  
- Test all auth pages (Login, Register, ForgotPassword, ResetPassword, ConfirmEmail)  
- Test all admin CRUD pages (Products, Users, Roles, Categories)  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAM0lEQVR4nO3KsQ0AIRAEsUW6Qij1KvnevhMSYmKQ7GiCGd09k3wBAOAVf+2o4wYAwE1qAdYuAy151mgcAAAAAElFTkSuQmCC)  
**Step 1.2 — Consolidate animation constants**  
**Current State:**  
- src/constants/animations.js — general animations (staggerContainer, staggerItem, fadeInUp, etc.)  
- src/constants/auth.js:31-65 — auth-specific animations (authContainerVariants, authFadeUpVariants, etc.)  
- src/admin/constants/animations.js — admin animations (pageVariants, itemVariants, dropdownVariants)  
**Actions:**  
1. Add admin-specific variants to src/constants/animations.js:  
// Add to existing file:  
 export const pageVariants = {  
     hidden: { opacity: 0 },  
     visible: {  
         opacity: 1,  
         transition: { staggerChildren: 0.08, delayChildren: 0.1 },  
     },  
 };  
   
 export const itemVariants = {  
     hidden: { opacity: 0, y: 16 },  
     visible: {  
         opacity: 1,  
         y: 0,  
         transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },  
     },  
 };  
   
 export const dropdownVariants = {  
     initial: { opacity: 0, y: -8, scale: 0.96 },  
     animate: { opacity: 1, y: 0, scale: 1 },  
     transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] },  
 };  
   
1. Delete src/admin/constants/animations.js  
2. Delete src/admin/constants/index.js  
3. Update imports in admin pages:  
| | | |  
|-|-|-|  
| **File** | **Old Import** | **New Import** |   
| src/pages/admin/Products.jsx:11 | import { pageVariants, itemVariants, dropdownVariants } from '../../admin/constants/animations' | import { pageVariants, itemVariants, dropdownVariants } from '../../constants/animations' |   
| src/pages/admin/Users.jsx:18 | import { pageVariants, itemVariants } from '../../admin/constants/animations' | import { pageVariants, itemVariants } from '../../constants/animations' |   
| src/pages/admin/Roles.jsx:8 | import { pageVariants, itemVariants } from '../../admin/constants/animations' | import { pageVariants, itemVariants } from '../../constants/animations' |   
| src/pages/admin/Categories.jsx:8 | import { pageVariants, itemVariants } from '../../admin/constants/animations' | import { pageVariants, itemVariants } from '../../constants/animations' |   
   
1. Remove duplicate auth variants from src/constants/auth.js:31-65 that overlap with src/constants/animations.js. Keep only:  
- authContainerVariants (unique to auth)  
- authFadeUpVariants (unique to auth)  
- authScaleFadeVariants (unique to auth)  
- floatingAnimation, floatingAnimation2, floatingBlurAnimation, floatingBlurAnimation2 (unique to auth)  
- PASSWORD_RULES (not animation-related, stays)  
**Verification:**  
- Run npm run build  
- Test all admin pages for animations  
- Test all auth pages for animations  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVR4nO3OQQmAABRAsSfYxZo/kC1sYQLPJrCCNxG2BFtmZquOAAD4i3Ot7mr/egIAwGvXA4qzBdC53Vr8AAAAAElFTkSuQmCC)  
**Step 1.3 — Delete **src/admin/ ** directory entirely**  
After steps 1.1 and 1.2, move remaining files:  
**Move Operations:**  
| | |  
|-|-|  
| **From** | **To** |   
| src/admin/hooks/useAdminCrud.js | src/hooks/useAdminCrud.js |   
| src/admin/hooks/useClickOutside.js | src/hooks/useClickOutside.js |   
| src/admin/hooks/index.js | src/hooks/admin.js (barrel export) |   
| src/admin/utils/photoHelpers.js | src/utils/photoHelpers.js |   
| src/admin/validation/productSchemas.js | src/validation/admin/productSchemas.js |   
| src/admin/validation/categorySchemas.js | src/validation/admin/categorySchemas.js |   
| src/admin/validation/userSchemas.js | src/validation/admin/userSchemas.js |   
| src/admin/validation/roleSchemas.js | src/validation/admin/roleSchemas.js |   
| src/admin/validation/index.js | src/validation/admin/index.js |   
   
**Update all imports** that reference ../../admin/ paths. Affected files:  
| | | |  
|-|-|-|  
| **File** | **Old Pattern** | **New Pattern** |   
| src/pages/admin/Products.jsx | ../../admin/hooks | ../../hooks/admin |   
|   | ../../admin/validation | ../../validation/admin |   
|   | ../../admin/utils/photoHelpers | ../../utils/photoHelpers |   
| src/pages/admin/Users.jsx | ../../admin/hooks/useAdminCrud | ../../hooks/useAdminCrud |   
|   | ../../admin/validation | ../../validation/admin |   
| src/pages/admin/Roles.jsx | ../../admin/hooks/useAdminCrud | ../../hooks/useAdminCrud |   
|   | ../../admin/validation | ../../validation/admin |   
| src/pages/admin/Categories.jsx | ../../admin/hooks/useAdminCrud | ../../hooks/useAdminCrud |   
|   | ../../admin/validation | ../../validation/admin |   
   
**After all moves, delete** the entire src/admin/ directory:  
rm -rf src/admin/  
   
**Verification:**  
- Run npm run build  
- Test all 4 admin pages (Products, Users, Roles, Categories)  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVR4nO3OMQ2AABAAsSNBACPykMH4NpGACyywEZJWQZeZ2aszAAD+4l6rrTo+jgAA8N71AL/CBEiG5xPoAAAAAElFTkSuQmCC)  
**Step 1.4 — Clean up **config/api.js  
**Current State:**  
- src/config/api.js exports API_CONFIG with unused fields and re-exports sleep  
**Actions:**  
1. Simplify src/config/api.js:  
const API_CONFIG = {  
     baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5223',  
 };  
   
 export const BASE_URL = API_CONFIG.baseURL;  
 export default API_CONFIG;  
   
1. Update src/services/apiClient.js:2:  
// Old:  
 import { BASE_URL, sleep } from '../config/api';  
   
 // New:  
 import { BASE_URL } from '../config/api';  
 import { sleep } from '../utils/sleep';  
   
**Verification:**  
- Run npm run build  
- Test API calls (login, fetch products, etc.)  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANElEQVR4nO3OQQmAABRAsaeILbwZ9Fewo0Gs4E2ELcGWmTmqKwAA/uLeqr06v54AAPDa+gAthwNEfGhnhAAAAABJRU5ErkJggg==)  
**Phase 2: Consolidate Validation**  
**Goal:** Single validation system using Zod throughout.  
   
 **Dependencies:** Phase 1  
   
 **Estimated Effort:** 1-2 hours  
   
 **Files Touched:** ~6  
**Step 2.1 — Create **src/validation/checkoutSchema.js  
import { z } from 'zod';  
   
 export const shippingAddressSchema = z.object({  
     firstName: z  
         .string()  
         .min(1, 'First name is required')  
         .max(100, 'First name must be at most 100 characters'),  
     lastName: z  
         .string()  
         .min(1, 'Last name is required')  
         .max(100, 'Last name must be at most 100 characters'),  
     street: z  
         .string()  
         .min(1, 'Street address is required')  
         .max(200, 'Street address must be at most 200 characters'),  
     city: z  
         .string()  
         .min(1, 'City is required')  
         .max(100, 'City must be at most 100 characters'),  
     state: z  
         .string()  
         .min(1, 'State is required')  
         .max(100, 'State must be at most 100 characters'),  
     zipCode: z  
         .string()  
         .min(1, 'ZIP code is required')  
         .max(20, 'ZIP code must be at most 20 characters'),  
 });  
   
**Step 2.2 — Remove manual validators**  
1. Create src/utils/passwordStrength.js (extract getPasswordStrength from validators.js):  
export function getPasswordStrength(password) {  
     if (!password) return { score: 0, label: '', color: '' };  
   
     let score = 0;  
     if (password.length >= 8) score++;  
     if (/[A-Z]/.test(password)) score++;  
     if (/[a-z]/.test(password)) score++;  
     if (/\d/.test(password)) score++;  
     if (/[@$!%*?&^#_\-]/.test(password)) score++;  
   
     if (score <= 2) return { score, label: 'Weak', color: '#ef4444' };  
     if (score <= 3) return { score, label: 'Fair', color: '#f59e0b' };  
     if (score === 4) return { score, label: 'Good', color: '#3b82f6' };  
     return { score, label: 'Strong', color: '#10b981' };  
 }  
   
1. Update src/components/auth/PasswordStrengthMeter.jsx to import from ../../utils/passwordStrength  
2. Delete src/utils/validators.js  
**Files to check for imports of ** **validators.js** **:**  
- src/components/auth/PasswordStrengthMeter.jsx — imports getPasswordStrength  
- src/pages/ResetPassword.jsx — may import validators  
- src/pages/SecuritySettings.jsx — may import validators  
**Step 2.3 — Refactor **Checkout.jsx ** to use Zod validation**  
**Current State:** src/pages/Checkout.jsx:76-86 has manual validation:  
const validate = () => {  
     const newErrors = {};  
     if (!address.firstName.trim()) newErrors.firstName = 'First name is required.';  
     // ... 5 more manual checks  
     setErrors(newErrors);  
     return Object.keys(newErrors).length === 0;  
 };  
   
**Actions:**  
1. Import the new schema and parseZodError:  
import { shippingAddressSchema } from '../validation/checkoutSchema';  
 import { parseZodError } from '../utils/validation';  
   
1. Replace the validate() function:  
const validate = () => {  
     const result = shippingAddressSchema.safeParse(address);  
     if (result.success) {  
         setErrors({});  
         return true;  
     }  
     setErrors(parseZodError(result.error));  
     return false;  
 };  
   
**Verification:**  
- Run npm run build  
- Test Checkout page — submit with empty fields, verify validation errors appear  
- Test Checkout page — submit with valid data, verify order is placed  
- Test all auth pages still work  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVR4nO3OQQmAABRAsScYxpg/i2XMYARvRrCCNxG2BFtmZquOAAD4i3Ot7mr/egIAwGvXA22YBcnkstSpAAAAAElFTkSuQmCC)  
**Phase 3: Refactor Admin Pages**  
**Goal:** Extract business logic from admin CRUD pages into custom hooks.  
   
 **Dependencies:** Phase 1  
   
 **Estimated Effort:** 4-6 hours  
   
 **Files Touched:** ~8  
**Step 3.1 — Create **src/hooks/useProductCrud.js  
Extract from src/pages/admin/Products.jsx (686 lines → ~250 lines).  
**New hook signature:**  
export default function useProductCrud() {  
     return {  
         // Data  
         products,  
         categories,  
         totalCount,  
         totalPages,  
   
         // Pagination & Filters  
         pageIndex,  
         setPageIndex,  
         sort,  
         setSort,  
         categoryFilter,  
         setCategoryFilter,  
         search,  
         setSearch,  
   
         // Loading & Error  
         isLoading,  
         error,  
   
         // Fetch  
         fetchProducts,  
         fetchCategories,  
   
         // Create Modal  
         showCreateModal,  
         setShowCreateModal,  
         openCreateModal,  
   
         // Edit Modal  
         showEditModal,  
         setShowEditModal,  
         openEditModal,  
         selectedProduct,  
   
         // Delete Dialog  
         showDeleteDialog,  
         setShowDeleteDialog,  
         openDeleteDialog,  
   
         // Form State  
         form,  
         formErrors,  
         photos,  
         setPhotos,  
         isSubmitting,  
         handleFormChange,  
   
         // Actions  
         handleCreate,  
         handleUpdate,  
         handleDelete,  
         buildFormData,  
         resetForm,  
   
         // Dropdowns  
         sortOpen,  
         setSortOpen,  
         categoryOpen,  
         setCategoryOpen,  
         sortRef,  
         categoryRef,  
     };  
 }  
   
**Step 3.2 — Create **src/components/admin/ProductForm.jsx  
Extract the renderForm() function from src/pages/admin/Products.jsx:366-488 into a standalone component:  
export default function ProductForm({  
     form,  
     formErrors,  
     photos,  
     setPhotos,  
     categories,  
     selectedProduct,  
     onFormChange,  
 }) {  
     // ... form fields JSX  
 }  
   
**Step 3.3 — Refactor **src/pages/admin/Products.jsx  
After extraction, the page becomes ~250 lines:  
- Imports useProductCrud hook and ProductForm component  
- Defines columns array  
- Renders PageHeader, SearchInput, filter dropdowns, DataTable, Modals, and ConfirmDialog  
- No business logic — all in the hook  
**Step 3.4 — Create **src/hooks/useUserCrud.js  
Extract from src/pages/admin/Users.jsx (697 lines → ~300 lines).  
**New hook handles:**  
- users, filteredUsers, availableRoles  
- Create/Edit/View/Toggle/Unlock modal states  
- All CRUD operations and form handling  
- filterUsers function  
**Step 3.5 — Create **src/components/admin/UserForm.jsx  
Extract Create/Edit user form fields from Users.jsx.  
**Step 3.6 — Create **src/components/admin/UserViewModal.jsx  
Extract the User Details modal from Users.jsx:583-668.  
**Step 3.7 — Refactor **src/pages/admin/Users.jsx  
After extraction, the page becomes ~300 lines with pure UI.  
**Verification:**  
- Run npm run build  
- Test Products admin: create, edit, delete, search, filter, pagination  
- Test Users admin: create, edit, view, toggle status, unlock, search  
- Test Roles admin (should be unaffected)  
- Test Categories admin (should be unaffected)  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVR4nO3OQQmAABRAsScYxpg/i2XMYARvRrCCNxG2BFtmZquOAAD4i3Ot7mr/egIAwGvXA22YBcnkstSpAAAAAElFTkSuQmCC)  
**Phase 4: Decompose Navbar**  
**Goal:** Split the 457-line Navbar into manageable pieces.  
   
 **Dependencies:** None (can run in parallel with Phase 1)  
   
 **Estimated Effort:** 2-3 hours  
   
 **Files Touched:** ~5  
**Step 4.1 — Create **src/components/layout/DesktopNav.jsx  
Extract desktop navigation links (src/components/Navbar.jsx:151-179):  
export default function DesktopNav() {  
     return (  
         <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">  
             {navLinks.map((link) => (  
                 <NavLink key={link.to} to={link.to} /* ... */>  
                     {({ isActive }) => (/* ... */)}  
                 </NavLink>  
             ))}  
         </nav>  
     );  
 }  
   
**Step 4.2 — Create **src/components/layout/DesktopActions.jsx  
Extract desktop right actions (src/components/Navbar.jsx:182-250):  
- Cart link with badge  
- Admin dashboard link (conditional)  
- User profile link  
- Sign in button (unauthenticated)  
- Sign out button  
- Theme toggle  
**Step 4.3 — Create **src/components/layout/MobileActions.jsx  
Extract mobile right actions (src/components/Navbar.jsx:253-289):  
- Cart icon with badge  
- Theme toggle  
- Hamburger menu button  
**Step 4.4 — Create **src/components/layout/MobileDrawer.jsx  
Extract the entire mobile slide-in drawer (src/components/Navbar.jsx:293-454):  
- Drawer header with close button  
- Profile card / Sign in button  
- Shopping section links  
- Support section links  
- Admin section links (conditional)  
- Sign out button  
Props: isOpen, onClose, user, isAuthenticated, isAdmin, cartCount, onLogout  
**Step 4.5 — Refactor **src/components/Navbar.jsx  
After extraction, Navbar becomes ~80 lines:  
export default function Navbar() {  
     const { cartCount } = useCart();  
     const { user, isAuthenticated, logout } = useAuth();  
     const [menuOpen, setMenuOpen] = useState(false);  
     const [scrolled, setScrolled] = useState(false);  
     const isAdmin = user?.roles?.includes('Admin');  
     const location = useLocation();  
     const navigate = useNavigate();  
   
     // ... scroll handler, logout handler, close-on-navigate  
   
     return (  
         <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled ? '...' : '...'}`}>  
             <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6 lg:px-8">  
                 <Logo />  
                 <DesktopNav />  
                 <DesktopActions user={user} isAuthenticated={isAuthenticated} isAdmin={isAdmin} cartCount={cartCount} onLogout={handleLogout} />  
                 <MobileActions cartCount={cartCount} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />  
             </div>  
             <MobileDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} user={user} isAuthenticated={isAuthenticated} isAdmin={isAdmin} cartCount={cartCount} onLogout={handleLogout} />  
         </header>  
     );  
 }  
   
**Verification:**  
- Run npm run build  
- Test desktop navigation — all links work  
- Test mobile drawer — opens, closes, all links work  
- Test cart badge updates  
- Test admin dashboard link visibility  
- Test theme toggle in both desktop and mobile  
- Test scroll behavior (sticky header blur)  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OMQ2AABAAsSPBCj7fFjsymJHAjAU2QtIq6DIzW7UHAMBfnGt1V8fXEwAAXrsexNkF4H1/HJoAAAAASUVORK5CYII=)  
**Phase 5: Extract Page-Level Hooks**  
**Goal:** Remove business logic from pages.  
   
 **Dependencies:** Phase 2  
   
 **Estimated Effort:** 3-4 hours  
   
 **Files Touched:** ~8  
**Step 5.1 — Create **src/hooks/useProducts.js  
Extract from src/pages/Products.jsx (369 lines → ~200 lines).  
**New hook handles:**  
- Search, category, sort, pagination state  
- Debounced search via useDebounce  
- fetchProducts() — API call with params  
- resetFilters() — clears all filters  
- categories — fetched from categoryService  
- loading, error, products, totalCount, totalPages  
export default function useProducts() {  
     const [searchParams] = useSearchParams();  
     // ... state  
     const debouncedSearch = useDebounce(search, 400);  
   
     const fetchProducts = useCallback(async () => { /* ... */ }, [deps]);  
   
     useEffect(() => { fetchProducts(); }, [fetchProducts]);  
   
     return {  
         search, setSearch,  
         category, setCategory,  
         sortBy, setSortBy,  
         currentPage, setCurrentPage,  
         loading, error,  
         products, totalCount, totalPages,  
         categories,  
         resetFilters,  
         fetchProducts,  
     };  
 }  
   
**Step 5.2 — Refactor **src/pages/Products.jsx  
After extraction, the page becomes ~200 lines:  
- Uses useProducts() hook  
- Defines filter sidebar JSX  
- Defines product grid JSX  
- Defines pagination JSX  
- No API calls, no state management logic  
**Step 5.3 — Create **src/hooks/useCheckout.js  
Extract from src/pages/Checkout.jsx (327 lines → ~200 lines).  
**New hook handles:**  
- Address state, delivery method selection  
- Zod validation (using shippingAddressSchema)  
- handleSubmit() — order creation via orderService  
- Delivery price calculation  
- refreshCartProducts() on mount  
**Step 5.4 — Create **src/components/checkout/AddressForm.jsx  
Extract shipping address form fields from Checkout.jsx:159-195.  
**Step 5.5 — Create **src/components/checkout/DeliveryMethodSelector.jsx  
Extract delivery method selection from Checkout.jsx:198-239.  
**Step 5.6 — Create **src/components/checkout/OrderSummary.jsx  
Extract order summary sidebar from Checkout.jsx:243-288.  
**Step 5.7 — Refactor **src/pages/Checkout.jsx  
After extraction, the page becomes ~150 lines:  
- Uses useCheckout() hook  
- Renders <AddressForm>, <DeliveryMethodSelector>, <OrderSummary>  
- No validation logic, no API calls in the page  
**Verification:**  
- Run npm run build  
- Test Products page — search, filter by category, sort, pagination all work  
- Test Checkout page — fill address, select delivery, place order  
- Test Checkout page with empty cart — shows "cart empty" state  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OMQ2AABAAsSPBCUZfEnoYmFDBhAU2QtIq6DIzW7UHAMBfnGt1V8fXEwAAXrse/wcF74lXkIsAAAAASUVORK5CYII=)  
**Phase 6: Improve Infrastructure**  
**Goal:** Fix miscellaneous infrastructure issues.  
   
 **Dependencies:** None (can run in parallel)  
   
 **Estimated Effort:** 1-2 hours  
   
 **Files Touched:** ~4  
**Step 6.1 — Fix ThemeContext storage key**  
**Current:** src/context/ThemeContext.jsx:8 uses localStorage.getItem('theme') and line 19 uses localStorage.setItem('theme', theme)  
**Actions:**  
1. Update to use prefixed key:  
const THEME_KEY = 'jaya-theme';  
   
 // In useState initializer:  
 const storedTheme = localStorage.getItem(THEME_KEY);  
   
 // In useEffect:  
 localStorage.setItem(THEME_KEY, theme);  
   
1. Add migration for existing users:  
// In useState initializer, before reading new key:  
 const migrateTheme = () => {  
     const oldTheme = localStorage.getItem('theme');  
     if (oldTheme) {  
         localStorage.setItem('jaya-theme', oldTheme);  
         localStorage.removeItem('theme');  
     }  
 };  
 migrateTheme();  
   
**Step 6.2 — Add route-level Error Boundaries**  
1. Create src/components/RouteErrorBoundary.jsx:  
import { Component } from 'react';  
 import { Link } from 'react-router-dom';  
   
 export default class RouteErrorBoundary extends Component {  
     constructor(props) {  
         super(props);  
         this.state = { hasError: false };  
     }  
   
     static getDerivedStateFromError() {  
         return { hasError: true };  
     }  
   
     componentDidCatch(error, errorInfo) {  
         console.error('Route error:', error, errorInfo);  
     }  
   
     render() {  
         if (this.state.hasError) {  
             return (  
                 <div className="min-h-[60vh] flex items-center justify-center p-4">  
                     <div className="bg-surface rounded-2xl border border-border max-w-md w-full p-8 text-center">  
                         <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>  
                         <p className="text-text-muted mb-6">An error occurred on this page.</p>  
                         <div className="flex gap-3 justify-center">  
                             <button onClick={() => this.setState({ hasError: false })} className="glass-button-secondary">  
                                 Try Again  
                             </button>  
                             <Link to="/" className="glass-button-primary">  
                                 Go Home  
                             </Link>  
                         </div>  
                     </div>  
                 </div>  
             );  
         }  
         return this.props.children;  
     }  
 }  
   
1. Wrap individual route content in App.jsx:  
// In Layout component:  
 <main>  
     <ErrorBoundary>  
         <Suspense fallback={<PageLoader />}>  
             <RouteErrorBoundary>  
                 <AnimatePresence mode="wait">  
                     <motion.div key={location.pathname} {...pageTransition}>  
                         <Outlet />  
                     </motion.div>  
                 </AnimatePresence>  
             </RouteErrorBoundary>  
         </Suspense>  
     </ErrorBoundary>  
 </main>  
   
**Step 6.3 — Improve Seo component**  
Update src/components/Seo.jsx to support:  
export default function Seo({ title, description, image, url, type = 'website' }) {  
     useEffect(() => {  
         // ... existing title and description logic  
   
         // Add image support  
         if (image) {  
             setMeta('og:image', image);  
             setMeta('twitter:image', image);  
         }  
   
         // Add URL support  
         if (url) {  
             setMeta('og:url', url);  
         }  
   
         // Add type  
         setMeta('og:type', type);  
   
         // Add twitter card  
         let twitterCard = document.querySelector('meta[name="twitter:card"]');  
         if (!twitterCard) {  
             twitterCard = document.createElement('meta');  
             twitterCard.name = 'twitter:card';  
             document.head.appendChild(twitterCard);  
         }  
         twitterCard.content = image ? 'summary_large_image' : 'summary';  
     }, [title, description, image, url, type]);  
   
     return null;  
 }  
   
**Step 6.4 — Create **src/hooks/useFormSubmission.js  
A reusable hook for form submission states:  
import { useState, useCallback } from 'react';  
 import notify from '../utils/notifications';  
   
 export function useFormSubmission({ onSuccess, onError }) {  
     const [isSubmitting, setIsSubmitting] = useState(false);  
     const [error, setError] = useState(null);  
   
     const submit = useCallback(async (fn) => {  
         setIsSubmitting(true);  
         setError(null);  
         try {  
             const result = await fn();  
             onSuccess?.(result);  
             return result;  
         } catch (err) {  
             const message = err.message || 'Something went wrong';  
             setError(message);  
             onError?.(err);  
             throw err;  
        } finally {  
             setIsSubmitting(false);  
         }  
     }, [onSuccess, onError]);  
   
     const reset = useCallback(() => {  
         setError(null);  
         setIsSubmitting(false);  
     }, []);  
   
     return { isSubmitting, error, submit, reset };  
 }  
   
**Verification:**  
- Run npm run build  
- Test theme toggle — persists across page reloads  
- Test error boundary — trigger a render error, verify "Try Again" works  
- Test Seo component — verify meta tags on Products page  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVR4nO3OQQmAABRAsSfYxZo/khWsYQLPJrCCNxG2BFtmZquOAAD4i3Ot7mr/egIAwGvXA4qjBdKlX6OKAAAAAElFTkSuQmCC)  
**Phase 7: Code Quality & Accessibility**  
**Goal:** Fix remaining code quality and accessibility issues.  
   
 **Dependencies:** None (can run anytime)  
   
 **Estimated Effort:** 1-2 hours  
   
 **Files Touched:** ~5  
**Step 7.1 — Add missing **alt ** attributes**  
| | | | |  
|-|-|-|-|  
| **File** | **Line** | **Image** | **Suggested ** **alt** |   
| src/pages/Home.jsx:78 | Hero image | alt="Capsules and wellness products" |   |   
| src/pages/Home.jsx:238 | Large collection card | alt={card.title} (already has it) |   |   
| src/pages/Home.jsx:258 | Small collection cards | alt={card.title} (already has it) |   |   
| src/pages/Home.jsx:340 | Owner image | alt="Madan Mohan Mishra, Founder & Owner" |   |   
| src/components/Footer.jsx | Logo if present | Verify alt text |   |   
| src/components/ProductCard.jsx:40 | Product image | Already has alt={product.name} ✓ |   |   
   
**Step 7.2 — Add skip-to-content link**  
1. Add at the top of Layout component in src/App.jsx:67:  
function Layout() {  
     return (  
         <div className="min-h-screen bg-hero-gradient text-slate-900">  
             <a  
                 href="#main-content"  
                 className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg"  
             >  
                 Skip to content  
             </a>  
             <ScrollToTop />  
             <Navbar />  
             {/* ... */}  
             <main id="main-content">  
                 {/* ... */}  
             </main>  
         </div>  
     );  
 }  
   
**Step 7.3 — Fix eslint-disable**  
src/context/AuthContext.jsx:72 has:  
}, []); // eslint-disable-line react-hooks/exhaustive-deps  
   
**Fix:** The empty dependency array is intentional (run once on mount). Add a proper comment:  
}, []); // Run once on mount — scheduleTokenRefresh is stable  
   
Or restructure to avoid the disable entirely by moving scheduleTokenRefresh into the effect.  
**Step 7.4 — Move **collectionCards ** to **data/store.js  
1. Move the collectionCards array from src/pages/Home.jsx:11-43 to src/data/store.js  
2. Import in Home page:  
import { trustBadges, howItWorksSteps, collectionCards } from '../data/store';  
   
**Step 7.5 — Extract Navbar link constants**  
1. Create src/constants/navigation.js:  
import { Pill, FileText, Info, HelpCircle, Phone } from 'lucide-react';  
   
 export const shoppingLinks = [  
     { label: 'Products', to: '/products', icon: Pill },  
     { label: 'Prescription', to: '/prescription', icon: FileText },  
 ];  
   
 export const supportLinks = [  
     { label: 'About', to: '/about', icon: Info },  
     { label: 'FAQ', to: '/faq', icon: HelpCircle },  
     { label: 'Contact', to: '/contact', icon: Phone },  
 ];  
   
1. Import in Navbar.jsx and MobileDrawer.jsx  
**Verification:**  
- Run npm run build  
- Test keyboard navigation — Tab through the page, verify skip link appears  
- Verify all images have alt text (audit with browser dev tools)  
- Verify no console warnings about missing alt attributes  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OMQ2AABAAsSPBCj7fFwtCmJHAjAU2QtIq6DIzW7UHAMBfnGt1V8fHEQAA3rsexOkF3va0dq8AAAAASUVORK5CYII=)  
**Implementation Order**  
Week 1:  
 ├── Day 1: Phase 1 (Eliminate Duplication) — foundation  
 ├── Day 2: Phase 6 (Infrastructure) + Phase 7 (Quality) — independent fixes  
 └── Day 3: Phase 2 (Consolidate Validation)  
   
 Week 2:  
 ├── Day 1: Phase 4 (Decompose Navbar) — independent  
 ├── Day 2: Phase 3 (Refactor Admin Pages) — largest effort  
 └── Day 3: Phase 5 (Extract Page-Level Hooks) + final testing  
   
**Recommended execution order:**  
| | | | | |  
|-|-|-|-|-|  
| **Order** | **Phase** | **Depends On** | **Risk** | **Effort** |   
| 1 | Phase 1: Eliminate Duplication | None | Low | 1-2h |   
| 2 | Phase 6: Improve Infrastructure | None | Low | 1-2h |   
| 3 | Phase 7: Code Quality | None | Low | 1-2h |   
| 4 | Phase 2: Consolidate Validation | Phase 1 | Low | 1-2h |   
| 5 | Phase 4: Decompose Navbar | None | Low | 2-3h |   
| 6 | Phase 3: Refactor Admin Pages | Phase 1 | Medium | 4-6h |   
| 7 | Phase 5: Extract Page-Level Hooks | Phase 2 | Medium | 3-4h |   
   
**Why this order:**  
- Phase 1 first because everything depends on clean imports  
- Phase 6 and 7 are independent quick wins  
- Phase 2 after Phase 1 because it needs the consolidated parseZodError  
- Phase 4 is independent and provides visible improvement  
- Phase 3 and 5 are the largest efforts, done last when the foundation is solid  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OQQ2AQBAAsSHhiQI0IWp9ngBsYIEfIWkVdJuZs5oAAPiLe6+O6vp6AgDAa+sBhYwEOqBD7p8AAAAASUVORK5CYII=)  
**Risk Assessment**  
| | | |  
|-|-|-|  
| **Phase** | **Risk Level** | **Mitigation** |   
| Phase 1 | Low | File moves only; verify imports compile |   
| Phase 2 | Low | New files + one page refactor; test validation flow |   
| Phase 3 | Medium | Large refactor; test all CRUD operations |   
| Phase 4 | Low | UI extraction; test navigation on desktop and mobile |   
| Phase 5 | Medium | Hook extraction; test all page functionality |   
| Phase 6 | Low | Isolated changes; test each independently |   
| Phase 7 | Low | Additive changes; no breaking risk |   
   
**Rollback Strategy:** Each phase should be a separate git commit. If any phase introduces issues, revert that specific commit.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OMQ2AABAAsSPBCj7fFjsymJHAjAU2QtIq6DIzW7UHAMBfnGt1V8fXEwAAXrsexNkF4H1/HJoAAAAASUVORK5CYII=)  
**Architecture Scores (Current)**  
| | | |  
|-|-|-|  
| **Category** | **Score** | **After Plan** |   
| Folder Structure | 7/10 | 9/10 |   
| Clean Architecture | 6/10 | 8/10 |   
| Separation of Concerns | 6/10 | 8/10 |   
| Components | 6/10 | 8/10 |   
| Pages | 5/10 | 8/10 |   
| API Layer | 8/10 | 9/10 |   
| Services | 8/10 | 8/10 |   
| Hooks | 4/10 | 8/10 |   
| Validation | 5/10 | 9/10 |   
| Notifications | 9/10 | 9/10 |   
| Error Handling | 7/10 | 8/10 |   
| State Management | 7/10 | 8/10 |   
| Performance | 7/10 | 8/10 |   
| Accessibility | 5/10 | 7/10 |   
| Security | 7/10 | 7/10 |   
| Scalability | 6/10 | 8/10 |   
| Maintainability | 5/10 | 8/10 |   
| React Best Practices | 7/10 | 8/10 |   
| Overall Code Quality | 6/10 | 8/10 |   
   
**Overall: 6.2/10 → 8.1/10** (+30% improvement)  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OMQ2AABAAsSNhQAQ60PcrIhnxgQU2QtIq6DIze3UGAMBf3Gu1VcfXEwAAXrseS14EKxPCORkAAAAASUVORK5CYII=)  
   
