✨ Features
➕ Add new todos
✔️ Mark todos as complete/incomplete
🗑️ Delete todos (if implemented)
🔍 Filter todos by status and text search
🔎 Search/filter todos by text input
↕️ Sort todos (e.g., by creation date or status)
⚡ Optimistic UI updates for smooth user experience
🔄 Synchronized with backend API
📱 Fully responsive design (mobile + desktop)
🧠 Debounced input handling for performance optimization

🛠️ Technologies Used
React
Vite
JavaScript (ES6+)
CSS Modules / Custom CSS
Fetch API
React Hooks (useState, useEffect, useMemo, useCallback, useRef)
Node.js backend API (external)

Link to Video Presentation of Todo APP:
https://youtu.be/ly1pxLA5hcI

📸 Screenshots
Desktop View

![Desktop View](https://raw.githubusercontent.com/jonastam93/my-todo-list/main/desktop%20view.png)
Mobile View

![Mobile View](https://raw.githubusercontent.com/jonastam93/my-todo-list/main/mobile%20view.png)

⚙️ Getting Started
Prerequisites

Make sure you have installed:

Node.js (v16+ recommended)
npm or yarn

Installation

# Clone the repository
git clone https://github.com/jonastam93/my-todo-list.git

# Navigate into project directory
cd todo-app

# Install dependencies
npm install

Environment Variables

Create a .env file in the root:
VITE_TARGET=https://your-api-url.com

Start Development Server
npm run dev

App runs on:
http://localhost:3001

📦 Available Scripts
npm run dev → Starts development server with hot reload
npm run build → Builds the app for production
npm run preview → Serves production build locally
npm run lint → Runs lint checks (if configured)

🎨 Design Decisions

This project uses a component-driven architecture to keep the UI modular and reusable. Key design choices include:

Separation of concerns: business logic extracted into reusable hooks to improve testability and maintainability
Optimistic updates: Improves perceived performance when updating todos
Debounced filtering: Prevents unnecessary re-renders and API calls
CSS modular structure: Keeps styles scoped and maintainable
Responsive layout: Mobile-first design for usability across devices

🚀 Future Improvements

If more time were available, the following features would be added:

🔐 User authentication (login/signup)
☁️ Cloud persistence per user account
🏷️ Tags or categories for todos
📅 Due dates and reminders
🌙 Dark mode toggle
📊 Analytics dashboard (task completion stats)
📤 Export todos to CSV or PDF

📄 License

This project is licensed under the MIT License.

📬 Contact

GitHub: https://github.com/jonastam93