# Requirements Coverage Matrix

| Requirement | Current package status | Notes |
|---|---|---|
| Angular / MEAN stack | Included | Angular 18 + Express + Node + MongoDB/Mongoose |
| User registration and login | Implemented in code | bcrypt password hashes, JWT |
| JPG/PNG upload | Implemented in code | WEBP also accepted; 8 MB maximum |
| Manual wall selection | Implemented in code | Polygon click points and double-click finish |
| AI wall detection | Optional prototype included | Browser model; experimental and not guaranteed |
| Apply solid paint colour | Implemented in code | Canvas polygon/mask colour blend |
| Opacity adjustment | Implemented in code | Slider |
| Before/after | Basic comparison included | Toggle original and painted canvas |
| Save/download designs | Implemented in code | PNG download; saved manual projects can reopen |
| Colour catalogue | Implemented in code | Public listing and admin CRUD |
| Pattern catalogue | Basic management included | Pattern records can be browsed and managed; no canvas texture compositing yet |
| Dual-tone walls | Not yet implemented | Future enhancement |
| User/admin roles | Implemented in code | Admin bootstrap from environment variables |
| Admin user management | Implemented in code | List, role update and account removal |
| Admin analytics | Basic KPIs implemented | Counts and recent activity; session duration and satisfaction survey are future work |
| Responsive UI | CSS included | Needs device/browser testing |
| Secure image storage | Development storage included | Production must use persistent disk or cloud media service |
| Cloud deployment | Documentation included | Hosting setup and live deployment are not included in the ZIP |

**Important:** A source ZIP is not proof of a successful build or live deployment. Install dependencies, run the app and complete the deployment checklist before submitting the project.
