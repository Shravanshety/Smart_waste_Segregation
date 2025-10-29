# 🌱 Smart Waste Segregation System

A comprehensive web application that connects citizens and waste collectors through an incentive-based waste management system with QR code integration.

## 🚀 Features

- **Multi-role Authentication**: Admin, Waste Collector, and End User roles
- **QR Code Integration**: Unique QR codes for each user for easy tracking
- **Incentive System**: Points-based rewards for proper waste segregation
- **Real-time Tracking**: Live waste collection and quality scoring
- **Admin Panel**: Complete system management and analytics
- **Responsive Design**: Modern light-themed UI with background video

## 🛠️ Technology Stack

- **Backend**: Java (Servlets/Spring Boot)
- **Frontend**: HTML5, CSS3, JavaScript
- **Database**: SQLite
- **QR Codes**: Google Charts API
- **Styling**: Custom CSS with gradients and animations

## 📁 Project Structure

```
smart-waste-segregation/
├── backend/
│   ├── src/
│   │   ├── UserServlet.java
│   │   └── QRCodeHandler.java
│   └── model/
│       ├── User.java
│       └── Waste.java
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── dashboard-admin.html
│   ├── dashboard-user.html
│   ├── dashboard-collector.html
│   └── assets/
│       ├── css/style.css
│       ├── video/
│       └── images/
├── database/
│   └── schema.sql
└── README.md
```

## 🎯 User Roles

### 👤 End Users
- Sign up and get unique QR code
- Track waste submissions and quality scores
- Earn incentive points for proper segregation
- View personal dashboard with statistics

### 🚛 Waste Collectors
- Scan user QR codes during collection
- Rate waste quality (1-10 scale)
- Submit waste reports by type (Dry/Wet/Hazardous/Mixed)
- Track daily collections

### ⚙️ Administrators
- Create and manage collector accounts
- View system-wide statistics
- Monitor waste collection trends
- Manage user access and permissions

## 🏃‍♂️ Getting Started

1. **Setup Database**:
   ```sql
   sqlite3 waste_db.sqlite < database/schema.sql
   ```

2. **Configure Backend**:
   - Set up Java servlet container (Tomcat/Jetty)
   - Configure database connection
   - Deploy servlet classes

3. **Launch Frontend**:
   - Open `frontend/index.html` in web browser
   - Or serve via local web server

4. **Default Login Credentials**:
   - Admin: `admin` / `admin123`
   - Collector: `collector1` / `collect123`
   - User: `john_doe` / `password123`

## 🎨 Design Features

- **Light Theme**: Clean, modern interface with colorful gradients
- **Background Video**: Environmental footage for engaging homepage
- **Responsive Layout**: Works on desktop and mobile devices
- **Interactive Elements**: Hover effects and smooth transitions
- **QR Code Display**: Integrated QR code generation and scanning

## 📊 Incentive System

| Waste Type | Base Points | Quality Multiplier |
|------------|-------------|-------------------|
| Dry Waste  | 10 points   | Score/10         |
| Wet Waste  | 8 points    | Score/10         |
| Hazardous  | 15 points   | Score/10         |
| Mixed      | 3 points    | Score/10         |

## 🔧 Development Setup

1. Install Java Development Kit (JDK 11+)
2. Set up servlet container (Apache Tomcat recommended)
3. Configure SQLite database
4. Add required dependencies for QR code generation
5. Deploy and test the application

## 📱 QR Code Integration

- Each user gets a unique QR code: `USER_ID:123`
- Collectors scan codes to identify users
- System tracks all waste submissions via QR
- Google Charts API used for QR generation

## 🌟 Future Enhancements

- Mobile app for collectors
- GPS tracking for waste trucks
- Email notifications
- PDF report generation
- Integration with payment systems for rewards

## 📄 License

This project is open source and available under the MIT License.