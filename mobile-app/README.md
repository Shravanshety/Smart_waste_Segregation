# Smart Waste Segregation Mobile App

A comprehensive mobile application for smart waste management with AI-powered image recognition, QR code integration, and gamification features.

## 🌟 Features

### 1. User Registration & Unique ID
- User registration with unique household QR code generation
- Secure login system with local SQLite database
- Profile management with household information

### 2. QR Code-Based Waste Logging
- Scan QR codes on smart bins, collection trucks, or household bins
- Mandatory QR scanning before waste submission
- Integration with camera for seamless workflow

### 3. AI Image Recognition Verification
- **End-user level**: Real-time waste classification using YOLOv5 model
- **Collector level**: Verification system for accuracy checking
- Support for multiple waste categories: dry, wet, hazardous
- Confidence scoring and accuracy feedback

### 4. Reward System Integration
- Points-based reward system
- Frequency and consistency tracking
- Negative points for incorrect classifications
- Redeemable rewards (vouchers, eco-products, etc.)

### 5. Gamification & Community Impact
- Leaderboards with rankings
- Level system based on points and consistency
- Achievement badges and special categories
- Community challenges and streaks

### 6. Comprehensive User Dashboard
- Real-time points and level display
- Daily/weekly/monthly waste disposal statistics
- QR code display for easy access
- Quick action buttons for common tasks

## 🛠️ Technology Stack

- **Framework**: React Native with Expo
- **AI/ML**: TensorFlow.js with YOLOv5 model integration
- **Database**: SQLite for local data storage
- **Camera**: Expo Camera for image capture
- **QR Scanner**: Expo Barcode Scanner
- **UI Components**: React Native Paper
- **Navigation**: React Navigation

## 📱 Screens

1. **Login/Register**: User authentication and account creation
2. **Dashboard**: Main hub with stats, QR code, and quick actions
3. **Camera**: AI-powered waste classification with image capture
4. **QR Scanner**: Scan waste bin/truck QR codes
5. **Leaderboard**: Community rankings and achievements
6. **Rewards**: Point redemption and available rewards
7. **History**: Detailed waste disposal history and analytics

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation Steps

1. **Clone the repository**
   ```bash
   cd mobile-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/emulator**
   ```bash
   # For Android
   npm run android
   
   # For iOS
   npm run ios
   
   # For web
   npm run web
   ```

## 🤖 AI Model Integration

The app integrates with the YOLOv5 model from the [Smart-Waste-Sorter](https://github.com/Prajakta713/Smart-Waste-Sorter) project:

### Supported Waste Categories
- **Cardboard**: Boxes, packaging materials
- **Glass**: Bottles, jars, containers
- **Metal**: Cans, foil, metal containers
- **Paper**: Documents, newspapers, magazines
- **Plastic**: Bottles, containers, packaging
- **Organic**: Food waste, biodegradable materials

### Classification Process
1. User captures image of waste
2. Image preprocessed and sent to YOLOv5 model
3. Model returns classification with confidence score
4. User selects their category choice
5. Points awarded based on accuracy match

## 🎮 Gamification Features

### Point System
- **Correct Classification**: +10-15 points
- **High Confidence (>90%)**: +3 bonus points
- **Daily Streak**: +5 bonus points
- **Incorrect Classification**: -5 points

### Levels & Achievements
- **Beginner** (0-99 points): 🌱
- **Intermediate** (100-299 points): ⭐
- **Advanced** (300-499 points): 🔥
- **Expert** (500-699 points): 💎
- **Master** (700+ points): 🌟

### Rewards Catalog
- Shopping vouchers (₹50-₹100)
- Eco-friendly products
- Movie tickets
- Bike rentals
- Plant saplings
- Organic fertilizers

## 📊 Analytics & Insights

### User Dashboard Metrics
- Total points earned
- Current level and progress
- Daily/weekly/monthly submissions
- Accuracy percentage
- Category-wise breakdown
- Consistency streaks

### Performance Tracking
- Submission history with timestamps
- Classification accuracy trends
- Points earned/lost over time
- Category preferences
- Improvement suggestions

## 🔧 Configuration

### Database Schema
The app uses SQLite with the following main tables:
- `users`: User accounts and profiles
- `waste_submissions`: Waste logging records
- `rewards`: Reward redemption history

### Environment Setup
Create a `.env` file in the root directory:
```
MODEL_URL=https://your-model-hosting-url/model.json
API_BASE_URL=https://your-backend-api-url
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Smart-Waste-Sorter](https://github.com/Prajakta713/Smart-Waste-Sorter) for the YOLOv5 model
- Expo team for the excellent development platform
- React Native Paper for UI components
- TensorFlow.js team for ML integration

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

---

**Made with ❤️ for a cleaner, smarter future** 🌍