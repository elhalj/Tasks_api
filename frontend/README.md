# 🚀 Tasks Application

A modern task management application built with React, TypeScript, and Fastify.

## 🛠️ Technologies Used

- **Frontend**:
  - React 18 with TypeScript
  - Vite for build tooling
  - Tailwind CSS for styling
  - React Context API for state management
  - Axios for API requests

- **Backend**:
  - Fastify for the server
  - MongoDB for the database
  - JWT for authentication

## ✨ Features

- User authentication (login/register)
- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Responsive design

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- MongoDB instance

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd frontend/tasks
   npm install
   ```
3. Set up environment variables (create a `.env` file in the root directory):
   ```
   VITE_API_URL=http://localhost:3000/api/v1
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📝 Future Features

### High Priority
- [ ] Task categories and tags
- [ ] Task due dates and reminders
- [ ] Task prioritization
- [ ] Search and filter functionality

### Medium Priority
- [ ] Task sharing and collaboration
- [ ] Task comments and notes
- [ ] File attachments for tasks
- [ ] Task templates

### Low Priority
- [ ] Calendar view for tasks
- [ ] Task statistics and insights
- [ ] Dark/light theme toggle
- [ ] Offline support with service workers

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Fastify for the blazing fast backend
- React and Vite for the amazing frontend experience
- Tailwind CSS for the utility-first CSS framework
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
