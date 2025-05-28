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

3. Install Mariadb-Server And enabling and Starting Service
```bash
  sudo apt install mariadb-server -y
  sudo systemctl enable mariadb
  sudo systemctl start  mariadb
```
4. Create





