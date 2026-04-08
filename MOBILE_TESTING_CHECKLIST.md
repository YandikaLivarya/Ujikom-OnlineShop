# 📱 Quick Mobile Testing Checklist

**What to test**: Every page on your phone/tablet using browser DevTools or real device  
**How to access DevTools**: Press `F12` → Click device toolbar icon → Select phone/tablet

---

## 🧪 Quick Test (5 minutes)

### **On Mobile Size (375px - iPhone SE)**

Page | What to Check | Expected | Status
-----|---------------|----------|--------
**Home** | Hero text readable | Text should NOT overflow | ⬜
**Home** | Image fits screen | Product image visible without scroll | ⬜
**Collection** | Product grid | 1 product per row | ⬜
**Katalog** | Product cards | 1 product per row | ⬜
**DetailProduct** | Thumbnails | Vertical stack (1 per row) | ⬜
**DetailProduct** | Product info | All text visible without scroll | ⬜
**Register** | Password fields | Full width, stacked vertically | ⬜
**Register** | Form inputs | Easy to tap, not cramped | ⬜
**Cart** | Items list | 1 column, scrollable | ⬜
**Cart** | Sticky summary | Summary bar accessible | ⬜
**Profile** | Tabs | Can see tabs, might wrap | ⬜
**TrackPackage** | Order details | 1 column layout | ⬜
**Payment** | Form | Readable and scrollable | ⬜
**OrderSuccess** | Success message | Icon visible, not huge | ⬜
**Navbar** | Menu | Hamburger menu (hidden on mobile) | ⬜

---

## 📊 Tablet Test (640px - iPad Portrait)

Page | What to Check | Expected | Status
-----|---------------|----------|--------
**Collection** | Product grid | 2 products per row | ⬜
**Katalog** | Product cards | 2 products per row | ⬜
**DetailProduct** | Thumbnails | 2 per row (max 3) | ⬜
**TrackPackage** | Order details | 2 columns or more | ⬜
**Register** | Password fields | Side-by-side (2 columns) | ⬜
**Cart** | Layout | Better spacing than mobile | ⬜
**Navbar** | Menu | Still hidden or visible? | ⬜

---

## 🖥️ Desktop Test (1024px - iPad Landscape / Laptop)

Page | What to Check | Expected | Status
-----|---------------|----------|--------
**Collection** | Product grid | 3-4 products per row | ⬜
**Katalog** | Product cards | 4 products per row | ⬜
**DetailProduct** | Layout | Side-by-side (image left, info right) | ⬜
**DetailProduct** | Thumbnails | 4 per row | ⬜
**Cart** | Sidebar | Order summary on right side | ⬜
**TrackPackage** | Details | Multiple columns visible | ⬜
**Navbar** | Menu | Full menu visible (not hidden) | ⬜

---

## 🔍 Detailed Checklist

### **Visual Checks**
- [ ] No horizontal scrolling on any page
- [ ] Text is readable (not too large or small)
- [ ] Images scale properly (no distortion)
- [ ] Buttons are touchable (minimum 44x44px)
- [ ] Spacing looks balanced on all screen sizes
- [ ] Colors/contrast good on mobile screen

### **Functionality Checks**
- [ ] All links/buttons clickable on mobile
- [ ] Forms easy to fill on mobile (not cramped)
- [ ] Navigation works on mobile (can go back)
- [ ] Modals don't overflow screen
- [ ] Sticky elements don't cover content
- [ ] Dropdowns work on mobile

### **Performance Checks**
- [ ] Page loads fast on mobile (< 3 seconds)
- [ ] No layout shift when page loads
- [ ] Animations smooth on mobile
- [ ] Images load properly
- [ ] No console errors (F12 → Console tab)

### **Touch Experience**
- [ ] Button spacing good for finger taps
- [ ] Input fields easy to focus/type
- [ ] Swipe gestures work (if any)
- [ ] No tiny text that needs pinch-to-zoom
- [ ] Form fields have reasonable padding

---

## 🎯 Pages Priority Order

**Test these FIRST (critical):**
1. ✅ Home (main entry)
2. ✅ Collection (main product page)
3. ✅ DetailProduct (detailed view)
4. ✅ Cart (important flow)
5. ✅ Register/Login (auth)

**Then test (important):**
6. ⬜ TrackPackage
7. ⬜ Payment
8. ⬜ Profile
9. ⬜ OrderSuccess

**Admin/Extras:**
10. ⬜ DashboardAdmin
11. ⬜ Inventory (admin)
12. ⬜ OrderList (admin)

---

## 🛠️ How to Test (Step by Step)

### **Method 1: Browser DevTools (Easiest)**

```
1. Open app: http://localhost:5173
2. Press F12 to open DevTools
3. Click device toolbar icon at top:
   ┌─────────────────────┐
   │ ☎️  tablet  ✕       │  ← Click phone/tablet icon
   └─────────────────────┘
4. Select device from dropdown:
   - iPhone SE (375px)
   - iPhone 12 (390px)
   - iPad (768px)
   - iPad Pro (1024px)
5. Go to each page and check checklist
6. Hard refresh page: Ctrl+Shift+R
7. Check console for errors (red text)
```

### **Method 2: Real Mobile Phone**

```
1. Deploy to ngrok:
   .\ngrok http 5173

2. Copy ngrok URL from terminal
   https://xxxx-xxx-xx-xxx.ngrok-free.app

3. Open on phone browser
4. Test tapping, scrolling, forms
5. Check Safari/Chrome console for errors
6. Test on different phones if possible
```

### **Method 3: Manual Resize**

```
1. Open DevTools (F12)
2. Open DevTools Console Drawer
3. Manually resize browser window
4. Watch layout adapt:
   - Drag to 375px (small phone)
   - Drag to 640px (large phone)
   - Drag to 768px (tablet)
   - Drag to 1024px (laptop)
```

---

## ❌ Common Mobile Issues to Look For

Issue | How to Fix | Check
-------|-----------|------
Text overflows edge | Use responsive text sizes | ⬜
Grid shows too many items | Use responsive grid-cols | ⬜
Buttons too small | Ensure 44x44px minimum | ⬜
Form fields cramped | Use full width on mobile | ⬜
Horizontal scroll | Check for fixed widths without responsive | ⬜
Sticky element covers content | Adjust sticky top position | ⬜
Image distorted | Check aspect-ratio classes | ⬜
Font size unreadable | Progressive text scaling | ⬜

---

## 📋 Testing Report Template

```
Date: ___________
Device: _________ (iPhone SE, iPad, etc)
Screen Size: ____ (375px, 768px, etc)
Browser: ________ (Chrome, Safari, etc)

✅ Working Pages:
- [ ] Home
- [ ] Collection
- [ ] DetailProduct
- [ ] Cart
- [ ] Register
- [ ] Login
- [ ] Profile
- [ ] TrackPackage
- [ ] Payment
- [ ] OrderSuccess

⚠️ Issues Found:
1. Page: _____ | Issue: _____ | Fix: _____
2. Page: _____ | Issue: _____ | Fix: _____

✅ Overall: _____ / 10 (Mobile Friendly Score)
```

---

## 🚀 When Ready for Production

- [ ] Tested on 3+ different mobile devices
- [ ] All pages tested at 3+ breakpoints
- [ ] No horizontal scrolling anywhere
- [ ] All forms tested and submittable
- [ ] Console has NO red errors
- [ ] Images load and scale properly
- [ ] Buttons/links easily tappable
- [ ] Tested real device (not just DevTools)
- [ ] Performance acceptable on 4G network
- [ ] Responsive design approved by team

---

## 💬 If Something Doesn't Look Right

**Step 1: Check the console for errors**
```
Press F12 → Go to Console tab → Look for red text
If error found → Note the error and file
```

**Step 2: Hard refresh the page**
```
Press: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
This clears cache and reloads fresh
```

**Step 3: Check screen width**
```
DevTools shows screen size in top-right
Make sure it's testing the right breakpoint
```

**Step 4: Check CSS class names**
```
Right-click element → Inspect → Look for responsive classes
Example: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
```

---

## 📞 Quick Reference: Breakpoints

| Breakpoint | Screen Width | Device |
|-----------|-------------|--------|
| Default | 0-640px | Mobile phones |
| `sm:` | 640px+ | Large phones / landscape |
| `md:` | 768px+ | Tablets (portrait) |
| `lg:` | 1024px+ | Tablets (landscape) |
| `xl:` | 1280px+ | Desktops |

---

**Last Updated**: April 8, 2026  
**Status**: ✅ All 9 pages responsive and ready for testing!

Silakan test di HP kamu menggunakan DevTools atau real device! 📱✨
