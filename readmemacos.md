# 🍎 macOS Setup Guide — JobJob

This guide walks you through installing every dependency required to run the JobJob project on macOS, from scratch.

---

## 📋 Prerequisites Overview

| Tool | Version | Purpose |
|------|---------|---------|
| Homebrew | latest | macOS package manager |
| Java (JDK) | 17+ | Spring Boot backend |
| Maven | 3.9+ | Java build tool |
| Node.js | 20+ (LTS) | Vite + React frontend |
| npm | 10+ | Frontend package manager |
| MySQL | 8.x | Relational database |
| Git | latest | Version control |

---

## 1. 🍺 Install Homebrew

Homebrew is the easiest way to install most tools on macOS.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

After installation, follow the terminal instructions to add Homebrew to your `PATH`. Then verify:

```bash
brew --version
```

---

## 2. ☕ Install Java (JDK 17)

The backend requires **Java 17** (as configured in `pom.xml`).

```bash
brew install openjdk@17
```

Since it's a "keg-only" formula, you need to symlink it:

```bash
sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk \
     /Library/Java/JavaVirtualMachines/openjdk-17.jdk
```

Add Java to your shell profile (`~/.zshrc` or `~/.bash_profile`):

```bash
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 17)' >> ~/.zshrc
echo 'export PATH="$JAVA_HOME/bin:$PATH"'              >> ~/.zshrc
source ~/.zshrc
```

Verify:

```bash
java --version
# Expected: openjdk 17.x.x ...
```

---

## 3. 📦 Install Maven

Maven is used to build and run the Spring Boot backend.

```bash
brew install maven
```

Verify:

```bash
mvn --version
# Expected: Apache Maven 3.x.x ...
```

---

## 4. 🟢 Install Node.js (via `nvm` — recommended)

Using **nvm** (Node Version Manager) is the recommended approach — it lets you switch Node versions easily.

### Option A: Install via nvm (Recommended)

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload your shell
source ~/.zshrc

# Install Node.js LTS (v20)
nvm install 20
nvm use 20
nvm alias default 20
```

### Option B: Install via Homebrew (Simpler)

```bash
brew install node@20
echo 'export PATH="/opt/homebrew/opt/node@20/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Verify either way:

```bash
node --version
# Expected: v20.x.x

npm --version
# Expected: 10.x.x
```

---

## 5. 🐬 Install MySQL 8

The backend uses MySQL as its database.

```bash
brew install mysql@8.4
```

Start the MySQL service and enable it on startup:

```bash
brew services start mysql@8.4
```

Add MySQL to your PATH:

```bash
echo 'export PATH="/opt/homebrew/opt/mysql@8.4/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Secure the installation (set root password, remove anonymous users, etc.):

```bash
mysql_secure_installation
```

Verify:

```bash
mysql --version
# Expected: mysql  Ver 8.4.x ...
```

### Create the database

```bash
mysql -u root -p
```

Inside the MySQL shell:

```sql
CREATE DATABASE jobjob_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

---

## 6. 🔧 Install Git

Git should already be available on macOS via Xcode Command Line Tools. If not:

```bash
brew install git
git --version
```

---

## 7. 📁 Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/DSA-JOBJOB.git
cd DSA-JOBJOB
```

> Replace `YOUR_USERNAME` with the actual GitHub username.

---

## 8. ⚙️ Configure Environment Variables

The backend reads database credentials and JWT secret from environment variables. Create a `.env` file or export them in your shell:

```bash
export DB_USERNAME=root
export DB_PASSWORD=your_mysql_root_password
export JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

> You can also add these lines to your `~/.zshrc` to make them permanent.

---

## 9. 🚀 Run the Backend (Spring Boot)

```bash
cd jobjob-backend

# Download all Maven dependencies and build
mvn clean install -DskipTests

# Start the server
mvn spring-boot:run
```

The backend will be available at: **`http://localhost:8080`**

---

## 10. 🎨 Run the Frontend (Vite + React)

Open a **new terminal tab**, then:

```bash
cd jobjob-frontend

# Install all npm dependencies
npm install

# Start the Vite dev server
npm run dev
```

The frontend will be available at: **`http://localhost:5173`**

---

## ✅ Verification Checklist

After following all steps, confirm the following:

- [ ] `java --version` → `17.x.x`
- [ ] `mvn --version` → `3.x.x`
- [ ] `node --version` → `v20.x.x`
- [ ] `npm --version` → `10.x.x`
- [ ] `mysql --version` → `8.4.x`
- [ ] `git --version` → any recent version
- [ ] MySQL service is running (`brew services list`)
- [ ] Database `jobjob_db` exists
- [ ] Backend starts on `http://localhost:8080`
- [ ] Frontend starts on `http://localhost:5173`

---

## 🛠 Troubleshooting

### Port 8080 already in use

```bash
lsof -ti:8080 | xargs kill -9
```

### MySQL won't start

```bash
brew services restart mysql@8.4
# or check logs:
cat /opt/homebrew/var/log/mysql@8.4/mysql@8.4.err
```

### `mvn` command not found after install

```bash
echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### `node` or `npm` not found (nvm)

```bash
source ~/.zshrc
nvm use 20
```

### CORS error in browser

Make sure the backend is running and the `cors.allowed-origins` in `application.yml` includes `http://localhost:5173`.

---

## 📚 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Language (Backend) | Java 17 |
| Framework | Spring Boot 3.2.5 |
| Build Tool | Maven 3.9+ |
| ORM | Spring Data JPA + Hibernate |
| Database | MySQL 8.x |
| Security | Spring Security + JWT |
| Language (Frontend) | TypeScript 5.9 |
| UI Framework | React 19 + Vite 7 |
| Styling | Tailwind CSS 4 |
| State Management | Zustand |
| HTTP Client | Axios |
| Animations | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |

---

*Guide written for macOS (Apple Silicon & Intel). Tested with Homebrew on macOS Ventura / Sonoma.*
