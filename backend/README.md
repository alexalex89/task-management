# GTD Task Management Backend

Backend API für die GTD (Getting Things Done) Task Management Anwendung.

## Features

- **Automatische Datenbankinitialisierung**: Die Anwendung erstellt automatisch die benötigten Tabellen und Sample-Daten, falls sie noch nicht existieren
- **Robuste Datenbankverbindung**: Wartet automatisch auf die Datenbank und versucht die Verbindung mehrmals
- **Health Checks**: Überwacht die Datenbankverbindung und API-Verfügbarkeit
- **RESTful API**: Vollständige CRUD-Operationen für Tasks
- **Sicherheit**: Helmet, CORS, Rate Limiting und andere Sicherheitsmaßnahmen

## Datenbankinitialisierung

Die Anwendung initialisiert automatisch die PostgreSQL-Datenbank beim ersten Start:

### Automatisch erstellte Tabellen:
- `tasks` - Haupttabelle für Aufgaben
- `users` - Benutzer-Tabelle (für zukünftige Authentifizierung)
- Indizes für bessere Performance
- Trigger für automatische `updated_at` Updates

### Sample-Daten:
Die Anwendung fügt automatisch 5 Beispielaufgaben hinzu, falls die Tabelle leer ist.

## Umgebungsvariablen

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gtd_tasks
DB_USER=gtd_user
DB_PASSWORD=gtd_password
NODE_ENV=production
PORT=3000
```

## API-Endpunkte

- `GET /health` - Health Check mit Datenbankstatus
- `GET /api/tasks` - Alle Aufgaben abrufen
- `POST /api/tasks` - Neue Aufgabe erstellen
- `PUT /api/tasks/:id` - Aufgabe aktualisieren
- `PATCH /api/tasks/:id/toggle` - Aufgabe als erledigt markieren
- `DELETE /api/tasks/:id` - Aufgabe löschen
- `POST /api/tasks/reorder` - Aufgaben neu ordnen
- `GET /api/stats` - Statistiken abrufen

## Starten der Anwendung

### Entwicklung
```bash
npm run dev
```

### Produktion
```bash
npm start
```

### Mit Docker
```bash
docker-compose up backend
```

## Datenbankverbindung

Die Anwendung wartet automatisch auf die Datenbank und initialisiert sie beim ersten Start. Falls die Datenbank nicht verfügbar ist, wird sie mehrmals versucht zu verbinden (Standard: 30 Versuche, alle 2 Sekunden).

## Health Check

Der Health Check-Endpunkt (`/health`) prüft:
- API-Verfügbarkeit
- Datenbankverbindung
- Gibt detaillierte Statusinformationen zurück

## Fehlerbehandlung

- Automatische Wiederherstellung bei Datenbankverbindungsproblemen
- Graceful Shutdown bei SIGTERM/SIGINT
- Umfassende Fehlerprotokollierung 
