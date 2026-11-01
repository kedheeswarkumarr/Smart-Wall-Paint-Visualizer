# HueRoom — Smart Wall Paint Visualizer

A web-based room paint preview application built with the MEAN stack: MongoDB, Express, Angular and Node.js.

## Included features

### User application
- Register and sign in with hashed passwords and JWT sessions.
- Upload JPG, PNG or WEBP room photographs (8 MB maximum).
- Manually outline a wall by clicking its corners; double-click to finish the outline.
- Optional AI semantic segmentation using Hugging Face Transformers in the browser. AI inference may take time on the first run and depends on browser/device memory and internet access. Manual selection remains available.
- Choose paint colours, adjust opacity, and preview the colour on the selected area.
- Switch between original and painted preview.
- Download the preview as PNG.
- Save designs with the original photo, preview, colour settings and manual selection coordinates; reopen saved manual designs for further editing.
- Browse colour and pattern libraries.

### Administrator
- Admin account is created on first server start when `ADMIN_NAME`, `ADMIN_EMAIL` and `ADMIN_PASSWORD` are configured.
- View KPI counts for users, projects, colours, patterns and uploads, plus recent activity.
- Add, edit and delete colour shades.
- Add, edit and delete pattern catalogue entries.
- View users, change user/admin roles and remove accounts (and their saved projects).

### API
- `/api/health`
- `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- `/api/colors` (GET/POST/PUT/DELETE)
- `/api/patterns` (GET)
- `/api/admin/patterns` (GET/POST/PUT/DELETE)
- `/api/projects` (GET/POST), `/api/projects/:id` (GET/PUT/DELETE), `/api/projects/upload`
- `/api/admin/stats`, `/api/admin/users`, `/api/admin/users/:id/role`

## Requirements
- Node.js 20 LTS or newer recommended (Angular 18 requires a supported modern Node version).
- npm.
- MongoDB Atlas free cluster or a local MongoDB server.
- VS Code (recommended).

## Windows setup (VS Code)

1. Extract the ZIP file to a folder such as `C:\Users\YOUR_NAME\Desktop\SmartWallPaintVisualizer`.
2. Open that folder in VS Code.
3. Create a MongoDB Atlas free cluster, create a database user, and allow your development IP address in Network Access. Copy the connection string.
4. In VS Code, open **Terminal → New Terminal** and run:

   ```powershell
   copy server\.env.example server\.env
   ```

5. Open `server/.env` and set `MONGODB_URI`, a private `JWT_SECRET` of at least 32 characters, and a strong `ADMIN_PASSWORD`. Do not upload `.env` to GitHub.
6. Install dependencies:

   ```powershell
   npm run install:all
   ```

7. Open two VS Code terminals.

   Terminal 1 — backend:

   ```powershell
   npm run dev:server
   ```

   Terminal 2 — Angular frontend:

   ```powershell
   npm run dev:client
   ```

8. Open `http://localhost:4200` in your browser. The API health check is `http://localhost:5000/api/health`.
9. Sign in with the admin email/password you configured in `server/.env`. Regular users can register from the app.

If PowerShell blocks npm scripts, use `npm.cmd` instead of `npm` (for example `npm.cmd run install:all`).

## Manual wall selection

1. Upload a clear, front-facing room photo.
2. Click the corners around one wall area in clockwise or counter-clockwise order.
3. Double-click to finish the polygon. Use Undo point or Clear selection to correct it.
4. Choose a shade and set opacity.
5. Select Preview shade / Apply colour, then use Show original to compare.
6. Save the project while signed in, or download the PNG preview.

AI wall detection is optional and experimental. It may identify more than one wall region, miss unusual walls, or fail on some photos. Review the mask and use manual polygon selection when needed.

## Important implementation notes and limitations

- The current manual polygon editor is the reliable Phase 1 selection workflow. The optional AI detector uses a public semantic-segmentation model and requires an internet connection for first-time model retrieval.
- The pattern catalogue supports admin CRUD and user browsing. Pattern texture compositing and advanced dual-tone workflows are future enhancements; pattern entries are not yet rendered as photorealistic textures on the canvas.
- Saved manual polygon designs retain the original photo and polygon coordinates. AI masks are not serialized, so AI-detected designs should be treated as preview exports rather than fully editable masks after reopening.
- The server currently stores uploads in `server/uploads`. This is suitable for local development. For cloud deployment, configure a persistent disk or replace local upload storage with a media service such as Cloudinary or Amazon S3. Ephemeral hosting filesystems can delete uploads during redeploys.
- This is a visualization, not a colour guarantee. Lighting, camera white balance, wall texture and screen calibration change the final result. Always test a physical sample before painting.
- Upload only room photos you own or have permission to use. Avoid photos containing private or sensitive information.

## Deployment overview

Deploy the Node API and Angular static frontend separately. Set the API environment variables on the backend, including `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `CLIENT_ORIGIN`. Build the Angular app with `npm run build --prefix client`, publish the generated `client/dist/visualizer/browser` directory, and set `window.__HUEROOM_API__` in `client/src/assets/config.js` to the deployed API origin (without `/api`). Use persistent/cloud media storage for uploaded room images. Configure HTTPS and a strict allowed frontend origin before public launch.

See `docs/DEPLOYMENT_CHECKLIST.md` before deployment.
