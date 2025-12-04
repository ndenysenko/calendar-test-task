### Prerequisites

- Node.js ^20.19.0 or >=22.12.0
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Type Checking

```bash
npm run type-check
```

## Project Structure

```
src/
├── assets/          # Global styles and assets
├── components/      # Vue components
│   ├── Calendar.vue      # Main calendar component
│   ├── EventModal.vue    # Event creation/editing modal
│   ├── Header.vue        # Application header
│   └── Sidebar.vue       # Navigation sidebar
├── composables/    # Reusable composition functions
│   ├── useCalendarNavigation.ts  # Calendar navigation logic
│   └── useEventModal.ts          # Event modal management
├── constants/      # Application constants
│   └── calendar.ts
├── stores/         # Pinia stores
│   └── events.ts   # Event state management
├── types/          # TypeScript type definitions
│   └── calendar.ts
├── utils/          # Utility functions
│   └── date.ts     # Date manipulation helpers
├── views/          # Route views
└── router/         # Vue Router configuration
```
