# GTD Task Management App

Eine einfache Aufgabenverwaltungs-App nach dem Getting Things Done (GTD) Prinzip, entwickelt mit React, TypeScript und PostgreSQL.

## Features

- **Inbox**: Sammeln Sie alle Aufgaben hier, bevor Sie sie einsortieren
- **Next**: Aufgaben, die als nächstes abgearbeitet werden müssen
- **Waiting**: Aufgaben, bei denen Sie auf andere Personen oder Firmen warten
- **Scheduled**: Fest eingeplante Aufgaben mit Terminen
- **Someday**: Aufgaben, die nicht vergessen werden sollen, aber nicht sofort bearbeitet werden

## Funktionen

- ✅ Aufgaben hinzufügen mit Titel, Beschreibung, Priorität und Fälligkeitsdatum
- ✅ **Aufgaben bearbeiten** - Vollständige Bearbeitung aller Aufgabendetails
- ✅ **Drag & Drop** - Aufgaben per Drag & Drop in der Reihenfolge ändern
- ✅ **Cross-Category Drag & Drop** - Aufgaben zwischen Kategorien ziehen
- ✅ **Kalender-Datumsauswahl** - Benutzerfreundliche Kalenderkomponente
- ✅ **PostgreSQL-Integration** - Robuste Datenbank-Speicherung
- ✅ **Docker-Support** - Einfache Deployment-Optionen
- ✅ Aufgaben zwischen Kategorien verschieben
- ✅ Aufgaben als erledigt markieren
- ✅ Aufgaben löschen
- ✅ Automatische Speicherung in PostgreSQL
- ✅ Responsive Design für Desktop und Mobile
- ✅ Moderne, benutzerfreundliche Oberfläche

## 🐳 Docker Deployment

### Voraussetzungen
- Docker
- Docker Compose

### Schnellstart mit Docker

1. **Repository klonen**:
```bash
git clone <repository-url>
cd task-management
```

2. **Umgebungsvariablen konfigurieren**:
```bash
cp env.example .env
# Bearbeiten Sie .env nach Ihren Bedürfnissen
```

3. **Docker Compose starten**:
```bash
docker-compose up -d
```

4. **Anwendung öffnen**:
- **GTD App**: http://localhost:3000
- **pgAdmin**: http://localhost:5050 (admin@gtd.local / admin123)
- **Backend API**: http://localhost:3001

### Docker Services

- **gtd-app**: React Frontend (Port 3000)
- **backend**: Node.js/Express API (Port 3001)
- **postgres**: PostgreSQL Datenbank (Port 5432)
- **pgadmin**: Datenbank-Management (Port 5050)

### Docker Befehle

```bash
# Services starten
docker-compose up -d

# Services stoppen
docker-compose down

# Logs anzeigen
docker-compose logs -f

# Datenbank zurücksetzen
docker-compose down -v
docker-compose up -d

# Einzelnen Service neu starten
docker-compose restart gtd-app

# Services mit Build neu starten
docker-compose up -d --build
```

## 🗄️ PostgreSQL Integration

### Datenbank-Schema

```sql
-- Tasks Tabelle
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20),
    due_date DATE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Datenbank-Verbindung

- **Host**: postgres (Docker) oder localhost (Development)
- **Port**: 5432
- **Database**: gtd_tasks
- **User**: gtd_user
- **Password**: gtd_password

### pgAdmin Zugang

- **URL**: http://localhost:5050
- **Email**: admin@gtd.local
- **Password**: admin123

## 🚀 Lokale Entwicklung

### Voraussetzungen
- Node.js 18+
- npm oder yarn
- PostgreSQL (optional für lokale Entwicklung)

### Installation und Start

1. **Abhängigkeiten installieren**:
```bash
npm install
cd backend && npm install
```

2. **Entwicklungsserver starten**:
```bash
# Frontend
npm run dev

# Backend (in separatem Terminal)
cd backend
npm run dev
```

3. **App im Browser öffnen**:
```
http://localhost:5173
```

## Build für Produktion

### Mit Docker
```bash
docker-compose up -d --build
```

### Ohne Docker
```bash
# Frontend build
npm run build

# Backend starten
cd backend
npm start
```

## Technologien

### Frontend
- React 18
- TypeScript
- Vite
- CSS3
- HTML5 Drag & Drop API
- Custom Kalender-Komponente

### Backend
- Node.js
- Express.js
- PostgreSQL
- pg (PostgreSQL Client)
- Helmet (Security)
- CORS
- Rate Limiting

### Infrastructure
- Docker
- Docker Compose
- Nginx (Production)
- PostgreSQL 15
- pgAdmin 4

## Projektstruktur

```
task-management/
├── src/                          # Frontend Source
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── DragAndDropTaskList.tsx
│   │   ├── EditTaskForm.tsx
│   │   ├── AddTaskForm.tsx
│   │   └── DatePicker.tsx
│   ├── hooks/
│   │   └── useTasks.ts
│   ├── types/
│   │   └── Task.ts
│   ├── App.tsx
│   ├── App.css
│   └── index.css
├── backend/                      # Backend API
│   ├── server.js
│   ├── healthcheck.js
│   ├── package.json
│   └── Dockerfile
├── Dockerfile                    # Frontend Docker
├── docker-compose.yml           # Docker Compose
├── nginx.conf                   # Nginx Configuration
├── init.sql                     # Database Schema
├── env.example                  # Environment Variables
└── README.md
```

## API Endpoints

### Tasks
- `GET /api/tasks` - Alle Aufgaben abrufen
- `GET /api/tasks?category=inbox` - Aufgaben nach Kategorie
- `POST /api/tasks` - Neue Aufgabe erstellen
- `PUT /api/tasks/:id` - Aufgabe bearbeiten
- `PATCH /api/tasks/:id/toggle` - Aufgabe als erledigt markieren
- `DELETE /api/tasks/:id` - Aufgabe löschen
- `POST /api/tasks/reorder` - Aufgaben neu ordnen

### Statistics
- `GET /api/stats` - Statistiken nach Kategorien

### Health Check
- `GET /health` - Service-Status

## Verwendung

### Grundlegende Aufgabenverwaltung
1. **Aufgaben hinzufügen**: Verwenden Sie das Formular oben, um neue Aufgaben zu erstellen
2. **Kategorien wechseln**: Klicken Sie auf die verschiedenen Kategorien in der linken Sidebar
3. **Aufgaben bearbeiten**: 
   - Checkbox anklicken, um Aufgaben als erledigt zu markieren
   - Dropdown-Menü verwenden, um Aufgaben zwischen Kategorien zu verschieben
   - Lösch-Button verwenden, um Aufgaben zu entfernen

### Neue Funktionen
4. **Aufgaben bearbeiten**: 
   - Klicken Sie auf den ✏️ Button bei einer Aufgabe
   - Bearbeiten Sie Titel, Beschreibung, Kategorie, Fälligkeitsdatum und Priorität
   - Speichern oder Abbrechen der Änderungen
5. **Drag & Drop Reihenfolge**: 
   - Ziehen Sie Aufgaben per Drag & Drop, um die Reihenfolge zu ändern
   - Die neue Reihenfolge wird automatisch gespeichert
   - Visuelle Feedback-Effekte während des Ziehens
6. **Cross-Category Drag & Drop**:
   - Ziehen Sie Aufgaben direkt zwischen verschiedenen Kategorien
   - Aufgaben werden automatisch in die Zielkategorie verschoben
   - Funktioniert sowohl zwischen Kategorien als auch innerhalb einer Kategorie
7. **Kalender-Datumsauswahl**:
   - Klicken Sie auf das Datumsfeld, um den Kalender zu öffnen
   - Navigieren Sie durch Monate mit den Pfeiltasten
   - Klicken Sie auf ein Datum, um es auszuwählen
   - "Heute"-Button für schnelle Datumsauswahl
   - X-Button zum Löschen des ausgewählten Datums

### Verbesserte Benutzeroberfläche
- **Bessere Sichtbarkeit**: Alle Formularfelder haben jetzt gute Kontraste
- **Icons in Dropdowns**: Kategorien und Prioritäten sind mit Icons versehen
- **Farbkodierung**: Prioritäten sind farblich gekennzeichnet (🟢🟡🔴)
- **Responsive Kalender**: Funktioniert optimal auf Desktop und Mobile

### Datenpersistierung
- **PostgreSQL-Speicherung**: Alle Änderungen werden in der Datenbank gespeichert
- **Reihenfolge wird beibehalten**: Die Drag & Drop Reihenfolge wird gespeichert
- **Kategoriewechsel**: Aufgaben behalten ihre Eigenschaften beim Verschieben

## GTD-Prinzipien

Diese App folgt den Getting Things Done Prinzipien von David Allen:

- **Capture**: Alle Aufgaben werden in der Inbox gesammelt
- **Clarify**: Aufgaben werden in die entsprechenden Kategorien einsortiert
- **Organize**: Jede Kategorie hat eine klare Bedeutung und Verwendung
- **Reflect**: Regelmäßige Überprüfung der verschiedenen Kategorien
- **Engage**: Fokus auf die "Next" Kategorie für sofortige Aktionen

## Tastatur- und Mausbedienung

- **Drag & Drop**: Klicken und ziehen Sie Aufgaben, um sie neu anzuordnen oder zu verschieben
- **Cross-Category Drag**: Ziehen Sie Aufgaben zwischen verschiedenen Kategorien
- **Modal schließen**: Klicken Sie auf das ✕ Symbol oder außerhalb des Modals
- **Formular absenden**: Drücken Sie Enter im Titel-Feld oder klicken Sie "Speichern"
- **Kategoriewechsel**: Klicken Sie auf die Sidebar-Menüpunkte
- **Kalender-Navigation**: Verwenden Sie die Pfeiltasten oder klicken Sie auf die Navigation
- **Datum löschen**: Klicken Sie auf das X-Symbol im Datumsfeld

## Troubleshooting

### Docker-Probleme
```bash
# Container-Logs prüfen
docker-compose logs gtd-app
docker-compose logs backend
docker-compose logs postgres

# Datenbank-Verbindung testen
docker-compose exec postgres psql -U gtd_user -d gtd_tasks

# Services neu starten
docker-compose restart
```

### Datenbank-Probleme
```bash
# Datenbank zurücksetzen
docker-compose down -v
docker-compose up -d

# pgAdmin verwenden
# Öffnen Sie http://localhost:5050
# Verbinden Sie sich mit:
# Host: postgres
# Port: 5432
# Database: gtd_tasks
# Username: gtd_user
# Password: gtd_password
```

## Sicherheit

- **Helmet**: Security Headers
- **CORS**: Cross-Origin Resource Sharing konfiguriert
- **Rate Limiting**: API-Rate-Limiting aktiviert
- **Input Validation**: Server-seitige Validierung
- **SQL Injection Protection**: Parameterized Queries
- **Non-root User**: Docker-Container laufen als non-root User

## Performance

- **Nginx**: Reverse Proxy mit Gzip-Kompression
- **Database Indexes**: Optimierte Datenbank-Indizes
- **Connection Pooling**: PostgreSQL Connection Pooling
- **Caching**: Statische Assets-Caching
- **Compression**: Gzip-Kompression aktiviert
