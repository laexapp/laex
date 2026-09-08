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

## 0.1.2-testnet / versionCode 3

The owner confirmed that account creation works with the device PIN; the earlier
failure occurred when the legacy credential UI accepted a fingerprint while the
Keystore key permitted only device credentials.

- Native BiometricPrompt now explicitly requests BIOMETRIC_STRONG or
  DEVICE_CREDENTIAL, matching the new AES key policy. USE_BIOMETRIC is declared.
- Existing v1 wallets request device credentials once. Their original entropy is
  decrypted with the existing key, encrypted with a separate v2 key, verified by
  authenticated decryption, then committed with AtomicFile. Original key aliases
  are never overwritten/deleted. Words, derivation path, address and preferences
  are preserved. A failed migration leaves the original envelope recoverable.
- New key generation happens before authentication. Timed Keystore authorization
  remains 30 seconds. A dedicated PIN-only unlock option is available.
- Authentication callbacks are consumed only once and only while resumed. Cancelled
  or superseded callbacks cannot authorize later actions.
- Backup verification accepts casing and surrounding Unicode whitespace, reports
  the incorrect positions (1, 6, 12), and offers re-authenticated viewing of the
  existing words. Spelling mistakes, extra words and numbered answers still fail.

Validation: 25 JVM tests cover cryptography/RPC, diagnostics, callback ordering,
backup input, encrypted migration, wrong keys, tampering and failed commits.
Android build and lint are required before publication. Hardware fingerprint and
Keystore migration still require acceptance testing on the owner's Galaxy A55;
no claim of independent security audit or real-funds readiness is made.

Owner checks: finish recording the test backup, install the update in place,
unlock once with PIN, then lock and unlock with fingerprint, confirm the same
public address and finish backup verification. Also cancel authentication and
confirm the wallet remains locked. Never share recovery words or PINs.

## 0.1.3-testnet / versionCode 4

Native presentation updated to the approved demo's dark/mint palette: geometric
brand welcome, gradient balance card, icon actions, bottom navigation and a
compact receive card. Backup words use a two-column layout. The existing vault,
authentication policies, address derivation and transaction signer are unchanged.

UI verification uses Robolectric 4.14.1 native graphics, API 35, public fixture
addresses and no vault authentication. It renders native layouts at 360/393dp
and enlarged fonts, checks the home fits at 393dp, FLAG_SECURE, address copying,
and returning home from receive. Screenshots are in app/build/reports/wallet-ui.
These renders approximate Android; Samsung font/display settings can differ.
Test dependencies and public fixture values are not part of production app flows.
