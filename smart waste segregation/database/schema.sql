-- Smart Waste Segregation Database Schema

-- Users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'USER', -- USER, COLLECTOR, ADMIN
    qr_code VARCHAR(255),
    incentive_points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Waste submissions table
CREATE TABLE waste_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    collector_id INTEGER NOT NULL,
    waste_type VARCHAR(20) NOT NULL, -- DRY, WET, HAZARDOUS, MIXED
    quality_score INTEGER NOT NULL CHECK (quality_score >= 1 AND quality_score <= 10),
    points_earned INTEGER NOT NULL,
    submission_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (collector_id) REFERENCES users(id)
);

-- Collector details table
CREATE TABLE collector_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    truck_id VARCHAR(50) UNIQUE NOT NULL,
    area_assigned VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert default admin user
INSERT INTO users (username, password, email, role) 
VALUES ('admin', 'admin123', 'admin@wastesystem.com', 'ADMIN');

-- Insert sample users
INSERT INTO users (username, password, email, role, qr_code, incentive_points) 
VALUES 
('john_doe', 'password123', 'john@email.com', 'USER', 'USER_ID:2', 150),
('jane_smith', 'password123', 'jane@email.com', 'USER', 'USER_ID:3', 89),
('collector1', 'collect123', 'collector1@email.com', 'COLLECTOR', NULL, 0);

-- Insert collector details
INSERT INTO collector_details (user_id, truck_id, area_assigned) 
VALUES (4, 'TRUCK001', 'Downtown Area');

-- Insert sample waste submissions
INSERT INTO waste_submissions (user_id, collector_id, waste_type, quality_score, points_earned) 
VALUES 
(2, 4, 'DRY', 9, 9),
(2, 4, 'WET', 8, 6),
(3, 4, 'DRY', 7, 7),
(3, 4, 'HAZARDOUS', 10, 15);