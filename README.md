# Ninja Timer

Professional countdown timer with customizable display for broadcasts, presentations, and live events.

## Features

### Timer Modes
- **Countdown** - Count down from a set duration
- **Count Up** - Count up from zero
- **Time of Day** - Display current time
- **Countdown + ToD** - Show countdown alongside current time
- **Count Up + ToD** - Show elapsed time alongside current time
- **Hidden** - Hide the timer display (useful for transitions)

### Timer Management
- **Multiple Timers** - Create and manage a list of timer presets
- **Drag & Drop Reordering** - Easily reorganize your timer list
- **Linked Timers** - Chain timers together for automatic sequential playback
- **Quick Title Edit** - Click timer title to rename inline
- **Duplicate Timers** - Clone existing timers with one click
- **Import/Export** - Save and load timer sets as JSON files
- **Undo Support** - Revert changes with Cmd/Ctrl+Z

### Display
- **Dual-Window Design** - Separate control panel and fullscreen output window
- **Live Preview** - See changes instantly in the control window
- **Resizable Preview** - Drag to adjust the preview section height
- **Progress Bar** - Visual progress with elapsed and remaining time display
- **Timer Segments** - See linked timer segments visualized in the progress bar
- **Overtime Mode** - Continues counting after timer ends (shows +M:SS in red)
- **Auto-Fit Text** - Timer text automatically scales to fill the display

### Appearance
- **Text Color** - Full color picker for timer text
- **Stroke** - Adjustable outline width and color
- **Shadow** - Configurable drop shadow size
- **Background Color** - Solid background color for output

### Controls
- **Flash Effect** - Grab attention with a white glow animation
- **Blackout Toggle** - Instantly black out the output display
- **Keyboard Shortcuts** - Control from any window

### Sound
- **End Sound** - Audio notification when timer completes
- **Volume Control** - Adjustable per-timer volume
- **Default Sound Setting** - Set default for new timers in app settings

### App Settings
- **Time of Day Format** - Choose 12-hour or 24-hour display
- **Confirm Delete** - Toggle delete confirmation dialogs
- **Window Behavior** - Keep output and/or control window always on top
- **New Timer Defaults** - Configure default mode, duration, format, and sound for new timers

## Getting Started

### Prerequisites
- Node.js 18 or later
- npm

### Installation

```bash
# Install dependencies
npm install

# Run the app
npm start
```

### Building

```bash
# Build for macOS
npm run build:mac

# Build DMG for macOS
npm run build:dmg
```

## Usage

1. Launch Ninja Timer with `npm start`
2. Click **+ Add Timer** to create a new timer
3. Configure timer settings (mode, duration, appearance)
4. Click the **Output** button to open the display window
5. Use the play/pause buttons or keyboard shortcuts to control timers
6. Press **Escape** in the output window for fullscreen

### Timer List Controls
- **Clock icon** - Select timer (load without starting)
- **Rewind icon** - Reset active timer
- **Play/Pause** - Start, pause, or resume timer
- **Settings icon** - Edit timer configuration
- **Three dots** - More options (duplicate, delete)
- **Link icon** - Connect to next timer for auto-play

## Keyboard Shortcuts

### Control Window
| Shortcut | Action |
|----------|--------|
| Space | Play/Pause toggle |
| Cmd/Ctrl+Z | Undo last change |

### Output Window
| Shortcut | Action |
|----------|--------|
| Space | Play/Pause toggle |
| R | Reset timer |
| B | Toggle blackout |
| Escape | Toggle fullscreen |

## Project Structure

```
NinjaTimer/
├── main.js              # Electron main process
├── preload.js           # Secure IPC bridge
├── src/
│   ├── control/         # Control window
│   │   ├── index.html
│   │   ├── control.js
│   │   └── control.css
│   ├── viewer/          # Output window
│   │   ├── viewer.html
│   │   ├── viewer.js
│   │   └── viewer.css
│   └── shared/          # Shared utilities
│       ├── base.css
│       ├── constants.js
│       ├── timer.js
│       └── sounds.js
├── icon.icns
├── package.json
└── README.md
```

## Configuration Options

### Timer Settings
| Option | Description |
|--------|-------------|
| **Title** | Name for the timer preset |
| **Mode** | Countdown, Count Up, Time of Day, or combinations |
| **Duration** | Timer length in HH:MM:SS format |
| **Format** | Display format: H:MM:SS, MM:SS, or SS |

### Appearance Settings
| Option | Description |
|--------|-------------|
| **Text Color** | Timer text color |
| **Stroke Width** | Outline thickness (0-20px) |
| **Stroke Color** | Outline color |
| **Shadow Size** | Drop shadow blur (0-50px) |
| **Background** | Output window background color |

### Sound Settings
| Option | Description |
|--------|-------------|
| **End Sound** | Play sound when timer completes |
| **Volume** | Sound volume level |

## License

MIT
