# EditKaro.in Deployment Configuration

## 1. Netlify Deployment
`netlify.toml` file is included in this repository. 
Simply push to GitHub and import into Netlify, or run:
```bash
npx netlify-cli deploy --prod
```

## 2. Vercel Deployment
`vercel.json` file is included in this repository.
Simply run:
```bash
npx vercel --prod
```

## 3. GitHub Pages Deployment
1. Push this directory to a public GitHub repository.
2. Go to **Settings** > **Pages**.
3. Select `main` branch and `/ (root)` folder.
4. Click **Save**.
