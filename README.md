# JBUIT Website

Marketing site for **JBUIT** — AI automations as a service, **Sales AI** (SaaS),
web & mobile development, social media management, and the **AI Automation
course** (paid, with Paystack).

- **Frontend:** React + Vite — `src/`
- **Backend:** Secure PHP REST API + MySQL — `server/`

---

## Project structure

```
jbuit-website/
├── index.html                 # Vite entry HTML
├── package.json
├── vite.config.js             # dev server + /backend proxy to PHP
├── .env.example               # VITE_API_BASE
├── public/
│   └── favicon.jpeg           # JBUIT logo
├── src/
│   ├── main.jsx               # React entry
│   ├── App.jsx                # routing (home / course)
│   ├── index.css              # global base styles
│   ├── theme/
│   │   └── themes.js          # dark + light design tokens
│   ├── lib/
│   │   ├── api.js             # API client (CSRF + fetch)
│   │   └── config.js          # SALES_AI_URL etc.
│   ├── data/
│   │   └── services.js        # services + setup pricing
│   ├── components/            # reusable UI
│   │   ├── Mesh.jsx           # animated constellation (logo motif)
│   │   ├── Logo.jsx
│   │   ├── ChatDemo.jsx       # Sales AI live chat demo
│   │   ├── Reveal.jsx         # scroll-reveal wrapper
│   │   ├── Eyebrow.jsx
│   │   └── Field.jsx
│   └── pages/
│       ├── HomePage.jsx
│       └── CoursePage.jsx     # curriculum, Paystack pay, video library
└── server/                    # PHP backend
    ├── .env.example
    ├── public/                # web root (point your domain here)
    │   ├── .htaccess
    │   └── api/
    │       ├── csrf.php
    │       ├── lead.php
    │       ├── enroll.php
    │       ├── course-init.php
    │       ├── course-verify.php
    │       └── course-webhook.php
    ├── src/                   # NOT web-accessible (outside public/)
    │   ├── config/  (Env.php, Database.php)
    │   └── lib/     (Security.php, Mailer.php, Paystack.php, AccessToken.php)
    └── sql/
        └── schema.sql
```

> Security note: `config/`, `lib/`, `sql/`, and `.env` live **outside** the web
> root (`server/public/`), so they can never be served — the recommended layout.

---

## 1. Frontend (React + Vite)

```bash
npm install
cp .env.example .env        # adjust VITE_API_BASE if needed
npm run dev                 # http://localhost:5173
```

`npm run dev` proxies `/backend/*` to `http://localhost:8000` (see
`vite.config.js`), so run the PHP server on port 8000 (below) and the two work
together locally.

Build for production:
```bash
npm run build               # outputs to dist/
```

The course page is at `/course` (client-side routed). On your host, rewrite
unknown paths to `index.html` so `/course` loads (Netlify: `/* /index.html 200`;
Apache: a fallback rewrite to `index.html`).

---

## 2. Backend (PHP + MySQL)

Requirements: PHP 8.1+ with `pdo_mysql`, `mbstring`, `openssl`, `curl`.

```bash
# 1. database
mysql -u root -p < server/sql/schema.sql

# 2. least-privilege DB user
#    GRANT SELECT, INSERT, UPDATE ON jbuit.* TO 'jbuit_user'@'localhost';

# 3. config
cp server/.env.example server/.env   # fill in DB, SMTP, Paystack, secrets

# 4. run locally (web root = server/public)
php -S localhost:8000 -t server/public
```

Point your production web server / vhost **document root** at `server/public/`.

### Endpoints
| Method | Path                         | Purpose                          |
|--------|------------------------------|----------------------------------|
| GET    | `/api/csrf.php`              | Issue CSRF token (call first)    |
| POST   | `/api/lead.php`              | Contact form                     |
| POST   | `/api/enroll.php`            | Free course-interest list        |
| POST   | `/api/course-init.php`       | Start a Paystack course payment  |
| POST   | `/api/course-verify.php`     | Verify payment, unlock videos    |
| POST   | `/api/course-webhook.php`    | Paystack webhook (set in dashboard) |

---

## 3. Course payments (Paystack)

1. In `server/.env`: set `PAYSTACK_SECRET_KEY`, `PAYSTACK_PUBLIC_KEY`,
   `COURSE_PRICE_NGN`, `COURSE_CALLBACK_URL` (your `/course` URL), and a long
   random `ACCESS_TOKEN_SECRET`.
2. In the Paystack dashboard → Settings → Webhooks, set the webhook to
   `https://yoursite.com/api/course-webhook.php`.
3. Flow: name+email → backend creates order & calls Paystack → user pays →
   redirected back with `?reference=` → `course-verify.php` confirms **status
   AND amount** server-side → unlocks videos via a signed device token. The
   webhook is a backstop if the user closes the tab.

Drop your real video URLs into `MODULES[].video` in `src/pages/CoursePage.jsx`.

### Hero background videos

The homepage hero is a carousel that cross-fades between three slides (web,
mobile, AI). To use real footage, drop three short muted clips into
`public/hero/` named `web.mp4`, `mobile.mp4`, and `ai.mp4` (see the README in
that folder). Until you add them, the hero shows a polished animated gradient,
so it always looks intentional. Edit the slide list in
`src/components/HeroCarousel.jsx` to change filenames or add slides.

> Access is per-device (no login). Convenient, but a determined buyer could
> share it. The real protection is that videos only unlock after a
> server-verified payment. Add accounts later if you need to stop sharing.

---

## 4. Sales AI

The "Sales AI" nav link and the flagship CTA point to
`https://salesai.jbuit.com` (set in `src/lib/config.js`). That subdomain is a
separate app you host independently.

---

## 5. Security (built in & tested)

Prepared statements (no SQL injection), CSRF double-submit tokens, per-IP rate
limiting, honeypot anti-spam, strict input validation, allow-listed CORS,
security headers, email header-injection protection, secrets in `.env` (outside
web root), hashed IPs, and server-side Paystack verification with amount checks.

Verified over real HTTP and with unit tests: valid/blocked submissions, CSRF
(419), bad email (422), honeypot drop, wrong method (405), SQL-injection stored
as harmless text, rate limit (429), payment success/underpayment/failure,
webhook signature forgery, and access-token tampering — all behave correctly.
```
