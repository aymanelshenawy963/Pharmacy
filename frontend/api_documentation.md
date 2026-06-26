# Pharmacy Application API Documentation (Admin Dashboard Focus)

This documentation provides comprehensive details of the backend ASP.NET Core API endpoints, request/response models, validation rules, authentication policies, and integration guidelines. It is structured to enable frontend developers and code generators to build a production-ready Admin Dashboard and user interface without direct access to the backend source code.

---

# Authentication & Account API

**Controller:** `AuthController`  
**Base URL:** `/Auth`

---

## User Login

### Purpose
Authenticates user credentials (email and password) and returns JWT access tokens and refresh tokens.

### Endpoint
```http
POST /Auth/login
```

### HTTP Method
`POST`

### Authentication
* Public (No Authorization required)

### Headers
* `Content-Type: application/json`

### Route Parameters
None.

### Query Parameters
None.

### Request DTO
**Type:** `LoginDTO`

| Field | Type | Required | Nullable | Description | Validation |
|---|---|---|---|---|---|
| `Email` | `string` | Yes | No | The user's registered email address. | Required, Must be valid email address format. |
| `Password` | `string` | Yes | No | The user's password. | Required, Must match password regex. |

### Request JSON Example
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

### Response DTO
**Type:** `AuthToReturnDTO`

| Field | Type | Nullable | Description |
|---|---|---|---|
| `Id` | `string` | No | Unique identifier of the authenticated user. |
| `Email` | `string` | Yes | Email address of the user. |
| `FirstName` | `string` | No | First name of the user. |
| `LastName` | `string` | No | Last name of the user. |
| `Token` | `string` | No | The generated JWT Access Token. |
| `ExpiresIn` | `int` | No | Token lifetime/expiry duration in seconds. |
| `RefreshToken` | `string` | No | Token used to renew the expired JWT access token. |
| `RefreshTokenExpiration` | `DateTime` | No | Expiration timestamp of the refresh token. |

### Success Response
**Status:** `200 OK`
```json
{
  "id": "user-uuid-string",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "token": "eyJhbGciOi...",
  "expiresIn": 3600,
  "refreshToken": "abcdef12345...",
  "refreshTokenExpiration": "2026-07-26T17:50:34Z"
}
```

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `401 Unauthorized` | Invalid email or password. | `{"statusCode": 401, "message": "Invalid email or password"}` | Display generic login failure message. |
| `403 Forbidden` | User email is registered but not confirmed. | `{"statusCode": 403, "message": "Email is not confirmed"}` | Redirect user to the Email Confirmation OTP input page. |
| `403 Forbidden` | User account is disabled. | `{"statusCode": 403, "message": "Account is disabled, contact support"}` | Display account disabled notification. |

---

## Refresh Token

### Purpose
Renews an expired JWT access token using a valid, unexpired refresh token.

### Endpoint
```http
POST /Auth/refresh-token
```

### HTTP Method
`POST`

### Authentication
* Public (No Authorization required)

### Headers
* `Content-Type: application/json`

### Route Parameters
None.

### Query Parameters
None.

### Request DTO
**Type:** `RefreshTokenDTO`

| Field | Type | Required | Nullable | Description | Validation |
|---|---|---|---|---|---|
| `Token` | `string` | Yes | No | The expired JWT access token. | Not available in the provided source. |
| `RefreshToken` | `string` | Yes | No | The refresh token associated with the JWT. | Not available in the provided source. |

### Request JSON Example
```json
{
  "token": "eyJhbGciOi...",
  "refreshToken": "abcdef12345..."
}
```

### Response DTO
**Type:** `AuthToReturnDTO` (See structure under Login endpoint).

### Success Response
**Status:** `200 OK`
```json
{
  "id": "user-uuid-string",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "token": "new-eyJhbGciOi...",
  "expiresIn": 3600,
  "refreshToken": "new-abcdef12345...",
  "refreshTokenExpiration": "2026-07-27T17:50:34Z"
}
```

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `401 Unauthorized` | Invalid or expired refresh token. | `{"statusCode": 401, "message": "Invalid refresh token"}` | Prompt user to log in again. Clear cookies/localStorage. |
| `403 Forbidden` | User account is disabled. | `{"statusCode": 403, "message": "Account is disabled, contact support"}` | Redirect user to contact support page. |

---

## Revoke Refresh Token

### Purpose
Revokes/deletes a refresh token, effectively logging the user out.

### Endpoint
```http
PUT /Auth/revoke-refresh-token
```

### HTTP Method
`PUT`

### Authentication
* Public (No Authorization required)

### Headers
* `Content-Type: application/json`

### Route Parameters
None.

### Query Parameters
None.

### Request DTO
**Type:** `RefreshTokenDTO` (See structure under Refresh Token endpoint).

### Request JSON Example
```json
{
  "token": "eyJhbGciOi...",
  "refreshToken": "abcdef12345..."
}
```

### Response DTO
**Type:** `ResponseAPI`

| Field | Type | Nullable | Description |
|---|---|---|---|
| `StatusCode` | `int` | No | HTTP status code matching the response. |
| `Message` | `string` | Yes | Detailed status message. |

### Success Response
**Status:** `200 OK`
```json
{
  "statusCode": 200,
  "message": "Refresh token revoked successfully"
}
```

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `400 Bad Request` | The provided refresh token is invalid. | `{"statusCode": 400, "message": "Invalid refresh token"}` | Show notification and log the error. |

---

## User Registration

### Purpose
Registers a new customer account.

### Endpoint
```http
POST /Auth/register
```

### HTTP Method
`POST`

### Authentication
* Public

### Headers
* `Content-Type: application/json`

### Route Parameters
None.

### Query Parameters
None.

### Request DTO
**Type:** `RegisterDTO`

| Field | Type | Required | Nullable | Description | Validation |
|---|---|---|---|---|---|
| `Email` | `string` | Yes | No | Email address for the account. | Required, Must be valid email address format. |
| `UserName` | `string` | Yes | No | Unique username. | Required, Length: 3-20 characters. |
| `Password` | `string` | Yes | No | Account password. | Required, Must match password regex. |
| `FirstName` | `string` | Yes | No | User's first name. | Required, Length: 3-100 characters. |
| `LastName` | `string` | Yes | No | User's last name. | Required, Length: 3-100 characters. |

### Request JSON Example
```json
{
  "email": "customer@example.com",
  "userName": "customer123",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Response DTO
**Type:** `ResponseAPI` (See structure under Revoke Refresh Token).

### Success Response
**Status:** `200 OK`
```json
{
  "statusCode": 200,
  "message": "Registration successful, please check your email to confirm your account"
}
```

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `400 Bad Request` | Request failed validation constraints. | `{"statusCode": 400, "message": "Username must be between 3 and 20 characters"}` | Highlight invalid fields with validation errors. |
| `409 Conflict` | Email is already registered. | `{"statusCode": 409, "message": "Email is already registered"}` | Show warning that email exists, prompt login. |
| `409 Conflict` | Username is already taken. | `{"statusCode": 409, "message": "Username is already taken"}` | Show username error on form. |

---

## Confirm Email by Token Link

### Purpose
Validates and confirms the user's email address using a query token link (typically consumed from an email activation link).

### Endpoint
```http
GET /Auth/confirm-email
```

### HTTP Method
`GET`

### Authentication
* Public

### Headers
None required.

### Route Parameters
None.

### Query Parameters
**Type:** `ConfirmEmailDTO`

| Name | Type | Required | Description |
|---|---|---|---|
| `UserId` | `string` | Yes | User's unique identifier. |
| `Code` | `string` | Yes | Confirmation token code. |

### Request DTO
**Type:** `ConfirmEmailDTO`

| Field | Type | Required | Nullable | Description | Validation |
|---|---|---|---|---|---|
| `UserId` | `string` | Yes | No | User's unique identifier. | Required (NotEmpty) |
| `Code` | `string` | Yes | No | Confirmation token code. | Required (NotEmpty) |

### Success Response
**Status:** `200 OK`
```json
{
  "statusCode": 200,
  "message": "Email confirmed successfully, you can now log in"
}
```

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `400 Bad Request` | Missing query params or invalid/expired confirmation code. | `{"statusCode": 400, "message": "Invalid code"}` | Display error card and offer resend email code option. |
| `409 Conflict` | Email is already confirmed. | `{"statusCode": 409, "message": "Email is already confirmed"}` | Redirect user to the login screen directly. |

---

## Confirm Email by OTP

### Purpose
Confirms the user's email address by verifying a 6-digit OTP code.

### Endpoint
```http
POST /Auth/confirm-email
```

### HTTP Method
`POST`

### Authentication
* Public

### Headers
* `Content-Type: application/json`

### Route Parameters
None.

### Query Parameters
None.

### Request DTO
**Type:** `ConfirmEmailOtpDTO`

| Field | Type | Required | Nullable | Description | Validation |
|---|---|---|---|---|---|
| `Email` | `string` | Yes | No | Registered email address. | Not available in the provided source. |
| `Code` | `string` | Yes | No | The 6-digit OTP code sent to user email. | Not available in the provided source. |

### Request JSON Example
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

### Response DTO
**Type:** `ResponseAPI` (See structure under Revoke Refresh Token).

### Success Response
**Status:** `200 OK`
```json
{
  "statusCode": 200,
  "message": "Email confirmed successfully, you can now log in"
}
```

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `400 Bad Request` | Invalid or expired OTP code. | `{"statusCode": 400, "message": "Invalid OTP code"}` | Show OTP verification failed alert. |
| `409 Conflict` | Email is already confirmed. | `{"statusCode": 409, "message": "Email is already confirmed"}` | Inform user and redirect to login page. |

---

## Resend Confirmation Email

### Purpose
Resends the confirmation code/link to the user's email address.

### Endpoint
```http
POST /Auth/resend-confirmation-email
```

### HTTP Method
`POST`

### Authentication
* Public

### Headers
* `Content-Type: application/json`

### Route Parameters
None.

### Query Parameters
None.

### Request DTO
**Type:** `ResendConfirmEmailDTO`

| Field | Type | Required | Nullable | Description | Validation |
|---|---|---|---|---|---|
| `Email` | `string` | Yes | No | User's registered email address. | Required, Must be valid email address format. |

### Request JSON Example
```json
{
  "email": "user@example.com"
}
```

### Success Response
**Status:** `200 OK`
**Response Body (Plain Text):**
```text
If your email is registered, you will receive a confirmation email shortly
```

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `409 Conflict` | Email is already confirmed. | `{"statusCode": 409, "message": "Email is already confirmed"}` | Notify user that email is already confirmed. |

---

## Forgot Password (OTP Code request)

### Purpose
Sends a 6-digit OTP code to the user's email to initiate the password reset process.

### Endpoint
```http
POST /Auth/forgot-password
```

### HTTP Method
`POST`

### Authentication
* Public

### Headers
* `Content-Type: application/json`

### Route Parameters
None.

### Query Parameters
None.

### Request DTO
**Type:** `ForgetPasswordDTO`

| Field | Type | Required | Nullable | Description | Validation |
|---|---|---|---|---|---|
| `Email` | `string` | Yes | No | Registered email address. | Required, Must be valid email address format. |

### Request JSON Example
```json
{
  "email": "user@example.com"
}
```

### Response DTO
**Type:** `ResponseAPI` (See structure under Revoke Refresh Token).

### Success Response
**Status:** `200 OK`
```json
{
  "statusCode": 200,
  "message": "Password reset code sent successfully"
}
```

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `400 Bad Request` | User email does not exist. | `{"statusCode": 400, "message": "Email is not registered"}` | Display error stating email is not registered. |
| `401 Unauthorized` | Email is registered but not confirmed. | `{"statusCode": 401, "message": "Email is not confirmed"}` | Redirect user to confirm their email address first. |

---

## Reset Password (using OTP)

### Purpose
Resets the user's password using the OTP code received in email.

### Endpoint
```http
POST /Auth/reset-password
```

### HTTP Method
`POST`

### Authentication
* Public

### Headers
* `Content-Type: application/json`

### Route Parameters
None.

### Query Parameters
None.

### Request DTO
**Type:** `ResetPasswordDTO`

| Field | Type | Required | Nullable | Description | Validation |
|---|---|---|---|---|---|
| `Email` | `string` | Yes | No | Registered email address. | Required, Must be valid email address format. |
| `Code` | `string` | Yes | No | The 6-digit OTP code. | Required (NotEmpty) |
| `NewPassword` | `string` | Yes | No | The new password. | Required, Must match password regex. |

### Request JSON Example
```json
{
  "email": "user@example.com",
  "code": "654321",
  "newPassword": "NewPassword123!"
}
```

### Response DTO
**Type:** `ResponseAPI` (See structure under Revoke Refresh Token).

### Success Response
**Status:** `200 OK`
```json
{
  "statusCode": 200,
  "message": "Password reset successfully"
}
```

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `400 Bad Request` | Code is incorrect, expired, or validation failed. | `{"statusCode": 400, "message": "Invalid password reset code"}` | Display error message on form. |

---

## Frontend Integration Notes (Authentication API)
* **Token Storage:** Save `token` and `refreshToken` in secure cookies or fallback to `localStorage`.
* **Token Refresh Interceptor:** Configure Axios/Fetch interceptor to automatically hit `/Auth/refresh-token` when a `401 Unauthorized` status is received on authenticated requests.
* **Lockout/Disabled Handling:** If a user receives a `403 Forbidden` response with a message containing `"disabled"`, redirect them immediately to a customized screen informing them that support must unlock it.

---

## Validation Rules
### Client-side validation:
* **Email:** Standard email regex patterns.
* **Username:** Length 3-20 characters.
* **Password Regex:** Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character (Regex: `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#_\-])[A-Za-z\d@$!%*?&^#_\-]{8,}$`).

### Server-side validation:
* Implemented via FluentValidation (`LoginDTOValidator`, `RegisterDTOValidator`, `ForgetPasswordDTOValidator`, `ResetPasswordDTOValidator`, `ResendConfirmEmailDTOValidator`, `ConfirmEmailDTOValidator`).

---

## CRUD Operation Mapping
* **Create:** Register customer (`POST /Auth/register`)
* **Read:** None (Except checking confirmation status/OTP verification)
* **Update:** Password reset (`POST /Auth/reset-password`), revocation (`PUT /Auth/revoke-refresh-token`)
* **Delete:** None

---

## Feature Summary (AuthController)

| Feature | Endpoint | Method | Auth | Admin Page |
|---|---|---|---|---|
| User Login | `/Auth/login` | `POST` | Public | Login Page |
| Refresh Token | `/Auth/refresh-token` | `POST` | Public | None (Global Hook) |
| Revoke Refresh Token | `/Auth/revoke-refresh-token` | `PUT` | Public | Logout Action |
| Register Account | `/Auth/register` | `POST` | Public | Register Page |
| Confirm Email (Link) | `/Auth/confirm-email` | `GET` | Public | Email Confirmation Landing |
| Confirm Email (OTP) | `/Auth/confirm-email` | `POST` | Public | OTP Verification Page |
| Resend Confirm Email | `/Auth/resend-confirmation-email` | `POST` | Public | OTP/Register Page |
| Forgot Password | `/Auth/forgot-password` | `POST` | Public | Forgot Password Page |
| Reset Password | `/Auth/reset-password` | `POST` | Public | Reset Password Page |

---
---

# User Account Profile API

**Controller:** `AccountController`  
**Base URL:** `/me`

---

## Get Logged-in Profile

### Purpose
Retrieves details of the currently logged-in user profile.

### Endpoint
```http
GET /me/profile
```

### HTTP Method
`GET`

### Authentication
* JWT Required (`[Authorize]`)

### Headers
* `Authorization: Bearer {token}`

### Route Parameters
None.

### Query Parameters
None.

### Response DTO
**Type:** `UserProfileDTO`

| Field | Type | Nullable | Description |
|---|---|---|---|
| `Email` | `string` | No | User's registered email address. |
| `UserName` | `string` | No | Unique username. |
| `FirstName` | `string` | No | First name of the user. |
| `LastName` | `string` | No | Last name of the user. |

### Success Response
**Status:** `200 OK`
```json
{
  "email": "john.doe@example.com",
  "userName": "johndoe",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `401 Unauthorized` | Missing or invalid JWT bearer token. | `{"statusCode": 401, "message": "Unauthorized"}` | Redirect user to Login page. |

---

## Update Logged-in Profile

### Purpose
Updates the name information of the logged-in user profile.

### Endpoint
```http
PUT /me/update-profile
```

### HTTP Method
`PUT`

### Authentication
* JWT Required (`[Authorize]`)

### Headers
* `Authorization: Bearer {token}`
* `Content-Type: application/json`

### Route Parameters
None.

### Query Parameters
None.

### Request DTO
**Type:** `UpdateProfileDTO`

| Field | Type | Required | Nullable | Description | Validation |
|---|---|---|---|---|---|
| `FirstName` | `string` | Yes | No | First name. | Required, Length: 3-100 characters. |
| `LastName` | `string` | Yes | No | Last name. | Required, Length: 3-100 characters. |

### Request JSON Example
```json
{
  "firstName": "Johnnie",
  "lastName": "Doest"
}
```

### Success Response
**Status:** `204 NoContent`
*(No response body)*

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `400 Bad Request` | First/Last name length constraint violation. | `{"statusCode": 400, "message": "First name must be between 3 and 100 characters"}` | Show validation error below field. |
| `401 Unauthorized` | Missing/expired JWT bearer token. | `{"statusCode": 401, "message": "Unauthorized"}` | Redirect to login page. |

---

## Change Account Password

### Purpose
Changes the password of the logged-in user.

### Endpoint
```http
PUT /me/change-password
```

### HTTP Method
`PUT`

### Authentication
* JWT Required (`[Authorize]`)

### Headers
* `Authorization: Bearer {token}`
* `Content-Type: application/json`

### Route Parameters
None.

### Query Parameters
None.

### Request DTO
**Type:** `ChangePasswordDTO`

| Field | Type | Required | Nullable | Description | Validation |
|---|---|---|---|---|---|
| `CurrentPassword` | `string` | Yes | No | User's active password. | Required. |
| `NewPassword` | `string` | Yes | No | The target new password. | Required, Must match password regex, Must be different from CurrentPassword. |

### Request JSON Example
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

### Success Response
**Status:** `204 NoContent`
*(No response body)*

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `400 Bad Request` | Validation constraints failed or incorrect current password. | `"Incorrect current password"` (plain string or object error) | Show error message on form. |
| `401 Unauthorized` | Missing/expired token. | `{"statusCode": 401, "message": "Unauthorized"}` | Redirect to login page. |

---

## Feature Summary (AccountController)

| Feature | Endpoint | Method | Auth | Admin Page |
|---|---|---|---|---|
| Get Profile | `/me/profile` | `GET` | JWT Required | Profile Settings Page |
| Update Profile | `/me/update-profile` | `PUT` | JWT Required | Profile Settings Page |
| Change Password | `/me/change-password` | `PUT` | JWT Required | Security Settings Page |

---
---

# User Management API

**Controller:** `UsersController`  
**Base URL:** `/api/Users`

---

## Get All Users

### Purpose
Retrieves a list of all registered users in the database.

### Endpoint
```http
GET /api/Users
```

### HTTP Method
`GET`

### Authentication
* JWT Required, Admin Role required (`[Authorize(Roles = "Admin")]`)

### Headers
* `Authorization: Bearer {token}`

### Route Parameters
None.

### Query Parameters
None.

### Response DTO
**Type:** `IEnumerable<UserToReturnDTO>`

| Field | Type | Nullable | Description |
|---|---|---|---|
| `Id` | `string` | No | User's unique identifier. |
| `Email` | `string` | No | Registered email address. |
| `UserName` | `string` | No | Username. |
| `FirstName` | `string` | No | First name. |
| `LastName` | `string` | No | Last name. |
| `IsDisabled` | `bool` | No | States whether user has been disabled by admins. |
| `Roles` | `IEnumerable<string>` | No | List of roles associated with the user. |

### Success Response
**Status:** `200 OK`
```json
[
  {
    "id": "user-uuid-1",
    "email": "admin@pharmacy.com",
    "userName": "admin",
    "firstName": "Super",
    "lastName": "User",
    "isDisabled": false,
    "roles": ["Admin"]
  },
  {
    "id": "user-uuid-2",
    "email": "customer@gmail.com",
    "userName": "cust1",
    "firstName": "John",
    "lastName": "Smith",
    "isDisabled": true,
    "roles": ["Customer"]
  }
]
```

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `401 Unauthorized` | Missing JWT token. | `{"statusCode": 401, "message": "Unauthorized"}` | Redirect to login page. |
| `403 Forbidden` | Non-admin user attempts access. | `{"statusCode": 403, "message": "Forbidden"}` | Show Access Denied message/page. |

---

## Get User by ID

### Purpose
Retrieves profile and system status details of a specific user.

### Endpoint
```http
GET /api/Users/{id}
```

### HTTP Method
`GET`

### Authentication
* JWT Required, Admin Role required (`[Authorize(Roles = "Admin")]`)

### Headers
* `Authorization: Bearer {token}`

### Route Parameters
| Name | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | Yes | Unique identifier of the target user. |

### Query Parameters
None.

### Response DTO
**Type:** `UserToReturnDTO` (See table in Get All Users).

### Success Response
**Status:** `200 OK`
```json
{
  "id": "user-uuid-2",
  "email": "customer@gmail.com",
  "userName": "cust1",
  "firstName": "John",
  "lastName": "Smith",
  "isDisabled": true,
  "roles": ["Customer"]
}
```

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `404 Not Found` | No user exists with the provided ID. | `{"statusCode": 404, "message": "User is not found"}` | Redirect to Users List page, show toast notification. |

---

## Add New User (Admin Action)

### Purpose
Allows administrators to manually add a new system user with specified roles.

### Endpoint
```http
POST /api/Users
```

### HTTP Method
`POST`

### Authentication
* JWT Required, Admin Role required (`[Authorize(Roles = "Admin")]`)

### Headers
* `Authorization: Bearer {token}`
* `Content-Type: application/json`

### Route Parameters
None.

### Query Parameters
None.

### Request DTO
**Type:** `UserDTO`

| Field | Type | Required | Nullable | Description | Validation |
|---|---|---|---|---|---|
| `Email` | `string` | Yes | No | Email address. | Required, Email format. |
| `UserName` | `string` | Yes | No | Username. | Required, Minimum length: 3 characters. |
| `FirstName` | `string` | Yes | No | First Name. | Required. |
| `LastName` | `string` | Yes | No | Last Name. | Required. |
| `Password` | `string` | Yes | No | User's system password. | Required, Must match password regex. |
| `Roles` | `IList<string>` | Yes | No | Roles assigned to this user. | Required, Not empty, no duplicate roles. |

### Request JSON Example
```json
{
  "email": "manager@pharmacy.com",
  "userName": "manager1",
  "password": "Password123!",
  "firstName": "Emma",
  "lastName": "Stone",
  "roles": ["Admin"]
}
```

### Response DTO
**Type:** `ResponseAPI` (See structure under Revoke Refresh Token).

### Success Response
**Status:** `200 OK`
```json
{
  "statusCode": 200,
  "message": "User added successfully"
}
```

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `400 Bad Request` | User validation failed or username/email duplicate. | `{"statusCode": 400, "message": "Username is already taken"}` | Display field-specific validation warning. |

---

## Update User details (Admin Action)

### Purpose
Allows administrators to modify an existing user's details and role associations.

### Endpoint
```http
PUT /api/Users/{id}
```

### HTTP Method
`PUT`

### Authentication
* JWT Required, Admin Role required (`[Authorize(Roles = "Admin")]`)

### Headers
* `Authorization: Bearer {token}`
* `Content-Type: application/json`

### Route Parameters
| Name | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | Yes | Unique ID of user to modify. |

### Query Parameters
None.

### Request DTO
**Type:** `UpdateUserDTO`

| Field | Type | Required | Nullable | Description | Validation |
|---|---|---|---|---|---|
| `Email` | `string` | Yes | No | Email address. | Required, Email format. |
| `UserName` | `string` | Yes | No | Username. | Required, Min Length: 3. |
| `FirstName` | `string` | Yes | No | First name. | Required. |
| `LastName` | `string` | Yes | No | Last name. | Required. |
| `Roles` | `IList<string>` | Yes | No | Assigned role names. | Required, Not empty, No duplicates. |

### Request JSON Example
```json
{
  "email": "manager.new@pharmacy.com",
  "userName": "managernew",
  "firstName": "Emma",
  "lastName": "Watson",
  "roles": ["Admin", "Customer"]
}
```

### Response DTO
**Type:** `ResponseAPI` (See structure under Revoke Refresh Token).

### Success Response
**Status:** `200 OK`
```json
{
  "statusCode": 200,
  "message": "User updated successfully"
}
```

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `400 Bad Request` | Validation constraint violation or duplicate email/username. | `{"statusCode": 400, "message": "You cannot add dupliacated role for the same user"}` | Alert user about specific validation rule that failed. |

---

## Toggle User Status

### Purpose
Disables or enables a user account (toggles active state). Disabled accounts cannot log in.

### Endpoint
```http
PUT /api/Users/{id}/toggle-status
```

### HTTP Method
`PUT`

### Authentication
* JWT Required, Admin Role required (`[Authorize(Roles = "Admin")]`)

### Headers
* `Authorization: Bearer {token}`

### Route Parameters
| Name | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | Yes | Target user's unique identifier. |

### Query Parameters
None.

### Response DTO
Returns an object indicating the success status of the toggle operation.
```json
{
  "isSuccess": true,
  "error": null
}
```

### Success Response
**Status:** `200 OK`
```json
{
  "isSuccess": true,
  "error": null
}
```

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `400 Bad Request` | System was unable to process status toggle. | `{"statusCode": 400, "message": "Failed to toggle user status"}` | Display error dialog notification. |

---

## Unlock Locked-Out User Account

### Purpose
Unlocks a user account locked due to too many failed password attempts.

### Endpoint
```http
PUT /api/Users/{id}/unlock
```

### HTTP Method
`PUT`

### Authentication
* JWT Required, Admin Role required (`[Authorize(Roles = "Admin")]`)

### Headers
* `Authorization: Bearer {token}`

### Route Parameters
| Name | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | Yes | Locked user's unique identifier. |

### Query Parameters
None.

### Response DTO
None.

### Success Response
**Status:** `204 NoContent`
*(No response body)*

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `400 Bad Request` | Account is not locked or does not exist. | `{"statusCode": 400, "message": "User is not locked out"}` | Show action failure toast notification. |

---

## Feature Summary (UsersController)

| Feature | Endpoint | Method | Auth | Admin Page |
|---|---|---|---|---|
| Get All Users | `/api/Users` | `GET` | JWT Admin | Users Admin Page |
| Get User by ID | `/api/Users/{id}` | `GET` | JWT Admin | User Profile Drawer |
| Add User | `/api/Users` | `POST` | JWT Admin | Create User Modal |
| Update User | `/api/Users/{id}` | `PUT` | JWT Admin | Edit User Modal |
| Toggle User Status | `/api/Users/{id}/toggle-status` | `PUT` | JWT Admin | User Table / Actions |
| Unlock User Account | `/api/Users/{id}/unlock` | `PUT` | JWT Admin | User Table / Actions |

---
---

# Role Management API

**Controller:** `RolesController`  
**Base URL:** `/api/Roles`

---

## Get All Roles

### Purpose
Retrieves all roles configured in the Identity database.

### Endpoint
```http
GET /api/Roles
```

### HTTP Method
`GET`

### Authentication
* JWT Required, Admin Role required (`[Authorize(Roles = DefaultRoles.Admin)]`)

### Headers
* `Authorization: Bearer {token}`

### Route Parameters
None.

### Query Parameters
| Name | Type | Required | Description |
|---|---|---|---|
| `includeDisabled` | `bool` | No | Flag indicating whether disabled roles should be returned (default is `false`). |

### Response DTO
**Type:** `IEnumerable<RoleToReturnDTO>`

| Field | Type | Nullable | Description |
|---|---|---|---|
| `Id` | `string` | No | Role unique identifier. |
| `Name` | `string` | No | Role name. |
| `IsDeleted` | `bool` | No | Shows if the role is soft-deleted/disabled. |

### Success Response
**Status:** `200 OK`
```json
[
  {
    "id": "22ea0339-4041-4281-9e76-9124589dd633",
    "name": "Admin",
    "isDeleted": false
  },
  {
    "id": "c70933bd-f3cf-4e7f-83d9-a10f5dc9799f",
    "name": "Customer",
    "isDeleted": false
  }
]
```

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `401 Unauthorized` | Authorization header missing. | `{"statusCode": 401, "message": "Unauthorized"}` | Redirect to login. |
| `403 Forbidden` | Non-admin token used. | `{"statusCode": 403, "message": "Forbidden"}` | Redirect to Access Denied. |

---

## Create Role

### Purpose
Adds a new user role to the system.

### Endpoint
```http
POST /api/Roles
```

### HTTP Method
`POST`

### Authentication
* JWT Required, Admin Role required (`[Authorize(Roles = DefaultRoles.Admin)]`)

### Headers
* `Authorization: Bearer {token}`
* `Content-Type: application/json`

### Route Parameters
None.

### Query Parameters
None.

### Request DTO
**Type:** `RoleDTO`

| Field | Type | Required | Nullable | Description | Validation |
|---|---|---|---|---|---|
| `Name` | `string` | Yes | No | Name of the role. | Required, Length: 3-50 characters. |

### Request JSON Example
```json
{
  "name": "Pharmacist"
}
```

### Response DTO
**Type:** `ResponseAPI` (See structure under Revoke Refresh Token).

### Success Response
**Status:** `200 OK`
```json
{
  "statusCode": 200,
  "message": "Role added successfully"
}
```

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `400 Bad Request` | Role validation rules failed. | `"Role name is too short"` (plain text message) | Alert user of validation failure. |
| `409 Conflict` | Role name already exists. | `"Role already exists"` (plain text message) | Inform user that this role is already registered. |

---

## Update Role

### Purpose
Modifies the name of an existing system role.

### Endpoint
```http
PUT /api/Roles/{id}
```

### HTTP Method
`PUT`

### Authentication
* JWT Required, Admin Role required (`[Authorize(Roles = DefaultRoles.Admin)]`)

### Headers
* `Authorization: Bearer {token}`
* `Content-Type: application/json`

### Route Parameters
| Name | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | Yes | Unique ID of the role. |

### Query Parameters
None.

### Request DTO
**Type:** `RoleDTO` (See Create Role endpoint).

### Request JSON Example
```json
{
  "name": "Lead Pharmacist"
}
```

### Success Response
**Status:** `200 OK`
**Response Body (Plain Text):**
```text
Role is updated successfully
```

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `400 Bad Request` | Invalid payload or validation failure. | `"Role name length invalid"` (plain text message) | Show form validation warning. |
| `404 Not Found` | The specified role ID does not exist. | `"Role not found"` (plain text message) | Close edit mode, refresh list, show toast alert. |

---

## Toggle Role Status

### Purpose
Toggles the deleted/disabled status of a specific role.

### Endpoint
```http
PUT /api/Roles/{id}/toggle-status
```

### HTTP Method
`PUT`

### Authentication
* JWT Required, Admin Role required (`[Authorize(Roles = DefaultRoles.Admin)]`)

### Headers
* `Authorization: Bearer {token}`

### Route Parameters
| Name | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | Yes | Unique ID of the role to toggle. |

### Query Parameters
None.

### Response DTO
None.

### Success Response
**Status:** `204 NoContent`
*(No response body)*

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `400 Bad Request` | Action failed to update in database. | `"Failed to toggle status"` (plain text message) | Notify action failure. |
| `404 Not Found` | Specified role ID not found. | `"Role not found"` (plain text message) | Notify role not found. |

---

## Feature Summary (RolesController)

| Feature | Endpoint | Method | Auth | Admin Page |
|---|---|---|---|---|
| Get All Roles | `/api/Roles` | `GET` | JWT Admin | Roles Admin Page |
| Create Role | `/api/Roles` | `POST` | JWT Admin | Create Role Modal |
| Update Role | `/api/Roles/{id}` | `PUT` | JWT Admin | Edit Role Modal |
| Toggle Role Status | `/api/Roles/{id}/toggle-status` | `PUT` | JWT Admin | Roles Admin Table |

---
---

# Product Category API

**Controller:** `CategoriesController`  
**Base URL:** `/api/Categories`

---

## Get All Categories

### Purpose
Retrieves a complete list of categories.

### Endpoint
```http
GET /api/Categories
```

### HTTP Method
`GET`

### Authentication
* JWT Required, Admin Role required (`[Authorize(Roles = DefaultRoles.Admin)]`)

### Headers
* `Authorization: Bearer {token}`

### Route Parameters
None.

### Query Parameters
None.

### Response DTO
**Type:** `CategoryToReturnDTO`

| Field | Type | Nullable | Description |
|---|---|---|---|
| `Id` | `int` | No | Category identifier. |
| `Name` | `string` | No | Name of category. |
| `Description` | `string` | No | Description details. |

### Success Response
**Status:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Antibiotics",
    "description": "Bacterial infection medications"
  },
  {
    "id": 2,
    "name": "Pain Relief",
    "description": "Pain relief and analgesics"
  }
]
```

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `401 Unauthorized` | Invalid/missing authentication token. | `{"statusCode": 401, "message": "Unauthorized"}` | Redirect user to login page. |
| `403 Forbidden` | Authenticated user is not an Admin. | `{"statusCode": 403, "message": "Forbidden"}` | Redirect to forbidden access landing. |

---

## Get Category by ID

### Purpose
Retrieves information of a specific category by ID.

### Endpoint
```http
GET /api/Categories/{id}
```

### HTTP Method
`GET`

### Authentication
* JWT Required, Admin Role required (`[Authorize(Roles = DefaultRoles.Admin)]`)

### Headers
* `Authorization: Bearer {token}`

### Route Parameters
| Name | Type | Required | Description |
|---|---|---|---|
| `id` | `int` | Yes | Unique identifier of the category. |

### Query Parameters
None.

### Response DTO
**Type:** `CategoryToReturnDTO` (See structural description under Get All Categories).

### Success Response
**Status:** `200 OK`
```json
{
  "id": 1,
  "name": "Antibiotics",
  "description": "Bacterial infection medications"
}
```

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `404 Not Found` | Category ID does not exist. | `{"statusCode": 404, "message": "Category with ID 99 not found"}` | Direct to list page, display toast error message. |

---

## Create Category

### Purpose
Creates a new category for products.

### Endpoint
```http
POST /api/Categories
```

### HTTP Method
`POST`

### Authentication
* JWT Required, Admin Role required (`[Authorize(Roles = DefaultRoles.Admin)]`)

### Headers
* `Authorization: Bearer {token}`
* `Content-Type: application/json`

### Route Parameters
None.

### Query Parameters
None.

### Request DTO
**Type:** `CategoryDTO`

| Field | Type | Required | Nullable | Description | Validation |
|---|---|---|---|---|---|
| `Name` | `string` | Yes | No | Name of the category. | Not available in the provided source. |
| `Description` | `string` | Yes | No | Description. | Not available in the provided source. |

### Request JSON Example
```json
{
  "name": "Vitamins & Supplements",
  "description": "Daily multivitamin packs and mineral capsules"
}
```

### Response DTO
**Type:** `CategoryToReturnDTO` (See structural description under Get All Categories).

### Success Response
**Status:** `201 Created`
**Headers:** `Location: /api/Categories/{id}`
```json
{
  "id": 3,
  "name": "Vitamins & Supplements",
  "description": "Daily multivitamin packs and mineral capsules"
}
```

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `400 Bad Request` | Request parsing or data issue. | `{"statusCode": 400, "message": "Bad Request"}` | Display form error notification. |

---

## Update Category

### Purpose
Modifies properties of an existing category.

### Endpoint
```http
PUT /api/Categories/{id}
```

### HTTP Method
`PUT`

### Authentication
* JWT Required, Admin Role required (`[Authorize(Roles = DefaultRoles.Admin)]`)

### Headers
* `Authorization: Bearer {token}`
* `Content-Type: application/json`

### Route Parameters
| Name | Type | Required | Description |
|---|---|---|---|
| `id` | `int` | Yes | Category unique identifier. |

### Query Parameters
None.

### Request DTO
**Type:** `CategoryDTO` (See structure in Create Category).

### Request JSON Example
```json
{
  "name": "Vitamins & Minerals",
  "description": "Vitamins, minerals, dietary supplements"
}
```

### Success Response
**Status:** `204 NoContent`
*(No response body)*

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `404 Not Found` | The targeted category ID is not registered. | `{"statusCode": 404, "message": "Category with ID 99 not found"}` | Show toast notification, close edit modal. |

---

## Delete Category

### Purpose
Deletes a category from the database.

### Endpoint
```http
DELETE /api/Categories/{id}
```

### HTTP Method
`DELETE`

### Authentication
* JWT Required, Admin Role required (`[Authorize(Roles = DefaultRoles.Admin)]`)

### Headers
* `Authorization: Bearer {token}`

### Route Parameters
| Name | Type | Required | Description |
|---|---|---|---|
| `id` | `int` | Yes | Category unique identifier. |

### Query Parameters
None.

### Response DTO
None.

### Success Response
**Status:** `204 NoContent`
*(No response body)*

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `404 Not Found` | Category ID not found. | `{"statusCode": 404, "message": "Category with ID 99 not found"}` | Notify user category doesn't exist. |

---

## Feature Summary (CategoriesController)

| Feature | Endpoint | Method | Auth | Admin Page |
|---|---|---|---|---|
| Get All Categories | `/api/Categories` | `GET` | JWT Admin | Categories Page |
| Get Category by ID | `/api/Categories/{id}` | `GET` | JWT Admin | Category details Drawer |
| Create Category | `/api/Categories` | `POST` | JWT Admin | Add Category Modal |
| Update Category | `/api/Categories/{id}` | `PUT` | JWT Admin | Edit Category Modal |
| Delete Category | `/api/Categories/{id}` | `DELETE` | JWT Admin | Delete Confirmation Dialog |

---
---

# Product Management API

**Controller:** `ProductsController`  
**Base URL:** `/api/Products`

---

## Get All Products (Paginated)

### Purpose
Retrieves a list of products supporting dynamic searches, category filters, and sorting.

### Endpoint
```http
GET /api/Products
```

### HTTP Method
`GET`

### Authentication
* Public (No Authorization required)

### Headers
None required.

### Route Parameters
None.

### Query Parameters
**Type:** `ProductParams`

| Name | Type | Required | Description |
|---|---|---|---|
| `Sort` | `string` | No | Sorting field key. Permissible options: `priceasc`, `pricedesc`, `nameasc`, `namedesc`. |
| `CategoryId` | `int` | No | Restricts query matches to products under this category identifier. |
| `Search` | `string` | No | String matched against product `Name` and `Description`. Supports keyword splits on spaces. |
| `PageSize` | `int` | No | Items count per page (Defaults to `3`, Maximum value is `6`). |
| `PageNumber` | `int` | No | The target page index (Defaults to `1`, Minimum value is `1`). |

### Response DTO
**Type:** `Pagination<ProductToReturnDTO>`

| Field | Type | Nullable | Description |
|---|---|---|---|
| `pageIndex` | `int` | No | Current index page number. |
| `pageSize` | `int` | No | Active page item limit. |
| `totalCount` | `int` | No | Overall matching record count. |
| `totalPages` | `int` | No | Calculated dynamic page count total. |
| `data` | `IEnumerable<ProductToReturnDTO>` | No | The page data items list containing matches. |

Nested item inside `data` (Type: `ProductToReturnDTO`):

| Field | Type | Nullable | Description |
|---|---|---|---|
| `Id` | `int` | No | Unique product code identifier. |
| `Name` | `string` | No | Product Name. |
| `Description` | `string` | No | Product Description text. |
| `NewPrice` | `decimal` | No | Current Selling Price. |
| `OldPrice` | `decimal` | No | Historical/Original retail price. |
| `Stock` | `int` | No | Available units in inventory. |
| `RequiresPrescription` | `bool` | No | Flag indicating if prescription authorization is mandated. |
| `HasStrips` | `bool` | No | True if product is sold in individual strip packs. |
| `StripCount` | `int?` | Yes | Count of strips included per package unit. |
| `TopSelling` | `bool` | No | Highlights if item is a top-selling favorite. |
| `CategoryName` | `string` | No | Name of category association. |
| `Photos` | `List<string>` | No | File paths/URLs corresponding to product images. |

### Success Response
**Status:** `200 OK`
```json
{
  "pageIndex": 1,
  "pageSize": 3,
  "totalCount": 10,
  "totalPages": 4,
  "data": [
    {
      "id": 1,
      "name": "Amoxicillin 500mg",
      "description": "Broad spectrum bacterial antibiotic capsule",
      "newPrice": 12.50,
      "oldPrice": 15.00,
      "stock": 142,
      "requiresPrescription": true,
      "hasStrips": true,
      "stripCount": 3,
      "topSelling": true,
      "categoryName": "Antibiotics",
      "photos": ["uploads/products/amox_1.jpg"]
    }
  ]
}
```

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `400 Bad Request` | Malformed parameter formatting. | `{"statusCode": 400, "message": "Bad Request"}` | Display standard error notice. |

---

## Get Product by ID

### Purpose
Retrieves detailed information of a single product.

### Endpoint
```http
GET /api/Products/{id}
```

### HTTP Method
`GET`

### Authentication
* Public (No Authorization required)

### Headers
None.

### Route Parameters
| Name | Type | Required | Description |
|---|---|---|---|
| `id` | `int` | Yes | Target product database index identifier. |

### Query Parameters
None.

### Response DTO
**Type:** `ProductToReturnDTO` (See structural definition under Get All Products endpoint).

### Success Response
**Status:** `200 OK`
```json
{
  "id": 1,
  "name": "Amoxicillin 500mg",
  "description": "Broad spectrum bacterial antibiotic capsule",
  "newPrice": 12.50,
  "oldPrice": 15.00,
  "stock": 142,
  "requiresPrescription": true,
  "hasStrips": true,
  "stripCount": 3,
  "topSelling": true,
  "categoryName": "Antibiotics",
  "photos": ["uploads/products/amox_1.jpg"]
}
```

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `404 Not Found` | Specified product identifier does not exist. | `{"statusCode": 404, "message": "Not Found"}` | Alert user product does not exist, redirect to listings. |

---

## Create Product

### Purpose
Creates a new product record. Handles image file uploads using multi-part forms.

### Endpoint
```http
POST /api/Products
```

### HTTP Method
`POST`

### Authentication
* Public (No Authorization attribute present in the controller)

### Headers
* `Content-Type: multipart/form-data`

### Route Parameters
None.

### Query Parameters
None.

### Request DTO
**Type:** `ProductDTO` (Submitted via Form Fields)

| Field | Type | Required | Nullable | Description | Validation |
|---|---|---|---|---|---|
| `Name` | `string` | Yes | No | Name of product. | Not available in the provided source. |
| `Description` | `string` | Yes | No | Detailed description. | Not available in the provided source. |
| `NewPrice` | `decimal` | Yes | No | Current retail cost. | Not available in the provided source. |
| `OldPrice` | `decimal` | Yes | No | Normal/Original retail cost. | Not available in the provided source. |
| `Stock` | `int` | Yes | No | Units in stock. | Not available in the provided source. |
| `RequiresPrescription` | `bool` | Yes | No | Flag indicating if prescription is needed. | Not available in the provided source. |
| `HasStrips` | `bool` | Yes | No | States whether product is strip-based. | Not available in the provided source. |
| `StripCount` | `int?` | No | Yes | Strips count details inside package. | Not available in the provided source. |
| `TopSelling` | `bool` | Yes | No | Highlight item status. | Not available in the provided source. |
| `CategoryId` | `int` | Yes | No | Target category identifier. | Not available in the provided source. |
| `Photos` | `IFormFileCollection` | No | Yes | File collection uploaded as attachments. | Not available in the provided source. |

### Request payload (multipart/form-data) Example
Represented as key-value pairs submitted in form payload:
* `Name`: Panadol Extra
* `Description`: Fast effective pain relief
* `NewPrice`: 5.20
* `OldPrice`: 6.50
* `Stock`: 250
* `RequiresPrescription`: false
* `HasStrips`: true
* `StripCount`: 2
* `TopSelling`: true
* `CategoryId`: 2
* `Photos`: [binary image file data]

### Response DTO
**Type:** `ProductToReturnDTO` (See structural definition under Get All Products endpoint).

### Success Response
**Status:** `201 Created`
**Headers:** `Location: /api/Products/{id}`
```json
{
  "id": 11,
  "name": "Panadol Extra",
  "description": "Fast effective pain relief",
  "newPrice": 5.20,
  "oldPrice": 6.50,
  "stock": 250,
  "requiresPrescription": false,
  "hasStrips": true,
  "stripCount": 2,
  "topSelling": true,
  "categoryName": "Pain Relief",
  "photos": ["uploads/products/panadol_1.jpg"]
}
```

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `400 Bad Request` | Invalid payload parameter conversions or file validation issues. | `{"statusCode": 400, "message": "Bad Request"}` | Present message warning user. |

---

## Update Product

### Purpose
Modifies properties and updates images of an existing product. 

> [!WARNING]
> Calling this updates all properties. Old images uploaded on the server are deleted and replaced with the newly uploaded file set.

### Endpoint
```http
PUT /api/Products/{id}
```

### HTTP Method
`PUT`

### Authentication
* Public (No Authorization attribute present in the controller)

### Headers
* `Content-Type: multipart/form-data`

### Route Parameters
| Name | Type | Required | Description |
|---|---|---|---|
| `id` | `int` | Yes | Target product database index identifier. |

### Query Parameters
None.

### Request DTO
**Type:** `ProductDTO` (Submitted via Form Fields - See details in Create Product).

### Success Response
**Status:** `204 NoContent`
*(No response body)*

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `404 Not Found` | The specified product identifier could not be located. | `{"statusCode": 404, "message": "Not Found"}` | Notify user product does not exist, cancel modification. |

---

## Delete Product

### Purpose
Deletes a product and cleans up its associated photo files from the server.

### Endpoint
```http
DELETE /api/Products/{id}
```

### HTTP Method
`DELETE`

### Authentication
* Public (No Authorization attribute present in the controller)

### Headers
None.

### Route Parameters
| Name | Type | Required | Description |
|---|---|---|---|
| `id` | `int` | Yes | Target product database index identifier. |

### Query Parameters
None.

### Response DTO
None.

### Success Response
**Status:** `204 NoContent`
*(No response body)*

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `404 Not Found` | Product ID not found. | `{"statusCode": 404, "message": "Not Found"}` | Notify user product was already deleted or doesn't exist. |

---

## Pagination
* **Page Indexing:** Page indices are 1-based (i.e. `PageNumber` starts at `1`).
* **Page Bounds:** Minimum page index is `1` (lesser requests resolve to `1`). Default page size is `3` and maximum is hardcapped at `6`.
* **Frontend Implementation:** The dashboard Table pagination toolbar must calculate `totalPages = Math.ceil(totalCount / pageSize)`. Toggle buttons for `hasNext` and `hasPrevious` should be conditioned as:
  * `hasPrevious = pageIndex > 1`
  * `hasNext = pageIndex < totalPages`

---

## Filtering
* **Category Filter:** Filter sidebar component must trigger requests passing `CategoryId` as a query parameter when selected.
* **Prescription/Strips/TopSelling:** Not supported directly as root parameters on backend query filter. Frontend needs to fetch full lists or filter client-side if needed, since the backend `ProductParams` only supports filtering by `CategoryId` and keyword `Search`.

---

## Sorting
Sorting keys must be passed to the `Sort` query parameter:
* `priceasc` -> Sorts ascending by current selling price (`NewPrice`).
* `pricedesc` -> Sorts descending by current selling price (`NewPrice`).
* `nameasc` -> Sorts alphabetically A-Z.
* `namedesc` -> Sorts reverse-alphabetically Z-A.

---

## Searching
* **Search Parameter:** Passes text query keyword string to `Search` query parameter.
* **Match Logic:** The backend splits search queries on space characters and performs case-insensitive containment matches across BOTH the `Name` and `Description` columns (`x.Name.Contains(word) || x.Description.Contains(word)`).
* **Debounce recommendation:** Frontend search inputs should utilize a **300ms debounce** timer before triggering API calls to minimize database loads.

---

## File Upload
* **Multipart Requests:** Creates/updates require uploading via `multipart/form-data`.
* **Parameter Binding:** Request bindings expect files attached under form parameter key `Photos`.
* **Accepted Formats / File limits:** Not available in the provided source.

---

## Frontend Integration Notes (Products API)
* **Creating/Editing Products:** Ensure you package properties inside a `FormData` instance (e.g. `const data = new FormData()`). Convert boolean values to strings/numbers as required by browser form-data standard.
* **File Upload Inputs:** Use an drag-and-drop file uploader component supporting multiple file selections, previewing images locally before hitting submit.

---

## CRUD Operation Mapping
* **Create:** Add product (`POST /api/Products`)
* **Read:** List (`GET /api/Products`), Details (`GET /api/Products/{id}`)
* **Update:** Edit product (`PUT /api/Products/{id}`)
* **Delete:** Remove product (`DELETE /api/Products/{id}`)

---

## Feature Summary (ProductsController)

| Feature | Endpoint | Method | Auth | Admin Page |
|---|---|---|---|---|
| Get All Products | `/api/Products` | `GET` | Public | Products List Page |
| Get Product by ID | `/api/Products/{id}` | `GET` | Public | Product Details Page |
| Create Product | `/api/Products` | `POST` | Public | Add Product Form |
| Update Product | `/api/Products/{id}` | `PUT` | Public | Edit Product Form |
| Delete Product | `/api/Products/{id}` | `DELETE` | Public | Products List Table |

---
---

# Basket API

**Controller:** `BasketsController`  
**Base URL:** `/api/Baskets`

---

## Get Basket by ID

### Purpose
Retrieves a customer shopping basket using its unique basket ID.

### Endpoint
```http
GET /api/Baskets/{id}
```

### HTTP Method
`GET`

### Authentication
* JWT Required, Customer Role required (`[Authorize(Roles = DefaultRoles.Customer)]`)

### Headers
* `Authorization: Bearer {token}`

### Route Parameters
| Name | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | Yes | Unique string identifier of the customer basket. |

### Query Parameters
None.

### Response DTO
**Type:** `Basket`

| Field | Type | Nullable | Description |
|---|---|---|---|
| `Id` | `string` | No | Unique basket identifier string. |
| `PaymentIntentId` | `string` | Yes | Stripe payment intent identifier. |
| `ClientSecret` | `string` | Yes | Client secret used for checkout verification. |
| `Items` | `List<BasketItem>` | No | List of item contents added to the basket. |

Nested item structure `BasketItem`:

| Field | Type | Nullable | Description |
|---|---|---|---|
| `ProductId` | `int` | No | Unique database identifier of the product. |
| `ProductName` | `string` | No | Product Name. |
| `Description` | `string` | No | Product Description. |
| `Image` | `string` | No | Relative URL/filename of the product photo. |
| `Price` | `decimal` | No | Unit price of the product when added to the basket. |
| `Quantity` | `int` | No | Target quantity selected by the user. |
| `Category` | `string` | No | Category name of the product. |

### Success Response
**Status:** `200 OK`
```json
{
  "id": "basket-uuid-string",
  "paymentIntentId": "pi_1234567890",
  "clientSecret": "secret_abc123",
  "items": [
    {
      "productId": 1,
      "productName": "Amoxicillin 500mg",
      "description": "Broad spectrum antibiotic",
      "image": "uploads/products/amox_1.jpg",
      "price": 12.50,
      "quantity": 2,
      "category": "Antibiotics"
    }
  ]
}
```
*Note: If the requested basket ID is not found, the server automatically returns a fresh, empty basket object with status `200 OK`.*

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `401 Unauthorized` | Invalid/missing authentication token. | `{"statusCode": 401, "message": "Unauthorized"}` | Redirect user to login page. |
| `403 Forbidden` | Authenticated user is not a Customer. | `{"statusCode": 403, "message": "Forbidden"}` | Show restricted message. |

---

## Add or Update Basket

### Purpose
Saves or modifies the basket items list under a specific basket identifier.

### Endpoint
```http
POST /api/Baskets
```

### HTTP Method
`POST`

### Authentication
* JWT Required, Customer Role required (`[Authorize(Roles = DefaultRoles.Customer)]`)

### Headers
* `Authorization: Bearer {token}`
* `Content-Type: application/json`

### Route Parameters
None.

### Query Parameters
None.

### Request DTO
**Type:** `Basket` (See structural definition under Get Basket by ID endpoint).

### Request JSON Example
```json
{
  "id": "basket-uuid-string",
  "paymentIntentId": "pi_1234567890",
  "clientSecret": "secret_abc123",
  "items": [
    {
      "productId": 1,
      "productName": "Amoxicillin 500mg",
      "description": "Broad spectrum antibiotic",
      "image": "uploads/products/amox_1.jpg",
      "price": 12.50,
      "quantity": 3,
      "category": "Antibiotics"
    }
  ]
}
```

### Response DTO
**Type:** `Basket` (See structural definition under Get Basket by ID endpoint).

### Success Response
**Status:** `200 OK`
```json
{
  "id": "basket-uuid-string",
  "paymentIntentId": "pi_1234567890",
  "clientSecret": "secret_abc123",
  "items": [
    {
      "productId": 1,
      "productName": "Amoxicillin 500mg",
      "description": "Broad spectrum antibiotic",
      "image": "uploads/products/amox_1.jpg",
      "price": 12.50,
      "quantity": 3,
      "category": "Antibiotics"
    }
  ]
}
```

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `400 Bad Request` | Missing or malformed payload. | `{"statusCode": 400, "message": "Basket is required"}` | Log error, notify user. |

---

## Delete Basket

### Purpose
Deletes a basket session from the system database.

### Endpoint
```http
DELETE /api/Baskets/{id}
```

### HTTP Method
`DELETE`

### Authentication
* JWT Required, Customer Role required (`[Authorize(Roles = DefaultRoles.Customer)]`)

### Headers
* `Authorization: Bearer {token}`

### Route Parameters
| Name | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | Yes | Unique identifier of basket session to delete. |

### Query Parameters
None.

### Response DTO
**Type:** `ResponseAPI` (See structure under Revoke Refresh Token).

### Success Response
**Status:** `200 OK`
```json
{
  "statusCode": 200,
  "message": "Basket deleted"
}
```

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `400 Bad Request` | Empty or whitespace basket ID provided. | `{"statusCode": 400, "message": "Invalid basket id"}` | Log failure, show warning toast. |
| `404 Not Found` | Basket session ID is not found. | `{"statusCode": 404, "message": "Not Found"}` | Log status, clear local state. |

---

## Feature Summary (BasketsController)

| Feature | Endpoint | Method | Auth | Admin Page |
|---|---|---|---|---|
| Get Basket | `/api/Baskets/{id}` | `GET` | JWT Customer | Shopping Cart Checkout |
| Add/Update Basket | `/api/Baskets` | `POST` | JWT Customer | Cart Modifiers |
| Delete Basket | `/api/Baskets/{id}` | `DELETE` | JWT Customer | Checkout / Logout Action |

---
---

# Global Error Handler API

**Controller:** `ErrorController`  
**Base URL:** `/errors/{statusCode}`

---

## Get Error Details

### Purpose
Standardized handler route re-executes error statuses (e.g. 404, 500) and formats a standard `ResponseAPI` error structure.

### Endpoint
```http
GET /errors/{statusCode}
```

### HTTP Method
`GET`

### Authentication
* Public

### Headers
None.

### Route Parameters
| Name | Type | Required | Description |
|---|---|---|---|
| `statusCode` | `int` | Yes | Target HTTP status code. |

### Query Parameters
None.

### Response DTO
**Type:** `ResponseAPI` (See structure under Revoke Refresh Token).

### Success Response
**Status:** Matches `{statusCode}` query (e.g. `404 Not Found`).
```json
{
  "statusCode": 404,
  "message": "Not Found"
}
```

### Error Responses
None.

---
---

# Bug & Troubleshooting API

**Controller:** `BugController`  
**Base URL:** `/api/Bug`

---

## Trigger NotFound Error

### Purpose
Tests endpoint responses for resource not found issues.

### Endpoint
```http
GET /api/Bug/not-found
```

### HTTP Method
`GET`

### Authentication
* Public (Inherits BaseController parameters but overrides authorization attributes)

### Headers
None.

### Route Parameters
None.

### Query Parameters
None.

### Response DTO
**Type:** `Category` (Internal database entity type).

### Success Response
**Status:** `200 OK` (Only if a Category exists with database ID `42`).
```json
{
  "id": 42,
  "name": "Antibiotics",
  "description": "Bacterial infection medications"
}
```

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `404 Not Found` | No Category exists with ID `42`. | *(Empty body)* | Show resource not found banner. |

---

## Trigger Server Error

### Purpose
Triggers a NullReferenceException on backend to test 500 server-side error handlers.

### Endpoint
```http
GET /api/Bug/server-error
```

### HTTP Method
`GET`

### Authentication
* Public

### Headers
None.

### Route Parameters
None.

### Query Parameters
None.

### Response DTO
None.

### Success Response
None (Always throws an unhandled exception).

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `500 Internal Server Error` | NullReferenceException thrown during Category Name assignment. | `{"statusCode": 500, "message": "Object reference not set to an instance of an object", "details": "stacktrace..."}` | Redirect user to standard 500 internal server error page. |

---

## Trigger Bad Request with Parameter

### Purpose
Tests server reaction to parameterized bad requests.

### Endpoint
```http
GET /api/Bug/bad-request/{Id}
```

### HTTP Method
`GET`

### Authentication
* Public

### Headers
None.

### Route Parameters
| Name | Type | Required | Description |
|---|---|---|---|
| `Id` | `int` | Yes | Any integer value. |

### Query Parameters
None.

### Response DTO
None.

### Success Response
**Status:** `200 OK`
*(Empty response body)*

### Error Responses
None.

---

## Trigger Standard Bad Request

### Purpose
Tests responses for 400 Bad Request statuses.

### Endpoint
```http
GET /api/Bug/bad-request
```

### HTTP Method
`GET`

### Authentication
* Public

### Headers
None.

### Route Parameters
None.

### Query Parameters
None.

### Response DTO
None.

### Success Response
None (Always returns `400 BadRequest`).

### Error Responses
| Status | Condition | Response Body | Frontend Action |
|---|---|---|---|
| `400 Bad Request` | Always triggers bad request status response. | `{"statusCode": 400, "message": "Bad Request"}` | Present standard error toast message. |

---
---

# Suggested Frontend Pages

Based on the exposed controllers and their roles, we recommend building the following React routes inside your Admin Dashboard application:

* **Authentication Pages:**
  * **Login Page (`/login`):** Consumes `POST /Auth/login` and handles session token assignments.
  * **Register Page (`/register`):** Consumes `POST /Auth/register`.
  * **OTP Verification Page (`/verify-otp`):** Consumes `POST /Auth/confirm-email` (OTP validation).
  * **Forgot Password Page (`/forgot-password`):** Consumes `POST /Auth/forgot-password`.
  * **Reset Password Page (`/reset-password`):** Consumes `POST /Auth/reset-password`.
* **Dashboard Management Pages (JWT Admin Authorized):**
  * **Users Page (`/admin/users`):** Displays tables list of users (`GET /api/Users`). Contains "Create User" and "Edit User" modals, toggle user disabled status triggers, and unlock action triggers.
  * **Roles Page (`/admin/roles`):** Displays user roles list (`GET /api/Roles`). Supports "Create Role" and "Edit Role" modals, and toggling active/deleted status.
  * **Categories Page (`/admin/categories`):** Renders categories table (`GET /api/Categories`). Supports adding, editing and deleting categories.
  * **Products Page (`/admin/products`):** Renders paginated, filterable, and sortable product table (`GET /api/Products`). Supports creation, updates, and deletes.
* **Account Settings Pages (JWT Authorized):**
  * **Profile Settings Page (`/account/profile`):** Consumes `GET /me/profile` and updates names (`PUT /me/update-profile`).
  * **Security Settings Page (`/account/security`):** Updates passwords via `PUT /me/change-password`.

---

# Suggested React Folder Structure

We suggest organizing your React Admin Dashboard frontend project as follows:

```text
src/
├── assets/                 # Brand logos, images, static styles
├── components/             # Global reusable UI Components
│   ├── ui/                 # Atomic design tokens (Buttons, Inputs, Dialogs, Toasts, Badges)
│   ├── layout/             # Page skeletons (Sidebar, Header, AdminLayout, AuthLayout)
│   └── feedback/           # Loading indicators, skeletal fallbacks, empty states
├── context/                # Context API states (AuthContext, ThemeContext)
├── hooks/                  # Global hooks (useAuth, useLocalStorage, useDebounce)
├── pages/                  # Page container components
│   ├── auth/               # Login, Register, ConfirmEmail, ForgotPassword, ResetPassword
│   ├── profile/            # ProfileSettings, SecuritySettings
│   └── admin/              # UserManagement, RoleManagement, CategoryManagement, ProductManagement
│       ├── components/     # Page-specific components (e.g. ProductForm, UserTable)
│       └── hooks/          # Page-specific hooks (e.g. useProductsQuery)
├── routes/                 # Routing configurations (ProtectedRoute, AppRoutes)
├── services/               # Api backend connectors
│   ├── api.js              # Base Axios instance with auth interceptor config
│   ├── authService.js      # Auth-related requests
│   ├── userService.js      # User management requests
│   ├── roleService.js      # Role management requests
│   ├── categoryService.js  # Category management requests
│   └── productService.js  # Product management requests
├── utils/                  # Helper utilities (formatters, validators)
└── types/                  # TypeScript interface declarations / prop-types mappings
```
