@echo off
echo Setting up Smart Waste Segregation System...

REM Create database
echo Creating SQLite database...
sqlite3 waste_db.sqlite < database\schema.sql
echo Database created successfully!

REM Build project with Maven
echo Building project with Maven...
mvn clean compile war:war

REM Instructions
echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Install Apache Tomcat 9 or 10
echo 2. Copy target\smart-waste-segregation-1.0.0.war to Tomcat webapps folder
echo 3. Start Tomcat server
echo 4. Access: http://localhost:8080/smart-waste-segregation-1.0.0/
echo.
echo Default login credentials:
echo - Admin: admin / admin123
echo - Collector: collector1 / collect123  
echo - User: john_doe / password123
echo.
pause