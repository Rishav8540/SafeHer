# 🛡️ SafeHer – One Click Protection

> *Because every woman deserves to feel safe, every single moment.*

SafeHer is a full-stack Women Safety Emergency Web Application. Built with love — for sisters, daughters, wives, and friends — so that help is always exactly one click away, even when family can't be physically present.

---

## 📸 Features at a Glance

| Feature | Description |
|---|---|
| 🚨 **SOS Button** | Big red button — triggers alarm, shares location, alerts all contacts |
| 👮 **Police Connect** | One-tap call to police (100) or women helpline (1091) |
| 👥 **Trusted Contacts** | Add family & friends who get instant alerts during emergency |
| 📍 **Live Location** | Share real-time GPS location with trusted people |
| 📞 **Fake Call** | Generate a fake incoming call screen to escape unsafe situations |
| 🎙️ **Voice Trigger** | Say *"Help me"* — SOS activates automatically |
| 🎥 **Evidence Guard** | Auto-records audio during SOS as legal evidence |
| ⏱️ **Safety Timer** | Set a check-in timer — missed check-in auto-fires alert |
| 🌙 **Dark / Light Mode** | Beautiful in both themes |
| 🔐 **Secure Auth** | JWT authentication with password hashing |
| 👩‍💼 **Admin Panel** | View users, alerts, and system analytics |

---

## 🗂️ Project Structure

```
safeher/
├── backend/                  ← Node.js + Express + MongoDB API
│   ├── models/
│   │   ├── User.js           ← User schema with bcrypt hashing
│   │   ├── TrustedContact.js ← Safety circle contacts
│   │   └── EmergencyAlert.js ← SOS alert records
│   ├── routes/
│   │   ├── auth.js           ← Register / Login / Me
│   │   ├── contacts.js       ← CRUD trusted contacts
│   │   ├── alerts.js         ← SOS trigger + history
│   │   ├── users.js          ← Profile + image upload
│   │   ├── locations.js      ← Location tracking stub
│   │   └── admin.js          ← Admin dashboard data
│   ├── middleware/
│   │   └── auth.js           ← JWT protect + admin guard
│   ├── uploads/              ← Profile images stored here
│   ├── server.js             ← Main Express server
│   ├── seeder.js             ← Seed admin + demo data
│   ├── .env.example          ← Copy to .env and fill in
│   └── package.json
│
├── frontend/                 ← React.js + Tailwind CSS
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.js       ← Landing page with hero section
│   │   │   ├── Login.js      ← Sign in page
│   │   │   ├── Register.js   ← Create account
│   │   │   ├── Dashboard.js  ← Main dashboard + quick SOS
│   │   │   ├── Emergency.js  ← All emergency features
│   │   │   ├── Contacts.js   ← Manage trusted contacts
│   │   │   ├── Profile.js    ← User profile + image upload
│   │   │   └── Admin.js      ← Admin panel
│   │   ├── components/
│   │   │   └── layout/
│   │   │       └── Layout.js ← Sidebar + mobile nav
│   │   ├── context/
│   │   │   ├── AuthContext.js  ← Global auth state
│   │   │   └── ThemeContext.js ← Dark/light mode
│   │   ├── utils/
│   │   │   └── api.js        ← Axios API calls
│   │   ├── App.js            ← Routes + protected routes
│   │   ├── index.js
│   │   └── index.css         ← Tailwind + custom styles
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example
│   └── package.json
│
├── package.json              ← Root scripts (run both together)
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start (Step-by-Step)

### Prerequisites
Make sure these are installed on your system:
- [Node.js](https://nodejs.org) v16 or above
- [MongoDB](https://www.mongodb.com/try/download/community) (local) OR a free [MongoDB Atlas](https://cloud.mongodb.com) cluster
- npm (comes with Node.js)

---

### Step 1 — Clone / Download the Project

```bash
# If using git:
git clone https://github.com/yourname/safeher.git
cd safeher

# Or just unzip the folder and open terminal inside it
```

---

### Step 2 — Set Up the Backend

```bash
cd backend
npm install
```

Create your `.env` file:
```bash
cp .env.example .env
```

Now open `.env` and fill in your values:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/safeher

# Change this to any long random string!
JWT_SECRET=safeher_super_secret_change_me_12345

CLIENT_URL=http://localhost:3000

# Gmail SMTP (for sending email alerts to contacts)
# Enable "App Passwords" in your Google account
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_gmail_app_password

# Twilio SMS (optional — for SMS alerts)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE=+1234567890
```

---

### Step 3 — Seed the Database (Creates admin + demo user)

```bash
# Still inside /backend
node seeder.js
```

You will see:
```
✅ SafeHer Database Seeded!
🔑 Admin Login:
   Email:    admin@safeher.com
   Password: admin123
👩 Demo User:
   Email:    priya@example.com
   Password: demo123
```

---

### Step 4 — Start the Backend Server

```bash
npm run dev
# or: node server.js
```

You should see:
```
🚀 SafeHer Server running on port 5000
✅ MongoDB Connected
```

Test it: Open `http://localhost:5000/api/health` in browser — you should see `"status": "SafeHer Backend Running ✅"`

---

### Step 5 — Set Up the Frontend

Open a **new terminal window**:
```bash
cd frontend
npm install
```

Create `.env`:
```bash
cp .env.example .env
```

The default `.env` content:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

### Step 6 — Start the Frontend

```bash
npm start
```

The app opens at `http://localhost:3000` 🎉

---

## 🧪 Test Login Credentials

| Role | Email | Password |
|------|-------|----------|
| 👩‍💼 Admin | admin@safeher.com | admin123 |
| 👩 Demo User | priya@example.com | demo123 |

---

## 🔑 API Reference

### Authentication
| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| POST | `/api/auth/register` | Create account | ❌ |
| POST | `/api/auth/login` | Sign in, get JWT | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |

### Trusted Contacts
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/contacts` | Get all contacts |
| POST | `/api/contacts` | Add new contact |
| PUT | `/api/contacts/:id` | Update contact |
| DELETE | `/api/contacts/:id` | Remove contact |

### Emergency Alerts
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/alerts/sos` | Trigger SOS (sends emails) |
| GET | `/api/alerts/history` | Get alert history |
| PUT | `/api/alerts/:id/resolve` | Mark alert resolved |

### User Profile
| Method | Route | Description |
|--------|-------|-------------|
| PUT | `/api/users/profile` | Update profile info |
| POST | `/api/users/profile-image` | Upload profile photo |
| PUT | `/api/users/location` | Update GPS location |

### Admin (admin only)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/admin/stats` | Dashboard numbers |
| GET | `/api/admin/users` | List all users |
| GET | `/api/admin/alerts` | All emergency alerts |
| PUT | `/api/admin/users/:id/toggle` | Activate/deactivate user |

---

## 🗃️ Database Collections

### Users
```js
{
  name, email, password (hashed), phone, profileImage,
  address, bloodGroup, medicalInfo,
  isAdmin, isActive,
  lastLocation: { lat, lng, updatedAt },
  createdAt
}
```

### TrustedContacts
```js
{
  userId, name, relation, phone, email,
  priority (1=High, 2=Medium, 3=Low),
  isActive, createdAt
}
```

### EmergencyAlerts
```js
{
  userId, type (SOS/POLICE/TRUSTED_CONTACTS/etc),
  status (ACTIVE/RESOLVED/CANCELLED),
  location: { lat, lng, address },
  message,
  notifiedContacts: [{ name, phone, email, notifiedAt }],
  resolvedAt, createdAt
}
```

---

## 🎨 Design System

- **Font Display**: Playfair Display (headings)
- **Font Body**: DM Sans (paragraphs, UI)
- **Primary Color**: `#f43f5e` (rose-500) — emergency red
- **Dark Background**: `#1a1a2e` → `#16213e` gradient
- **Glass Cards**: `backdrop-filter: blur(20px)` with subtle borders
- **Animations**: CSS keyframes — pulse-ring (SOS), float (shield), slideUp (pages)

---

## 🚀 Deployment Guide

### Option A — Deploy on Render (Free)

**Backend:**
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your repo → select `/backend` as root
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variables from `.env`

**Frontend:**
1. Render → New → Static Site
2. Root: `/frontend`
3. Build: `npm install && npm run build`
4. Publish dir: `build`
5. Set `REACT_APP_API_URL` = your backend Render URL

### Option B — Deploy on Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

railway login
railway init
railway up
```

### Option C — VPS / DigitalOcean

```bash
# On server
git clone your-repo
cd safeher/backend && npm install
pm2 start server.js --name safeher-api

cd ../frontend && npm install && npm run build
# Serve build/ with nginx
```

---

## 📧 Email Alert Setup (Gmail)

1. Go to your Google Account → Security
2. Enable **2-Step Verification**
3. Search for **App Passwords**
4. Generate a new App Password for "Mail"
5. Paste the 16-character password into `.env` as `EMAIL_PASS`

This allows SafeHer to send emergency emails to trusted contacts with live location links.

---

## 🔐 Security Features

- ✅ Passwords hashed with **bcryptjs** (12 salt rounds)
- ✅ **JWT tokens** expire in 7 days
- ✅ Protected routes — unauthenticated requests get 401
- ✅ Admin routes — non-admin users get 403
- ✅ CORS configured to only allow your frontend domain
- ✅ Input validation on all forms
- ✅ File upload size limit (5MB)
- ✅ Tokens stored in `localStorage` with auto-logout on 401

---

## 📱 Mobile Features

- Fully responsive — works on all screen sizes
- Mobile-first sidebar that slides in
- Touch-friendly large SOS button
- `navigator.geolocation` for GPS
- `Web Speech API` for voice trigger
- `MediaRecorder API` for audio evidence
- `navigator.share` for native sharing on mobile

---

## 🆘 Emergency Helplines (India)

| Service | Number |
|---------|--------|
| Police | 100 |
| Women Helpline | 1091 |
| Single Emergency | 112 |
| Ambulance | 102 |
| Fire | 101 |
| Childline | 1098 |
| Domestic Violence | 181 |
| Anti-Stalking | 1096 |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js 18, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Email | Nodemailer (Gmail SMTP) |
| SMS | Twilio (optional) |
| File Upload | Multer |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Voice | Web Speech API |
| Recording | MediaRecorder API |
| Location | Geolocation API |

---

## 💡 Future Enhancements

- [ ] Real-time location sharing with Socket.io
- [ ] WhatsApp alert integration
- [ ] Google Maps embedded view
- [ ] Push notifications (PWA)
- [ ] Safe route suggestion with Google Directions API
- [ ] Community safety heatmap
- [ ] Wearable / smartwatch integration
- [ ] Multi-language support (Hindi, Tamil, etc.)

---

## 🤝 Contributing

This is an open-source project built for social good. Contributions are welcome!

1. Fork the repo
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m "Add: my feature"`
4. Push and open a Pull Request

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## ❤️ Made With Love

> *"I can't always be there to protect you. So I built something that can."*
>
> SafeHer was born from the heart of a brother who wanted his sister to always feel safe.
> This app is for every woman who deserves a guardian in her pocket.

**SafeHer – One Click Protection** 🛡️

---

*For support or questions, open an issue on GitHub or email: support@safeher.com*
