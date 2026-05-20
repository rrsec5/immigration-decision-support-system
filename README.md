# 🌍 Immigration Decision Support System

A comprehensive, microservice-based Decision Support System (DSS) designed to help individuals choose the ideal country for immigration. The platform evaluates countries across multiple 10-point metrics and generates highly personalized recommendations based on detailed user questionnaires.

## 📺 Project Walkthrough

You can watch the full demonstration of the system's features and architecture on YouTube:
👉 **[Watch Project Presentation on YouTube](https://youtu.be/B0ZciVTedco)**

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

## 🏗️ System Architecture

The backend is built using a scalable **Microservices Architecture** comprising 3 core business services and 2 infrastructure components:

- **`user-service`:** Manages authentication, user sessions (log out), and profile metadata.
- **`country-service`:** Handles country profiles, 10-point analytical parameters, and user reviews.
- **`recommendation-service`:** Runs the decision-making algorithm based on user survey inputs.
- **`eureka-service`:** Service registry for dynamic discovery.
- **`api-gateway`:** Centralized routing and request handling.

## 🛠️ Tech Stack

### **Backend (Microservices)**

- **Core:** Java, Spring Boot, Spring Web
- **Cloud & Routing:** Spring Cloud Netflix Eureka (Service Registry), Spring Cloud Routing (API Gateway), OpenFeign (Inter-service communication)
- **Data Layer:** Spring Data JPA, MySQL Driver
- **Database:** MySQL

### **Frontend (Client)**

- **Core:** React, TypeScript (Vite)
- **Styling:** Tailwind CSS
- **Navigation & Forms:** `react-router-dom`, `react-hook-form` (with validation)
- **UI Components:** `sonner` (Toast notifications), `react-icons`, `flag-icons` (Dynamic country flags representation)
- **API Client:** Axios

## 📂 Repository Structure

The project is organized into three main directories:

- `/DataBase` — Contains SQL scripts for database schema creation and initial seeding.
- `/immigration-decision-support` — The Java Spring Boot backend microservices.
- `/immigration-decision-support-frontend` — The responsive React client application.

## ⚙️ Quick Start

1. Run the SQL scripts in the `/DataBase` folder to set up your **MySQL** instance.
2. Configure and start the `eureka-service` and `api-gateway`.
3. Launch the core backend microservices (`user`, `country`, `recommendation`).
4. Navigate to the frontend directory, install dependencies via `npm install`, and run `npm run dev`.

---

_Developed as a complex architectural project combining data-driven decision algorithms, distributed microservices, and modern UI engineering._
