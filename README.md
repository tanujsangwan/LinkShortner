# ⚡ LinkShifter — Smart URL Shortener

A full-stack URL shortener with custom aliases, QR codes, and a rich analytics dashboard.

![Tech Stack](https://img.shields.io/badge/Backend-Spring%20Boot%203-brightgreen) ![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue) ![Database](https://img.shields.io/badge/DB-H2%20(embedded)-orange) ![Java](https://img.shields.io/badge/Java-23-red)

---

## 🚀 Features

- **🔗 Custom Short Links** — Choose your own alias or get a random one
- **📷 QR Code Generator** — Auto-generated, downloadable QR code for every link
- **📊 Analytics Dashboard** — Track clicks, devices, browsers, OS, referrers, countries
- **🌙 Dark Mode UI** — Beautiful glassmorphism design with Framer Motion animations

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 3 (Java 23) + Maven |
| Database | H2 (embedded, file-mode) |
| QR Codes | Google ZXing |
| Frontend | React 18 + Vite + Tailwind CSS |
| Animations | Framer Motion |
| Charts | Recharts |

---

## 📦 Getting Started

### Prerequisites
- Java 23+
- Maven 3.9+
- Node.js 18+

### 1. Clone the repo
```bash
git clone https://github.com/tanujsangwan/LinkShortner.git
cd LinkShortner
```

### 2. Start the Backend
```bash
cd backend
mvn spring-boot:run
```
Backend runs on **http://localhost:8080**

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on **http://localhost:5173**

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/links` | Create a new short link |
| `GET` | `/api/links` | Get all links |
| `GET` | `/{alias}` | Redirect to original URL |
| `GET` | `/api/analytics/{alias}` | Get analytics for a link |
| `GET` | `/api/qr/{alias}` | Get QR code PNG |
| `DELETE` | `/api/links/{alias}` | Delete a link |

### Create Link — Request Body
```json
{
  "originalUrl": "https://example.com/very/long/url",
  "alias": "mylink"
}
```

---

## 📊 Analytics Tracked

- ✅ Total clicks & unique visitors
- ✅ Clicks by date/time
- ✅ Device type (Mobile / Desktop / Tablet)
- ✅ Browser (Chrome / Firefox / Safari / Edge)
- ✅ Operating System
- ✅ Referrer URLs
- ✅ Country (from IP)

---

## 📁 Project Structure

```
LinkShortner/
├── backend/          # Spring Boot Maven project
│   └── src/main/java/com/linkshifter/
│       ├── controller/
│       ├── service/
│       ├── model/
│       ├── repository/
│       └── dto/
└── frontend/         # React + Vite app
    └── src/
        ├── pages/    # Home, Dashboard, Analytics
        └── components/
```

---

## 📝 License

MIT © [Tanuj Sangwan](https://github.com/tanujsangwan)
