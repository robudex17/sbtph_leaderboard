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
4. Configure and Setup Backend.
   
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
   c. Run **npm install** to install backend packages. (__It make take some quite amount of time to install__)
   
      ```bash
         npm install
      ```
   d. Run **npm run start** to test if the backend is successfully running and can connect to the database 
      successfully (Initial Test).

     ```bash
        npm run start

        #THE OUTPUT SHOULD LOOK LIKE THIS:
        
        > backend@1.0.0 start
        > node src/server.js
        
        ✅ DB connected
        🚀 Server is running at http://localhost:8080

     ```
     Once confirmed, stop the app by pressing Ctrl + C in the terminal. This will terminate the Node.js process 
     running in the foreground.
   e. 🚀 Using PM2 to Manage the App.

    Instead of running the app manually each time, we use PM2, a process manager that makes it easier to manage     
    Node.js applications — especially in production environments.

    PM2 helps by:
    
    ✅ Running your app in the background.
    
    🔄 Automatically restarting the app if it crashes.
    
    🔌 Keeping the app alive after server reboots.
    
    📊 Offering built-in monitoring and logging.
    
    ⚙️ Supporting cluster mode for multi-core performance.

     ```bash
         #PM2 Commands
         # Start the app using PM2
           pm2 start src/server.js --name backend
          
          # View running processes
            pm2 list
          
          # View real-time logs
             pm2 logs
          
          # Save the process list (for auto-restart on reboot)
             pm2 save
          
          # Generate startup script (optional but recommended)
             pm2 startup
     ```
     Verify And View running processes
     ```bash
        pm2 list

     ```
     The Status  of the backend should be online.
     ![App Running Backend](./screenshots/pm2-running-backend-process.png)


5.  Configure and Setup Frontend.

    a. Create **.env** on the frontend/sbtph-sales-leaderboard-app folder

      ```bash
       cd frontend/sbtph-sales-leaderboard-app
       touch .env
       
      ```
    b. Open **.env** file and environment variables. (Edit the update the variables values if neccessary)

       ```bash
            nano .env
    
            #Update  env variables below and copy it to the .env file
     
            NUXT_PUBLIC_API_URL=<ADDRESS AND PORT OF BACKEND>          #SAMPLE FORMAT: http://localhost:8080/api
            NUXT_PUBLIC_SOCKET_IO_URL=<ADDRESS AND PORT OF BACKEND>    #SAMPLE FORMAT: http://localhost:8080  
            NUXT_IMAGE_BASE_URL=http:<ADDRESS AND PORT OF BACKEND>     #SAMPLE FORMAT: http://localhost:8080
         
       ```

    c. Run **npm install** to install backend packages. (__It make take some quite amount of time to install__)
   
       ```bash
         npm install
       ```
   d. Our Frontend APP need to build to deploy it in production. Before building the app you can preview it

     ```bash
        npm run preview
     ```   
   e. Test the application by visiting the browser

   f. After testing, its time to build it for production ready app

     ```bash
        npm run build
    ```
   g. Our production ready code is located in .output folder

   h. Now its time to use PM2 to manage our production Frontend app

    ```bash
         #PM2 Commands
         # Start the app using PM2
           pm2 start .output/server/index.mjs --name "frontend"
          
          # View running processes
            pm2 list
          
          # View real-time logs
             pm2 logs
          
          # Save the process list (for auto-restart on reboot)
             pm2 save
          
          # Generate startup script (optional but recommended)
             pm2 startup
     ```
     Verify And View running processes
     ```bash
        pm2 list

     ```
        The Status  of the backend and frontend  should be online.
     ![App Running Backend and Frontend](./screenshots/pm2-running-backend-frontend-process.png)
     


     
   








