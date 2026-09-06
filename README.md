# GHL Theme Builder MVP

A minimalist browser-only theme builder for HighLevel agency users.

## What it does

- Select sidebar, accent, and navigation text colors.
- Choose Inter, Montserrat, Lexend, or system font.
- Add a sub-account logo URL.
- Choose sidebar finish, corner style, and icon treatment.
- Hide common HighLevel menu items or add custom sidebar IDs.
- Optionally scope the generated theme to one HighLevel Location ID.
- Preview changes immediately.
- Copy a single self-contained Custom JavaScript snippet.
- Saves the builder state in localStorage.

## Run locally

Open `index.html` in a browser. For the best local behavior, serve the folder with any static server.

Example:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy

This MVP is static and can be deployed to Cloudflare Pages, GitHub Pages, Netlify, Vercel, Railway static hosting, or any normal web server.

## HighLevel usage

1. Configure the theme.
2. Click **Copy code**.
3. Paste it into HighLevel Agency Settings > Company > Whitelabel > Custom JavaScript.
4. Keep Custom CSS empty.

## Next product step

Add authentication + hosted theme records. Then the copied code can contain only a theme ID and load the current configuration remotely. That allows agency users to edit and publish later without repasting HighLevel code.
