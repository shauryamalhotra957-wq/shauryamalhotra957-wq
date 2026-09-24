# Shaurya Malhotra Engineering: Ecosystem Security Governance

Formal security standards, vulnerability management, and supply-chain policies enforced across all repositories.

## 1. Organization Security Baseline
- **STRIDE Threat Modeling**: Every repository maintains an audited threat model (`docs/THREAT_MODEL.md`).
- **Cryptographic Signing**: All git commits are signed using verified developer keys.
- **Supply-Chain Integrity**: SBOM generation via CycloneDX v1.5 (`codesupply`) with automated vulnerability correlation.
- **Zero Hardcoded Secrets**: Pre-commit hooks reject any credentials, API keys, or raw certificates.

## 2. Vulnerability Disclosure & Bug Bounty
Security reports are triaged within 24 hours. Critical vulnerabilities receive immediate patch commits and automated downstream notifications.
