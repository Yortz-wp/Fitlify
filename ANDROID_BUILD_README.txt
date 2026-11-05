FITLIFY ANDROID BUILD STARTER

This adds a cloud Android build to the existing FITLIFY GitHub repository.
It does not replace the current PWA files.

UPLOAD THESE THREE ITEMS TO THE ROOT OF Yortz-wp/Fitlify:
1. package.json
2. capacitor.config.json
3. .github/workflows/build-android.yml

IMPORTANT:
- Keep the .github/workflows folder structure exactly as shown.
- The existing app files must remain in the repository root:
  index.html, styles.css, app.js, manifest.webmanifest, sw.js, icon.svg
- Do not upload this ZIP file itself as a ZIP.
- Do not delete or replace the existing app files.

After uploading:
1. Open the repository on GitHub.
2. Tap Actions.
3. Select "Build FITLIFY Android APK".
4. Tap "Run workflow" if it has not started automatically.
5. Wait for the green successful run.
6. Open the completed run and download the artifact named
   FITLIFY-Android-test-APK.

This first build creates a DEBUG test APK. It is suitable for installation
and testing, but it is not the final signed public release build.
A separate release-signing setup is needed before public distribution.
Keep any future signing keystore and passwords private. Never commit them
to a public GitHub repository.

App ID: app.fitlify.mobile
App name: FITLIFY
