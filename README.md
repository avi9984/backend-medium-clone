# 📝 BloggyTech — Backend API

A full-featured blogging platform REST API inspired by Medium, built with **Node.js**, **Express.js**, and **MongoDB**.

---

## 🚀 Why Node.js?

| Reason | Explanation |
|---|---|
| **Non-blocking I/O** | Node.js uses an event-driven, asynchronous model — perfect for I/O-heavy tasks like reading from MongoDB, sending emails, and uploading images simultaneously without blocking the server. |
| **JavaScript Everywhere** | Same language on frontend and backend — reduces context switching and allows code sharing (e.g., validation logic). |
| **npm Ecosystem** | Access to a massive library ecosystem: Express, Mongoose, JWT, Bcrypt, Multer, Cloudinary, etc. |
| **Fast for APIs** | Node.js is lightweight and efficient for building RESTful APIs where multiple concurrent requests are handled. |
| **ES Modules Support** | The project uses `"type": "module"` in `package.json`, enabling modern `import/export` syntax natively. |

---

## 🛡️ Security

### 1. 🔑 Password Hashing — `bcryptjs`
- User passwords **password never store in plain text**.
- On Registration `bcrypt.hash(password, 10)` create hash.
- On Login `bcrypt.compare()` verifies the hash.
- **Salt rounds = 10** (industry standard).

```js
// Registration
let hasPassword = await bcrypt.hash(password, 10);

// Login verification
const checkPass = await bcrypt.compare(password, user.password);
```

---

### 2. 🎫 JWT Authentication — `jsonwebtoken`
- After login **JSON Web Token (JWT)** generate.
- Token **24 hours** valid.
- Every protected route uses the `isLoggedIn` middleware to verify JWT.

```js
// Token generate
const token = jwt.sign({ user: { id: user._id } }, process.env.SECRET_KEY, { expiresIn: 86400 });

// Token verify
jwt.verify(headers, process.env.SECRET_KEY, async (err, decoded) => { ... });
```

---

### 3. 🔒 Password Reset — Crypto (Node.js built-in)
- Reset token generated using **`crypto.randomBytes(32)`**.
- Token **SHA-256 hash** before saving to the database.
- Token expires in **1 hour**.

```js
const resetToken = crypto.randomBytes(32).toString("hex");
this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
this.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
```

---

### 4. ✅ Account Verification — Crypto Token
- Uses the same pattern to generate an email verification token.
- `accountVerificationToken` (hashed) and `accountVerificationExpires` are saved in the database.
- The `isVerifiedAccount` middleware checks if the account is verified.

---

### 5. 🌐 Environment Variables — `dotenv`
- All sensitive credentials are stored in a `.env` file.
- `.gitignore` includes `.env` to prevent it from being committed.

```
SECRET_KEY=...
MONGO_URL=...
RESEND_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

### 6. 🛡️ Role-Based Access Control (RBAC)
- The User model has a `role` field: `"user"` or `"admin"`.
- The `isLoggedIn` middleware protects all protected routes.
- The `isVerifiedAccount` middleware ensures only verified users can access certain features.

---

### 7. 🚫 User Blocking System
- One user can block other users like instagram or facebook.
- When a user is blocked:
  - Posts from the blocked user do **not appear** in the feed.
  - The blocked user's **profile is not visible**.
  - The blocked user **cannot be followed**.

---

### 8. 🔐 CORS — `cors`
- Cross-Origin Resource Sharing configured for frontend requests.

---

## 🗄️ MongoDB — Database Setup

### What is MongoDB?
MongoDB is a **NoSQL document database** that stores data in JSON-like documents (BSON). It is ideal for flexible schemas — such as blog posts that may have different fields.

### Collections (Models)

| Collection | File | Description |
|---|---|---|
| `users` | `models/user.js` | Users, roles, followers, blocked users, tokens |
| `posts` | `models/post.js` | Blog posts, likes, dislikes, claps, schedule |
| `categories` | `models/category.js` | Post categories |
| `comments` | `models/comment.js` | Comments on posts |

### User Model Schema (Key Fields)
```
username, email, password (hashed), role (user/admin)
isVerified, accountLevel (bronze/silver/gold)
profilePicture, coverImage, bio, location, gender
profileViewers[], followers[], following[], blockedUsers[]
posts[], likedPosts[]
passwordResetToken, passwordResetExpires
accountVerificationToken, accountVerificationExpires
```

### Post Model Schema
```
title, content, image (Cloudinary URL)
author (ref: User), category (ref: Category)
claps, likes[], dislikes[], comments[]
scheduledPublished, shares, postViews
```

---

## ⚙️ Project Setup — Step by Step

### Prerequisites
- **Node.js** v18+ → [Download](https://nodejs.org)
- **MongoDB** (local or Atlas Cloud)
- **Cloudinary** account (image upload)
- **Resend** account (email)

---

### Step 1: Repository Clone Karo
```bash
git clone https://github.com/avi9984/backend-medium-clone.git
cd backend
```

---

### Step 2: Dependencies Install Karo
```bash
npm install
```

| Package | Purpose |
|---|---|
| `express` | Web framework |
| `mongoose` | MongoDB ODM |
| `bcryptjs` | Password hashing |
| `jsonwebtoken` | JWT auth tokens |
| `dotenv` | Environment variables |
| `cors` | Cross-origin requests |
| `morgan` | HTTP request logging |
| `multer` | File/image upload handling |
| `multer-storage-cloudinary` | Multer + Cloudinary integration |
| `cloudinary` | Cloud image storage |
| `resend` | Email sending service |
| `nodemon` | Auto-restart on file changes (dev) |

---

### Step 3: Environment Variables Setup
Project root mein `.env` file create karo (`.env.example` se copy karo):

```env
# Server
PORT=3000

# MongoDB
MONGO_URL=mongodb://localhost:27017/bloggy-tech
# OR MongoDB Atlas URL:
# MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/bloggy-tech

# JWT Secret (koi bhi strong random string)
SECRET_KEY=your_super_secret_jwt_key_here

# Resend Email Service (https://resend.com)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=noreply@yourdomain.com

# Cloudinary (https://cloudinary.com)
CLOUDINARY_API_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

### Step 4: MongoDB Setup

#### Option A — Local MongoDB
1. Install MongoDB from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   sudo systemctl start mongod
   ```
3. Set the connection string in `MONGO_URL` in `.env`:
   ```
   MONGO_URL=mongodb://localhost:27017/medium-clone
   ```

#### Option B — MongoDB Atlas (Cloud, Free Tier)
1. Create a free account on [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster 
3. Copy connection string from **Connect > Drivers**
4. Paste in `.env`:
   ```
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/<example>?retryWrites=true&w=majority
   ```

---

### Step 5: Cloudinary Setup (Image Upload)
1. Create a free account on [https://cloudinary.com](https://cloudinary.com)
2. Copy `Cloud Name`, `API Key`, `API Secret` from dashboard
3. Paste in `.env`

---

### Step 6: Resend Setup (Email Service)
1. Create a free account on [https://resend.com](https://resend.com)
2. Generate API Key
3. Paste in `.env`
4. Set `FROM_EMAIL` (verified domain required for production)

---

### Step 7: Start the Server

#### Development Mode (auto-restart with nodemon)
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

Server is running:
```
MongoDB is connected
Server is listend on port http://localhost:3000
```

---

## 📡 API Endpoints

### 🔐 Auth / Users — `/api/v1/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | ❌ | User register |
| POST | `/login` | ❌ | User login, JWT |
| GET | `/profile` | ✅ JWT | Apna profile |
| GET | `/other-profile/:id` | ✅ JWT | Other user profile |
| PUT | `/follow/:id` | ✅ JWT | User ko follow |
| PUT | `/unfollow/:id` | ✅ JWT | Unfollow |
| PUT | `/block/:id` | ✅ JWT | User ko block |
| PUT | `/unblock/:id` | ✅ JWT | Unblock |
| POST | `/forgot-password` | ❌ | Reset link email |
| POST | `/reset-password/:token` | ❌ | Naya password set |
| PUT | `/sent-account-verification-mail` | ✅ JWT | Verification mail |
| PUT | `/verify-account/:token` | ✅ JWT | Account verify |

### 📰 Posts — `/api/v1/posts`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | ✅ JWT + Verified | Post create (image upload) |
| GET | `/` | ✅ JWT | Saare posts (blocked users filter) |
| GET | `/:id` | ✅ JWT | Post by ID |
| PUT | `/:id` | ✅ JWT | Post update |
| DELETE | `/:id` | ✅ JWT | Post delete |
| PUT | `/like/:id` | ✅ JWT | Post like |
| PUT | `/dislike/:id` | ✅ JWT | Post dislike |
| PUT | `/clap/:id` | ✅ JWT | Clap do |
| PUT | `/schedule/:id` | ✅ JWT | Post schedule |

### 🏷️ Categories — `/api/v1/categories`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Category create |
| GET | `/` | Saari categories |

### 💬 Comments — `/api/v1/comments`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Comment create |
| DELETE | `/:id` | Comment delete |

---

## 📁 Project Structure

```
backend/
├── index.js                    # Entry point — Express app, MongoDB connect
├── package.json                # Dependencies & scripts
├── .env                        # Environment variables (gitignored)
├── controllers/
│   ├── user.js                 # Auth, profile, follow, block, password reset
│   ├── post.js                 # CRUD, like/dislike/clap, schedule
│   ├── category.js             # Category management
│   └── comment.js              # Comment management
├── models/
│   ├── user.js                 # User schema + crypto token methods
│   ├── post.js                 # Post schema
│   ├── category.js             # Category schema
│   └── comment.js              # Comment schema
├── routes/
│   ├── user.js                 # User routes with middleware
│   ├── post.js                 # Post routes
│   ├── category.js             # Category routes
│   └── comment.js              # Comment routes
├── middlewares/
│   ├── isLoggedIn.js           # JWT verification middleware
│   └── isVerifiedAccount.js    # Account verification check
└── utils/
    ├── generateToken.js        # JWT token generator
    ├── sendEmail.js            # Password reset email (Resend)
    ├── accountVerificationEmail.js  # Verification email
    └── fileUploadingService.js # Cloudinary + Multer config
```

---

## 🔁 Authentication Flow

```
Register → Password hashed (bcrypt) → Stored in MongoDB
    ↓
Login → bcrypt.compare() → JWT Token (24hr) returned
    ↓
Protected Route → isLoggedIn middleware → JWT verified → req.userAuth set
    ↓
(If needed) isVerifiedAccount → Check isVerified field in DB
```

## 🔑 Password Reset Flow

```
POST /forgot-password → crypto token generate → SHA-256 hash DB mein save
    ↓
Email bhejo (Resend) → Reset link with raw token
    ↓
POST /reset-password/:token → Token hash karo → match with DB token → Expire check
    ↓
hash new password → Save → clear token
```

---

## 📌 Notes

- API versioning: `/api/v1/` prefix is used for future-proofing.
- Post scheduling feature is available — set future date, post will be visible at that time.
- Blocked users' posts are automatically filtered out from the feed.
- Images are uploaded to Cloudinary with a maximum size limit of `500x500`.
