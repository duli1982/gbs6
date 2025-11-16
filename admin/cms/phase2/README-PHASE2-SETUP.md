## 🎯 Phase 2 - Complete Setup Guide
### Use Cases, Workshops & Knowledge Content Management

---

## 📦 WHAT YOU HAVE - PHASE 2

Phase 2 adds management for **3 new content types**:

### ✅ Files Created:

1. **`1-SETUP-UseCases-Sheet.gs`** - Google Sheet for Use Cases (28 fields)
2. **`2-WEBAPP-UseCases-Manager.gs`** - Backend API for Use Cases
3. **`3-SETUP-Workshops-Sheet.gs`** - Google Sheet for Workshops
4. **`4-WEBAPP-Workshops-Manager.gs`** - Backend API for Workshops
5. **`5-SETUP-KnowledgeContent-Sheet.gs`** - Google Sheet for Videos & Articles
6. **`6-WEBAPP-KnowledgeContent-Manager.gs`** - Backend API for Knowledge Content
7. **`README-PHASE2-SETUP.md`** - This complete setup guide

### ✅ What You Can Manage:

**Use Cases / Success Stories:**
- ✅ Add/edit/delete AI success stories
- ✅ Set metrics (time saved, improvement %, quality boost)
- ✅ Define getting started steps
- ✅ Add common pitfalls and examples
- ✅ Organize by category and difficulty
- ✅ Link to GBS prompts
- ✅ One-click JSON generation

**Workshops:**
- ✅ Add/edit/delete upcoming workshops
- ✅ Set date, time, duration, instructor
- ✅ Track participant numbers
- ✅ Auto-update status (Coming Soon, Open, Full, Completed)
- ✅ Manage registration links
- ✅ One-click JSON generation

**Knowledge Content:**
- ✅ Manage video tutorials (Google Drive links)
- ✅ Manage help articles (external links)
- ✅ Organize by category
- ✅ Set display order
- ✅ Separate Videos and Articles management
- ✅ One-click JSON generation

---

## 🚀 COMPLETE SETUP (3-4 Hours Total)

Follow these steps for each content type. You can do them in any order.

---

## 📚 PART 1: USE CASES SETUP (60-90 min)

### Step 1: Create Use Cases Google Sheet (10 min)

1. **Go to:** https://script.google.com
2. **Click:** "New Project"
3. **Name it:** "GBS Use Cases Sheet Setup"
4. **Copy** all code from `1-SETUP-UseCases-Sheet.gs`
5. **Paste** into the editor
6. **Click:** Run ▶️ button
7. **Select:** `createUseCasesSheet` function
8. **Click:** Run
9. **Authorize** when asked
10. **COPY the Sheet ID** from the popup/logs

**✅ Success Check:**
- New Google Sheet: "GBS Use Cases - Admin CMS"
- Three tabs: Use Cases, Categories, Settings
- One sample use case in row 2

**🔐 IMPORTANT:** Go to Settings tab and **CHANGE THE PASSWORD**!

---

### Step 2: Deploy Use Cases Web App (15 min)

1. **Go to:** https://script.google.com
2. **Click:** "New Project" (new project!)
3. **Name it:** "GBS Use Cases Manager API"
4. **Copy** all code from `2-WEBAPP-UseCases-Manager.gs`
5. **Paste** into editor
6. **Find line 14:** `var USECASES_SHEET_ID = 'YOUR_USECASES_SHEET_ID_HERE';`
7. **Replace** with your Sheet ID from Step 1:
   ```javascript
   var USECASES_SHEET_ID = '1xyz...';
   ```
8. **Click:** Deploy → New deployment
9. **Click:** ⚙️ gear icon → Web app
10. **Settings:**
    - Execute as: **Me**
    - Who has access: **Anyone**
11. **Click:** Deploy
12. **Authorize** when asked
13. **COPY the Web App URL**

**✅ Success Check:**
- Visit URL in browser → Should see "✅ Web App is running!"
- Try: `YOUR_URL?action=getAll` → Should see JSON with sample use case

**📝 SAVE THIS URL!** You'll need it for your website integration.

---

## 🎓 PART 2: WORKSHOPS SETUP (45-60 min)

### Step 1: Create Workshops Google Sheet (10 min)

1. **Go to:** https://script.google.com
2. **Click:** "New Project"
3. **Name it:** "GBS Workshops Sheet Setup"
4. **Copy** all code from `3-SETUP-Workshops-Sheet.gs`
5. **Paste** and run `createWorkshopsSheet`
6. **COPY the Sheet ID**

**✅ Success Check:**
- New Sheet: "GBS Workshops - Admin CMS"
- Two tabs: Workshops, Settings
- Sample workshops in rows 2-3

**🔐 Change password** in Settings tab!

---

### Step 2: Deploy Workshops Web App (15 min)

1. **New Apps Script project:** "GBS Workshops Manager API"
2. **Copy** code from `4-WEBAPP-Workshops-Manager.gs`
3. **Update Sheet ID** (line 10):
   ```javascript
   var WORKSHOPS_SHEET_ID = '1abc...';
   ```
4. **Deploy as Web App** (Anyone can access)
5. **COPY the Web App URL**

**✅ Success Check:**
- Visit URL → "✅ Web App is running!"
- Try: `YOUR_URL?action=getUpcoming` → Should see upcoming workshops

---

## 📖 PART 3: KNOWLEDGE CONTENT SETUP (60 min)

### Step 1: Create Knowledge Content Google Sheet (10 min)

1. **New Apps Script project:** "GBS Knowledge Content Sheet Setup"
2. **Copy** code from `5-SETUP-KnowledgeContent-Sheet.gs`
3. **Run** `createKnowledgeContentSheet`
4. **COPY the Sheet ID**

**✅ Success Check:**
- New Sheet: "GBS Knowledge Content - Admin CMS"
- Three tabs: Videos, Articles, Settings
- Sample data in both Videos and Articles sheets

**🔐 Change password!**

---

### Step 2: Deploy Knowledge Content Web App (15 min)

1. **New Apps Script project:** "GBS Knowledge Content Manager API"
2. **Copy** code from `6-WEBAPP-KnowledgeContent-Manager.gs`
3. **Update Sheet ID** (line 11):
   ```javascript
   var KNOWLEDGE_SHEET_ID = '1def...';
   ```
4. **Deploy as Web App** (Anyone can access)
5. **COPY the Web App URL**

**✅ Success Check:**
- Visit URL → "✅ Web App is running!"
- Try: `YOUR_URL?action=getVideos` → Should see video list
- Try: `YOUR_URL?action=getArticles` → Should see articles list

---

## 📊 YOUR COMPLETE WORKFLOW

### Managing Use Cases:

1. Open "GBS Use Cases - Admin CMS" Google Sheet
2. Go to "Use Cases" tab
3. Add new row with all fields:
   - ID (auto-generated or manual like "usecase-5")
   - Title, Icon, Category, Difficulty
   - Impact Stat, Metrics (time, improvement, quality)
   - Prerequisites (bullet list)
   - Getting Started steps (3 steps)
   - Common Pitfalls (2 items with title + description)
   - Example section
   - GBS Prompt Link
   - Demo Type
   - Status (Active/Draft/Archived)
   - Order (for sorting)
4. **Publish:** Go to Web App URL → `?action=generateJSON`
5. **Copy** the JSON output
6. **Save** as `/use-cases/use-cases.json` on your website
7. **Upload/Deploy** to your website

### Managing Workshops:

1. Open "GBS Workshops - Admin CMS" Google Sheet
2. Add new workshop with:
   - Title, Icon, Icon Color (bg-xxx-100)
   - Date, Time, Timezone, Duration
   - Instructor, Description
   - Status (Coming Soon, Open, Full, Completed)
   - Registration Link
   - Max Participants
3. **Publish:** Web App URL → `?action=generateJSON`
4. **Save** as `/workshops/workshops.json`
5. **Upload** to website

### Managing Knowledge Content:

**For Videos:**
1. Open "GBS Knowledge Content - Admin CMS"
2. Go to "Videos" tab
3. Add new video:
   - Title, Duration (e.g., "7:20")
   - Google Drive URL (preview link)
   - Category, Description
   - Order, Status

**For Articles:**
1. Go to "Articles" tab
2. Add new article:
   - Category, Link Title, Link URL
   - Description, Order, Status

**Publish Both:**
1. Web App URL → `?action=generateJSON`
2. Save as `/knowledge-content/content.json`
3. Upload to website

---

## 🔐 SECURITY NOTES

### Passwords:
- ✅ Change default password in ALL Google Sheets
- ✅ Use the **SAME** password for all Phase 2 sheets (if you want one admin panel)
- ✅ Or use different passwords for each (more secure)
- ✅ Store passwords securely

### Google Sheets:
- ✅ Keep sheets private
- ✅ Don't share Sheet IDs publicly
- ✅ Use Google's version history for backups

### Web Apps:
- ⚠️ Must be "Anyone can access" for public use
- ✅ But write operations are password-protected
- ✅ Read operations are public
- ✅ This is by design - same as Phase 1

---

## 🛠️ TROUBLESHOOTING

### "Invalid password" error

**Solution:**
1. Open the Google Sheet
2. Go to Settings tab
3. Check the exact password
4. Ensure ALL Phase 2 sheets have same password (or track separately)

### Changes don't appear

**Solution:**
1. Check Google Sheet - are changes saved?
2. Re-generate JSON (`?action=generateJSON`)
3. Verify JSON is updated
4. Upload new JSON to website
5. Clear browser cache (Ctrl+F5)

### JSON shows empty or errors

**Solution:**
1. Check Status column = "Active" for items you want to show
2. Verify all required fields are filled
3. Check for special characters
4. Look at Apps Script logs (View → Executions)

---

## 📋 QUICK REFERENCE - YOUR URLs

Fill these in as you complete setup:

```
USE CASES:
Sheet: https://docs.google.com/spreadsheets/d/_________________
Web App: https://script.google.com/macros/s/_________________/exec

WORKSHOPS:
Sheet: https://docs.google.com/spreadsheets/d/_________________
Web App: https://script.google.com/macros/s/_________________/exec

KNOWLEDGE CONTENT:
Sheet: https://docs.google.com/spreadsheets/d/_________________
Web App: https://script.google.com/macros/s/_________________/exec
```

### Google Apps Script Projects:

You should now have **6 Phase 2 projects** (plus 6 from Phase 1):

**Phase 2:**
1. GBS Use Cases Sheet Setup
2. GBS Use Cases Manager API
3. GBS Workshops Sheet Setup
4. GBS Workshops Manager API
5. GBS Knowledge Content Sheet Setup
6. GBS Knowledge Content Manager API

**Total across Phase 1 & 2: 12 projects**

---

## 🎓 FIELD REFERENCE

### Use Cases Fields Explained:

- **ID**: Unique identifier (e.g., "usecase-1")
- **Title**: Display name (e.g., "AI-Powered Boolean Search")
- **Icon**: Emoji for visual (e.g., "🔍")
- **Category**: Talent Sourcing, Content Creation, Data Analysis, Communication
- **Difficulty**: Beginner, Intermediate, Advanced
- **Impact Stat**: Short stat (e.g., "75% Time Saved")
- **Time Metric**: Before/after (e.g., "45min → 10min")
- **Time Metric Label**: What it measures (e.g., "Search Creation")
- **Improvement Metric**: Percentage (e.g., "+300%")
- **Improvement Metric Label**: What improved (e.g., "Search Variations")
- **Quality Metric**: Quality boost (e.g., "+40%")
- **Quality Metric Label**: Quality aspect (e.g., "Quality Matches")
- **Prerequisites**: Bullet list of requirements
- **Getting Started Steps**: 3 numbered steps
- **Common Pitfalls**: 2 warnings with title + description
- **Example Section**: Title + content showing real example
- **GBS Prompt Link**: Link to related prompt
- **Demo Type**: ID for demo functionality
- **Status**: Active, Draft, or Archived
- **Order**: Display order (1, 2, 3...)

### Workshops Fields:

- **Icon Color**: Tailwind class (bg-orange-100, bg-blue-100, etc.)
- **Timezone**: EST, PST, GMT, CET, etc.
- **Status**: Coming Soon, Open, Full, Completed, Cancelled
- **Max/Current Participants**: Capacity tracking

### Knowledge Content:

**Videos:**
- **Google Drive URL**: Full preview link
- **Duration**: Format like "7:20" or "1:15:30"

**Articles:**
- **Category**: Topic grouping
- **Link URL**: External article URL

---

## 🎉 SUCCESS CHECKLIST - PHASE 2

Before you finish, make sure:

- [  ] ✅ Created Use Cases Google Sheet
- [  ] ✅ Deployed Use Cases Web App
- [  ] ✅ Created Workshops Google Sheet
- [  ] ✅ Deployed Workshops Web App
- [  ] ✅ Created Knowledge Content Google Sheet
- [  ] ✅ Deployed Knowledge Content Web App
- [  ] ✅ Changed ALL passwords
- [  ] ✅ Saved all Sheet IDs
- [  ] ✅ Saved all Web App URLs
- [  ] ✅ Tested all ?action=generateJSON endpoints
- [  ] ✅ Can see JSON output for all three

---

## 🚀 NEXT STEPS

**Option A: Use Google Sheets Directly**
- Manage all content through Google Sheets
- Generate JSON manually when needed
- Copy/paste JSON to your website files

**Option B: Build Admin Panel UI** (Future)
- Create web interface like Phase 1
- One-click publish buttons
- Visual editors for all Phase 2 content
- *This would be Phase 3*

**Option C: Integrate with Website**
- Update your website to consume JSON
- Auto-refresh from JSON files
- Dynamic content loading

---

## 📖 DOCUMENTATION STRUCTURE

All Phase 2 files are in: `/admin/cms/phase2/`

```
admin/
└── cms/
    ├── phase1/                          ← Prompts & Gems (done)
    │   ├── 1-7 files...
    │   └── admin-panel.html
    └── phase2/                          ← New content types
        ├── 1-SETUP-UseCases-Sheet.gs
        ├── 2-WEBAPP-UseCases-Manager.gs
        ├── 3-SETUP-Workshops-Sheet.gs
        ├── 4-WEBAPP-Workshops-Manager.gs
        ├── 5-SETUP-KnowledgeContent-Sheet.gs
        ├── 6-WEBAPP-KnowledgeContent-Manager.gs
        └── README-PHASE2-SETUP.md       ← You are here
```

---

## 💡 TIPS & BEST PRACTICES

### Content Management:

**Use Cases:**
- ✅ Use real metrics from actual implementations
- ✅ Keep steps simple and actionable
- ✅ Include specific examples
- ✅ Link to relevant prompts
- ✅ Test demo functionality

**Workshops:**
- ✅ Update status as they progress
- ✅ Track participants accurately
- ✅ Include clear registration info
- ✅ Mark past workshops as "Completed"
- ✅ Archive old workshops

**Knowledge Content:**
- ✅ Keep video durations accurate
- ✅ Test all Drive preview links
- ✅ Verify external article links work
- ✅ Organize by logical categories
- ✅ Set display order thoughtfully

### Backup:

- ✅ Google Sheets auto-saves with version history
- ✅ Periodically export JSON as backup
- ✅ Store JSON files in version control (Git)
- ✅ Keep backup of Sheet IDs and URLs

---

## 📞 SUPPORT & MAINTENANCE

### If Something Breaks:

1. **Check Google Sheets** - Is data still there?
2. **Check Apps Script logs** - View → Executions
3. **Test Web App directly** - Visit URL in browser
4. **Re-deploy if needed** - Creates same URL
5. **Verify JSON generation** - Test ?action=generateJSON

### Updating the System:

1. Edit Apps Script code
2. Save (Ctrl+S)
3. Deploy → Manage deployments
4. Click ✏️ next to active deployment
5. Version: New version
6. Deploy
7. URL stays the same!

---

## 🎯 COMPLETE SYSTEM OVERVIEW

You now have a full Content Management System for:

### Phase 1 (From Before):
- ✅ GBS Prompts
- ✅ Gemini Gems Collection

### Phase 2 (New):
- ✅ Use Cases / Success Stories
- ✅ Interactive Workshops
- ✅ Knowledge Content (Videos + Articles)

**All managed through Google Sheets!**
**All with one-click JSON generation!**
**No coding required for daily use!** ✨

---

**Questions? Issues? Need customization?**
All the code is open and well-documented. You can modify anything to fit your needs!

**Congratulations on completing Phase 2!** 🎉
