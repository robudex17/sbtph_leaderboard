# Project DevOps Journey: From App Creation to On-Premise and Cloud Deployment

## 📦 Phase 1: Single Server Deployment (Monolithic-Style)

In this initial phase of our DevOps journey, we begin with a **single server deployment**. This setup hosts the **frontend**, **backend**, and **MySQL database** on **one Linux server**.

Although the frontend and backend are maintained as separate codebases, deploying all components on a single server is considered a **monolithic-style deployment**, due to tight infrastructure coupling.

---

### 🖥️ Server Environment & Initial Setup

We are using:

- **OS**: Ubuntu Server 24.04 LTS (Long Term Support)

  1. To verify your server version, run:
  
  ```bash
  cat /etc/os-release
  ```
  **Output:**
  ```
    PRETTY_NAME="Ubuntu 24.04.1 LTS"
    NAME="Ubuntu"
    VERSION_ID="24.04"
    VERSION="24.04.1 LTS (Noble Numbat)"
    VERSION_CODENAME=noble
    ID=ubuntu
    ID_LIKE=debian
    HOME_URL="https://www.ubuntu.com/"
    SUPPORT_URL="https://help.ubuntu.com/"
    BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
    PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
    UBUNTU_CODENAME=noble
    LOGO=ubuntu-logo
  ```
  
  2. Update and Upgrade the System 
  
  ```bash
    sudo apt udpate -y
    sudo apt upgrade -y
  ```
  
  3. Install Mariadb-Server,  run neccessary script  and enabling and Starting Service
  ```bash
    sudo apt install mariadb-server -y
    sudo mysql_secure_installation
    sudo systemctl enable mariadb
    sudo systemctl start  mariadb
  ```
  4. Install nodejs version 22
  ```bash
    sudo apt install -y curl
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt install -y nodejs
    node -v
    npm -v
  ``` 
### 🖥️ Setup Database, Backend, Frontend

1. Clone Project Repository and cd to the project:
  ```bash
     git clone -b main https://github.com/robudex17/sbtph_leaderboard.git
     cd sbtph_leaderboard
  ```
2. Run mariab.sh for creating , mysql user, leaderboard database, and restoring database from backup
  ```bash
     cd database
     bash database/mariab.sh
     cd ..
  ```
3. Install PM2. PM2 is a production process manager for Node.js applications
  ```bash
    npm install -g pm2
  ```
4. Configure and Setup Backend
   
   a. Create **.env** on the backend folder
     ```bash
       cd backend
       touch .env
     ```
   b. Open **.env** file and environment variables. (Edit the update the variables values if neccessary)
     ```bash
        nano .env

        #Update  env variables below and copy it to the .env file
        PORT=8080
        DB_HOST= <Server IP Address>
        DB_NAME=leaderboard
        DB_USER=admin
        DB_PASSWORD=admin@2025
        JWT_SECRET=  <JWT_SECRET HERE>
        JWT_REFRESH_SECRET= <JWT_REFRESH_SECRET HERE>
        
        STANDARD_USER_LOGIN_ID=9999
        STANDARD_USER_ROLE=admin
        STANDARD_USER_USERNAME=admin
        STANDARD_USER_FIRSTNAME=admin
        STANDARD_USER_LASTNAME=admin
        STANDARD_USER_DBNAME=admin
        STANDARD_USER_LOGIN_TYPE=standarduser
     ```
   








