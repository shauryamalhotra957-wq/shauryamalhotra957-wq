# GitHub Profile & Ecosystem Maintenance Runbook

Operational guidelines for syncing repository telemetry, refreshing automated badges, and managing public releases.

## Portfolio Maintenance Procedures
1. **Repository Index Sync**: Trigger `scripts/ecosystem_health.mjs` weekly to audit upstream release versions.
2. **Badge Refresh**: Badges link dynamically to GitHub Actions CI workflows for real-time build verification.
3. **Commit Signature Verification**: All 32 production repositories enforce GPG commit verification.
