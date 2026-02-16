# Reckognyze Browser Extension

A Chrome/Edge browser extension for managing personalization profiles with Reckognyze.

## Features

- **Profile Management**: Create and manage multiple user profiles
- **Reckognyze Detection**: Automatically detects websites with Reckognyze installed
- **Floating Panel**: Access your profiles from any website
- **Responsive Design**: Desktop panel (20% viewport) and mobile slide-out menu
- **Profile Data**: Store sizing, color preferences, allergies, and personal status

## Installation (Development)
##test

1. Navigate to the extension directory:
   ```bash
   cd browser-extension
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load in Chrome/Edge:
   - Open `chrome://extensions/` or `edge://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `browser-extension/dist` folder

## Usage

1. Click the Reckognyze icon in your browser toolbar
2. Create a profile with your preferences
3. Enable Reckognyze personalization
4. Visit websites with Reckognyze installed
5. Use the floating button (bottom-left) to access your profile panel

## Profile Fields

- **Name**: Profile identifier
- **Gender Identity**: Personal preference
- **Height**: With cm or ft-in units
- **Waist Size**: With inches or cm units
- **Shoe Size**: US, UK, or EU sizing
- **T-Shirt Size**: XS to XXXL
- **Color Preferences**: Favorite colors for recommendations
- **Allergies**: Dietary or material allergies
- **Married**: Relationship status
- **Has Children**: Family status

## Development

```bash
# Watch mode for development
npm run dev

# Production build
npm run build
```

## Project Structure

```
browser-extension/
├── src/
│   ├── background/      # Service worker
│   ├── content/         # Content script (injected into pages)
│   ├── popup/           # Extension popup UI
│   ├── panel/           # Floating profile panel
│   ├── components/      # Shared React components
│   ├── storage/         # Chrome storage utilities
│   ├── types/           # TypeScript types
│   └── lib/             # Utilities
├── dist/                # Built extension (load this in browser)
└── public/              # Static assets
```
