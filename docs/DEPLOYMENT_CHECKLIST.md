# Deployment Checklist

## Before deployment
- [ ] Confirm the app builds locally with `npm run build --prefix client`.
- [ ] Create a production MongoDB database and restrict database network access.
- [ ] Set a unique JWT secret (32+ random characters).
- [ ] Set a strong admin password and keep it private.
- [ ] Set `CLIENT_ORIGIN` to the exact deployed frontend origin (no wildcard).
- [ ] Configure HTTPS for frontend and backend.
- [ ] Replace local `server/uploads` storage with Cloudinary, S3 or a persistent disk.
- [ ] Configure upload size limits, backups and file retention policy.
- [ ] Set `window.__HUEROOM_API__` in `client/src/assets/config.js` to the deployed API origin, without `/api`.
- [ ] Build Angular and publish `client/dist/visualizer/browser` as the static site directory.
- [ ] Deploy the Express API with `npm start` from the `server` directory.
- [ ] Verify `/api/health`, registration, login, upload, save, download and admin authorization.
- [ ] Test the deployed site from a second browser/device.
- [ ] Never commit `.env`, passwords, MongoDB credentials or uploaded private room photos.

## Example service settings

### Backend (Node service)
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Environment: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`, `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`

### Frontend (static site)
- Root directory: `client`
- Build command: `npm install && npm run build`
- Publish directory: `dist/visualizer/browser`

Configure the frontend API origin before building. Exact settings vary by hosting provider. This repository is not deployed automatically by creating this ZIP; deployment must be completed and verified separately.
