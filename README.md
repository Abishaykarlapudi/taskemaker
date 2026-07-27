# TaskMaker - Bloom's Taxonomy Daily Task & Mastery Platform 🧠

A modern, responsive web application designed for **Java Full-Stack Developers** to track daily **Institute Assignments** and **Personal Goals** structured by **Bloom's Taxonomy Cognitive Levels** (Remember, Understand, Apply, Analyze, Evaluate, Create).

---

## 🌟 Key Features

- 🎓 **Dual Track Management**: Separate tracking for **Institute Course Assignments** (Spring Boot, Core Java, SQL, React) and **Personal Daily Goals** (LeetCode DSA, personal habits, projects).
- 🧠 **Interactive Bloom's Cognitive Pyramid**: Stacked visualizer displaying task distribution across all 6 Bloom levels with tier-filtering.
- ⚡ **Cognitive Depth Index (CDI)**: Weighted scoring system that rewards higher-order cognitive tasks.
- 🔥 **Daily Pain & Effort Rating**: 1–5 difficulty scale to log daily effort and grit.
- 📝 **Learning Reflections Log**: Record key takeaways, solutions, and code snippets upon task completion.
- 🎉 **Completion Celebrations**: Interactive confetti animation on goal achievements.

---

## 🚀 How to Host on Render (Free Static Site Deployment)

1. Sign in to [Render.com](https://dashboard.render.com/).
2. Click **New +** and select **Static Site**.
3. Connect your GitHub repository: `Abishaykarlapudi/taskemaker`.
4. Configure the deployment settings:
   - **Name**: `taskmaker` (or your preferred name)
   - **Branch**: `main`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
5. Click **Create Static Site**.
6. Render will automatically build your app and give you a live HTTPS URL (e.g., `https://taskemaker.onrender.com`)!

---

## 🛠️ Local Development

```bash
# Clone the repository
git clone https://github.com/Abishaykarlapudi/taskemaker.git

# Navigate into project folder
cd taskemaker

# Install dependencies
npm install

# Run dev server
npm run dev
```