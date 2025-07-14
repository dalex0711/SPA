# Event Management SPA (Single Page Application)

This is a front-end project built with **Vite**, **vanilla JavaScript**, and **pure CSS** that simulates a basic event management system. The application has two roles:

- **Admin**: Can create, edit, and delete events.
- **Guest (Visitor)**: Can view and enroll in available events.

The app uses **`localStorage`** for authentication tokens and **JSON Server** as a mock API for backend operations like user login, event creation, and enrollments.

---

## 🔧 Technologies Used

- Vite
- JavaScript (ES Modules)
- CSS (Vanilla)
- JSON Server (mock API)
- LocalStorage for token/session management

---

## 🚀 Installation and Setup

Follow the steps below to run the project on your machine:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Frontend (Vite)

```bash
npm run dev
```

This will run the application at:

```
http://localhost:5173
```

### 4. Start the Mock Backend (JSON Server)

```bash
npm run start:api
```

This will start the API at:

```
http://localhost:3000
```

Make sure the JSON Server is running **before logging in** or performing any data operations.

---

## 👤 Test Users

You can use the following credentials to test the app:

### ✅ Admin

- **Email:** admi@agmail.com  
- **Password:** Admi123

### ✅ Guest

- **Email:** user6@6.com  
- **Password:** User12345

---
```

---

## 📌 Features

### Admin:
- 🔐 Login
- ➕ Create new events
- 📝 Edit existing events
- ❌ Delete events

### Guest:
- 🔐 Login
- 👀 View available events
- ✅ Enroll or unenroll in events

---

## 📁 Project Structure

```
app/
├── controllers/
├── database/
├── services/
├── views/
├── router.js
├── main.js
└── ...
```

---

## 📦 Build for Production

If you want to build the project:

```bash
npm run build
```

And preview the production build locally:

```bash
npm run preview
```

---
