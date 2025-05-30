# Project DevOps Journey: From App Creation to On-Premise and Cloud Deployment

## 📦 Phase 1: Single Server Deployment (Monolithic-Style)

In this initial phase of our DevOps journey, we begin with a **single server deployment**. This setup hosts the **frontend**, **backend**, and **MySQL database** on **one Linux server**.

Although the frontend and backend are maintained as separate codebases, deploying all components on a single server is considered a **monolithic-style deployment** due to tight infrastructure coupling.

---

## 🖥️ Server Environment & Initial Setup

We are using:

- **OS**: Ubuntu Server 24.04 LTS (Long Term Support)

### 1. Verify Server Version

```bash
cat /etc/os-release
```

**Expected Output:**

```plaintext
PRETTY_NAME="Ubuntu 24.04.1 LTS"
...
UBUNTU_CODENAME=noble
```

### 2. Update & Upgrade the System

```bash
sudo apt update -y
sudo apt upgrade -y
```

### 3. Install MariaDB

```bash
sudo apt install mariadb-server -y
sudo mysql_secure_installation
sudo systemctl enable mariadb
sudo systemctl start mariadb
```

### 4. Install Node.js (v22)

```bash
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

---

## 🧩 Setup Database, Backend, and Frontend

### 1. Clone Project Repository

```bash
git clone -b main https://github.com/robudex17/sbtph_leaderboard.git
cd sbtph_leaderboard
```

### 2. Setup Database

```bash
cd database
bash mariab.sh
cd ..
```

This script will:
- Create a MySQL user
- Create the `leaderboard` database
- Restore from a backup

### 3. Install PM2

```bash
npm install -g pm2
```

---

## 🛠️ Backend Configuration

### a. Setup Environment Variables

```bash
cd backend
touch .env
nano .env
```

Paste and update:

```env
PORT=8080
DB_HOST=<Server IP Address>
DB_NAME=leaderboard
DB_USER=admin
DB_PASSWORD=admin@2025
JWT_SECRET=<JWT_SECRET>
JWT_REFRESH_SECRET=<JWT_REFRESH_SECRET>
STANDARD_USER_LOGIN_ID=9999
STANDARD_USER_ROLE=admin
STANDARD_USER_USERNAME=admin
STANDARD_USER_FIRSTNAME=admin
STANDARD_USER_LASTNAME=admin
STANDARD_USER_DBNAME=admin
STANDARD_USER_LOGIN_TYPE=standarduser
```

### b. Install Dependencies

```bash
npm install
```

### c. Initial Test Run

```bash
npm run start
```

Expected output:

```plaintext
✅ DB connected
🚀 Server is running at http://localhost:8080
```

Press `Ctrl + C` to stop the process.

### d. Run Backend with PM2

```bash
pm2 start src/server.js --name backend
pm2 list
pm2 logs
pm2 save
pm2 startup
```

✅ Backend should show **online** in `pm2 list`.

![App Running Backend](./screenshots/pm2-running-backend-process.png)

---

## 🎨 Frontend Configuration

### a. Setup Environment Variables

```bash
cd frontend/sbtph-sales-leaderboard-app
touch .env
nano .env
```

Paste and update:

```env
NUXT_PUBLIC_API_URL=http://<BACKEND-IP>:8080/api
NUXT_PUBLIC_SOCKET_IO_URL=http://<BACKEND-IP>:8080
NUXT_IMAGE_BASE_URL=http://<BACKEND-IP>:8080
```

### b. Install Frontend Dependencies

```bash
npm install
```

### c. Preview Frontend

```bash
npm run preview
```

Test it by opening:

```
http://<YOUR-SERVER-IP>:3000/sbtph_sales_leaderboard
```

Login credentials:

```plaintext
Username: testuser
Password: testuser
Login as: standarduser
```

### d. Build for Production

```bash
npm run build
```

### e. Run Production Frontend with PM2

```bash
pm2 start .output/server/index.mjs --name frontend
pm2 list
pm2 logs
pm2 save
pm2 startup
```

✅ Both backend and frontend should show **online**.

![App Running Backend and Frontend](./screenshots/pm2-running-backend-frontend-process.png)

---

## 🔄 Final Testing

Access the application again to ensure everything works correctly!

---

## ✅ Summary

You've now successfully deployed your application on a single Linux server with:
- MySQL
- Node.js backend
- Nuxt.js frontend
- PM2 for process management

Stay tuned for Phase 2 — containerization and multi-node deployment!
