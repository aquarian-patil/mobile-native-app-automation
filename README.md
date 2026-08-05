# 📱 Enterprise Mobile Native E2E Test Automation Framework

Welcome to the **Mobile Native E2E Test Automation Framework**! This repository demonstrates a robust, production-grade architecture for automating mobile native applications (Android & iOS) using **WebdriverIO** and **Appium**, heavily integrated with cloud execution via **BrowserStack** and beautiful unified reporting via **CTRF**.

---

## 🚀 Key Features

- **Cross-Platform Support**: Write once, run everywhere. Tests execute seamlessly across both Android and iOS real devices.
- **Strict Page Object Model (POM)**: Highly maintainable architecture separating test logic from page locators and interactions.
- **Cloud Execution**: Natively integrated with **BrowserStack** App Automate for massively parallel execution on real devices.
- **Unified Reporting (CTRF)**:
  - **GitHub Actions Integration**: Beautiful inline summaries directly in PRs and workflow runs.
  - **Static HTML Reports**: A stunning, dark-themed, and interactive VitePress-based report automatically deployed to **GitHub Pages**.
- **CI/CD Ready**: Fully containerized GitHub Actions pipeline with daily cron schedules, PR checks, and dynamic artifact management.
- **Automated Email Notifications**: Stakeholders receive automated rich HTML emails post-execution detailing pass/fail metrics.

---

## 🛠️ Technology Stack

- **Core Engine**: [WebdriverIO](https://webdriver.io/) (v8) + [Appium](https://appium.io/)
- **Language**: TypeScript / Node.js
- **Cloud Provider**: BrowserStack
- **Reporting**: CTRF (Common Test Report Format)
- **CI/CD**: GitHub Actions + GitHub Pages

---

## 📂 Framework Architecture

```text
mobile-native-app-demo/
├── .github/workflows/        # CI/CD pipelines (BrowserStack integration, Pages deployment)
├── config/                   # Capabilities, environment, and BrowserStack configurations
├── test/
│   ├── pageobjects/          # POM classes (screens, locators, methods)
│   ├── specs/                # Test scenarios and assertions
├── scripts/                  # CI/CD utility scripts (CTRF report enhancement, emails)
├── wdio.conf.ts              # Master WebdriverIO configuration
└── package.json              # Dependencies and NPM scripts
```

---

## 💻 Getting Started

### Prerequisites
1. Node.js (v18 or higher)
2. BrowserStack Account (Username & Access Key)

### Installation
```bash
git clone https://github.com/aquarian-patil/mobile-native-app-demo.git
cd mobile-native-app-demo
npm install
```

### Local Execution (BrowserStack)
To run tests locally while pointing to BrowserStack cloud devices, ensure your credentials are set:
```bash
# Windows (PowerShell)
$env:BROWSERSTACK_USERNAME="your-username"
$env:BROWSERSTACK_ACCESS_KEY="your-access-key"

# Mac/Linux
export BROWSERSTACK_USERNAME="your-username"
export BROWSERSTACK_ACCESS_KEY="your-access-key"
```

Run the Android tests:
```bash
npm run test:wiki
```

Run the SauceLabs sample app tests:
```bash
npm run test:sauce
```

---

## 📊 Reporting & CI/CD

This framework uses **CTRF** (Common Test Report Format) to guarantee that testing metadata is preserved beautifully across every level of the pipeline.

1. **GitHub Actions**: Every push or PR triggers a run on BrowserStack.
2. **GitHub Summary**: A CTRF summary is injected into the GitHub Actions run UI.
3. **GitHub Pages**: A stunning VitePress HTML report is generated and pushed to the `gh-pages` branch, viewable publicly by stakeholders.
4. **Email Integration**: The pipeline automatically sends out email summaries.

Check out the live report here: [Mobile Native Automation Report](https://aquarian-patil.github.io/mobile-native-app-demo/)

---

## 👤 Author

**Nithin Patil**  
QA Automation Architect  
Passionate about designing scalable, modern testing frameworks. 

*(Check out my API and Web UI Playwright framework as well!)*
