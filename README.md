# SurakshaNet: Unified Cybercrime and Public Safety Dashboard

## Overview

SurakshaNet is a comprehensive cybersecurity and public safety platform designed specifically for the Chandigarh Police Cybercrime Unit. This unified dashboard integrates multiple AI-powered modules to assist law enforcement in detecting, analyzing, and preventing various types of cybercrimes and security threats.

## Purpose

The platform serves as a centralized command center for cybercrime investigation and prevention, providing officers with advanced tools to:

- Detect and analyze financial fraud
- Identify deepfake media
- Assist in missing persons cases
- Provide legal guidance to officers
- Analyze surveillance footage
- Detect voice phishing (vishing) scams
- Identify phishing emails

## Key Features

### 1. DhanRakshak - Financial Fraud Detection
- Analyzes UPI transactions for potential fraud
- Provides risk assessment (Low/Medium/High)
- Identifies suspicious patterns in transaction details
- Offers actionable recommendations

### 2. SatyaDarpan - Deepfake Media Analysis
- Detects AI-generated or manipulated images
- Identifies common deepfake artifacts
- Provides confidence scores and detailed explanations
- Supports multiple image formats

### 3. NetraTrace - Missing Persons Facial Recognition (Simulation)
- Simulates facial recognition against a missing persons database
- Generates potential matches with confidence scores
- Provides case details and last known locations
- Includes ethical use guidelines

### 4. Sahayak CopBot - Police Legal Assistant
- Provides information on Indian legal codes (IPC, CrPC, Evidence Act)
- Assists with police standard operating procedures
- Offers guidance on recent legal updates
- Maintains conversation history for reference

### 5. NigraniAI - Surveillance Analysis (Simulation)
- Analyzes video footage for suspicious activities
- Detects potential security threats
- Identifies unusual behaviors and objects
- Assigns alert levels to detected events

### 6. VaaniShield - VoIP Scam Detection
- Analyzes audio recordings of phone calls
- Identifies common scam indicators
- Provides risk assessment and recommendations
- Generates transcript summaries

### 7. Kavach MailGuard - Phishing Email Detection
- Analyzes email content for phishing attempts
- Identifies suspicious links and social engineering tactics
- Provides confidence scores and explanations
- Maintains history of analyzed emails

## Technology Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite (build tool)

### AI Integration
- Google Gemini AI API (gemini-2.5-flash-preview-04-17 model)
- Custom prompt engineering for specialized tasks

## System Requirements

- Node.js 18.0 or higher
- Modern web browser (Chrome, Firefox, Edge)
- Internet connection for API access
- Google Gemini API key

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-organization/surakshanet.git
   cd surakshanet
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Usage Guide

### Getting Started
1. Launch the application and view the dashboard home screen
2. Select a module based on the investigation need
3. Follow the module-specific instructions for data input
4. Review the AI-generated analysis and recommendations

### Module-Specific Instructions

#### DhanRakshak
- Enter sender and receiver UPI IDs
- Input transaction amount and any remarks
- Submit for fraud risk analysis

#### SatyaDarpan
- Upload an image file (JPEG, PNG, WebP, GIF)
- Maximum file size: 5MB
- Review deepfake detection results

#### NetraTrace
- Upload a clear facial image
- Maximum file size: 5MB
- Review potential matches from the simulated database

#### Sahayak CopBot
- Type legal or procedural queries in natural language
- Reference specific sections or acts for more precise answers
- Review conversation history for reference

#### NigraniAI
- Upload video footage (MP4, WebM, OGG, QuickTime)
- Maximum file size: 25MB
- Optionally specify areas of interest
- Review detected events with alert levels

#### VaaniShield
- Upload audio recording of suspicious call
- Supported formats: MP3, WAV, OGG, AAC, M4A
- Maximum file size: 10MB
- Review scam detection results and recommendations

#### Kavach MailGuard
- Enter email sender, subject, and body text
- Submit for phishing analysis
- Review detection results and save to history

## Ethical Considerations and Limitations

SurakshaNet is designed with the following ethical guidelines:

1. **Privacy Protection**: The system processes data locally where possible and does not store sensitive information unnecessarily.

2. **Simulation Disclaimers**: Modules like NetraTrace and NigraniAI clearly indicate they are simulations and not operational surveillance systems.

3. **Human Oversight**: All AI-generated analyses are meant to assist human officers, not replace their judgment.

4. **Transparency**: The system provides explanations for its assessments and confidence scores.

5. **Limitations Awareness**: Users are informed about the limitations of AI analysis and the need for verification.

## Roadmap

### Short-term (3-6 months)
- Integration with real-time UPI transaction monitoring
- Enhanced deepfake detection capabilities
- Improved audio analysis for regional languages
- Mobile-responsive design for field operations

### Medium-term (6-12 months)
- Integration with national crime databases
- Advanced analytics dashboard with trend analysis
- Multi-language support for all modules
- API endpoints for integration with existing police systems

### Long-term (1-2 years)
- Predictive analytics for crime prevention
- Blockchain integration for evidence integrity
- Expanded surveillance capabilities with ethical safeguards
- Comprehensive training program for law enforcement

## Dependencies

- React (^18.2.0)
- Google Generative AI (@google/genai ^1.0.1)
- Lucide React (^0.417.0)
- TypeScript (~5.7.2)
- Tailwind CSS (^3.4.17)
- Vite (^6.2.0)

## Contact Information

For more information about SurakshaNet, please contact:

- Chandigarh Police Cybercrime Unit
- Email: cybercrime@chandigarhpolice.gov.in
- Phone: +91-XXXXXXXXXX

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

© 2024 Chandigarh Police Cybercrime Unit. All rights reserved.
