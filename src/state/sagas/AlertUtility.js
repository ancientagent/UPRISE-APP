import { Alert } from 'react-native';

// Track recent alerts to prevent spam
let recentAlerts = [];
const ALERT_COOLDOWN = 2000; // 2 seconds

const showAlert = (message, title = 'Alert') => {
  const now = Date.now();
  const alertKey = `${title}:${message}`;
  
  // Remove old alerts from tracking
  recentAlerts = recentAlerts.filter(alert => now - alert.timestamp < ALERT_COOLDOWN);
  
  // Check if this alert was shown recently
  const isDuplicate = recentAlerts.some(alert => alert.key === alertKey);
  
  if (!isDuplicate) {
    // Add to tracking
    recentAlerts.push({ key: alertKey, timestamp: now });
    
    // Show alert only if it's not a duplicate
    console.log(`Alert: ${title} - ${message}`); // Log for debugging
    Alert.alert(title, message, [
      { text: 'OK', onPress: () => {} }
    ]);
  } else {
    console.log(`Duplicate alert prevented: ${title} - ${message}`);
  }
};

export default showAlert; 