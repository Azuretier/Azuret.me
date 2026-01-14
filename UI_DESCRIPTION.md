# Discord Role Selection - UI Description

## Page: `/azure-supporter`

### Before Login View

**Layout:**
- Dark theme (gray-950 background)
- Centered card layout
- Maximum width: 512px

**Content:**
```
┌────────────────────────────────────────┐
│                                        │
│         Azure Supporter                │
│   Select your language role for        │
│            Discord                     │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │            🔗                     │ │
│  │                                   │ │
│  │      Connect Discord              │ │
│  │                                   │ │
│  │  Link your Discord account to     │ │
│  │  select your language role        │ │
│  │                                   │ │
│  │  ┌─────────────────────────────┐ │ │
│  │  │  [Discord Icon]              │ │ │
│  │  │  Login with Discord          │ │ │
│  │  └─────────────────────────────┘ │ │
│  │     (Blue Discord button)         │ │
│  └──────────────────────────────────┘ │
│                                        │
└────────────────────────────────────────┘
```

### After Login - Role Selection View

**Header:**
- Shows "Select Your Role"
- Displays username: "Logged in as [username]"
- Shows current role: "Current role: English" (if applicable)

**Role Selection Grid:**
```
┌────────────────────────────────────────┐
│                                        │
│       Select Your Role                 │
│   Logged in as: username               │
│   Current role: English                │
│                                        │
│  ┌──────────────┐  ┌──────────────┐  │
│  │              │  │              │  │
│  │      🇺🇸      │  │      🇯🇵      │  │
│  │              │  │              │  │
│  │   English    │  │    日本語     │  │
│  │              │  │              │  │
│  └──────────────┘  └──────────────┘  │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ Confirm & Sync to Discord        │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Disconnect Discord                    │
│                                        │
└────────────────────────────────────────┘
```

### Visual States

#### 1. Unselected Role Button
- Border: Gray-800 (2px)
- Background: Gray-900
- Text: White
- Hover: Border changes to Gray-700

#### 2. Selected Role Button
- Border: Transparent
- Background: Gradient (Blue for EN, Red for JP)
- Scale: 105% (slightly larger)
- Shadow: Large shadow effect

#### 3. Confirm Button States

**Disabled (no selection):**
- Background: Gray-800
- Text: Gray-600
- Cursor: Not allowed

**Enabled:**
- Background: Gradient matching selected role
- Text: White
- Hover: Slight opacity change

**Loading:**
- Text: "Syncing..."
- Disabled state

**Success:**
- Text: "✓ Role Assigned!"
- Green checkmark icon

#### 4. Current Role Already Selected
- Button text: "Already Assigned"
- Disabled state

### Color Schemes

**EN (English):**
- Gradient: Blue-500 to Indigo-600
- Flag: 🇺🇸
- Accent: Blue

**JP (Japanese):**
- Gradient: Red-500 to Pink-600
- Flag: 🇯🇵
- Accent: Red

### Error/Success Messages

**Error Message Box:**
- Background: Red-900 with 20% opacity
- Border: Red-500
- Text: Red-400
- Padding: 1rem
- Rounded corners

**Success Message Box:**
- Background: Green-900 with 20% opacity
- Border: Green-500
- Text: Green-400
- Padding: 1rem
- Rounded corners

### Loading States

1. **Initial Load (Fetching Current Role):**
   - Shows: "Loading current role..."
   - Text: Gray-400
   - Center aligned

2. **Role Assignment in Progress:**
   - Button text: "Syncing..."
   - All buttons disabled
   - Opacity: 50%

### Responsive Design
- Mobile: Full width with padding
- Desktop: Centered with max-width constraint
- Grid: 2 columns for role buttons
- All elements stack vertically on mobile

### Accessibility
- Semantic HTML buttons
- Clear visual feedback for all states
- Keyboard navigation support
- Color contrasts meet WCAG standards
- Loading states announced to screen readers

---

# Discord Rank Card - UI Description

## Page: `/guilds/{guild_id}/rank-card/{user_discord_display_name}`

## Design Philosophy
- **Modern & Polished**: Glass morphism with gradient effects
- **Dark Theme**: Dark background with light glass elements
- **Responsive**: Works on mobile and desktop
- **Animated**: Smooth transitions and shimmer effects

## 1. Loading State

**Layout:**
- Full screen height (min-h-screen)
- Centered content
- Dark gradient background: Slate-900 → Purple-900 → Slate-900

**Content:**
```
┌────────────────────────────────────────────────────┐
│                                                    │
│                                                    │
│         ┌──────────────────────────────┐         │
│         │  Glass Card with Shimmer     │         │
│         │                              │         │
│         │  ○  [Skeleton Name]          │         │
│         │     [Skeleton Rank]          │         │
│         │                              │         │
│         │  [Progress Bar Skeleton]     │         │
│         │                              │         │
│         └──────────────────────────────┘         │
│                                                    │
│              Loading rank card...                  │
│                 (pulsing text)                     │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Visual Details:**
- Glass card: White/5 opacity with backdrop blur
- Border: White/10 opacity
- Shimmer animation: Horizontal sweep every 2 seconds
- Skeleton elements: White/10 with pulse animation
- Loading text: White/80 with pulse animation

## 2. Rank Card Display (Ready State)

**Layout:**
```
┌────────────────────────────────────────────────────┐
│                                                    │
│    [Gradient Mesh Background Blur]                │
│                                                    │
│   ┌──────────────────────────────────────────┐   │
│   │ Glass Card with Noise Texture           │   │
│   │                                          │   │
│   │  ┌──┐  Username              ┌────┐    │   │
│   │  │🎭│  Rank Name              │LVL │    │   │
│   │  └──┘                         │ 5  │    │   │
│   │                               └────┘    │   │
│   │                                          │   │
│   │  Experience                              │   │
│   │  350 / 600 XP                           │   │
│   │                                          │   │
│   │  ▓▓▓▓▓▓▓▓▓▓░░░░░░░░  (Progress Bar)   │   │
│   │                                          │   │
│   │  250 XP to next level                   │   │
│   │                                          │   │
│   └──────────────────────────────────────────┘   │
│                                                    │
│   ┌──────────────┐  ┌──────────────────────┐    │
│   │  [Patreon]  │  │  Discord Widget      │    │
│   │   Support   │  │  ┌────────────────┐  │    │
│   │    Button   │  │  │ 5 Online       │  │    │
│   └──────────────┘  │  │ 20 Members     │  │    │
│                     │  │ #general       │  │    │
│                     │  └────────────────┘  │    │
│                     └──────────────────────┘    │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Visual Components

#### Background
- **Base**: Gradient from Slate-900 → Purple-900 → Slate-900
- **Mesh Overlay**: Gradient blur with Purple/20, Pink/20, Blue/20
- **Size**: Covers full viewport height

#### Glass Card
- **Container**: Max width 768px (2xl), centered
- **Background**: White/5 opacity with backdrop blur (XL)
- **Border**: 1px White/10 opacity
- **Corners**: Rounded 3xl (1.5rem)
- **Shadow**: 2xl shadow
- **Noise**: SVG noise texture overlay at 20% opacity

#### Avatar Section
- **Avatar Container**: 96px × 96px (24 × 24)
- **Background Blur**: Purple-400 to Pink-400 gradient, blurred
- **Border**: 2px White/20
- **Image**: Object-fit cover, or fallback to initial letter
- **Fallback**: Gradient Purple-500 to Pink-500 with first letter

#### Display Name
- **Font Size**: 3xl (1.875rem)
- **Weight**: Bold
- **Color**: White
- **Truncate**: Ellipsis on overflow

#### Rank Name (Optional)
- **Font Size**: lg (1.125rem)
- **Color**: Purple-300
- **Weight**: Medium

#### Level Badge
- **Size**: 80px × 80px (20 × 20)
- **Background**: Gradient Purple-500 to Pink-500
- **Shape**: Rounded 2xl (1rem)
- **Shadow**: lg shadow
- **Label**: "LEVEL" in small text, White/80
- **Number**: 2xl (1.5rem) bold, White

#### XP Stats
- **Label**: "Experience" in White/80, small text
- **Values**: "350 / 600 XP" in White, medium weight
- **Position**: Flex between label and values

#### Progress Bar
- **Container**: Height 16px (4), rounded full
- **Background**: White/5 with White/10 border
- **Fill**: Gradient Purple-500 to Pink-500
- **Fill Overlay**: White/20 with pulse animation
- **Width**: Percentage based (e.g., 58% for 350/600)
- **Animation**: Smooth 500ms ease-out transition

#### XP to Next Level
- **Text**: "{xpToNext} XP to next level"
- **Color**: White/60
- **Size**: Small
- **Alignment**: Right

### Color Palette

**Primary Gradients:**
- Purple-500 (#8B5CF6) → Pink-500 (#EC4899)
- Blue-500 → Indigo-600 (alternate)

**Glass Effect:**
- White at 5% opacity for background
- White at 10% opacity for borders
- White at 20% opacity for hover states

**Text:**
- Primary: White (#FFFFFF)
- Secondary: White at 80% opacity
- Tertiary: White at 60% opacity
- Muted: White at 40% opacity

### Animations

1. **Shimmer (Loading):**
   - Horizontal sweep from -200% to 200%
   - Duration: 2 seconds
   - Infinite loop

2. **Pulse (Loading skeletons):**
   - Opacity fade in/out
   - Built-in Tailwind pulse

3. **Progress Bar Fill:**
   - Width transition: 500ms ease-out
   - Smooth expansion on data load

4. **Hover Effects:**
   - Subtle scale or opacity changes
   - 200ms transition

#### Patreon Button (Optional)
- **Display**: Conditional on `NEXT_PUBLIC_PATREON_URL` environment variable
- **Layout**: Flex-1, fills half of row on desktop, full width on mobile
- **Background**: Gradient Orange-500 to Red-500
- **Hover**: Orange-600 to Red-600 with scale-105 transform
- **Icon**: Patreon logo SVG (24px × 24px)
- **Text**: "Support on Patreon" in White, semibold, lg size
- **Padding**: 24px (6) horizontal, 16px (4) vertical
- **Border Radius**: 2xl (1rem)
- **Shadow**: lg shadow, xl on hover
- **Animation**: 300ms transition, subtle scale on hover
- **Link**: Opens in new tab with `noopener noreferrer`

#### Discord Server Widget (Always shown)
- **Display**: Always displayed using guild_id from URL
- **Layout**: Flex-1, fills half of row on desktop, full width on mobile
- **Container**: Glass card styling with White/5 background
- **Border**: White/10 opacity, 1px
- **Border Radius**: 2xl (1rem)
- **Shadow**: lg shadow
- **iframe Source**: `https://discord.com/widget?id={guildId}&theme=dark`
- **Width**: 100% (responsive)
- **Height**: 300px fixed
- **Theme**: Dark mode
- **Sandbox**: Secure with limited permissions
  - `allow-popups`: For Discord invite links
  - `allow-popups-to-escape-sandbox`: Allow navigation
  - `allow-same-origin`: Required for Discord widget
  - `allow-scripts`: Required for widget functionality
- **Features**: Shows online members, member count, voice channels

#### Action Section Layout
- **Container**: Flex column on mobile, flex row on desktop (md breakpoint)
- **Gap**: 16px (4) between items
- **Items**: Stretch to equal height
- **Responsive**:
  - Mobile: Stack vertically, full width each
  - Desktop: Side by side, equal width (flex-1)

## 3. Not Found State

**Layout:**
```
┌────────────────────────────────────────────────────┐
│                                                    │
│                                                    │
│   ┌──────────────────────────────────────────┐   │
│   │                                          │   │
│   │            ┌────────┐                   │   │
│   │            │   ⚠️   │                   │   │
│   │            └────────┘                   │   │
│   │                                          │   │
│   │       Member Not Found                  │   │
│   │                                          │   │
│   │   No member found with display name:    │   │
│   │          "TestUser"                     │   │
│   │                                          │   │
│   │  Please check spelling or ensure        │   │
│   │  member exists in server.               │   │
│   │                                          │   │
│   └──────────────────────────────────────────┘   │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Visual Details:**
- Icon: 96px × 96px circle, Red-500/20 background
- Icon: Warning triangle, Red-400 color
- Title: 2xl bold, White
- Display name: xl, Purple-300
- Message: White/50, small

## 4. Ambiguous State (Multiple Matches)

**Layout:**
```
┌────────────────────────────────────────────────────┐
│                                                    │
│   ┌──────────────────────────────────────────┐   │
│   │            ┌────────┐                   │   │
│   │            │   ❓   │                   │   │
│   │            └────────┘                   │   │
│   │                                          │   │
│   │     Multiple Members Found              │   │
│   │                                          │   │
│   │  Multiple members match: "TestUser"     │   │
│   │                                          │   │
│   │  Matching Members:                      │   │
│   │  ┌────────────────────────────────┐    │   │
│   │  │ 1. TestUser  ID: member-123    │    │   │
│   │  │ 2. TESTUSER  ID: member-456    │    │   │
│   │  └────────────────────────────────┘    │   │
│   │                                          │   │
│   │  Contact admin to resolve ambiguity.    │   │
│   │                                          │   │
│   └──────────────────────────────────────────┘   │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Visual Details:**
- Icon: 96px × 96px circle, Yellow-500/20 background
- Icon: Question mark, Yellow-400 color
- List background: White/5
- List items: White/5 with White/10 border, rounded lg
- Member IDs: White/40, monospace font

## 5. Error State

**Layout:**
```
┌────────────────────────────────────────────────────┐
│                                                    │
│                                                    │
│   ┌──────────────────────────────────────────┐   │
│   │                                          │   │
│   │            ┌────────┐                   │   │
│   │            │   ✕    │                   │   │
│   │            └────────┘                   │   │
│   │                                          │   │
│   │              Error                      │   │
│   │                                          │   │
│   │      Failed to load rank card           │   │
│   │                                          │   │
│   │  Try again later or contact support.    │   │
│   │                                          │   │
│   └──────────────────────────────────────────┘   │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Visual Details:**
- Icon: 96px × 96px circle, Red-500/20 background
- Icon: X mark, Red-400 color
- Similar styling to Not Found state

## Responsive Behavior

### Mobile (< 640px)
- Full width with 16px padding
- Avatar: Scales to 80px × 80px
- Level badge: 64px × 64px
- Font sizes reduce by one step
- Stack elements vertically

### Tablet (640px - 1024px)
- Maintains design with adjusted spacing
- Avatar: 88px × 88px
- Level badge: 72px × 72px

### Desktop (> 1024px)
- Full design as described
- Max width container (768px)
- Optimal spacing and typography

## Accessibility

- **Contrast**: All text meets WCAG AA standards
- **Alt Text**: Avatar images have alt text
- **Semantic HTML**: Proper heading hierarchy
- **Focus States**: Visible focus indicators
- **Screen Readers**: Status messages announced
- **Keyboard Navigation**: Fully navigable

## Performance

- **Loading Screen**: Appears instantly (< 50ms)
- **Data Load**: 1-2 seconds typical
- **Real-time Updates**: < 2 seconds latency
- **Smooth Animations**: 60fps target
- **Optimized Images**: Lazy loading for avatars

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## Design Inspirations

- **Glass Morphism**: Apple iOS, Windows 11 Fluent Design
- **Gradients**: Modern web apps (Discord, Notion)
- **Dark Mode**: Gaming UIs (Discord, Steam)
- **Progress Bars**: RPG/Gaming interfaces

