# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an ASEAN Universal Verifier React application for validating COVID-19 vaccination certificates from ASEAN member countries. The app supports different certificate formats including DIVOC (Indonesia), EU DCC (Malaysia, Thailand, Vietnam), and URL-based QR codes (Brunei, Myanmar).

## Commands

### Development
- `yarn start` - Start development server on http://localhost:3000
- `yarn test` - Run tests in watch mode
- `yarn build` - Build production bundle
- `yarn eject` - Eject from Create React App (one-way operation)

### Docker
- `make docker` - Build Docker image as `dockerhub/verification`
- Docker builds use nginx to serve the production build

## Architecture

### Core Structure
- **React 17** application bootstrapped with Create React App
- **Redux** for state management with Provider wrapper
- **React Bootstrap** for UI components
- **Single Page Application** with main verification flow

### Key Components
- `VerifyCertificate` - Main component handling country selection and QR scanning
- `QRScanner` - QR code scanning functionality using zbar.wasm
- `CertificateStatus/` - Country-specific certificate verification components:
  - `CertEU.js` - EU DCC format (Malaysia, Thailand, Vietnam)
  - `CertBR.js` - Brunei URL-based certificates
  - `CertSG.js` - Singapore certificates
  - `CertMYM.js` - Myanmar certificates
  - `index.js` - Default DIVOC format (Indonesia, Philippines, India)

### Certificate Processing Flow
1. User selects country from list
2. QR code is scanned and processed based on country:
   - **EU DCC countries** (Malaysia, Thailand, Vietnam): Direct QR data processing
   - **URL-based countries** (Brunei, Myanmar, Singapore): Direct QR data processing
   - **DIVOC countries** (Indonesia, Philippines, India): JSZip extraction of certificate.json

### Utils and Context
- `utils/context/` - Vaccination context configurations for different countries
- `constants.js` - Certificate detail path mappings for Indonesia and Philippines
- `utils.js` - Utility functions like ordinal suffix generation

### Certificate Verification Status
Countries currently supported:
- ✅ Brunei, Indonesia, Malaysia, Myanmar, Thailand
- ❌ Cambodia, Laos, Philippines, Singapore, Vietnam (various issues)

### Dependencies Note
- Uses `zbar.wasm` for QR code scanning
- `JSZip` for DIVOC certificate extraction
- `sweetalert2` for user notifications
- `cose-js`, `cbor`, `base45` for EU DCC processing
- `@fidm/x509` for certificate validation