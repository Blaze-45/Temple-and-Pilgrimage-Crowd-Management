# Temple & Pilgrimage Crowd Management System

## 📌 Project Overview
The Temple & Pilgrimage Crowd Management System is a smart, technology‑driven solution designed to manage large pilgrim gatherings efficiently and safely.  
The system uses slot‑based booking, QR verification, real‑time crowd monitoring, emergency handling, analytics, and medical resource tracking to prevent overcrowding and ensure rapid emergency response.

---

## 🎯 Objectives
- Mandatory pre‑enrollment with slot‑based digital tickets
- QR‑based entry and exit verification
- Real‑time zone‑wise crowd monitoring
- Emergency SOS handling with automatic zone blocking
- Heatmap‑based crowd density visualization
- Admin dashboard with analytics and reports
- Medical and emergency resource tracking

---

## 🧩 System Modules
1. Booking & QR Management  
2. Entry / Exit Control  
3. Crowd Monitoring & Heatmaps  
4. Emergency SOS System  
5. Admin Dashboard  
6. Reports & Analytics  
7. Medical Resource Management  

---

## 🛠️ Technology Stack
- Backend: Node.js, Express.js  
- Database: PostgreSQL  
- API Style: REST APIs  
- Frontend: React  
- Tools: Thunder Client / Postman  

---

## 🗄️ Database Tables
- zones  
- slots  
- bookings  
- qr_codes  
- zone_events  
- emergencies  
- medical_resources  

---

## 🔄 Core Workflows

### 1️⃣ Booking & QR Flow
- Devotee selects a slot
- Booking is created
- QR code is generated with validity time
- Notification sent to the user

### 2️⃣ Entry & Exit Flow
- QR scanned at entry gate
- Zone capacity increases
- Entry event logged
- Exit scan decreases capacity

### 3️⃣ Crowd Monitoring
- Real‑time zone‑wise capacity
- Entry and exit counts
- Statistics API for dashboards

### 4️⃣ Emergency SOS
- SOS triggered for a zone
- Emergency logged in system
- Zone automatically blocked
- Admin manages emergency lifecycle

### 5️⃣ Heatmap Logic
- Occupancy percentage calculated
- Zones classified as LOW, MEDIUM, HIGH, or CRITICAL
- Used for real‑time heatmap visualization

### 6️⃣ Medical Resource Tracking
- Track ambulances and first‑aid teams
- Availability status monitoring
- Zone‑based allocation

---

## 📊 API Overview
- /booking/create  
- /qr/scan  
- /zones/stats  
- /zones/heatmap  
- /emergencies/sos  
- /admin/dashboard  
- /reports/daily  
- /medical  

---

## ▶️ How to Run the Project
```bash
npm install
npm run dev
