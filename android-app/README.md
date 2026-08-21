# Sodo Dumaki — Android App

A native Android app shell (built with [Capacitor](https://capacitorjs.com)) that loads **www.sododumaki.com** live inside a WebView. Same site, same functions (Shop, Business, Layaway, Rewards, Analytics, accounts, cart, checkout) — this just gives it an installable app icon, splash screen, and its own place on a phone's home screen instead of living in a browser tab.

## Why this approach

Rebuilding the whole site natively in React Native/Flutter would mean maintaining two separate codebases with the same logic (cart, checkout, Business bulk-order form, Rewards points, etc.) that would drift out of sync over time. Wrapping the live site instead means every update to the website — new products, design tweaks, bug fixes — shows up in the app automatically, with no app update required. The tradeoff: it needs an internet connection to load (same as the website already requires for Square checkout), and it won't have deep native gestures/animations a fully native app would.

## Why this wasn't built and signed entirely in one pass

This project was scaffolded in a Linux sandbox that cannot reach `dl.google.com` (Google's Android SDK servers are blocked by the sandbox's network policy) — so the Android SDK platform this app needs to compile against (API 36) couldn't be downloaded locally. Rather than hand you an unbuilt project, this repo includes `.github/workflows/android-build.yml`, a GitHub Actions workflow that builds a real debug APK automatically (GitHub's own runners have unrestricted internet access and can fetch whatever SDK components are needed). Every push to `android-app/` triggers a fresh build; the resulting APK is attached to that workflow run as a downloadable artifact.

## Project structure

- `capacitor.config.json` — points the app at `https://www.sododumaki.com` (`server.url`). App ID: `com.sododumaki.app`.
- `android/` — the native Android Studio project Capacitor generated. This is what actually compiles into the APK/AAB.
- `android/app/src/main/res/` — app icon (adaptive + legacy, generated from `assets/logo.svg`) and splash screen, in brand colors (black `#0B0B0D` background, gold `#D4AF37` ring/text).
- `www/` — a minimal offline-fallback page, only shown if the app can't reach the live site.

## Building it yourself

**Easiest — let CI do it:** push a change under `android-app/`, or manually run the "Build Android App" workflow from the repo's Actions tab. Download the `sodo-dumaki-debug-apk` artifact when it finishes, and sideload it onto any Android phone (Settings → allow install from this source) to test.

**Locally, if you have Android Studio installed:**
```
cd android-app
npm install
npx cap sync android
```
Then open the `android-app/android` folder in Android Studio and hit Run, or `cd android && ./gradlew assembleDebug`.

## Signed release build (.aab) for Play Console

`.github/workflows/android-release-build.yml` builds a **signed** release Android App Bundle — the file Play Console actually accepts. It's `workflow_dispatch`-only (run it manually from the Actions tab) rather than on every push, since it's meant to be run for real submissions, not on every commit.

It reads four GitHub Actions repo secrets:

| Secret | What goes in it |
|---|---|
| `SODO_RELEASE_KEYSTORE_BASE64` | The release keystore file, base64-encoded |
| `SODO_RELEASE_KEYSTORE_PASSWORD` | The keystore password |
| `SODO_RELEASE_KEY_ALIAS` | The key alias inside the keystore (`sododumaki`) |
| `SODO_RELEASE_KEY_PASSWORD` | The key password (same as the keystore password for a PKCS12 keystore) |

Add them under the repo's **Settings → Secrets and variables → Actions → New repository secret**. Once all four are set, run the workflow from the **Actions** tab (or push a change to the workflow file itself). It publishes `app-release.aab` both as a workflow artifact and as a GitHub Release asset tagged `android-release-latest`, ready to upload to Play Console.

`android/app/build.gradle` only applies a signing config when those env vars are present, so local/CI debug builds are unaffected — nothing here changes how `assembleDebug` works.

**Keep the keystore file and its password somewhere safe and permanently backed up outside of GitHub — if it's lost, this exact app listing can never be updated again** and a new listing would be needed under a different package/name. Do not commit the keystore file itself to the repo; only the base64 copy lives in the GitHub secret.

## Getting this onto the Google Play Store — what's still needed

The debug APK from CI is for testing/sideloading only, and the signed AAB above is the file Play Console needs. The rest of Play Store submission needs a few things only you can do (they require your own accounts and identity/business verification — nothing here can be done on your behalf):

1. **A Google Play Console developer account** — [play.google.com/console](https://play.google.com/console), $25 one-time fee, requires identity verification.
2. **Play Store listing assets**: a 512×512 app icon, a 1024×500 feature graphic, at least 2 phone screenshots, a short and full description, and a **privacy policy URL** (required by Google even for a simple storefront app — this site doesn't have one yet; that's worth building before submitting).
3. **App content questionnaire** in Play Console (data safety, target audience, ads declaration, etc.) — Google requires this for every app, filled out by the account owner.
4. Upload the signed `.aab` from the workflow above to Play Console (Production, or a testing track first), and submit for review. Google's review for a straightforward, functional app like this is typically a few days.

One thing to watch for: Google's Play Store policy discourages "trivial" WebView-wrapper apps that add no value over the website. This app already clears that bar somewhat (native icon, splash screen, installable app, status bar theming) — if it gets flagged in review, the next step would be adding a genuinely native feature (push notifications for drops/restocks, for example) rather than just more wrapper polish.
