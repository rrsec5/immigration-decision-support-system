# 🌍 Immigration Decision Support System

![CI](https://github.com/rrsec5/immigration-decision-support-system/actions/workflows/ci.yml/badge.svg)

A comprehensive, microservice-based Decision Support System (DSS) designed to help individuals choose the ideal country for immigration. The platform evaluates countries across multiple 10-point metrics and generates highly personalized recommendations based on detailed user questionnaires.

## 📺 Project Walkthrough

You can watch the full demonstration of the system's features and architecture on YouTube:
👉 **[Watch Project Presentation on YouTube](https://youtu.be/B0ZciVTedco)**

---

## 🚀 Key Features

### 👤 Guest Features

- **Global Rating:** View a comprehensive, searchable list of countries sorted and filtered by major metrics.
- **Detailed Country Profiles:** Access deep-dive information including images, localized parameters, and user reviews (sortable by highest/lowest ratings).
- **10-Point Evaluation Scale:** Countries are rated based on quality of life, economy, safety, education, healthcare, job opportunities, immigration policy, and social institutions.

### 🔐 Authenticated User Features

- **Personalized Recommendation Engine:** Upon registration, users complete an analytical questionnaire. The system processes this data to generate a custom, weighted country ranking.
- **Historical Recommendations:** Users can re-run the recommendation algorithm multiple times. Each customized rating is timestamped, allowing users to track changes if their preferences or country metrics evolve over time.
- **Profile Management:** Full control over personal data and questionnaire responses with the ability to update metrics at any time.
- **Interactive Reviews:** Only registered users can submit text reviews and 10-point ratings for specific countries.

---

## 🏗️ System Architecture

The backend is built using a scalable **Microservices Architecture** comprising 3 core business services and 2 infrastructure components:

- **`user-service`:** Manages authentication, user sessions (log out), and profile metadata.
- **`country-service`:** Handles country profiles, 10-point analytical parameters, and user reviews.
- **`recommendation-service`:** Runs the decision-making algorithm based on user survey inputs.
- **`eureka-service`:** Service registry for dynamic discovery.
- **`api-gateway`:** Centralized routing and request handling.

---

## 🛠️ Tech Stack

### **Backend (Microservices)**

- **Core:** Java 17, Spring Boot, Spring Web
- **Microservices & Communication:** Spring Cloud Netflix Eureka (Service Registry), Spring Cloud Routing (API Gateway), OpenFeign (Inter-service communication)
- **Data Layer:** Spring Data JPA, MySQL Driver
- **Database:** MySQL
- **Security and Authentication:** Spring Security, JWT Authentication

### **Frontend (Client)**

- **Core:** React, TypeScript (Vite)
- **Styling:** Tailwind CSS
- **Navigation & Forms:** `react-router-dom`, `react-hook-form` (with validation)
- **UI Components:** `sonner` (Toast notifications), `react-icons`, `flag-icons` (Dynamic country flags representation)
- **API Client:** Axios

---

## 📂 Repository Structure

```
Immigration-Decision-Support-System
│
├── .github
│   └── workflows
│       ├── ci.yml
│       └── cd.yml
│
├── backend
│   │
│   ├── api-gateway
│   ├── country-service
│   ├── eureka-service
│   ├── recommendation-service
│   └── user-service
│
├── database
│   └── database.sql
│
├── frontend
│   └── React + TypeScript application
│
├── helm 
│   └── immigration-system 
│       ├── files
│       ├── templates
│       ├── Chart.yaml 
│       ├── values-secret.example.yaml 
│       └── values.yaml 
│
├── .env.example 
├── .gitignore
├── README.md
└── compose.yml
```

---

## 🧪 Testing

The project includes unit testing for the main business services across all backend microservices.

The tests were created using **JUnit 5** and **Mockito** to verify core application logic, service behavior, and different business scenarios without relying on external dependencies.

Currently implemented tests cover:

### `user-service`

- **AuthService**
  - Successful user registration
  - Registration with an already existing email
  - Successful login
  - Login with invalid credentials

- **UserService**
  - Saving user profile data
  - Handling missing users and invalid reference data

- **JwtService**
  - JWT token generation and username extraction
  - Token validation

- **ReferenceService**
  - Loading available reference data (languages, professions, financial levels)

### `country-service`

- **CountryService**
  - Retrieving country information
  - Country filtering and sorting logic
  - Handling missing countries

- **ReviewService**
  - Creating reviews
  - Calculating average ratings
  - Review retrieval logic

### `recommendation-service`

- **RecommendationCalculator**
  - Language scoring
  - Profession scoring
  - Salary and financial cushion calculations
  - Climate, region, and migration preference scoring
  - Full recommendation score calculation

- **RecommendationService**
  - Creating recommendation sessions
  - Handling incomplete user profiles
  - Retrieving recommendation sessions

In total, the project contains **30+ backend tests** covering the main business scenarios of the application.

---

## 🐳 Running the Project with Docker

The entire application can be started using Docker Compose.

### Requirements

Install:

- Docker Desktop
- Git

### 1. Clone repository

```bash
git clone https://github.com/rrsec5/immigration-decision-support-system.git
cd immigration-decision-support-system
```

### 2. Configure environment variables

Create your local environment file:

```bash
cp .env.example .env
```

Open `.env` and configure required values.

Example:

```bash
DB_NAME=immigration_decision_support

MYSQL_ROOT_PASSWORD=your_password

DB_USER=app_user
DB_PASSWORD=your_password

JWT_SECRET=your_secret_key
JWT_EXPIRATION=86400000
```

Do not commit `.env` to the repository.

The `.env.example` file contains only template values required to start the project.

### 3. Start the Application

Run the following command from the project root directory:

```bash
docker compose up --build
```

Docker will:

- build all application containers
- create the MySQL database
- start backend services
- start frontend application

### 4. Access the application

After successful startup, open:

```
http://localhost:3000
```

Stop application:

```
docker compose down
```

---

## ☸️ Kubernetes Deployment with Helm

The project is fully containerized and can be deployed to Kubernetes using a custom Helm chart.

The Kubernetes infrastructure includes:

- **Deployments and Services** for all application components:
  - `api-gateway`
  - `user-service`
  - `country-service`
  - `recommendation-service`
  - `eureka-service`
  - `frontend`
  - `mysql`

- **ConfigMap and Secrets** for centralized application configuration and sensitive data management.

- **Ingress configuration** with NGINX Ingress Controller, allowing access to the application through a single entry point.

- **Persistent Volume Claim (PVC)** for MySQL database persistence, preventing data loss after pod restarts.

- **Resource management** using Kubernetes requests and limits to define CPU and memory requirements for each service.

- **Health monitoring** using Spring Boot Actuator integrated with Kubernetes readiness and liveness probes.

---

## 📦 Helm Chart

The Kubernetes deployment is packaged as a reusable **Helm chart**.

The chart provides:

- configurable application deployment through `values.yaml`;
- separate secret management using `values-secret.yaml`;
- reusable Helm templates to reduce Kubernetes manifest duplication;
- common helper templates for labels, selectors, and health probes;
- shared deployment and service templates for microservices;
- custom MySQL deployment with persistent storage configuration.

The entire application stack can be deployed using a single Helm command:

```bash

helm install immigration-system helm/immigration-system

```

---

## 🚀 Running Kubernetes locally

The project can be deployed locally using a Kubernetes cluster such as **Kind**.

### Requirements

Install:

- Docker Desktop
- Kind
- Helm

### 1. Create Kubernetes cluster

```bash

kind create cluster --name immigration-cluster

```

### 2. Deploy application using Helm

```bash

helm install immigration-system \
helm/immigration-system \
--namespace immigration-support-system \
--create-namespace \
-f helm/immigration-system/values.yaml \
-f helm/immigration-system/values-secret.example.yaml

```
> For production environments, replace `values-secret.example.yaml` with your own secret configuration file and never commit real credentials.

After successful deployment, the application becomes available through the configured Ingress host.

Application images are stored in Docker Hub and referenced by Kubernetes deployments. The MySQL container uses the official MySQL Docker image.

---

## ⚙️ Continuous Integration

The project uses **GitHub Actions** to automate continuous integration and Kubernetes deployment workflows.

### Continuous Integration (CI)

The CI pipeline is triggered on:
- pushes to the `main` branch;
- pull requests targeting the `main` branch.

Each workflow run performs the following checks:

- **Backend verification**
  - sets up Java 17 environment;
  - starts a MySQL service for database testing;
  - initializes database schema from `database/database.sql`;
  - builds all Spring Boot microservices using Maven;
  - runs automated tests.

- **Frontend verification**
  - sets up Node.js environment;
  - installs dependencies using `pnpm`;
  - builds the React + TypeScript application.

- **Docker validation**
  - builds all application images using Docker Compose.

- **Helm validation**
  - checks Helm chart correctness using `helm lint`;
  - renders Kubernetes manifests using `helm template`;
  - validates generated manifests using `kubeconform`.

### Continuous Deployment (CD)

The CD pipeline is implemented using **GitHub Actions** and performs automated Kubernetes deployment validation.

The workflow:

- creates a temporary Kubernetes cluster using Kind;
- installs NGINX Ingress Controller;
- builds application Docker images;
- loads images into the Kubernetes cluster;
- deploys the application stack using Helm;
- waits for Kubernetes resources to become ready;
- verifies pods, services, and ingress configuration.

The CI/CD workflow results are available directly in the GitHub Actions section of the repository.

---

_Developed as a complex architectural project combining data-driven decision algorithms, microservices architecture, container orchestration with Kubernetes, Helm-based deployments, and automated CI/CD workflows._
