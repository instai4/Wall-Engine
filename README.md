# My Wallpaper Engine

A unified viewer for your collection of HTML‑based animated wallpapers.  
Display all your interactive wallpapers in one place, switch between them with a click, and enjoy a full‑screen experience.


## Features

- 📁 **Organised wallpaper collection** – each wallpaper lives in its own folder.
- 🖼️ **Thumbnail sidebar** – quickly see and select your wallpapers.
- 🔄 **Single‑click switching** – load any wallpaper into the main viewer.
- 🖥️ **Full‑screen mode** – hide the sidebar for an immersive view (click the **Hide Sidebar** button or press `F`).
- 🧭 **Floating show button** – a small ☰ button appears when the sidebar is hidden, so you can always bring it back.
- 📱 **Responsive layout** – works on different screen sizes.
- 👤 **Custom footer** – includes your name, social media links, and copyright.


*Note:* Thumbnails can also be placed inside each wallpaper folder if you prefer.

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, etc.).
- (Optional) A local web server – **required** because iframes often fail to load local files when opened directly with the `file://` protocol.

### Installation

1. **Clone or download** this repository to your computer.
2. **Place your wallpaper folders** inside the project root (or anywhere you like, as long as you update the paths in `index.html`).
3. **Add thumbnails** for each wallpaper (e.g., `wallpaper1.jpg`, `wallpaper2.jpg`). Store them in a `thumbnails/` folder or inside each wallpaper folder.
4. **Edit the `wallpapers` array** in `index.html` to match your actual folders and thumbnail paths:

   ```javascript
   const wallpapers = [
       { 
           name: 'My First Wallpaper', 
           file: 'wallpaper1/index.html', 
           thumb: 'thumbnails/wallpaper1.jpg' 
       },
       { 
           name: 'Another Cool Wallpaper', 
           file: 'wallpaper2/index.html', 
           thumb: 'wallpaper2/thumb.jpg'      // thumbnail inside wallpaper folder
       },
       // add more...
   ];
