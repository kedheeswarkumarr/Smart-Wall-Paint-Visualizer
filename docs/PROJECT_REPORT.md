# SMART WALL PAINT VISUALIZER — PROJECT REPORT

## 1. Project title
**HueRoom: Smart Wall Paint Visualizer — Virtual Room Paint & Design Preview Application**

## 2. Collaborating organization and reference
- Collaborating organization: Unified Mentor
- Reference inspiration: Behr Paint Visualizer
- Application type: Web-based interior visualization application

## 3. Abstract
HueRoom is a web application that helps users preview paint colours on photographs of their own rooms before purchasing paint or beginning renovation work. Users upload an image, select wall regions manually with a polygon tool, choose a shade, adjust opacity and inspect an indicative preview. The system supports user accounts, saved projects, colour and pattern catalogues, and an administrator area. The application demonstrates full-stack development using MongoDB, Express.js, Angular and Node.js (MEAN stack).

## 4. Problem statement
Customers often choose wall paint from small shade cards or showroom displays. Those samples cannot reproduce the lighting, room size, surrounding furniture and wall texture of a customer's own space. This makes it difficult to imagine the finished room and can lead to unsuitable colour choices, dissatisfaction and repainting costs. HueRoom provides a convenient digital preview to support more informed decisions.

## 5. Objectives
### Primary objectives
- Preview paint colours on uploaded room photographs.
- Allow users to select wall areas manually.
- Provide adjustable paint opacity and original/painted comparison.
- Allow users to save and download designs.
- Improve confidence in paint selection and reduce avoidable rework.

### Secondary objectives
- Support interior designers, painters and paint retailers during consultations.
- Provide a manageable colour and pattern catalogue.
- Demonstrate a modular MEAN-stack application with authentication and administration.

## 6. Scope
### Included in this Phase 1 implementation
- Browser-based Angular application.
- Registration, login, JWT authentication and user/admin roles.
- JPG, PNG and WEBP room-image upload with an 8 MB limit.
- Manual polygon wall selection and editing controls.
- Paint shade catalogue, opacity adjustment and canvas preview.
- Original/painted preview toggle and PNG download.
- Saved projects with original photo and manual polygon metadata.
- User project listing, reopen/edit for saved manual polygon projects, and delete.
- Admin colour CRUD, pattern catalogue CRUD, user/role management and activity KPIs.
- Optional experimental AI wall segmentation in the browser.

### Not fully implemented / future work
- Photorealistic pattern and wallpaper texture compositing.
- Dual-tone wall regions and multiple independent masks per project.
- Persistent restoration of AI segmentation masks.
- Real-time AR/VR camera preview and native mobile application.
- Professional lighting simulation, shadows and material-aware rendering.
- Paint retailer inventory, purchasing and payment integrations.
- Production media storage integration (Cloudinary/S3) and cloud deployment configuration.

## 7. Technology stack
| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Angular 18, TypeScript | Responsive single-page application |
| UI | HTML5, CSS3 | Layout and responsive interface |
| Image editor | HTML5 Canvas | Polygon selection, colour blending and PNG export |
| Optional AI | Hugging Face Transformers.js | Browser-based semantic wall segmentation |
| Backend | Node.js, Express.js | REST API and business logic |
| Database | MongoDB, Mongoose | Users, projects, colours, patterns and activity |
| Authentication | JWT, bcryptjs | Signed sessions and password hashing |
| Uploads | Multer | Validated image upload handling |

## 8. High-level architecture
1. The Angular client presents the studio, catalogue, saved projects and admin pages.
2. The client communicates with the Express REST API over HTTP.
3. Express validates requests, verifies JWT roles and reads/writes MongoDB documents through Mongoose.
4. Multer validates supported image MIME types and file size before saving development uploads.
5. Canvas renders the uploaded room and applies a semi-transparent colour inside the selected wall mask.

## 9. Functional modules
### 9.1 Authentication
Users can register and sign in. Passwords are hashed using bcryptjs. The API issues a signed JWT with a seven-day expiry. Admin access is provisioned from environment variables on initial server startup.

### 9.2 Room upload
Authenticated users can upload JPG, PNG or WEBP files up to 8 MB. The server stores the image and returns its URL. The client checks file size and loads the photo into a Canvas workspace.

### 9.3 Wall selection and paint preview
The user clicks at least three wall-corner points to form a polygon and double-clicks to finish. The editor blends the selected HEX shade into the polygon using the chosen opacity. An optional AI segmentation path can produce a wall mask; users should inspect results and prefer manual correction when needed.

### 9.4 Design saving
The application stores the painted preview, original photo URL, manual polygon coordinates, title, selected shade, finish and opacity. Saved manual designs can be reopened for further editing. AI masks are not persisted in the current release.

### 9.5 Catalogue management
The colour catalogue includes shade name, HEX value, brand, finish and category. The pattern catalogue includes name, description, category and active state. Admins can create, update and delete catalogue entries.

### 9.6 Administration and KPIs
Administrators can view user, project, colour, pattern and upload counts; review recent activity; list users; change roles; and remove accounts and their projects.

## 10. Data model
- **User:** name, email, passwordHash, role, favouriteColors, timestamps.
- **Color:** name, HEX, brand, finish, category, tags, timestamps.
- **Pattern:** name, description, category, imageUrl, scale, active, timestamps.
- **Project:** owner, title, preview URL, original image URL, polygon data, applied colour, finish, opacity, optional pattern, timestamps.
- **Activity:** optional user, event type (upload/save/login/download), detail, timestamps.

## 11. Non-functional requirements
- Responsive desktop/tablet layout.
- Password hashing and role-protected administrative endpoints.
- API rate limiting and common HTTP security headers.
- Image file type and size validation.
- Modular separation of frontend, API and data models.
- User-facing warning that colour previews are approximate.

## 12. User flow
1. Register or sign in.
2. Upload a room image.
3. Select wall corners manually or optionally run AI detection.
4. Choose a paint colour and opacity.
5. Preview and compare with the original.
6. Save the design or download a PNG.
7. Reopen saved manual designs from My Designs.

## 13. KPIs
- Registered user count.
- Saved project count.
- Number of colours and patterns in the catalogue.
- Upload and save event counts.
- Recent activity feed.

Session-duration and satisfaction-feedback instrumentation are planned enhancements and are not claimed as implemented metrics.

## 14. Assumptions and constraints
- Users provide photos they own or are authorized to use.
- Clear photographs and manual selection are acceptable for the first release.
- Rendering quality depends on the photo, camera, display and wall surface.
- Browser AI inference may be slow or unavailable on lower-memory devices.
- Local file storage is for development; production deployment needs persistent or managed media storage.

## 15. Privacy, security and responsible use
- Do not upload photos without permission.
- Configure a long, private JWT secret and strong admin password.
- Keep `.env` out of source control.
- Use HTTPS and restrict CORS to the deployed frontend origin.
- Configure persistent/cloud file storage and appropriate retention controls before public deployment.
- Do not treat the preview as a guarantee of the final physical paint shade.

## 16. Expected impact
HueRoom makes it easier to compare paint shades in the context of a user's own room, supports design discussions and can reduce uncertainty before painting. The application is an aid to decision-making and does not replace physical paint samples or professional advice.

## 17. Future enhancements
- Multi-polygon editing and independent wall masks.
- Dual-tone walls and pattern/texture rendering.
- AI mask refinement and saved segmentation masks.
- Lighting simulation and realistic material-aware blending.
- Cloud media storage and production deployment.
- Feedback forms and session analytics.
- Retailer/paint-brand catalogue integration and mobile experience.
