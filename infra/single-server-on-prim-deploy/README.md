# Project DevOps Journey: From App Creation to On-Premise and Cloud Deployment

## 📦 Phase 1: Single Server Deployment (Monolithic-Style)

In this initial phase of our DevOps journey, we begin with a **single server deployment**. This setup hosts the **frontend**, **backend**, and **MySQL database** on **one Linux server**.

Although the frontend and backend are maintained as separate codebases, deploying all components on a single server is considered a **monolithic-style deployment**, due to tight infrastructure coupling.

---

### 🖥️ Server Environment & Initial Setup

We are using:

- **OS**: Ubuntu Server 24.04 LTS (Long Term Support)

To verify your server version, run:

```bash
cat /etc/os-release




