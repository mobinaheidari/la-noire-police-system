# 🕵️‍♂️ L.A. Noire Police Department Management System

![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![Django REST Framework](https://img.shields.io/badge/DJANGO-REST-ff1709?style=for-the-badge&logo=django&logoColor=white&color=ff1709&labelColor=gray)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

A comprehensive, web-based criminal investigation management platform inspired by the L.A. Noire universe. This system digitizes police department workflows, from filing complaints to solving complex cases, managing evidence, and conducting judicial trials. 

Developed as the final Web Programming course project at **Sharif University of Technology**.

## ✨ Key Features

* **Dynamic Role-Based Access Control (RBAC):** Custom user models with strict authentication. Supports multiple hierarchical roles including Administrator, Chief, Captain, Sergeant, Detective, Patrol Officer, Cadet, Judge, Coroner, Complainant, and Suspect.
* **Case & Complaint Management:** Automated workflows for reviewing complaints (with a 3-strike rejection rule) and converting them into active investigation cases.
* **Polymorphic Evidence Architecture:** Scalable database design separating Biological, Vehicle, and Identity evidence using One-to-One relationships.
* **Interactive Detective Board:** A drag-and-drop workspace for detectives to visually connect evidence, suspects, and notes, with export-to-image capabilities.
* **Automated "Most Wanted" & Reward System:** Real-time mathematical calculation of suspect threat levels based on active pursuit days and crime severity, featuring automated reward issuance in Rials.
* **Judicial Trial Flow:** Complete lifecycle tracking for arrests, interrogations, and final verdicts by the Judge.
* **Modern UI/UX:** Responsive design, Skeleton Loading for better perceived performance, and modular dashboards tailored to user roles.

## 🛠️ Technology Stack

**Backend:**
* Python 3.13
* Django & Django REST Framework (DRF)
* JWT Authentication (`rest_framework_simplejwt`)
* Swagger UI / ReDoc (`drf-yasg`)

**Frontend:**
* React / Next.js 15
* Tailwind CSS (Styling & Skeleton Loaders)
* Zustand (Global State Management)
* dnd-kit (Drag and Drop functionality)
* Axios

**Infrastructure & Database:**
* PostgreSQL
* Docker & Docker Compose

## 🚀 Getting Started

The entire project is containerized. You can run both the frontend and backend environments using Docker.

### Prerequisites
* [Docker](https://docs.docker.com/get-docker/)
* [Docker Compose](https://docs.docker.com/compose/install/)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/mobinaheidari/la-noire-police-system.git](https://github.com/mobinaheidari/la-noire-police-system.git)
   cd la-noire-police-system
