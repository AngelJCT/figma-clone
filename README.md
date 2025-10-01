# Figma Clone - Multi-Device Web Design Tool

A simplified Figma clone built with Next.js, TypeScript, Tailwind CSS, and Zustand for multi-device web design.

## Features (Planned)

### Phase 1: Project Setup ✅
- Next.js 15 with TypeScript
- Tailwind CSS for styling
- Zustand for state management
- Fabric.js for canvas manipulation
- Project structure with components, store, utils, types, and constants
- TypeScript interfaces for Canvas, Templates, Layers, and Project state

### Phase 2: Canvas Foundation (In Progress)
- Canvas component with pan and zoom
- Element system with base properties
- Transform controls (resize, rotate, drag)

### Phase 3: Template System
- Predefined templates (Desktop, Tablet, Mobile)
- Artboard implementation
- Multiple artboards support

### Phase 4: Design Elements
- Layout components (Frame, Flexbox, Grid)
- Typography system
- Shape elements (Rectangle, Circle, Line)
- Image support

### Phase 5: Tools & Interactions
- Toolbar with essential tools
- Properties panel
- Layers panel
- Keyboard shortcuts

### Phase 6-9: Advanced Features
- Responsive design features
- Undo/redo system
- Export functionality
- UI/UX polish

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Canvas Library**: Fabric.js
- **Build Tool**: Native Next.js

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # React components
│   ├── Canvas/      # Canvas-related components
│   ├── Toolbar/     # Toolbar components
│   ├── Sidebar/     # Sidebar components
│   └── Templates/   # Template selection components
├── store/           # Zustand stores
├── types/           # TypeScript type definitions
├── constants/       # Constants and configuration
└── utils/           # Utility functions
```

## Development Plan

See `figma_clone_plan.txt` for the detailed development roadmap.
