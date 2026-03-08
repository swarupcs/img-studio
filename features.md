# ImgGen — Feature Documentation

Complete list of all implemented features. Updated after each successful implementation.

---

## Authentication

### Credentials (Email & Password)
Users can register with name, email, and password. Passwords are hashed with bcrypt (12 rounds). On signup, the user is automatically signed in. Implemented via NextAuth v5 Credentials provider + Prisma adapter.

- **Frontend**: `/signin`, `/signup` pages with form validation and inline error messages.
- **Backend**: `POST /api/signup` creates the user; NextAuth credentials provider handles login.

### Google OAuth
One-click sign-in with Google. Redirects to `/dashboard` on success.

- **Frontend**: "Continue with Google" button on both signin and signup pages.
- **Backend**: NextAuth Google provider with `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` env vars.
- **Required env**: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

### GitHub OAuth
One-click sign-in with GitHub. Redirects to `/dashboard` on success.

- **Frontend**: "Continue with GitHub" button on both signin and signup pages.
- **Backend**: NextAuth GitHub provider with `GITHUB_CLIENT_ID` + `GITHUB_CLIENT_SECRET` env vars.
- **Required env**: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`

### Route Protection
All routes under `/dashboard`, `/editor`, `/profile`, `/gallery/user` require authentication. Middleware redirects unauthenticated users to `/signin`. Authenticated users visiting auth pages are redirected to `/dashboard`.

- **File**: `src/middleware.ts` using a lightweight edge-safe NextAuth config.

---

## Profile Management

### View Profile
Displays user avatar (initials fallback or OAuth profile image), display name, email, member since date, and connected OAuth provider badges (Google, GitHub, Email & Password).

- **Frontend**: `/profile` page.
- **Backend**: `GET /api/user` returns name, email, image, hasPassword flag, accounts, createdAt.

### Edit Display Name
Inline form to update the display name. Save button is disabled when the name matches the current value.

- **Frontend**: Form in `/profile` page with success/error feedback.
- **Backend**: `PATCH /api/user` with `{ name }` body.

### Change Password
Available only to credential accounts (users who signed up with email/password). Verifies current password before setting the new one.

- **Frontend**: Conditional password section in `/profile` page.
- **Backend**: `PATCH /api/user/password` verifies current password with bcrypt compare, hashes new password.

---

## Editor

### Image Upload
Upload an image via file picker or drag-and-drop anywhere on the canvas.

- **Frontend**: `editor/page.tsx` — file input ref passed to Navbar upload button; drag-and-drop handlers on the canvas area.

### Text-to-Image Generation
Generate an image from a text prompt without uploading anything. Uses Google Gemini `gemini-3-pro-image-preview` model. Switch to the "Generate" tab in the editor empty state.

- **Frontend**: Tab switcher in empty state (`upload` | `generate`). Textarea prompt input + Generate button with loading state and credits check.
- **Backend**: `POST /api/generate` — sends prompt-only request to Gemini, deducts 1 credit on success.
- **Store**: `generateFromPrompt()` in `useEditorStore`.

### AI Inpainting
Paint a mask over a region of the image, type a prompt, and let AI replace only the masked area while seamlessly preserving the rest. Supports brush, eraser, and rectangle selection tools.

- **Frontend**: Canvas-based mask painter in `ImageEditor` component. Left sidebar tool buttons. Prompt input at the bottom.
- **Backend**: `POST /api/edit-image` — sends image + mask + prompt to Gemini, deducts 1 credit.
- **Store**: `generateEdit()` in `useEditorStore`.

### AI Style Filters
One-click style transfer presets: Toonify (2D cartoon), Ghibli Studio (Miyazaki anime), Cyberpunk (neon aesthetic), Oil Painting (impressionist brushstrokes).

- **Frontend**: Filter grid in the left sidebar Filters accordion.
- **Backend**: `POST /api/edit-image` with a detailed style prompt.
- **Store**: `applyFilter(prompt)` in `useEditorStore`.

### Image Expansion (Outpainting)
Expand the canvas to a new aspect ratio with AI-generated content that seamlessly continues the original image. 8 presets: Square (1:1), Wide (16:9), Standard (4:3), Classic (3:2), Cinema (21:9), Story (9:16), Social (4:5), Poster (2:3).

- **Frontend**: Expansion grid in the left sidebar Expansion accordion.
- **Backend**: `POST /api/edit-image` with `aspectRatio` parameter.
- **Store**: `applyExpansion(aspectRatio)` in `useEditorStore`.

### Background Removal
Remove the image background and replace it with a clean white background. One-click from the Editing Options section in the left sidebar.

- **Frontend**: "Remove BG" button in left sidebar (enabled when image is loaded).
- **Backend**: `POST /api/edit-image` with a background removal prompt.
- **Store**: `removeBackground()` in `useEditorStore`.

### AI Image Enhancement
Sharpen, upscale, remove noise and compression artifacts, and improve color vibrancy while preserving composition. One-click from the left sidebar.

- **Frontend**: "AI Enhance" button in left sidebar (enabled when image is loaded).
- **Backend**: `POST /api/edit-image` with an enhancement/upscaling prompt.
- **Store**: `enhanceImage()` in `useEditorStore`.

### Edit History
Every AI-generated result is added to an in-memory history stack. Navigate between versions with undo/redo keyboard shortcuts and the History panel. Click any thumbnail to jump to that version. Clear history keeps only the current image.

- **Frontend**: `RightSidebar` component (history thumbnails). Navbar undo/redo buttons. Layers toggle button.
- **Store**: `history[]`, `historyIndex`, `undo()`, `redo()`, `setHistoryIndex()` in `useEditorStore`.

### Save to Gallery
Save the current canvas image to the user's personal gallery in the database. The save button in the navbar shows a confirmation state after saving.

- **Frontend**: Save button in editor Navbar with loading and "Saved ✓" feedback states.
- **Backend**: `POST /api/images` creates a `GeneratedImage` record with imageData, prompt, and auto-generated title.
- **Store**: `saveCurrentImage(title?)` in `useEditorStore`.

### Export Options Panel
Download the current canvas with full control over format, quality, and scale.

- **Frontend**: Export button opens `ExportPanel` overlay. Supports PNG (lossless), JPEG, and WebP formats; quality slider (10–100%); scale factor (0.5×, 1×, 2×, 3×). Uses off-screen canvas to render at target resolution.

---

## Editor — Phase 2 Features

### Flip & Rotate
Non-destructive local transform operations applied directly to the canvas.

- **Actions**: Flip Horizontal, Flip Vertical, Rotate 90° Left (CCW), Rotate 90° Right (CW).
- **Frontend**: Transform section in left sidebar. Rotation swaps canvas width/height automatically.
- **Store**: `flipHorizontal()`, `flipVertical()`, `rotateLeft()`, `rotateRight()` in `useEditorStore`. All use Canvas 2D context transforms and call `pushToHistory`.
- **Credits**: Free — local canvas operation.

### Canvas Effects
Local non-AI visual effects applied directly to pixel data.

- **Effects**: Gaussian Blur (0–20px via CSS filter), Vignette (0–100% radial gradient overlay), Film Grain (0–100 random pixel noise), Sharpen (3×3 convolution kernel `[0,-1,0,-1,5,-1,0,-1,0]`).
- **Frontend**: Canvas Effects section in left sidebar with sliders. Live preview via slider value. "Apply Effects" bakes all three sliders into the canvas. "Sharpen" is a separate one-click button.
- **Store**: `canvasEffects` state slice, `setCanvasEffect()`, `applyCanvasEffects()`, `applySharpen()` in `useEditorStore`. Resets `canvasEffects` values after applying.
- **Credits**: Free — local canvas operation.

### Keyboard Shortcuts
Full keyboard shortcut system for tools, history, and canvas navigation.

- **Shortcuts**: `M` Move, `B` Brush, `E` Eraser, `C` Crop, `T` Text, `P` Color picker, `W` Smart remove, `Esc` Return to Move, `Ctrl+Z` Undo, `Ctrl+Y` Redo, `[` Brush size −10, `]` Brush size +10, `Space+drag` Pan canvas.
- **Frontend**: `useKeyboardShortcuts` hook registered in editor page. Help modal (`KeyboardShortcutModal`) accessible via `?` keyboard icon button in navbar. Modal shows all shortcuts grouped by category.
- **Files**: `src/hooks/useKeyboardShortcuts.ts`, `src/components/keyboard-shortcut-modal.tsx`.

### Prompt Templates
Quick-select prompt chips displayed above the AI prompt input bar.

- **Templates**: Golden Hour, Add Rain, Pencil Sketch, Neon Night, Cinematic, Soft Portrait, Vintage Film, Snow Scene.
- **Frontend**: `PromptTemplates` component renders a horizontally scrollable row of pill buttons. Clicking a chip calls `setPrompt()` to populate the input. Shown only when an image is loaded.
- **Files**: `src/components/prompt-templates.tsx`. Template data in `src/lib/constants.ts`.

### AI Recolor Tool
AI-powered recoloring of a user-masked area to a target color.

- **Usage**: Paint a mask using the Brush/Rectangle tool, open "AI Recolor" in the left sidebar, pick a target color, click Apply.
- **Frontend**: AI Recolor accordion item in left sidebar with `<input type="color">` picker and Apply button (disabled until mask exists).
- **Backend**: `POST /api/edit-image` with `maskBase64` and a constructed prompt specifying target color. Deducts 1 credit.
- **Store**: `recolorArea(targetColor: string)` in `useEditorStore`.

### Sticker / Emoji Panel
Add emoji stickers as draggable text layers over the image.

- **Usage**: Click a sticker to add it centered on the canvas. Drag to reposition. Double-click to edit. Use "Flatten to Image" to bake all text/stickers permanently.
- **Frontend**: Sticker Panel section in left sidebar with category tabs (Faces, Nature, Objects, Symbols) and an emoji grid. Uses the existing text layer system with `fontSize: 64` and emoji-compatible font stack.
- **Files**: `src/components/sticker-panel.tsx`. Sticker data in `src/lib/constants.ts` (`STICKER_CATEGORIES`).
- **Credits**: Free — reuses text layer infrastructure.

### Shareable Image Links
Generate a public URL for any saved image to share outside the app.

- **Usage**: In My Gallery, click the link icon on any image to copy its public URL. If the image is private, it is automatically made public first.
- **Frontend**: Link2 icon button in gallery image hover overlay with "Copied!" feedback state. Public page at `/p/[id]` shows the image, title, prompt, author, and a "Try ImgGen" CTA.
- **Backend**: No new API needed — uses existing `PATCH /api/images/[id]` to set `isPublic: true`. Public page fetches directly from Prisma (server component).
- **Files**: `src/app/p/[id]/page.tsx`. Route allowlisted in `src/middleware.ts`.

### Image Info Bar
Displays current canvas dimensions and zoom level at the bottom-left of the canvas.

- **Frontend**: Absolutely-positioned pill overlay in `image-editor.tsx` showing `{width} × {height}` and `{zoom}%`. Updates reactively via `canvasDimensions` local state (set on image load). Sits alongside the zoom controls panel at bottom-right.

---

## Usage Credits

### Credit System
Each new user receives **20 free credits**. Every successful AI generation (edit, filter, expansion, background removal, enhancement, text-to-image) deducts 1 credit. Requests are blocked server-side when credits reach 0.

- **Frontend**: Credits badge in editor Navbar and dashboard (purple when > 5, red when ≤ 5). Credits check before enabling the Generate button in text-to-image mode.
- **Backend**: Credit check before processing in `POST /api/edit-image` and `POST /api/generate`. Credit decrement on success. `GET /api/credits` returns current balance.
- **Database**: `credits Int @default(20)` on the `User` model.

---

## Gallery

### Personal Gallery
Browse all saved images in a responsive grid. Toggle each image between public and private. Delete images. Add images to collections via hover overlay.

- **Frontend**: `/gallery/user` page with Images and Collections tabs.
- **Backend**: `GET /api/images` (paginated list), `DELETE /api/images/[id]`, `PATCH /api/images/[id]` (toggle isPublic / update title).

### Public Community Gallery
Browse all images marked as public by any user. Masonry grid layout with hover to reveal the prompt. Author avatar and name shown per image. Server-rendered with 60-second revalidation.

- **Frontend**: `/gallery` page (public, no auth required). Accessible from dashboard.
- **Backend**: `GET /api/gallery` returns paginated public images with user info.

---

## Collections

### Create Collection
Name and create a collection to organize saved images.

- **Frontend**: Collections tab in `/gallery/user` page with inline creation form.
- **Backend**: `POST /api/collections`.

### Add Images to Collection
Add any saved image to one or more collections from the gallery image hover overlay.

- **Frontend**: Collection buttons shown on image hover when collections exist.
- **Backend**: `POST /api/collections/[id]/images` with `{ imageId }` — uses upsert to prevent duplicates.

### Delete Collection
Remove a collection (images are not deleted, only the collection and its links).

- **Frontend**: Delete button on collection card hover.
- **Backend**: `DELETE /api/collections/[id]`.

### View Collection Contents
Browse images within a specific collection.

- **Backend**: `GET /api/collections/[id]` returns collection with all linked images.

---

## Database Schema

```
User              — id, name, email, password, image, credits(20), timestamps
Account           — OAuth provider accounts linked to User
Session           — JWT sessions
VerificationToken — Email verification
GeneratedImage    — id, userId, title, prompt, imageData(Text), isPublic, createdAt
Collection        — id, userId, name, createdAt
CollectionImage   — collectionId + imageId join (unique pair)
```

**Storage note**: Images are stored as base64 data URLs in PostgreSQL `TEXT` columns. For production at scale, migrate `imageData` to Vercel Blob, Cloudinary, or AWS S3 and store URLs instead.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Font | Inter (Google Fonts) |
| State | Zustand (with devtools) |
| Auth | NextAuth v5 beta.30 |
| Database | Prisma 7 + NeonDB (PostgreSQL) |
| DB Adapter | @prisma/adapter-pg |
| AI Model | Google Gemini `gemini-3-pro-image-preview` |
| Icons | Lucide React |
