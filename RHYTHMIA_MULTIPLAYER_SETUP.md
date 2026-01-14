# RHYTHMIA NEXUS "BATTLE ARENA" Multiplayer Setup Guide

This guide will help you set up and run the RHYTHMIA NEXUS multiplayer system with WebSocket server and optional Firestore persistence.

## Features

- **Real-time Multiplayer**: WebSocket-based host/join lobby system
- **Room Management**: Create and join rooms with 6-character codes
- **Tabbed Lobby UI**: Room List and Create Room tabs
- **Firestore Persistence**: Optional room database for cross-instance consistency
- **Room Cleanup**: Automatic cleanup of stale rooms (1-hour TTL)
- **Neon Aesthetic**: Orbitron font with purple/cyan neon glow effects

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Client: rhythmia-nexus-multiplayer.html                │
│  - Tabbed UI (Room List / Create Room)                  │
│  - WebSocket connection to server                       │
│  - Real-time lobby updates                              │
└─────────────────────────────────────────────────────────┘
                          │
                          │ WebSocket
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Server: multiplayer-server.ts                          │
│  - WebSocket server (ws library)                        │
│  - Room Manager (in-memory)                             │
│  - Firestore Service (optional persistence)             │
│  - Room cleanup task                                    │
└─────────────────────────────────────────────────────────┘
                          │
                          │ (Optional)
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Firestore Database                                      │
│  - Collection: rhythmia_rooms                           │
│  - Room documents with metadata                         │
│  - TTL-based cleanup                                    │
└─────────────────────────────────────────────────────────┘
```

## Quick Start (Without Firestore)

The multiplayer system works perfectly fine without Firestore. Rooms will be stored in memory only.

### 1. Start the WebSocket Server

```bash
npm run multiplayer
```

The server will start on `ws://localhost:3001` (or the port specified in `PORT` env variable).

### 2. Open the HTML Page

Open `public/rhythmia-nexus-multiplayer.html` in your browser:

```bash
# Option 1: Direct file access
open public/rhythmia-nexus-multiplayer.html

# Option 2: Via local web server (recommended)
npx serve public
# Then visit: http://localhost:3000/rhythmia-nexus-multiplayer.html

# Option 3: Via Next.js dev server (after deploying as static file)
npm run dev
# Then visit: http://localhost:3000/rhythmia-nexus-multiplayer.html
```

### 3. Test Multiplayer

1. **Create a Room**: 
   - Click "Create Room" tab
   - Enter your name and room name
   - Click "Create Room"
   - You'll see the 6-character room code

2. **Join from Another Browser/Tab**:
   - Open the page in another browser/tab
   - Click "Room List" tab
   - Click "Refresh List"
   - Click on the room to join
   - Enter your name when prompted

3. **Start the Game**:
   - Guest player clicks "Ready Up"
   - Host clicks "Start Game"
   - Both players transition to game view

## Setup with Firestore (Optional)

Firestore provides room persistence, allowing:
- Rooms to survive server restarts
- Cross-instance room synchronization
- Automatic TTL-based cleanup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Firestore Database:
   - Go to "Build" → "Firestore Database"
   - Click "Create database"
   - Choose production mode
   - Select your region

### 2. Generate Service Account Key

1. In Firebase Console, go to Project Settings (gear icon)
2. Navigate to "Service Accounts" tab
3. Click "Generate new private key"
4. Save the JSON file securely

### 3. Configure Environment Variables

Add the service account JSON to your `.env` file:

```bash
# Copy the entire JSON as a single-line string
FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...@your-project.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}'
```

**Important**: The JSON must be on a single line. Remove all line breaks from the private key.

### 4. Firestore Security Rules

Set up security rules in Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow server-side access via admin SDK
    match /rhythmia_rooms/{roomId} {
      allow read, write: if false; // Only admin SDK can access
    }
  }
}
```

Since the server uses Firebase Admin SDK, it bypasses these rules. This configuration ensures only your server can access the rooms.

### 5. (Optional) Configure Firestore TTL

For automatic cleanup, you can configure TTL on the `updatedAt` field:

1. In Firestore Console, go to your database
2. Enable "TTL" (Time To Live) if available in your region
3. Set TTL on the `updatedAt` field to 3600 seconds (1 hour)

The server also runs a periodic cleanup task every 5 minutes as a backup.

## Configuration Options

### Environment Variables

```bash
# Required for WebSocket server
PORT=3001                    # Server port
HOST=0.0.0.0                 # Bind address (0.0.0.0 for Railway/Docker)

# Required for CORS/Origin validation
ALLOWED_ORIGINS='http://localhost:3000,https://yourdomain.com'

# Optional for Firestore persistence
FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'
```

### Client Configuration

The HTML page accepts a `wsUrl` query parameter to override the default WebSocket URL:

```
# Connect to local server
rhythmia-nexus-multiplayer.html

# Connect to production server
rhythmia-nexus-multiplayer.html?wsUrl=wss://your-server.railway.app
```

### Server Configuration

Edit constants in `multiplayer-server.ts`:

```typescript
const CLEANUP_INTERVAL = 300000; // 5 minutes (in milliseconds)
```

Edit TTL in `src/lib/multiplayer/FirestoreRoomService.ts`:

```typescript
private roomTTL = 3600000; // 1 hour (in milliseconds)
```

## Deployment

### Local Development

```bash
# Terminal 1: Start WebSocket server
npm run multiplayer

# Terminal 2: Serve HTML page (if using static server)
npx serve public

# Or use Next.js dev server
npm run dev
```

### Production Deployment

#### Option 1: Railway (WebSocket Server) + Vercel (Static HTML)

**Railway (WebSocket Server):**

1. Create new project on [Railway](https://railway.app)
2. Connect GitHub repository
3. Set start command: `npm run multiplayer`
4. Add environment variables:
   ```
   ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
   FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
   ```
5. Note your Railway URL (e.g., `your-app.railway.app`)

**Vercel (Static HTML):**

1. Deploy to Vercel normally (`vercel deploy`)
2. The HTML file will be accessible at: `https://your-app.vercel.app/rhythmia-nexus-multiplayer.html`
3. Update HTML file or use query parameter: `?wsUrl=wss://your-app.railway.app`

#### Option 2: Single VPS/Server

```bash
# Install dependencies
npm install

# Build if needed
npm run build

# Start WebSocket server (use PM2 for persistence)
pm2 start npm --name "rhythmia-ws" -- run multiplayer

# Serve static files with nginx or another web server
# Point nginx to public/rhythmia-nexus-multiplayer.html
```

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "run", "multiplayer"]
```

Build and run:

```bash
docker build -t rhythmia-multiplayer .
docker run -p 3001:3001 \
  -e ALLOWED_ORIGINS="https://yourdomain.com" \
  -e FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}' \
  rhythmia-multiplayer
```

## Room Schema

Firestore stores rooms in the `rhythmia_rooms` collection with the following structure:

```typescript
{
  code: "ABC123",              // 6-character room code
  name: "My Battle Room",      // Display name
  createdAt: 1234567890123,    // Timestamp (ms)
  updatedAt: 1234567890123,    // Timestamp (ms)
  status: "open",              // "open" | "in_game"
  maxPlayers: 4,               // Max players allowed
  hostId: "player_123_abc",    // Host player ID
  players: [
    {
      id: "player_123_abc",
      name: "Player1",
      isHost: true,
      joinedAt: 1234567890123
    },
    {
      id: "player_456_def",
      name: "Player2",
      isHost: false,
      joinedAt: 1234567890456
    }
  ]
}
```

## WebSocket Protocol

### Client → Server Messages

```typescript
// List available rooms
{ type: 'list_rooms' }

// Create a new room
{ 
  type: 'create_room',
  playerName: string,
  roomName?: string
}

// Join existing room
{
  type: 'join_room',
  roomCode: string,
  playerName: string
}

// Leave current room
{ type: 'leave_room' }

// Set ready status (non-host players)
{
  type: 'set_ready',
  ready: boolean
}

// Start game (host only)
{ type: 'start_game' }

// Relay custom game data
{
  type: 'relay',
  payload: any
}
```

### Server → Client Messages

```typescript
// Connection established
{
  type: 'connected',
  playerId: string
}

// Room list response
{
  type: 'room_list',
  rooms: Array<{
    roomCode: string,
    name: string,
    hostName: string,
    playerCount: number,
    maxPlayers: number,
    status: 'open' | 'in_game',
    createdAt: number
  }>
}

// Room created successfully
{
  type: 'room_created',
  roomCode: string,
  playerId: string
}

// Joined room successfully
{
  type: 'joined_room',
  roomCode: string,
  playerId: string,
  roomState: RoomStateData
}

// Room state update
{
  type: 'room_state',
  roomState: RoomStateData
}

// Player joined room
{
  type: 'player_joined',
  player: MultiplayerPlayer
}

// Player left room
{
  type: 'player_left',
  playerId: string
}

// Player ready status changed
{
  type: 'player_ready',
  playerId: string,
  ready: boolean
}

// Game started
{ type: 'game_started' }

// Relayed message from another player
{
  type: 'relayed',
  fromPlayerId: string,
  payload: any
}

// Error occurred
{
  type: 'error',
  message: string,
  code?: string
}
```

## Troubleshooting

### Server won't start

**Error: "Cannot find module 'firebase-admin'"**
```bash
npm install
```

**Error: "Address already in use"**
```bash
# Change port in .env
PORT=3002
```

### Firestore errors

**Error: "Failed to initialize Firestore"**
- Check that `FIREBASE_SERVICE_ACCOUNT_JSON` is valid JSON
- Ensure the service account has Firestore permissions
- Verify the project ID matches your Firebase project

**Error: "Permission denied"**
- Check Firestore security rules
- Ensure you're using Firebase Admin SDK (not client SDK)

### Connection issues

**Error: "WebSocket connection failed"**
- Ensure server is running: `npm run multiplayer`
- Check WebSocket URL in client
- Verify `ALLOWED_ORIGINS` includes your client origin
- For production, use `wss://` instead of `ws://`

**Error: "Origin not allowed"**
```bash
# Add your origin to ALLOWED_ORIGINS
ALLOWED_ORIGINS='http://localhost:3000,https://yourdomain.com'
```

### Room not appearing in list

- Click "Refresh List" button
- Check server logs for errors
- Verify room was created successfully
- Ensure room status is "open" (not "in_game")

## Testing

### Manual Testing Checklist

- [ ] Server starts without errors
- [ ] Client connects successfully (green status)
- [ ] Can create a room
- [ ] Room appears in room list
- [ ] Can join room from another browser
- [ ] Player list updates in real-time
- [ ] Ready/Not Ready status works
- [ ] Host can start game when all ready
- [ ] Game view appears for both players
- [ ] Can leave room/game
- [ ] Room cleanup works (wait 1+ hour)

### Multi-Tab Testing

1. Open three browser tabs/windows
2. Tab 1: Create room as Host
3. Tab 2: Join room as Player 2
4. Tab 3: Check room list (should see the room)
5. Tab 2: Click "Ready Up"
6. Tab 1: Click "Start Game"
7. Both Tab 1 and 2 should show game view

## Firestore Indexes

For optimal query performance, create these indexes in Firestore:

```
Collection: rhythmia_rooms
Fields: status (Ascending), createdAt (Descending)
```

To create:
1. Go to Firestore Console
2. Click "Indexes" tab
3. Click "Create Index"
4. Select `rhythmia_rooms` collection
5. Add fields: `status` (Ascending), `createdAt` (Descending)
6. Click "Create"

## Support and Feedback

For issues, feature requests, or questions:
- Check server logs: `npm run multiplayer` output
- Check browser console for client-side errors
- Verify environment variables are set correctly
- Review this guide's troubleshooting section

## Next Steps

- **Customize Game Logic**: Implement actual game mechanics in the "game" view
- **Add Chat**: Use the relay system to send chat messages
- **Add Spectators**: Extend room logic to support spectator mode
- **Add Room Privacy**: Implement password-protected rooms
- **Add Reconnection**: Handle disconnects and reconnections gracefully
- **Add Matchmaking**: Auto-match players with similar skill levels

Enjoy your RHYTHMIA NEXUS BATTLE ARENA! 🎮✨
