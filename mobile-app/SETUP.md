# Smart Waste App - Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd mobile-app
npm install
```

### 2. Install Expo CLI (if not already installed)
```bash
npm install -g expo-cli
```

### 3. Start Development Server
```bash
npm start
```

### 4. Run on Device
- Install Expo Go app on your phone
- Scan QR code from terminal/browser
- Or use Android/iOS simulator

## 📱 Testing the App

### Demo Accounts
The app comes with pre-configured demo data:

**Test User 1:**
- Username: `demo_user`
- Password: `password123`

**Test User 2:**
- Username: `eco_warrior`
- Password: `green123`

### QR Codes for Testing
Use these QR code values for testing waste logging:
- `WASTE_BIN_001` - Smart bin #1
- `TRUCK_ABC123` - Collection truck
- `USER_DEMO_001` - Household bin

## 🤖 AI Model Integration

### YOLOv5 Model Setup
1. Download the trained model from [Smart-Waste-Sorter](https://github.com/Prajakta713/Smart-Waste-Sorter)
2. Convert to TensorFlow.js format:
   ```bash
   pip install tensorflowjs
   tensorflowjs_converter --input_format=tf_saved_model --output_format=tfjs_graph_model ./saved_model ./web_model
   ```
3. Host the model files on a web server
4. Update the model URL in `WasteClassificationService.js`

### Mock Classification
For testing without the actual model, the app uses mock classification that randomly assigns waste categories with realistic confidence scores.

## 🛠️ Development Features

### Database
- SQLite database automatically created on first run
- Tables: users, waste_submissions, rewards
- Sample data populated for testing

### Camera Integration
- Real-time camera preview
- Image capture and processing
- Gallery image selection
- QR code scanning integration

### Offline Support
- Local SQLite database
- Cached user data
- Works without internet (except AI model)

## 📊 Features Implemented

✅ **User Registration & Unique QR Code**
- Account creation with unique household ID
- QR code generation for each user
- Secure local authentication

✅ **QR Code-Based Waste Logging**
- Mandatory QR scanning before waste submission
- Support for bin, truck, and household QR codes
- Integrated camera workflow

✅ **AI Image Recognition**
- YOLOv5 model integration
- Real-time waste classification
- Confidence scoring and validation
- User category selection and comparison

✅ **Reward System**
- Points-based scoring system
- Positive points for correct classification
- Negative points for incorrect classification
- Redeemable rewards catalog

✅ **Gamification**
- User levels and progress tracking
- Community leaderboard
- Achievement system
- Consistency streaks

✅ **User Dashboard**
- Real-time statistics
- QR code display
- Quick action buttons
- Performance insights

## 🔧 Customization

### Adding New Waste Categories
1. Update `classes` array in `WasteClassificationService.js`
2. Add category mappings in `wasteCategories`
3. Update UI icons in relevant screens

### Modifying Point System
Edit the `calculatePoints` function in `WasteClassificationService.js`:
```javascript
calculatePoints(classification, userCategory) {
  const basePoints = 10; // Modify base points
  const confidenceBonus = Math.floor(classification.confidence * 5);
  // Add custom logic here
}
```

### Adding New Rewards
Update the `rewards` array in `RewardsScreen.js` with new items:
```javascript
{
  id: 9,
  title: 'New Reward',
  description: 'Description',
  points: 100,
  category: 'category',
  icon: '🎁'
}
```

## 🐛 Troubleshooting

### Camera Not Working
- Check device permissions
- Ensure camera access is granted
- Restart the app

### QR Scanner Issues
- Ensure good lighting
- Hold device steady
- Check QR code format

### Model Loading Errors
- Verify model URL is accessible
- Check internet connection
- Falls back to mock classification

### Database Issues
- Clear app data and restart
- Check SQLite permissions
- Reinstall the app

## 📱 Building for Production

### Android APK
```bash
expo build:android
```

### iOS IPA
```bash
expo build:ios
```

### Web Build
```bash
expo build:web
```

## 🔄 Updates & Maintenance

### Adding New Features
1. Create new screen in `src/screens/`
2. Add navigation route in `App.js`
3. Update database schema if needed
4. Test thoroughly

### Performance Optimization
- Optimize image processing
- Implement lazy loading
- Cache frequently used data
- Minimize re-renders

## 📞 Support

For issues and questions:
- Check this setup guide
- Review error logs in Expo DevTools
- Test on different devices
- Contact development team

---

**Happy coding! 🚀**