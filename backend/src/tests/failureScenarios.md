
---

# ⚠️ **FailureScenarios.md**

```md
# Failure Scenarios & Handling

This document describes potential failure scenarios and how the system handles them to ensure safety, reliability, and data consistency.

---

## 1️⃣ Invalid or Expired QR Code
**Scenario:**  
A user attempts to scan an expired or already‑used QR code.

**Handling:**  
- QR validity time is checked  
- QR status verified (ISSUED / SCANNED / EXITED)  
- Entry is rejected with an error message  

**Outcome:**  
Prevents unauthorized or duplicate entry.

---

## 2️⃣ Zone Capacity Full
**Scenario:**  
A zone reaches its maximum allowed capacity.

**Handling:**  
- Entry requests are automatically blocked  
- Priority capacity rules applied  
- Only authorized categories allowed if applicable  

**Outcome:**  
Prevents overcrowding and ensures safety.

---

## 3️⃣ Emergency Situation in a Zone
**Scenario:**  
A medical or safety emergency occurs inside a zone.

**Handling:**  
- SOS is triggered  
- Emergency record is created  
- Zone is automatically blocked  
- Further entries are restricted  

**Outcome:**  
Ensures controlled evacuation and response.

---

## 4️⃣ Invalid API Request
**Scenario:**  
Client sends an API request with missing or invalid parameters.

**Handling:**  
- Input validation at API level  
- Meaningful error responses returned  

**Outcome:**  
System remains stable and predictable.

---

## 5️⃣ Database Failure
**Scenario:**  
Temporary database connectivity issue occurs.

**Handling:**  
- Transactions are rolled back  
- Partial data writes are avoided  
- Error is logged  

**Outcome:**  
Data integrity is preserved.

---

## 6️⃣ Medical Resource Unavailable
**Scenario:**  
All ambulances or first‑aid teams are busy.

**Handling:**  
- Resource status tracked in real‑time  
- Admin notified via dashboard  
- Alternate resources identified  

**Outcome:**  
Improved emergency response coordination.

---

## 7️⃣ High Crowd During Peak Hours
**Scenario:**  
Sudden surge in pilgrims during festivals or peak times.

**Handling:**  
- Slot enforcement enabled  
- Heatmap highlights critical zones  
- Admin monitors live dashboards  

**Outcome:**  
Crowd remains controlled and safe.

---

## 🎓 Viva‑Ready Explanation
Failure scenarios are handled using validations, transactional safety, automatic blocking, and real‑time monitoring to ensure system reliability and public safety.
