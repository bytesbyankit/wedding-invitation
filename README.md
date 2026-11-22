# 👑 Royal Indian Wedding Invitation Website (विवाह निमंत्रण पत्रिका)

A luxurious, responsive, and traditional Indian wedding invitation website built with HTML5, CSS3, and JavaScript.

---

## ✨ Features Included
1. **Auspicious Invocation (श्री गणेशाय नमः)** with glowing golden Ganesha motif & sacred mantra.
2. **Royal Heritage Theme**: Deep Maroon (`#520d18`), Shimmering Gold Foil gradients, and warm Ivory card layout.
3. **Live Countdown Timer**: Real-time ticker counting down days, hours, minutes, and seconds until the auspicious moment.
4. **Interactive Timeline / Functions**:
   - 🌼 **Haldi Ceremony** (Dress code: Festive Yellow)
   - 💃 **Mehendi & Sangeet Night** (Dress code: Indo-Western Glamour)
   - 🕊️ **Baraat & Pheras** (Sacred Vows around Holy Fire)
   - 🥂 **Gala Reception & Blessings** (Fine Dining & Toasts)
5. **Interactive Venue & Maps**:
   - Embedded Google Maps location.
   - 1-Click "Get Driving Directions" and "Copy Address" buttons.
   - Proximity to Airport and Railway Station info.
6. **Photo Gallery with Lightbox**: Click on any photo to open a high-resolution modal view.
7. **RSVP Form**:
   - Guests can enter their name, phone, attendance status, and select which functions they are attending.
   - Option to leave heartfelt blessings for the couple.
   - Form saves responses to browser's `localStorage`.
8. **Blessings & Wishes Wall**: Newly submitted blessings show up dynamically on the wishes board.
9. **Royal Audio & Ambient Petals**:
   - **Background Music**: Play/pause button with royal instrumental music (includes Web Audio synth drone fallback).
   - **Rose & Marigold Petals**: Falling petals canvas animation with on/off toggle.
10. **"Add to Google Calendar" button**: Guests can add the wedding event to their Google Calendar with one click.

---

## 🚀 How to Run the Website Locally
No Node.js or build steps required! Simply open `index.html` in any web browser:

```bash
# Option 1: Open directly in Chrome / Firefox
xdg-open /home/neosoft/.gemini/antigravity/scratch/wedding-invitation/index.html

# Option 2: Run a quick local server
python3 -m http.server 8000 --directory /home/neosoft/.gemini/antigravity/scratch/wedding-invitation
# Then visit http://localhost:8000 in your browser
```

---

## 🛠️ How to Customize Details

### 1. Change Couple Names & Dates
Open `index.html`:
- Search for `Aarav` and `Diya` and replace with your couple's names.
- Search for `Sunday, 14 February 2027` and set your wedding date.

### 2. Update Countdown Timer Target Date
Open `script.js` line 12:
```javascript
const weddingDate = new Date('February 14, 2027 19:00:00').getTime();
```
Change to your preferred date and time.

### 3. Change Event Schedule & Venue
In `index.html`, find the `<section class="events-section">` to change:
- Haldi, Mehendi, Wedding, and Reception dates, timings, venues, and dress codes.
- Google Maps link inside `<a href="https://maps.google.com/?q=..." class="event-map-btn">`.

### 4. Replace Photos
In `index.html`, replace image URLs inside `.profile-img` and `.gallery-item` with your pre-wedding photos or local image files in the same folder.

### 5. Change Music Track
In `index.html`:
```html
<audio id="bgMusic" loop preload="auto">
    <source src="your-music-file.mp3" type="audio/mpeg">
</audio>
```
You can place any MP3 (e.g. Shehnai tune or favourite romantic song) in the folder and link to it.

---

## 🌐 How to Host Online for Free
1. **GitHub Pages**: Push this folder to a GitHub repository, enable GitHub Pages in Settings -> Pages -> Deploy from main branch.
2. **Netlify Drop / Vercel**: Simply drag and drop this entire folder onto [app.netlify.com/drop](https://app.netlify.com/drop) to get a live URL in 10 seconds!

