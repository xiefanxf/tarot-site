# Solaris Luna Tarot — Full Integration Test Report

Date: 2026-07-26  
Result: **Healthy in browser and iOS simulators; no known blocking UI or functional defect remains in the tested scope.**

## Test coverage

- Languages: Simplified Chinese, English, Japanese.
- Themes: light and dark, including live switching inside an active reading.
- Mobile viewports: 320×568 and 402×874.
- Native targets: iPhone 17 Pro on iOS 26.5 and iPhone SE (3rd generation) on iOS 18.3.
- Reading flows: single card, three-card timeline, Celtic Cross.
- Supporting flows: question/category state, shuffle/cut, spread selection, reveal/detail, synthesis, history, journal, favorites, card library, daily card, reminders, privacy/support and sharing.

## Final findings and fixes

1. **Top controls and content overlapped on compact screens.** Reading and reveal pages now reserve mobile top space, and the short-screen intro card stack sits below the language/theme controls.
2. **Tarot faces and thumbnails could be clipped or enlarged past their frame.** Every reading, history, library, daily and share-card image now preserves the original 2:3 artwork with `object-contain` and bounded frames.
3. **The reading detail panel and bottom actions could cover cards.** The detail is in mobile scroll flow, selected cards are scrolled beneath the controls, and the fixed action row has safe-area padding and a background gradient.
4. **Celtic Cross positions were mapped incorrectly.** Foundation, Past and Potential now use the correct positions; the mobile and desktop layouts use the same semantic ordering.
5. **Back navigation and timers could race.** Shuffle, spread selection, dealing and transition timers are cancelled on navigation/unmount, preventing delayed page jumps.
6. **Changing language during spread selection could create mixed-language state.** Spread/card IDs are stable and localization is resolved from the latest language. This race was reproduced by switching to Japanese during the 800 ms transition and passed.
7. **A single-card reading could generate a self-referential multi-card summary.** It now uses dedicated single-card synthesis in all three languages.
8. **Corrupt or stale local data could break rendering.** Stored readings, cards, dates, favorites, learned state, daily cards and reminder flags are now validated and sanitized before use.
9. **Browser reminders could falsely appear enabled.** Notification state is reconciled with iOS permission and pending requests; the browser fallback stays off. Reminder content is rescheduled when the app returns to foreground or language changes.
10. **Share cancellation was treated as an error.** Cancellation now returns a neutral state; successful native shares and browser image downloads remain distinct.
11. **Accessibility gaps were present.** Cards use native buttons, hidden card names are not exposed before reveal, categories use radio semantics, dialogs trap/restore focus, page headings receive programmatic focus, touch targets are at least 44 px, zoom is allowed, and reduced-motion preferences are respected.
12. **Release/privacy gaps were present.** The iOS privacy manifest now declares the required file-timestamp reason and no tracking/collection, remote fonts were removed, dependencies were updated, and an in-app plus public privacy page was added.

## Visual evidence

1. Final compact intro without control/card overlap: [41-intro-zh-dark-320x568-no-overlap.png](41-intro-zh-dark-320x568-no-overlap.png)
2. Japanese three-card layout after the language-transition race: [32-three-card-ja-dark-320x568.png](32-three-card-ja-dark-320x568.png)
3. Revealed three-card artwork, including correct reversed rotation: [33-three-card-revealed-zh-dark-320x568.png](33-three-card-revealed-zh-dark-320x568.png)
4. English single-card synthesis on the narrow viewport: [30-reveal-single-en-light-320x568-final.png](30-reveal-single-en-light-320x568-final.png)
5. Chinese three-card synthesis: [34-reveal-three-zh-dark-320x568.png](34-reveal-three-zh-dark-320x568.png)
6. Original report and final same-state comparison: [47-before-after-overlap-comparison.png](47-before-after-overlap-comparison.png)
7. Final Japanese/light Celtic outcome detail at 402×874: [46-celtic-outcome-detail-ja-light-402x874-final.png](46-celtic-outcome-detail-ja-light-402x874-final.png)
8. Final Xcode Release build on iPhone 17 Pro: [48-xcode-release-iphone17pro-final.png](48-xcode-release-iphone17pro-final.png)
9. Final Xcode Release build on iPhone SE (3rd generation): [43-xcode-release-iphone-se3-final.png](43-xcode-release-iphone-se3-final.png)

## Automated and build verification

- `npm test`: 3 files, 9 tests passed.
- `npm run lint`: passed with zero errors.
- `npm run build`: passed (TypeScript + Vite production build).
- `npm audit --audit-level=low`: 0 vulnerabilities.
- `git diff --check`: passed.
- `npm run ios:sync`: Capacitor copied the final production assets and synchronized Filesystem, Haptics, Local Notifications and Share.
- Xcode Release / iOS Simulator: **BUILD SUCCEEDED**. Log: [xcode-simulator-release-final.log](xcode-simulator-release-final.log)
- Xcode Release / generic iOS device, unsigned: **BUILD SUCCEEDED**. Log: [xcode-device-release-unsigned.log](xcode-device-release-unsigned.log)
- The built device app contains `PrivacyInfo.xcprivacy`, bundle ID `com.xiefanxf.tarot`, iOS minimum 15.0 and `ITSAppUsesNonExemptEncryption = false`.

The only Xcode warning is that App Intents metadata extraction was skipped because this app does not use App Intents. It does not affect the app or App Store submission.

## Evidence limits and required real-device/release checks

The following cannot be truthfully completed in a simulator or without the owner's Apple account:

- Select an Apple Developer Team, create signing/provisioning, archive and upload to App Store Connect.
- Verify physical haptic feedback.
- Accept/deny notification permission and confirm an actual 9:00 AM delivery on a real iPhone.
- Exercise the real iOS share sheet, destination apps and cancellation on a real iPhone.
- Host `public/privacy.html` at a public HTTPS URL and enter it in App Store Connect.
- Complete App Store metadata, screenshots, age rating, privacy answers and review submission.

These are release-account or physical-device checks, not known code defects.
