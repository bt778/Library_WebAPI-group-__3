# LibraryWebAPI 

A third-year group project for the course **Event-Driven Programming & Web Backends with ASP.NET Core**. This project implements a full-featured **Library Management System** backend using ASP.NET Core Web API, Entity Framework Core, and JWT Authentication. A bonus frontend client built with React is also included.

## 🔧 Tech Stack

- **Backend:** ASP.NET Core Web API  
- **ORM:** Entity Framework Core (Code First)  
- **Authentication:** JWT Bearer Tokens  
- **Database:** SQLite  
- **Frontend (Bonus):** React (JavaScript)  
- **Tools:** Visual Studio, Postman, Gama, Git & GitHub

---

## Features

###  Authentication & Authorization
- **User Registration & Login**
- JWT token issuance and validation
- All APIs protected for authenticated users

###  Books API
- `GET /api/books` — list all books  
- `GET /api/books/{id}` — get book by ID  
- `POST /api/books` — add a new book  
- `PUT /api/books/{id}` — update book  
- `DELETE /api/books/{id}` — delete book  

### Borrowers API
- Same CRUD operations under `/api/borrowers`

###  Loans API
- `POST /api/loans` — issue a book (decrease available copies)  
- `POST /api/returns` — return a book (increase available copies)  
- `GET /api/loans/overdue` — list overdue loans  
- `GET /api/loans` — list all loans  

---

## 🖥️ Frontend (Bonus +5 Marks)

A simple React app demonstrates core functionality:
- Login with JWT
- View all books
- Create and return loans
- Filter active/returned loans

> 📸 Screenshots of both frontend and backend are included in the `screenshots/` folder.

---

## 👥 Team Members

- Berhane Tesfay – Frontend &DB design  
-ZEREYAKOB DEREJE  – Auth & Borrowers API  
- ETSUBDINK MEKETE  – Loans logic & Book APIs  
-YOSEF BEKELE – JWT setup & Integration  
-KALKIDAN ANBERBIR – power point & Documentation

---

## Lessons Learned

- Designing RESTful APIs with ASP.NET Core  
- Applying JWT-based authentication  
- Handling entity relationships with EF Core  
- Building a full-stack system using modern tools  
- Collaborating using Git and GitHub

---

##  Getting Started

### Backend
```bash
cd LibraryWebAPI
dotnet restore
dotnet ef database update
dotnet run
