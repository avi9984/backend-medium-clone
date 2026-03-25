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

## 🛡️ Security — Kya Use Kiya Hai?

### 1. 🔑 Password Hashing — `bcryptjs`
- User passwords **kabhi bhi plain text mein store nahi hote**.
- Registration pe `bcrypt.hash(password, 10)` se hash banaya jata hai.
- Login pe `bcrypt.compare()` se verify kiya jata hai.
- **Salt rounds = 10** (industry standard).

```js
// Registration
let hasPassword = await bcrypt.hash(password, 10);

// Login verification
const checkPass = await bcrypt.compare(password, user.password);
```

---

### 2. 🎫 JWT Authentication — `jsonwebtoken`
- Login ke baad server ek **JSON Web Token (JWT)** generate karta hai.
- Token **24 ghante** ke liye valid hota hai.
- Har protected route ke aage `isLoggedIn` middleware JWT verify karta hai — `Authorization: Bearer <token>` header se.

```js
// Token generate karna
const token = jwt.sign({ user: { id: user._id } }, process.env.SECRET_KEY, { expiresIn: 86400 });

// Token verify karna (middleware)
jwt.verify(headers, process.env.SECRET_KEY, async (err, decoded) => { ... });
```

---

### 3. 🔒 Password Reset — Crypto (Node.js built-in)
- Reset token **`crypto.randomBytes(32)`** se generate hota hai.
- Woh token **SHA-256 hash** karke DB mein save hota hai (raw token kabhi store nahi).
- Token **1 ghante** mein expire ho jata hai.

```js
const resetToken = crypto.randomBytes(32).toString("hex");
this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
this.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
```

---

### 4. ✅ Account Verification — Crypto Token
- Usi pattern se email verification token banta hai.
- `accountVerificationToken` (hashed) + `accountVerificationExpires` DB mein save hota hai.
- Verified account check karne ke liye `isVerifiedAccount` middleware use hota hai.

---

### 5. 🌐 Environment Variables — `dotenv`
- Sare sensitive credentials `.env` file mein hain — code mein hardcode nahi.
- `.gitignore` mein `.env` add kiya hua hai.

```
SECRET_KEY=...
MONGO_URL=...
RESEND_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

### 6. 🛡️ Role-Based Access Control (RBAC)
- User model mein `role` field hai: `"user"` ya `"admin"`.
- `isLoggedIn` middleware har protected route par lagaya gaya hai.
- `isVerifiedAccount` middleware ensure karta hai ki sirf verified users hi kuch actions le sakein.

---

### 7. 🚫 User Blocking System
- Ek user dusre ko block kar sakta hai.
- Block hone ke baad:
  - Blocked user ka post feed mein **nahi aata**.
  - Blocked user **profile nahi dekh sakta**.
  - Blocked user **follow nahi kar sakta**.

---

### 8. 🔐 CORS — `cors`
- Cross-Origin Resource Sharing configured hai taaki frontend requests accept ho sakein.

---

## 🗄️ MongoDB — Database Setup

### MongoDB Kya Hai?
MongoDB ek **NoSQL document database** hai jisme data JSON-like documents (BSON) mein store hota hai. Yeh flexible schema ke liye best hai — jaise blog posts jinke alag-alag fields ho sakte hain.

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
- **MongoDB** (local ya Atlas Cloud)
- **Cloudinary** account (image upload ke liye)
- **Resend** account (email bhejne ke liye)

---

### Step 1: Repository Clone Karo
```bash
git clone <your-repo-url>
cd backend
```

---

### Step 2: Dependencies Install Karo
```bash
npm install
```

Yeh packages install hongi:

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

### Step 3: Environment Variables Setup Karo
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
1. MongoDB install karo: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. MongoDB service start karo:
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   sudo systemctl start mongod
   ```
3. `.env` mein set karo:
   ```
   MONGO_URL=mongodb://localhost:27017/bloggy-tech
   ```

#### Option B — MongoDB Atlas (Cloud, Free Tier)
1. [https://cloud.mongodb.com](https://cloud.mongodb.com) par account banao
2. Free cluster create karo
3. **Connect > Drivers** se connection string copy karo
4. `.env` mein paste karo:
   ```
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/bloggy-tech?retryWrites=true&w=majority
   ```

---

### Step 5: Cloudinary Setup (Image Upload)
1. [https://cloudinary.com](https://cloudinary.com) par free account banao
2. Dashboard se `Cloud Name`, `API Key`, `API Secret` copy karo
3. `.env` mein paste karo

---

### Step 6: Resend Setup (Email Service)
1. [https://resend.com](https://resend.com) par account banao
2. API Key generate karo
3. `.env` mein paste karo
4. `FROM_EMAIL` set karo (verified domain chahiye production mein)

---

### Step 7: Server Start Karo

#### Development Mode (auto-restart with nodemon)
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

Server chal raha hai:
```
MongoDB is connected
Server is listend on port http://localhost:3000
```

---

## 📡 API Endpoints

### 🔐 Auth / Users — `/api/v1/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | ❌ | User register karo |
| POST | `/login` | ❌ | User login karo, JWT milega |
| GET | `/profile` | ✅ JWT | Apna profile dekho |
| GET | `/other-profile/:id` | ✅ JWT | Dusre ka profile dekho |
| PUT | `/follow/:id` | ✅ JWT | User ko follow karo |
| PUT | `/unfollow/:id` | ✅ JWT | Unfollow karo |
| PUT | `/block/:id` | ✅ JWT | User ko block karo |
| PUT | `/unblock/:id` | ✅ JWT | Unblock karo |
| POST | `/forgot-password` | ❌ | Reset link email pe bhejo |
| POST | `/reset-password/:token` | ❌ | Naya password set karo |
| PUT | `/sent-account-verification-mail` | ✅ JWT | Verification mail bhejo |
| PUT | `/verify-account/:token` | ✅ JWT | Account verify karo |

### 📰 Posts — `/api/v1/posts`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | ✅ JWT + Verified | Post banao (image upload) |
| GET | `/` | ✅ JWT | Saare posts dekho (blocked users filter) |
| GET | `/:id` | ✅ JWT | Post by ID |
| PUT | `/:id` | ✅ JWT | Post update karo |
| DELETE | `/:id` | ✅ JWT | Post delete karo |
| PUT | `/like/:id` | ✅ JWT | Post like karo |
| PUT | `/dislike/:id` | ✅ JWT | Post dislike karo |
| PUT | `/clap/:id` | ✅ JWT | Clap do |
| PUT | `/schedule/:id` | ✅ JWT | Post schedule karo |

### 🏷️ Categories — `/api/v1/categories`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Category create karo |
| GET | `/` | Saari categories |

### 💬 Comments — `/api/v1/comments`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Comment karo |
| DELETE | `/:id` | Comment delete karo |

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
POST /reset-password/:token → Token hash karo → DB se match karo → Expire check
    ↓
Naya password bcrypt hash karo → Save → Token clear karo
```

---

## 📌 Notes

- API versioning: `/api/v1/` prefix use kiya gaya hai future-proofing ke liye.
- Post scheduling feature available hai — future date set karo, post tab dikhega.
- Blocked users ke posts feed mein filter ho jate hain automatically.
- Images Cloudinary par upload hote hain, maximum size `500x500` limit ke saath.
