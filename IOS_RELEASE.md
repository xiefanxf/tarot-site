# iOS Release Notes

## Local setup

1. Install the full Xcode app from the Mac App Store or Apple Developer Downloads.
2. Open Xcode once and let it install additional components.
3. Point command-line tools at Xcode:

```sh
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -license accept
```

## Project commands

```sh
npm install
npm run ios:sync
npm run ios:open
```

`ios:sync` builds the Vite app and copies the static output into the native iOS project.

The iOS target includes native support for:

- haptic feedback while drawing and revealing cards;
- the iOS share sheet with a generated PNG reading card;
- a local 9:00 AM daily-card notification;
- device-local reading history, journals, favorites, learning progress, and streaks.

When the app first enables the daily reminder, iOS will ask for notification permission.

## Xcode settings to finish

- Open `ios/App/App.xcodeproj`.
- Select the `App` target.
- In `Signing & Capabilities`, choose your Apple Developer team.
- Keep bundle identifier as `com.xiefanxf.tarot`, or change it before creating the App Store Connect app record.
- Archive from Xcode with `Product > Archive`, then upload with Organizer.

## Testing on an iPhone

1. Connect the iPhone to the Mac and accept the trust prompts on both devices.
2. In Xcode, select the `App` scheme and your iPhone as the run destination.
3. In `Signing & Capabilities`, select your Apple Developer team.
4. Press Run. If iOS asks, enable Developer Mode and run again.

The web preview cannot reproduce native haptics, notification permission, or the iOS share sheet; verify those three items on an iPhone.

If Xcode says that CoreSimulator is out of date, install the macOS/Xcode component updates and restart Xcode. This only affects Simulator availability; the generic iPhone target can still compile.

## App Store Connect

- Create a new iOS app record with the same bundle identifier.
- In Pricing and Availability, choose `Specific Countries or Regions` and exclude mainland China if you do not want China-region availability.
- Complete privacy nutrition labels. The current app stores readings locally in the WebView only and does not intentionally collect personal data.
- Use category `Lifestyle` or `Entertainment`; `Lifestyle` is the cleaner fit for a tarot reading app.
- Publish `public/privacy.html` on an HTTPS site and use that public URL for both Privacy Policy URL and Support URL (the support anchor is `#support`). A file bundled inside the app is not a public App Store Connect URL.
- The repository support fallback is `https://github.com/xiefanxf/tarot-site/issues`.

## Current external blockers

- Release signing still needs an Apple Developer Team and a valid distribution identity selected in Xcode. These credentials are intentionally not stored in the repository.
- Before submission, verify notification delivery, haptics, and share-sheet cancellation on a signed physical iPhone; Simulator builds cannot prove those hardware and system-service behaviors.
