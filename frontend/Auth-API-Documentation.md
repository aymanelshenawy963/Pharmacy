**Auth API — Frontend Integration Guide**  
**BaseURl : ** **http://localhost:5223**  
*Base route: * ***/Auth*** * (derived from * *[Route("[controller]")]* * on * *AuthController* *)*  
 *  
 Controller: * *Pharmacy.API.Controllers.AuthController*  
 *  
 All endpoints below are * ***public*** * (no * *[Authorize]* * attribute present) — they are the entry points used * *before* * a client has a JWT.*  
**Conventions used in this document**  
- **ResponseAPI** is referenced throughout the controller (e.g. new ResponseAPI(403, error)) but its class definition wasn't included in the uploaded files. Based on usage, assume the shape:  
- interface ResponseAPI {  
   statusCode: number;  
   message: string;  
 }  
   
-   
 Verify the exact property names/casing against the actual class before wiring up TypeScript types.  
- ResetPasswordDTO.cs itself wasn't uploaded, but its shape is fully inferable from ResetPasswordDTOValidator.cs: { Email, Code, NewPassword }.  
- ChangePasswordDTO / ChangePasswordDTOValidator exist in the codebase but **no controller action consumes them in ** **AuthController**. There is currently no /Auth/change-password (or similar) endpoint to call — flag this to your backend team if a "change password while logged in" feature is expected.  
- Password regex (RegexPatterns.Password) requires: **minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character.** Mirror this exact rule client-side for instant validation feedback before hitting the API.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OQQmAABRAsSd4NIGBzPXBmAawhhW8ibAl2DIze3UGAMBf3Gu1VcfXEwAAXrsehaQEN+8fLHEAAAAASUVORK5CYII=)  
**1. Login**  
| | |  
|-|-|  
|   |   |   
| **URL** | /Auth/login |   
| **Method** | POST |   
| **Auth required** | No |   
   
**Request Headers**  
Content-Type: application/json  
**Query Parameters**  
None  
**Route Parameters**  
None  
**Request Body**  
{  
   "email": "user@example.com",  
   "password": "P@ssword123"  
 }  
   
Validation (LoginDTOValidator):  
- email: required, must be a valid email format  
- password: required, must match the password complexity regex  
**Success Response — **200 OK  
Returns AuthToReturnDTO:  
{  
   "id": "string",  
   "email": "user@example.com",  
   "firstName": "string",  
   "lastName": "string",  
   "token": "jwt-access-token",  
   "expiresIn": 3600,  
   "refreshToken": "string",  
   "refreshTokenExpiration": "2026-07-01T00:00:00Z"  
 }  
   
**Error Responses**  
| | | |  
|-|-|-|  
| **Status** | **Condition** | **Body** |   
| 401 Unauthorized | Invalid credentials (default/generic error) | ResponseAPI(401, error) |   
| 403 Forbidden | "Email is not confirmed" | ResponseAPI(403, error) |   
| 403 Forbidden | "Account is disabled, contact support" | ResponseAPI(403, error) |   
   
**Frontend Integration Notes**  
- On 403 with "Email is not confirmed", route the user to a "resend confirmation email" screen rather than just showing a generic error.  
- Persist token + refreshToken securely (httpOnly cookie ideally; if using localStorage/memory, be aware of XSS exposure). Use expiresIn to schedule a silent refresh.  
- Errors are distinguished **only by string-matching ** **error** on the backend — if the backend wording ever changes, your frontend's conditional UI (e.g. "resend confirmation" prompt) will silently break. Consider asking the backend team for stable error codes instead of relying on string equality long-term.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OQQmAABRAsSeYxKS/kJkED6bwYAVvImwJtszMVu0BAPAXx1rd1fn1BACA164HHDwF+DpPyKwAAAAASUVORK5CYII=)  
**2. Refresh Token**  
| | |  
|-|-|  
|   |   |   
| **URL** | /Auth/refresh-token |   
| **Method** | POST |   
| **Auth required** | No (uses refresh token itself as the credential) |   
   
**Request Headers**  
Content-Type: application/json  
**Query / Route Parameters**  
None  
**Request Body**  
{  
   "token": "expired-or-current-jwt",  
   "refreshToken": "string"  
 }  
   
⚠️ No RefreshTokenDTOValidator was found among the uploaded files — assume **no server-side FluentValidation rules** are applied beyond model binding. Don't rely on the API for empty/format checks here; validate non-empty fields client-side anyway.  
**Success Response — **200 OK  
Returns AuthToReturnDTO (same shape as Login).  
**Error Responses**  
| | | |  
|-|-|-|  
| **Status** | **Condition** | **Body** |   
| 401 Unauthorized | Invalid/expired refresh token (generic) | ResponseAPI(401, error) |   
| 403 Forbidden | "Account is disabled, contact support" | ResponseAPI(403, error) |   
   
**Frontend Integration Notes**  
- This is the endpoint your Axios/Fetch interceptor should call when a protected request returns 401 due to an expired access token.  
- On 401 from *this* endpoint specifically (refresh itself failing), force a full logout/redirect to login — don't retry indefinitely.  
- Update both token and refreshToken in storage after every successful refresh (refresh tokens here appear to rotate, given a new RefreshToken is returned).  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OMQ2AABAAsSNBCUrfD6LYGNDAgAU2QtIq6DIzW7UHAMBfHGt1V+fXEwAAXrseHDAF/orRG+cAAAAASUVORK5CYII=)  
**3. Revoke Refresh Token**  
| | |  
|-|-|  
|   |   |   
| **URL** | /Auth/revoke-refresh-token |   
| **Method** | PUT |   
| **Auth required** | No (token pair acts as credential — though logically this should probably require the access token via Authorization header; not enforced in the code shown) |   
   
**Request Headers**  
Content-Type: application/json  
**Request Body**  
{  
   "token": "string",  
   "refreshToken": "string"  
 }  
   
**Success Response — **200 OK  
{ "statusCode": 200, "message": "Refresh token revoked successfully" }  
   
**Error Responses**  
| | | |  
|-|-|-|  
| **Status** | **Condition** | **Body** |   
| 400 Bad Request | Invalid refresh token | ResponseAPI(400, "Invalid refresh token") |   
   
**Frontend Integration Notes**  
- Call this on explicit user "Logout" action so the refresh token can't be reused if leaked.  
- Clear local/session storage of token/refreshToken immediately on 200, regardless of whether the backend call succeeds, to ensure a responsive logout UX (fire-and-forget is acceptable here).  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVR4nO3OMQ2AABAAsSNBCkJfFSqwwIgHRiywEZJWQZeZ2ao9AAD+4lyruzq+ngAA8Nr1AOH8BeZxN/IIAAAAAElFTkSuQmCC)  
**4. Register**  
| | |  
|-|-|  
|   |   |   
| **URL** | /Auth/register |   
| **Method** | POST |   
| **Auth required** | No |   
   
**Request Headers**  
Content-Type: application/json  
**Request Body**  
{  
   "email": "user@example.com",  
   "userName": "string",  
   "password": "P@ssword123",  
   "firstName": "string",  
   "lastName": "string"  
 }  
   
Validation (RegisterDTOValidator):  
- email: required, valid email format  
- userName: required, length 3–20  
- password: required, complexity regex  
- firstName: required, length 3–100  
- lastName: required, length 3–100  
**Success Response — **200 OK  
{ "statusCode": 200, "message": "Registration successful, please check your email to confirm your account" }  
   
**Error Responses**  
| | | |  
|-|-|-|  
| **Status** | **Condition** | **Body** |   
| 409 Conflict | "Email is already registered" | ResponseAPI(409, error) |   
| 409 Conflict | "Username is already taken" | ResponseAPI(409, error) |   
| 400 Bad Request | Any other failure | ResponseAPI(400, error) |   
   
**Frontend Integration Notes**  
- Mirror the length constraints (username 3–20, first/last name 3–100) in your form validation to avoid a round trip just to discover a length error.  
- After success, route to a "check your email" screen — there is **no token returned here**; the user must confirm their email before they can log in (see Login's 403 "Email is not confirmed" case).  
- 409 on email vs. username are distinguishable by message string — surface field-specific errors (e.g. attach to the email or userName input) rather than a generic toast.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANElEQVR4nO3OMQ0AIAwAwZIgBKnVgjN8dGDBABMhuZt+/JaZIyJmAADwi9VP1NMNAABu1AaU3AUhiyfJeAAAAABJRU5ErkJggg==)  
**5. Confirm Email**  
| | |  
|-|-|  
|   |   |   
| **URL** | /Auth/confirm-email |   
| **Method** | GET |   
| **Auth required** | No |   
   
**Request Headers**  
None required beyond defaults.  
**Query Parameters**  
Bound via [FromQuery] ConfirmEmailDTO:  
   
 | Param | Type | Required |  
   
 |---|---|---|  
   
 | UserId | string | Yes |  
   
 | Code | string | Yes |  
Example: GET /Auth/confirm-email?UserId=abc123&Code=xyz789  
**Route Parameters**  
None  
**Request Body**  
None (GET request)  
**Success Response — **200 OK  
{ "statusCode": 200, "message": "Email confirmed successfully, you can now log in" }  
   
**Error Responses**  
| | | |  
|-|-|-|  
| **Status** | **Condition** | **Body** |   
| 409 Conflict | "Email is already confirmed" | ResponseAPI(409, error) |   
| 400 Bad Request | Any other failure (invalid/expired code, etc.) | ResponseAPI(400, error) |   
   
**Frontend Integration Notes**  
- This is almost always triggered from a link inside the confirmation email (?UserId=...&Code=...), so it's typically hit by a dedicated route/page in your React app (e.g. /confirm-email) that reads UserId/Code from URLSearchParams and immediately fires the request on mount.  
- Treat 409 "Email is already confirmed" as a soft-success in the UI ("Your email is already confirmed — you can log in") rather than an error banner, since the end state the user wants (a confirmed account) is already true.  
- Note the casing: the DTO properties are UserId/Code (PascalCase in C#), but ASP.NET model binding is case-insensitive for query strings, so userId/code from the frontend will bind correctly.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVR4nO3OMQ2AABAAsSNhYMEBIpD4ArCJDyywEZJWQZeZOaorAAD+4l6rrTq/ngAA8Nr+AEqmA1hl45m5AAAAAElFTkSuQmCC)  
**6. Resend Confirmation Email**  
| | |  
|-|-|  
|   |   |   
| **URL** | /Auth/resend-confirmation-email |   
| **Method** | POST |   
| **Auth required** | No |   
   
**Request Headers**  
Content-Type: application/json  
**Request Body**  
{ "email": "user@example.com" }  
   
Validation (ResendConfirmEmailDTOValidator): email required, valid format.  
**Success Response — **200 OK  
⚠️ **Inconsistent with every other endpoint** — this action returns Ok("If your email is registered, you will receive a confirmation email shortly"), i.e. a  **plain string**, not the ResponseAPI wrapper. Don't assume response.data.statusCode/.message here — it will just be response.data as a raw string.  
**Error Responses**  
| | | |  
|-|-|-|  
| **Status** | **Condition** | **Body** |   
| 409 Conflict | Email already confirmed | ResponseAPI(409, error) |   
   
**Frontend Integration Notes**  
- The success message is intentionally vague ("if your email is registered...") to avoid leaking whether an email exists in the system — don't try to infer account existence from this response.  
- Because the success payload shape differs from other endpoints, write a dedicated response handler (or normalize on the backend) rather than reusing a shared ResponseAPI parser for this one call.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OMQ2AUBBAsUfyVTCg9UygEBVsWGAjJK2CbjNzVGcAAPzFtapV7V9PAAB47X4AEWIEM8iQs0EAAAAASUVORK5CYII=)  
**7. Forgot Password**  
| | |  
|-|-|  
|   |   |   
| **URL** | /Auth/forgot-password |   
| **Method** | POST |   
| **Auth required** | No |   
   
**Request Headers**  
Content-Type: application/json  
**Request Body**  
{ "email": "user@example.com" }  
   
Validation (ForgetPasswordDTOValidator): email required, valid format.  
**Success Response — **200 OK  
{ "statusCode": 200, "message": "Password reset code sent successfully" }  
   
**Error Responses**  
| | | |  
|-|-|-|  
| **Status** | **Condition** | **Body** |   
| 401 Unauthorized | "Email is not confirmed" | ResponseAPI(401, error) |   
| 400 Bad Request | Any other failure | ResponseAPI(400, error) |   
   
**Frontend Integration Notes**  
- Unlike "resend confirmation," this endpoint **does** reveal an "email not confirmed" state via 401 — so your forgot-password flow can branch into "please confirm your email first" guidance.  
- On success, navigate to a "reset password" form that expects a Code field (sent to the user's email) plus a new password — see endpoint 8 below.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAM0lEQVR4nO3KsQ0AIRAEsUW6Qij1KvnevhMSYmKQ7GiCGd09k3wBAOAVf+2o4wYAwE1qAdYuAy151mgcAAAAAElFTkSuQmCC)  
**8. Reset Password**  
| | |  
|-|-|  
|   |   |   
| **URL** | /Auth/reset-password |   
| **Method** | POST |   
| **Auth required** | No |   
   
**Request Headers**  
Content-Type: application/json  
**Request Body**  
{  
   "email": "user@example.com",  
   "code": "string",  
   "newPassword": "P@ssword123"  
 }  
   
*Inferred shape — * *ResetPasswordDTO.cs* * was not among the uploaded files, but * *ResetPasswordDTOValidator.cs* * confirms these three properties exist and are validated.*  
Validation (ResetPasswordDTOValidator):  
- email: required, valid email format  
- code: required (the reset code from the "forgot password" email)  
- newPassword: required, must match the password complexity regex  
**Success Response — **200 OK  
{ "statusCode": 200, "message": "Password reset successfully" }  
   
**Error Responses**  
| | | |  
|-|-|-|  
| **Status** | **Condition** | **Body** |   
| 400 Bad Request | Any failure (invalid/expired code, etc.) | ResponseAPI(400, error) |   
   
**Frontend Integration Notes**  
- This endpoint deliberately returns a flat 400 for all failures (no granular status codes like the others) — you'll need to surface error text directly to the user since there's no way to branch UI behavior by status code alone.  
- After success, redirect to the login screen rather than auto-logging in — no token is returned from this call.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OMQ2AUBBAsUfyRTCh9VRgEBGsWGAjJK2CbjNzVGcAAPzFtapV7V9PAAB47X4AEWgEMAY9+pUAAAAASUVORK5CYII=)  
**Summary Table**  
| | | | | |  
|-|-|-|-|-|  
| **#** | **Endpoint** | **Method** | **Auth** | **Body Type** |   
| 1 | /Auth/login | POST | No | LoginDTO |   
| 2 | /Auth/refresh-token | POST | No | RefreshTokenDTO |   
| 3 | /Auth/revoke-refresh-token | PUT | No | RefreshTokenDTO |   
| 4 | /Auth/register | POST | No | RegisterDTO |   
| 5 | /Auth/confirm-email | GET | No | Query: UserId, Code |   
| 6 | /Auth/resend-confirmation-email | POST | No | ResendConfirmEmailDTO |   
| 7 | /Auth/forgot-password | POST | No | ForgetPasswordDTO |   
| 8 | /Auth/reset-password | POST | No | ResetPasswordDTO (inferred) |   
| — | *(not implemented)*change-password | — | — | ChangePasswordDTO exists with a validator but has no controller action in AuthController |   
   
**Suggested shared TypeScript types**  
export interface ResponseAPI {  
   statusCode: number;  
   message: string;  
 }  
   
 export interface AuthToReturnDTO {  
   id: string;  
   email: string | null;  
   firstName: string;  
   lastName: string;  
   token: string;  
   expiresIn: number;  
   refreshToken: string;  
   refreshTokenExpiration: string; // ISO date string  
 }  
   
 export interface LoginRequest {  
   email: string;  
   password: string;  
 }  
   
 export interface RegisterRequest {  
   email: string;  
   userName: string;  
   password: string;  
   firstName: string;  
   lastName: string;  
 }  
   
 export interface RefreshTokenRequest {  
   token: string;  
   refreshToken: string;  
 }  
   
 export interface ForgetPasswordRequest {  
  email: string;  
 }  
   
 export interface ResetPasswordRequest {  
   email: string;  
   code: string;  
   newPassword: string;  
 }  
   
 export interface ResendConfirmEmailRequest {  
   email: string;  
 }  
   
 export interface ConfirmEmailQuery {  
   UserId: string;  
   Code: string;  
 }  
   
**Shared password rule for client-side validation**  
// Mirrors RegexPatterns.Password used across LoginDTOValidator,  
 // RegisterDTOValidator, ChangePasswordDTOValidator, ResetPasswordDTOValidator  
 export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;  
 // Exact pattern should be verified against the actual RegexPatterns.Password  
 // constant in the backend, since its definition wasn't included in the uploaded files.  
   
