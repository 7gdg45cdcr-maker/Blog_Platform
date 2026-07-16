# Blog_Platform
# Blog Platform with Comments

A full-stack blogging platform where users can create, edit, delete posts and interact through comments.

## 🚀 Features

- User registration, login, and authentication
- Create, edit, delete blog posts
- Comment section for user interaction
- RESTful APIs with database integration
- Responsive design

## 🛠️ Technologies

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas

### Authentication
- JWT (JSON Web Tokens)
- bcryptjs for password hashing

## 🔧 Installation

1. Clone the repository
2. Run `npm install`
3. Create `.env` file with MONGODB_URI and JWT_SECRET
4. Run `npm run dev`
5. Open `frontend/index.html` in your browser

## 📡 API Endpoints

### Auth Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Post Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get all posts |
| GET | `/api/posts/:id` | Get single post |
| POST | `/api/posts` | Create post |
| PUT | `/api/posts/:id` | Update post |
| DELETE | `/api/posts/:id` | Delete post |

### Comment Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/comments/post/:postId` | Get comments for post |
| POST | `/api/comments` | Add comment |
| DELETE | `/api/comments/:id` | Delete comment |

## 📁 Project Structure
blog-platform/
├── backend/
│ ├── config/
│ │ └── db.js
│ ├── middleware/
│ │ └── auth.js
│ ├── models/
│ │ ├── User.js
│ │ ├── Post.js
│ │ └── Comment.js
│ ├── routes/
│ │ ├── auth.js
│ │ ├── posts.js
│ │ └── comments.js
│ └── server.js
├── frontend/
│ ├── css/
│ │ └── style.css
│ ├── js/
│ │ ├── auth.js
│ │ ├── posts.js
│ │ └── comments.js
│ └── index.html
├── .env
├── .gitignore
└── package.json

## 👤 Author

- GitHub: [@7gdg45cdcr-maker](https://github.com/7gdg45cdcr-maker)

## 📄 License

MIT
