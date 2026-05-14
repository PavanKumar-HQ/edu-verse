# 🚀 Geniusphere X - Advanced Features Workflow

You have three powerful standalone applications integrated into the Mission Control dashboard. Because they are complex applications (Python, Django, Streamlit, and Node), they must be started in their own terminals alongside the main Geniusphere app.

Here is the proper workflow to start everything so they appear inside the Mission Control `iframe` tabs.

## Step 1: Start Geniusphere (Main App)
```bash
# In your main project directory
npm run dev
```

## Step 2: Start the Holo-Mentor Avatar (Port 5174)
This runs the React Three Fiber 3D Avatar frontend.
```bash
# Open a NEW terminal
cd features/talking-avatar-with-ai-main/apps/frontend
npm install
npm run dev
```

## Step 3: Start the Study Agent Wizard (Port 8501)
This runs the Multi-Agent Python Streamlit application.
```bash
# Open a NEW terminal
cd features/Multi-Agent-Study-Assistant-main
pip install -r requirements.txt
streamlit run app.py
```

## Step 4: Start DeepTutor (Port 3782 & 8001)
This runs the full Django AI Backend and its Web UI.
```bash
# Open a NEW terminal
cd features/DeepTutor-main
docker-compose up
```

---

## 🎨 Theme Updates
The `MissionControl` UI has been strictly locked to the glassmorphism dark theme (`bg-black/50 backdrop-blur-xl border-white/10`) with glowing accents. When your underlying apps load inside the iframes, they will blend into this environment.
