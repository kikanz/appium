Mobile Automation Framework for Wikipedia Android App
Prerequisites

Node.js (v20+)
Java Development Kit (JDK)
Android SDK
Appium Server
Android Emulator or Physical Device

Setup

Clone the repository
Install dependencies:

bashnpm install

Download Wikipedia APK and place in ./apps/wikipedia.apk
Ensure Appium is installed:

bashnpm install -g appium

Start Android Emulator

Running Tests
bash# Run all tests
npm test

# Run Android-specific tests
npm run test:android
Test Scenarios

Search Functionality

Verify search results appear
Search for an article


Article Saving

Open an article
Save the article
Verify article is saved



Design Patterns Used

Page Object Model
Singleton Pattern for Page Objects
Mocha BDD Framework

Reporting
Uses WebdriverIO spec reporter for test output
Optional Improvements

Screenshot on test failure
Detailed logging
Cross-platform support