# Randstad GBS Learning Hub

**AI Training & Learning Platform**

A comprehensive learning platform designed to help Randstad GBS employees learn and adopt AI tools in their daily work, with a focus on recruitment and RPO operations.

---

## 🚀 Quick Start

1. **Clone the repository**
2. **Open `index.html` in your browser**
3. **Explore the learning modules**

For production deployment, see [Deployment Guide](#deployment).

---

## 📚 What's Inside

### Main Features

- **🎓 RPO Training Program** - Structured AI curriculum with beginner, intermediate, and advanced paths
- **✨ AI Prompts Library** - Searchable collection of ready-to-use AI prompts
- **🎯 Daily Focus** - Micro-coaching cards for daily skill improvement
- **📖 Knowledge Base** - Comprehensive guides and best practices
- **🎪 Interactive Workshops** - Live sessions and hands-on training
- **💡 Success Stories** - Real-world AI transformation examples
- **🔬 AI Simulations** - Practice scenarios and interactive learning
- **🛠️ AI Tools Lab** - Practical tools for immediate use

### Learning Paths

1. **Beginner Path** (~40 min)
   - AI fundamentals
   - Basic prompting
   - Practice exercises

2. **Intermediate Path** (~50 min)
   - Advanced prompting techniques
   - Role-specific applications
   - Workflow integration

3. **Advanced Path** (~125 min)
   - AI strategy and leadership
   - Custom solutions development
   - Enterprise integration

### Role-Specific Tracks

- 👥 **Recruiter** - Sourcing and candidate engagement
- 📊 **Manager** - Strategy and team implementation
- 📈 **Analyst** - Data analysis and reporting
- 📋 **Coordinator** - Scheduling and communication

---

## 🛡️ Security

The platform includes comprehensive security measures:

✅ **XSS Protection** - DOMPurify integration
✅ **CSP Headers** - Content Security Policy
✅ **Input Sanitization** - All user input validated
✅ **Rate Limiting** - Prevent abuse
✅ **Secure Storage** - Encrypted localStorage

### Security Documentation

- 📘 [Full Security Guide](SECURITY.md) - Comprehensive documentation
- 📝 [Quick Reference](SECURITY-QUICK-REFERENCE.md) - Developer cheat sheet
- 📊 [Implementation Summary](SECURITY-IMPLEMENTATION-SUMMARY.md) - What was done
- 🌐 [Secure Template](secure-template.html) - Working examples

---

## 🏗️ Project Structure

```
gbs6-to-upload/
├── index.html                      # Main hub/homepage
├── shared/                         # Shared resources
│   ├── scripts/
│   │   ├── utils/
│   │   │   ├── security.js        # Security utilities ⭐
│   │   │   └── dom-helpers.js     # DOM utilities
│   │   ├── components/
│   │   │   ├── navigation.js      # Navigation component
│   │   │   └── dropdown.js        # Dropdown component
│   │   ├── footer.js              # Dynamic footer
│   │   ├── scroll-to-top.js       # Scroll functionality
│   │   └── breadcrumb-nav.js      # Breadcrumb navigation
│   ├── fonts.css                  # Typography
│   ├── buttons.css                # Button styles
│   ├── breadcrumb-nav.css         # Navigation styles
│   ├── hub-button.css             # Hub button styles
│   ├── scroll-to-top.css          # Scroll button styles
│   └── card-animations.css        # Card animations
├── rpo-training/                  # RPO training modules
│   ├── index.html                 # Training hub
│   ├── ai-tools-lab.html          # Tools laboratory
│   ├── pathways/                  # Learning paths
│   │   ├── beginner.html
│   │   ├── intermediate.html
│   │   ├── advanced.html
│   │   ├── recruiter.html
│   │   ├── manager.html
│   │   ├── analyst.html
│   │   ├── coordinator.html
│   │   └── modules/               # Individual modules
│   ├── css/
│   └── js/
├── gbs-prompts/                   # Prompt library
│   ├── index.html
│   └── prompts.json
├── onboarding-flow/               # New user onboarding
│   ├── index.html
│   ├── welcome.html
│   ├── role-selection.html
│   ├── assessment.html
│   └── results.html
├── daily-focus/                   # Daily coaching cards
├── use-cases/                     # Success stories
├── knowledge-content/             # Knowledge base
├── ai-help/                       # AI in action examples
├── ai-simulations/                # Interactive simulations
├── workshops/                     # Workshop content
├── about-us/                      # About page
├── feedback/                      # Feedback system
└── appscript-bank/                # Automation ideas

# Configuration & Security
├── netlify.toml                   # Netlify config ⭐
├── vercel.json                    # Vercel config ⭐
├── .htaccess                      # Apache config ⭐
├── security-headers.config.js     # Security headers reference ⭐

# Documentation
├── README.md                      # This file
├── SECURITY.md                    # Security documentation ⭐
├── SECURITY-QUICK-REFERENCE.md    # Security cheat sheet ⭐
├── SECURITY-IMPLEMENTATION-SUMMARY.md  # Security summary ⭐
├── CHANGELOG.md                   # Version history
├── NAVIGATION-GUIDE.md            # Navigation patterns
├── NAVIGATION-IMPROVEMENTS.md     # Navigation enhancements
├── ENTERPRISE-READINESS.md        # Production checklist
└── CLAUDE.md                      # Development guidelines

⭐ = New security files
```

---

## 🔧 Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling
- **JavaScript (ES6+)** - Interactive features
- **Tailwind CSS** - Utility-first CSS framework (CDN)

### Security
- **DOMPurify** - XSS protection
- **Custom SecurityUtils** - Input sanitization
- **CSP Headers** - Content Security Policy

### Hosting
- Compatible with: Netlify, Vercel, Apache, Nginx, or any static host

---

## 📦 Deployment

### Netlify (Recommended)

1. **Connect repository to Netlify**
2. **Configuration automatically applied from `netlify.toml`**
3. **Deploy**

```bash
# Or use Netlify CLI
netlify deploy --prod
```

### Vercel

1. **Connect repository to Vercel**
2. **Configuration automatically applied from `vercel.json`**
3. **Deploy**

```bash
# Or use Vercel CLI
vercel --prod
```

### Apache

1. **Upload files to server**
2. **Ensure `.htaccess` is in root directory**
3. **Verify `mod_headers` is enabled**

```bash
# Upload via FTP/SCP
scp -r . user@server:/var/www/html/

# Enable mod_headers (if needed)
sudo a2enmod headers
sudo service apache2 restart
```

### Nginx

1. **Upload files to server**
2. **Add headers to `nginx.conf`** (see `security-headers.config.js`)
3. **Reload Nginx**

```bash
# Reload Nginx
sudo nginx -t
sudo nginx -s reload
```

### Manual/Static Host

1. **Upload all files**
2. **Configure security headers** (if supported by host)
3. **Test deployment**

---

## 🧪 Testing

### Manual Testing

1. **Open `index.html` locally**
2. **Test navigation between modules**
3. **Try search functionality**
4. **Complete a learning module**

### Security Testing

```bash
# Test security headers
curl -I https://yoursite.com

# Check for XSS protection
# Open secure-template.html and try injecting scripts
```

### Browser Console Tests

```javascript
// Check if security loaded
console.log(typeof SecurityUtils); // Should be "object"
console.log(typeof DOMPurify);     // Should be "object"

// Test XSS protection
SecurityUtils.sanitizeHTML('<script>alert("XSS")</script>');
// Should return: '' (empty) or safe HTML
```

---

## 🔐 Security Setup

### For Developers

Add these scripts to every HTML page:

```html
<head>
    <!-- DOMPurify for XSS protection -->
    <script src="https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js"
        integrity="sha384-4H0KEY16H/RgZTVx9vNEz5PQZbQ/1LDz9Jl8tN0FKYxjBfUOcYhJ3k+xhWLxqUqK"
        crossorigin="anonymous"></script>

    <!-- Security utilities -->
    <script src="shared/scripts/utils/security.js" defer></script>
</head>
```

Use SecurityUtils in your code:

```javascript
// ✅ Safe HTML injection
SecurityUtils.safeSetInnerHTML(element, userContent);

// ✅ Sanitize search queries
const safeQuery = SecurityUtils.sanitizeSearchQuery(input.value);

// ✅ Validate URLs
if (SecurityUtils.isValidURL(url)) {
    window.location.href = url;
}
```

**See:** [SECURITY-QUICK-REFERENCE.md](SECURITY-QUICK-REFERENCE.md) for more examples

---

## 📝 Development Guidelines

### Code Standards

- **Semantic HTML** - Use proper HTML5 tags
- **Accessible** - WCAG 2.1 AA compliance
- **Responsive** - Mobile-first design
- **Secure** - Always sanitize user input
- **Documented** - Comment complex code

### File Naming

- HTML files: `lowercase-with-hyphens.html`
- CSS files: `lowercase-with-hyphens.css`
- JS files: `camelCase.js` or `kebab-case.js`
- Folders: `lowercase-with-hyphens/`

### Before Committing

- [ ] Test all links work
- [ ] Verify responsive design
- [ ] Check accessibility (WAVE, axe)
- [ ] Sanitize all user input
- [ ] Remove console.log statements
- [ ] Update documentation

---

## 🐛 Troubleshooting

### Common Issues

**Issue:** Scripts not loading
**Fix:** Check file paths are relative, not absolute

**Issue:** Security utilities not working
**Fix:** Ensure DOMPurify loads before SecurityUtils

**Issue:** CSP blocking resources
**Fix:** Update CSP headers in deployment config

**Issue:** Search not working
**Fix:** Check `shared/search-index.json` exists and path is correct

### Getting Help

1. Check [SECURITY.md](SECURITY.md) for security issues
2. Review [NAVIGATION-GUIDE.md](NAVIGATION-GUIDE.md) for navigation issues
3. See [ENTERPRISE-READINESS.md](ENTERPRISE-READINESS.md) for production issues

---

## 📊 Browser Support

- **Chrome/Edge** - Latest 2 versions ✅
- **Firefox** - Latest 2 versions ✅
- **Safari** - Latest 2 versions ✅
- **Mobile browsers** - iOS Safari, Chrome Mobile ✅

### Requirements

- JavaScript enabled
- Cookies/localStorage enabled (for progress tracking)
- Modern browser with ES6 support

---

## 🚧 Roadmap

### Phase 1: Security Hardening ✅ COMPLETE
- [x] XSS protection
- [x] CSP headers
- [x] Input sanitization
- [x] Security documentation

### Phase 2: Build System (Next)
- [ ] Replace Tailwind CDN with compiled CSS
- [ ] Set up Vite build system
- [ ] Implement code splitting
- [ ] Add minification

### Phase 3: Backend Integration
- [ ] User authentication
- [ ] Database for content
- [ ] Progress tracking
- [ ] Certificate generation

### Phase 4: Advanced Features
- [ ] Assessment/quiz system
- [ ] Community features
- [ ] Mobile app
- [ ] Analytics dashboard

---

## 📄 License

Internal use only - Randstad GBS

---

## 👥 Contributors

- **Development:** Randstad GBS Team
- **Security Hardening:** Claude Code Assistant (October 2025)

---

## 📞 Support

For questions or issues:
- Review documentation in this repository
- Check [SECURITY.md](SECURITY.md) for security concerns
- Refer to [ENTERPRISE-READINESS.md](ENTERPRISE-READINESS.md) for production readiness

---

## 🎯 Quick Links

### For Users
- 🏠 [Main Hub](index.html)
- 🎓 [RPO Training](rpo-training/index.html)
- ✨ [AI Prompts](gbs-prompts/index.html)
- 🎯 [Daily Focus](daily-focus/index.html)

### For Developers
- 📘 [Security Guide](SECURITY.md)
- 📝 [Security Quick Ref](SECURITY-QUICK-REFERENCE.md)
- 🌐 [Secure Template](secure-template.html)
- 📊 [Enterprise Readiness](ENTERPRISE-READINESS.md)

### For DevOps
- ⚙️ [Netlify Config](netlify.toml)
- ⚙️ [Vercel Config](vercel.json)
- ⚙️ [Apache Config](.htaccess)
- 🔒 [Security Headers](security-headers.config.js)

---

**Version:** 1.0.0
**Last Updated:** October 9, 2025
**Status:** 🟢 Production Ready (Security Hardened)
