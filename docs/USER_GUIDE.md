# HueRoom User Guide

## Getting started
1. Open the deployed HueRoom URL or run the local application using the README instructions.
2. Create an account using your name, email and a password of at least eight characters.
3. Sign in to access saved designs.

## Upload a room photo
1. Open **Visualizer Studio**.
2. Choose **Upload room photo**.
3. Select a JPG, PNG or WEBP image up to 8 MB.
4. Use a clear, well-lit image where the wall is visible. Upload only a photo you own or have permission to use.

## Select a wall manually
1. Click the visible corners of the wall area on the canvas.
2. Select at least three points.
3. Double-click to finish the outline.
4. Use **Undo point** to remove the last point or **Clear selection** to start again.
5. Optional: use AI detection, then inspect the result. AI detection is experimental and can include incorrect regions.

## Apply a paint shade
1. Choose a colour from the shade palette or Color Library.
2. Adjust Paint opacity.
3. Select Preview shade or Apply colour.
4. Use Show original / Show painted preview to compare the result.
5. Remember that screen calibration, camera white balance, room lighting and wall texture affect the real-world result.

## Save and download
- Select **Download preview** to export the current canvas as a PNG.
- Sign in, enter a project title and select **Save design to my projects**.
- Open **My Designs** to see saved work. Saved manual polygon designs can be reopened with their original room photo and selection points.
- AI masks are not saved for editing in this version.

## Administrator guide
1. Configure `ADMIN_NAME`, `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `server/.env` before the first backend startup.
2. Start the backend. It creates the admin account if that email does not already exist.
3. Sign in with the configured admin credentials.
4. Open **Admin Panel** to view KPI counts, recent activity, manage colour shades, manage patterns and manage user roles.
5. Keep administrator credentials private. Do not share the admin account with ordinary users.

## Troubleshooting
- **Cannot connect:** Check that the backend is running on port 5000 and MongoDB connection string is correct.
- **Image rejected:** Use JPG, PNG or WEBP and keep it below 8 MB.
- **AI detector fails:** Use manual polygon selection. The AI model may need internet access and device memory.
- **Cannot save:** Sign in and select at least one wall region before saving.
- **Admin panel missing:** Sign in with the administrator account created from server environment variables.
