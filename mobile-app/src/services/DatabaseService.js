import AsyncStorage from '@react-native-async-storage/async-storage';

class DatabaseService {
  constructor() {
    this.initStorage();
  }

  async initStorage() {
    try {
      const users = await AsyncStorage.getItem('users');
      if (!users) {
        const defaultUsers = [
          { id: 1, username: 'admin', password: 'admin123', role: 'ADMIN', email: 'admin@app.com', qr_code: 'ADMIN_001', total_points: 0 },
          { id: 2, username: 'demo_user', password: 'password123', role: 'USER', email: 'demo@app.com', qr_code: 'USER_DEMO_001', total_points: 50 },
          { id: 3, username: 'eco_warrior', password: 'green123', role: 'USER', email: 'eco@app.com', qr_code: 'USER_ECO_001', total_points: 120 }
        ];
        await AsyncStorage.setItem('users', JSON.stringify(defaultUsers));
        await AsyncStorage.setItem('collector_requests', JSON.stringify([]));
        await AsyncStorage.setItem('waste_submissions', JSON.stringify([]));
      }
    } catch (error) {
      console.log('Storage init error:', error);
    }
  }

  async loginUser(username, password) {
    try {
      const users = JSON.parse(await AsyncStorage.getItem('users') || '[]');
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        return { success: true, user };
      } else {
        return { success: false, message: 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, message: 'Login failed' };
    }
  }

  async registerUser(userData) {
    try {
      const qrCode = `USER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const users = JSON.parse(await AsyncStorage.getItem('users') || '[]');
      const existingUser = users.find(u => u.username === userData.username || u.email === userData.email);
      
      if (existingUser) {
        throw new Error('User already exists');
      }
      
      const newUser = {
        id: users.length + 1,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: 'USER',
        qr_code: qrCode,
        total_points: 0,
        level: 1
      };
      
      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      return { success: true, qrCode, userId: newUser.id };
    } catch (error) {
      throw error;
    }
  }

  async getUserStats(userId) {
    try {
      const users = JSON.parse(await AsyncStorage.getItem('users') || '[]');
      const user = users.find(u => u.id === userId);
      const submissions = JSON.parse(await AsyncStorage.getItem('waste_submissions') || '[]')
        .filter(s => s.user_id === userId);
      
      return {
        total_points: user?.total_points || 0,
        level: user?.level || 1,
        total_submissions: submissions.length,
        correct_submissions: submissions.filter(s => s.points_earned > 0).length
      };
    } catch (error) {
      return {
        total_points: 0,
        level: 1,
        total_submissions: 0,
        correct_submissions: 0
      };
    }
  }

  async submitWaste(submissionData) {
    try {
      const accuracy = submissionData.predictedCategory === submissionData.userCategory ? 1.0 : 0.0;
      const points = accuracy >= 0.8 ? 10 : -5;
      
      const submissions = JSON.parse(await AsyncStorage.getItem('waste_submissions') || '[]');
      const users = JSON.parse(await AsyncStorage.getItem('users') || '[]');
      
      const newSubmission = {
        id: Date.now(),
        user_id: submissionData.userId,
        points_earned: points,
        accuracy_score: accuracy,
        ...submissionData
      };
      
      submissions.push(newSubmission);
      
      const userIndex = users.findIndex(u => u.id === submissionData.userId);
      if (userIndex >= 0) {
        users[userIndex].total_points += points;
      }
      
      await AsyncStorage.setItem('waste_submissions', JSON.stringify(submissions));
      await AsyncStorage.setItem('users', JSON.stringify(users));
      
      return { success: true, points, accuracy };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getWasteHistory(userId, limit = 20) {
    try {
      const submissions = JSON.parse(await AsyncStorage.getItem('waste_submissions') || '[]')
        .filter(s => s.user_id === userId)
        .slice(0, limit);
      return submissions;
    } catch (error) {
      return [];
    }
  }

  async getLeaderboard(limit = 10) {
    try {
      const users = JSON.parse(await AsyncStorage.getItem('users') || '[]')
        .filter(u => u.role !== 'ADMIN')
        .sort((a, b) => b.total_points - a.total_points)
        .slice(0, limit);
      return users;
    } catch (error) {
      return [];
    }
  }

  async requestCollectorRole(userId) {
    try {
      const requests = JSON.parse(await AsyncStorage.getItem('collector_requests') || '[]');
      requests.push({ id: Date.now(), user_id: userId, status: 'PENDING' });
      await AsyncStorage.setItem('collector_requests', JSON.stringify(requests));
      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  async getPendingCollectorRequests() {
    try {
      const requests = JSON.parse(await AsyncStorage.getItem('collector_requests') || '[]')
        .filter(r => r.status === 'PENDING');
      const users = JSON.parse(await AsyncStorage.getItem('users') || '[]');
      
      const result = requests.map(r => {
        const user = users.find(u => u.id === r.user_id);
        return { ...r, username: user?.username, email: user?.email };
      });
      return result;
    } catch (error) {
      return [];
    }
  }

  async approveCollectorRequest(requestId, userId) {
    try {
      const requests = JSON.parse(await AsyncStorage.getItem('collector_requests') || '[]');
      const users = JSON.parse(await AsyncStorage.getItem('users') || '[]');
      
      const requestIndex = requests.findIndex(r => r.id === requestId);
      if (requestIndex >= 0) {
        requests[requestIndex].status = 'APPROVED';
      }
      
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex >= 0) {
        users[userIndex].role = 'COLLECTOR';
      }
      
      await AsyncStorage.setItem('collector_requests', JSON.stringify(requests));
      await AsyncStorage.setItem('users', JSON.stringify(users));
      return { success: true };
    } catch (error) {
      throw error;
    }
  }
}

export default new DatabaseService();