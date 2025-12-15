# Recommended South African Integrations & Notes

Payments
- Ozow (Instant EFT) — great for local bank payments and conversion.
- PayFast — popular in SA, supports cards, EFT and recurring billing.
- Yoco — card readers + online payments for SMBs.
- SnapScan / Zapper — mobile QR payment options.
Notes: use tokenised flows; do not store card PAN.

SMS & Messaging
- Infobip — global presence with good SA coverage.
- Clickatell — local operator connectivity.
- BulkSMS SA / local aggregators — cost-effective for high volume.
Notes: implement queueing and exponential backoff for delivery retries.

Telco Partnerships
- MTN / Vodacom / Telkom — for zero-rating the app or bundling data.
Notes: pursue co-marketing pilots.

Government & Training
- SETAs (Sector Education and Training Authorities) — work on reporting/certification formats.
- SAQA — investigate certificate recognition paths for larger enterprise pilots.

Identity & SSO
- SAML / OIDC providers (Okta, Azure AD) for enterprise customers.
- Consider social login (Google/Microsoft) for SMEs.

Hosting & Infra
- AWS Cape Town, Azure South Africa, or local hosting vendors.
- CDN for static assets (edge locations nearest SA).
