# Setup — get this thing live

Follow these steps in order. Each step is one or two clicks. No terminal required.

The whole thing should take 20-30 minutes. If anything breaks, the error usually tells you exactly what's missing — read it before assuming you broke something irreversible.

---

## Step 1 — Get the code into GitHub

You already have a repo at `github.com/patrickmccaffity24-cloud/Mosaic-Stuff`. We'll put the code there.

1. Unzip the `mosaic-portal` folder you got from Claude. You should see a folder with `package.json`, `src/`, `supabase/`, etc. inside.
2. Open your repo in a browser: `https://github.com/patrickmccaffity24-cloud/Mosaic-Stuff`
3. Click **Add file → Upload files**
4. Drag the **contents** of the `mosaic-portal` folder into the upload area (not the folder itself — the files inside it: `package.json`, `src/`, `supabase/`, etc.)
5. Wait for everything to upload (a few minutes — there are ~33 files)
6. Scroll down. Commit message: `Initial commit`. Click **Commit changes**

You should now see all the project files in your repo. If you see a `src/` folder when you click into the repo, you're good.

---

## Step 2 — Set up Supabase (database + auth + file storage)

1. Go to **supabase.com** and sign up (use your University of Michigan email or anything — free tier is fine)
2. Click **New project**
3. Fill in:
   - **Name:** `mosaic-policy-portal`
   - **Database password:** Generate a strong one and save it in a password manager. You'll rarely need it but it's important.
   - **Region:** `East US (Ohio)` or anywhere geographically near Detroit
4. Click **Create new project**. Wait ~2 minutes for it to provision.

### 2a. Run the database schema

5. Once the project is ready, click **SQL Editor** in the left sidebar
6. Click **New query**
7. Open the file `supabase/schema.sql` from the project folder. Copy ALL of it.
8. Paste it into the Supabase SQL editor
9. Click **Run** (bottom right)
10. You should see "Success. No rows returned."

### 2b. Create an admin user

11. Click **Authentication** in the left sidebar → **Users** tab
12. Click **Add user → Create new user**
13. Fill in:
    - **Email:** Your email (or `patrick@mosaicdetroit.org` if you have one)
    - **Password:** Set a strong password you'll remember
    - **Auto Confirm User:** ✅ check this
14. Click **Create user**

You now have an admin account. Same goes for Ang — create her account the same way.

### 2c. Grab the API keys

15. Click **Project Settings** (gear icon, bottom left) → **API**
16. Keep this tab open. You'll need three values:
    - **Project URL** — something like `https://xxxx.supabase.co`
    - **anon public** key — long string starting with `eyJ...`
    - **service_role secret** key — another long string starting with `eyJ...` (click "Reveal" to see it)

---

## Step 3 — Get an Anthropic API key

1. Go to **console.anthropic.com** and sign in (same login as Claude.ai works)
2. Click **API Keys** in the left sidebar
3. Click **Create Key**
4. Name it `mosaic-portal`
5. Copy the key (starts with `sk-ant-api...`). **You can only see it once** — save it somewhere immediately.
6. You'll need to add billing — go to **Plans & Billing** and add at least $5. PDF processing is very cheap (~$0.05-0.20 per policy), so $5 will get you started for many policies.

---

## Step 4 — Deploy to Vercel

1. Go to **vercel.com** and sign up using your GitHub account
2. Click **Add New… → Project**
3. Find `Mosaic-Stuff` in your repo list. Click **Import**
4. On the configuration screen:
   - **Framework Preset:** Should auto-detect as Next.js. If not, select Next.js.
   - **Root Directory:** Leave as `./`
   - **Build Command / Output / Install** — leave all defaults
5. Expand **Environment Variables** and add these four (use the values from Steps 2c and 3):

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon public key |
   | `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service_role secret |
   | `ANTHROPIC_API_KEY` | Your Anthropic key (sk-ant-api…) |

6. Click **Deploy**
7. Wait ~2 minutes for the build

When it's done, Vercel gives you a URL like `mosaic-stuff-abc123.vercel.app`. Click it.

You should see the Mosaic Policy Portal homepage with the "Empty database" message.

---

## Step 5 — Upload your first real policy

1. Click **+ Upload** in the top right of the live site
2. You'll be redirected to **/admin/sign-in**
3. Sign in with the email and password you created in step 2b
4. You should now be on the upload page
5. Drop a Mosaic policy PDF (start with the Drug & Alcohol one you already shared with Claude)
6. Wait 30-90 seconds while Claude processes it
7. You'll see the review form pre-filled with the extracted data
8. Verify everything looks right. Fix anything that's off.
9. Click **Save as draft →**
10. The policy now exists as a draft. Go to the admin dashboard (`/admin`) and click **Publish** next to it.
11. Visit the homepage — your real policy is on the live site.

---

## What to share with Ang

- The live URL (e.g. `mosaic-stuff-abc123.vercel.app`)
- Her admin email + password (create one for her in Step 2b)
- A short walkthrough: open the site → click + Upload → sign in → drop a PDF → review → save as draft → publish from admin

---

## When something goes wrong

**The site loads but says "Empty database"** — That's correct. Upload a policy.

**The upload page redirects me to sign-in repeatedly** — Your Supabase URL/keys in Vercel env vars don't match the project, or you haven't created a user. Double-check Step 2c and 2b.

**Claude API errors / "Processing failed"** — Check your Anthropic API key is set, billing is active, and you have credit available.

**"Storage upload failed"** — Run the schema.sql again. The `policy-sources` bucket needs to exist.

**Build fails on Vercel** — Read the build log. The most common cause is a missing environment variable. Add it in Project Settings → Environment Variables and click **Redeploy**.

**Anything else** — Send the error message back to Claude. Don't redeploy on guesses.

---

## Connecting your own domain (later)

When you're ready, in Vercel → Project → Settings → Domains, add `policies.mosaicdetroit.org` (or whatever subdomain Mosaic owns). Vercel walks you through the DNS records to add.
