### **📌 `README.md`**

# 🚀 React + Vite App

This is a React project bootstrapped with [Vite](https://vitejs.dev/) and tested using [Vitest](https://vitest.dev/).

---

## 📦 Installation & Setup

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2️⃣ Install Dependencies

```sh
npm install
```

---

## ▶️ Running the Development Server

Start the development server with:

```sh
npm run dev
```

Then open your browser and go to:  
🔗 `http://localhost:5173`

---

## 🔧 Building the Project

To create an optimized production build:

```sh
npm run build
```

To preview the production build locally:

```sh
npm run preview
```

---

## ✅ Running Unit Tests

This project uses **Vitest** for unit testing.

### 1️⃣ Run Tests in CLI
```sh
npm run test
```

### 2️⃣ Run Tests in Watch Mode
```sh
npm run test:watch
```

---

## 📂 Project Folder Structure

```
📦 form-builder/
├── 📁 public/                # Static public files
├── 📁 src/
│   ├── 📁 assets/            # Static assets (images, icons, etc.)
│   ├── 📁 components/
│   │   ├── 📁 ui/            # Shadcn UI components
│   │   ├── 📁 form-builder/  # Form builder specific components
│   │   ├── 📁 form-renderer/ # Form renderer specific components
│   ├── 📁 hooks/             # Custom + Shadcn hooks
│   ├── 📁 utils/             # Helper functions
│   ├── 📁 test/              # Test setup files
│   ├── 📄 App.tsx            # App component that render FormBuilder + State
│   ├── 📄 main.tsx           # Entry file
├── 📄 index.html           # Main HTML file
├── 📄 package.json         # Package dependencies
├── 📄 vite.config.ts       # Vite configuration
├── 📄 tsconfig.json        # TypeScript configuration
├── 📄 README.md            # Project documentation
```

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

