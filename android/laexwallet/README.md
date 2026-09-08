# laexWallet Android testnet pilot

Native Android pilot, application ID `com.laexwallet.testnet`, min API 30.
Only native tBNB transfers on chain 97 are enabled. Never import a funded seed.

## 0.1.1-testnet / versionCode 2

The A55 owner reported that creating a wallet disappears after device PIN
authentication, while the recovery form can open. No device crash trace is
available yet; the exact cause is **not confirmed**.

This diagnostic update:

- Defers the authenticated action until `onPostResume`, after returning from
  the credential activity. It consumes the action once and discards it on cancel.
- Captures `LinkageError` as well as regular exceptions in background work and
  completion callbacks, so missing runtime classes/methods can be reported.
- Offers a copyable LW-101 diagnostic with exception type and code location;
  exception messages, PINs, recovery phrases and account data are excluded.
- Retains the application ID, signing certificate and vault format for an
  in-place update. Do not uninstall or clear app data to install this update.

Validation: JVM crypto/RPC and error-boundary tests, Android compilation and lint.
The software emulator exits during startup on this machine without hardware
acceleration. Creation, authenticated Keystore operations and testnet sends on
an Android device remain unverified. This release is not a confirmed fix for
the reported device issue, a production wallet, or independently audited.

Build with JDK 17, Gradle 8.11.1 and Android SDK 35:

```
gradle :app:assembleDebug :app:testDebugUnitTest :app:lintDebug
```

The downloadable pilot is debug-signed for private-device testing and has no
mainnet signing path. Do not use its debug signing key for a production release.
