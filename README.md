# 🍽️ BiteRite  

### 🚀 *Personalized Recipe Generator & Community Platform*  

BiteRite is a **full-stack web application** that delivers **AI-powered personalized recipes** based on users’ dietary preferences, health conditions, and fitness goals.  
It also features a **community forum** where users can share ideas, recipes, and interact with others.  

---

## ✨ Features  

### 👤 Authentication  
- 🔐 **Secure login/signup** using Clerk  
- ⚡ **Persistent user sessions**  

### 🧠 Personalized Experience  
- 📝 Guided onboarding to collect:  
  - **Diet type**  
  - **Allergies**  
  - **Health conditions**  
  - **Fitness goals** *(weight loss, muscle gain, etc.)*  
- 💾 Stores user preferences in **MongoDB**  

### 🍳 Recipe Generation  
- 🤖 **AI-powered recipes** using Gemini API  
- 🎯 Fully **customized results** based on user profile  
- 📄 Clean and structured recipe display  

### 👥 Community Forum  
- 📝 Create posts *(text + images)*  
- 💬 Comment on posts  
- ❤️ Like posts  
- 🗑️ Delete your own posts  

### 📝 User Profile  
- 👀 View & edit personal information  
- 🥗 Manage dietary & health preferences  
- 🔄 Real-time database sync  

### 🌙 UI/UX  
- 🎨 Modern and responsive design  
- 🌙 Dark mode support  
- ⚡ Smooth interactions  

---

## 🛠️ Tech Stack  

### 🎯 Frontend  
- **React.js (Vite)**  
- **Tailwind CSS**  
- **React Router**  
- **Clerk Authentication**  

### ⚙️ Backend  
- **Node.js**  
- **Express.js**  
- **MongoDB (Mongoose)**  

### 🔗 APIs & Services  
- **Gemini API** → AI recipe generation  
- **Unsplash API** → Image integration  

---

## ⚙️ Installation & Setup  

```bash
# 🔽 Clone the repository
git clone https://github.com/your-username/BiteRite.git

# 📂 Navigate into the project
cd BiteRite

# 📦 Install dependencies
npm install

# 🚀 Start development server
npm run dev