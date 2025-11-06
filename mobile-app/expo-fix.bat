@echo off
echo Fixing Expo Go network issues...

echo 1. Clearing Expo cache...
npx expo install --fix

echo 2. Starting with tunnel mode for better connectivity...
npx expo start --tunnel --clear

echo If tunnel doesn't work, try:
echo - Press 'w' for web version
echo - Press 'a' for Android emulator
echo - Make sure phone and PC are on same WiFi