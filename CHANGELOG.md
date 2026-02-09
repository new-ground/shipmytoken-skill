# Changelog

All notable changes to Ship My Token will be documented in this file.

## [1.0.2] - 2026-02-09

### Fixed
- Stats and fee claiming broken by pump-sdk v1.27.0 API change. The SDK split into offline (`PumpSdk`) and online (`OnlinePumpSdk`) classes — updated stats, fees, and launch scripts to use the correct classes.
- Launch with `--initial-buy` was also broken (calling `fetchGlobal`/`fetchFeeConfig` on the offline SDK).
- Pinned `@pump-fun/pump-sdk` and `@pump-fun/pump-swap-sdk` to `^1.27.0` / `^1.13.0` to prevent future silent breakage from `latest`.

## [1.0.1] - 2025-02-09

### Fixed
- Fee sharing configuration failing on every token launch (error 6013: NotEnoughRemainingAccounts). The `createFeeSharingConfig` initializes the creator as the sole shareholder, so `updateFeeShares` needs the creator passed as a current shareholder.

## [1.0.0] - 2025-02-08

### Added
- Token launch on Pumpfun via chat (name, symbol, image, optional metadata)
- Automatic fee sharing: 90% creator / 10% Ship My Token
- Fee claiming for accumulated creator trading fees
- Fee sharing updates with custom splits (up to 10 shareholders)
- Portfolio view with token status, price, and bonding curve progress
- Daily recap reports
- Secure wallet creation and backup (stored in `~/.shipmytoken/`)
- Post-install onboarding flow with guided setup
- Universal Agent Skills spec compatibility (Claude Code, Cursor, Windsurf, OpenClaw)
- Version check on setup to notify users of available updates

### Fixed
- Fee claim crash when fee sharing is not configured
- Minimum SOL requirement corrected from 0.005 to 0.01 SOL
- SKILL.md frontmatter parsing issue with colons in description
