# AI Onboarding Flow

This folder contains the complete onboarding experience for new users to the GBS Learning Hub.

## File Structure

```
onboarding-flow/
├── index.html          # Entry point (redirects to welcome.html)
├── welcome.html        # Step 1: Welcome & value proposition
├── role-selection.html # Step 2: Role selection (4 roles)
├── assessment.html     # Step 3: 3-question skill assessment
├── results.html        # Step 4: Personalized recommendations
└── README.md          # This documentation
```

## User Journey

1. **Welcome** (`welcome.html`)
   - Value proposition with feature cards
   - "What You'll Get" section
   - CTA to start the flow

2. **Role Selection** (`role-selection.html`)
   - 4 role options: Recruiter, Manager, Analyst, Coordinator
   - Each role shows relevant AI tools
   - Visual selection with hover effects

3. **Assessment** (`assessment.html`)
   - 3 questions about AI familiarity, challenges, and goals
   - Visual progress indicators
   - Form validation and styling

4. **Results** (`results.html`)
   - Personalized recommendations based on role + assessment
   - Quick action items for immediate use
   - Relevant success stories
   - CTA to start learning

## Technical Features

- **localStorage persistence** - User selections saved across sessions
- **Progressive enhancement** - Works without JavaScript
- **Responsive design** - Mobile-friendly layouts
- **Consistent styling** - Matches main hub design language
- **Smooth animations** - Professional transitions and hover effects

## Integration

- Links from main hub "Get Started with AI" card
- Returns to main hub after completion
- Saves completion status for future personalization
- Compatible with existing site structure and styling

## Customization

Role recommendations and quick actions can be easily modified in the `roleRecommendations` object in `results.html`.