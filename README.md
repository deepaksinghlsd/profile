# Deepak Kumar Singh - Full-Stack Developer Portfolio

A premium, production-quality, responsive personal portfolio website built for **Deepak Kumar Singh**, representing his work as a Full-Stack Software Engineer, AI & Voice Agent Engineer, and SaaS developer.

## Tech Stack
*   **Frontend**: React (Vite), TypeScript, Tailwind CSS, Framer Motion
*   **Icons**: Lucide React
*   **Animations**: Framer Motion
*   **Contact Service**: Web3Forms (Free Contact Form)

## Key Features
1.  **Glassmorphic Design**: Clean aesthetic, subtle dark/light visual system, soft glows, and tech-inspired grids.
2.  **Interactive Timeline**: Sleek representation of professional experience.
3.  **Filtered Skills**: Categories for programming languages, frontend UI, backend systems, telephony VoIP/AI, DevOps, and security.
4.  **Premium Projects Layout**: Custom project cards showcasing ApnaJob and Real-Time Chat app.
5.  **Resume view/download**: Access to the actual verified PDF resume.
6.  **Contact Form**: Submits messages directly to Deepak's email via Web3Forms API.

---

## Local Development Setup

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org) (v18+) installed.

### 2. Installation
Clone or navigate to the project directory and install dependencies:
```bash
npm install
```

### 3. Environment Variables
1.  Create a Web3Forms account and generate a free Access Key at [web3forms.com](https://web3forms.com).
2.  Copy `.env.example` to `.env`:
    ```bash
    cp .env.example .env
    ```
3.  Open `.env` and paste your Access Key:
    ```env
    VITE_WEB3FORMS_ACCESS_KEY=your_actual_access_key_here
    ```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Build for Production
To build the project:
```bash
npm run build
```
This generates optimized static files in the `dist/` directory.

---

## Free Deployment Instructions (Vercel)

1.  Push the code to a public or private GitHub repository.
2.  Log in to [Vercel](https://vercel.com) and click **Add New** -> **Project**.
3.  Import your portfolio repository.
4.  Under **Environment Variables**, add:
    *   **Key**: `VITE_WEB3FORMS_ACCESS_KEY`
    *   **Value**: `your_actual_access_key_here`
5.  Click **Deploy**.
6.  Test the contact form on your live Vercel domain to ensure messages arrive in your inbox!
