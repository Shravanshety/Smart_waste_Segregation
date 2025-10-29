# 🚀 Quick Start Guide

## Prerequisites
1. **Java JDK 11+** - Download from Oracle or OpenJDK
2. **Apache Maven** - Download from https://maven.apache.org/
3. **Apache Tomcat 9/10** - Download from https://tomcat.apache.org/
4. **SQLite** - Download from https://sqlite.org/

## Setup Steps

### 1. Install Prerequisites
```bash
# Verify Java installation
java -version

# Verify Maven installation  
mvn -version
```

### 2. Build Project
```bash
# Run the setup script
run-setup.bat

# OR manually:
sqlite3 waste_db.sqlite < database\schema.sql
mvn clean compile war:war
```

### 3. Deploy to Tomcat
1. Copy `target\smart-waste-segregation-1.0.0.war` to Tomcat `webapps` folder
2. Start Tomcat: `bin\startup.bat`
3. Access: http://localhost:8080/smart-waste-segregation-1.0.0/

## Alternative: Simple File Server
For quick testing without Tomcat:

```bash
# Navigate to webapp folder
cd src\main\webapp

# Start Python server (if Python installed)
python -m http.server 8000

# Access: http://localhost:8000
```

## Default Login Credentials
- **Admin**: admin / admin123
- **Collector**: collector1 / collect123  
- **User**: john_doe / password123

## Troubleshooting
- Ensure all ports (8080, 8000) are available
- Check Java/Maven PATH variables
- Verify Tomcat is running: http://localhost:8080