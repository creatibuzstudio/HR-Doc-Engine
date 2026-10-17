# 🏛️ Creatibuz Studio — HR Document Engine

<div align="center">

[![Platform Status](https://img.shields.io/badge/Status-Production%20Active-emerald?style=for-the-badge&logo=vercel&logoColor=white)](https://hr-doc-engine.creatibuzstudio.com)
[![Framework](https://img.shields.io/badge/Next.js-15%20App%20Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Security](https://img.shields.io/badge/Security-Encrypted%20JWT%20%26%20Bcrypt-navy?style=for-the-badge&logo=auth0)](https://hr-doc-engine.creatibuzstudio.com)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)
[![License](https://img.shields.io/badge/Access-Confidential%20%2F%20Internal-red?style=for-the-badge)](https://creatibuzstudio.com)

**Enterprise Documentation, Dual-Signature Lifecycle & Verification Infrastructure**

[Live Production Gateway](https://hr-doc-engine.creatibuzstudio.com) • [Fallback Gateway](https://hr-doc-engine.vercel.app) • [Corporate Portal](https://www.creatibuzstudio.com)

---

</div>

## 📌 Executive Summary

**HR-Doc-Engine** is the proprietary document lifecycle and legal agreement automation platform for **Creatibuz Studio**. Designed for executive HR operations, it standardizes contractual agreements, recruitment offers, and dual-party digital executions across global engineering and creative departments.

The platform unifies document synthesis, auditable counter-signatures, automated high-resolution PDF rendering, and zero-touch transactional dispatch through high-deliverability enterprise gateways.

---

## 💎 Key Platform Capabilities

### 📜 Automated Agreement Synthesis
- Standardized corporate legal templates tailored for full-time engineering and executive appointments.
- Configurable remuneration structures, equity incentives, performance stipulations, and confidentiality clauses.
- Institutional sequence generation conforming to corporate governance standards (`CBS/REF-YY/NNN` and `CBS-EMP-NNN`).

### 🖋️ Verified Dual-Signature Protocol
- **Executive Counter-Signature**: Instant founder authorization with cryptographically stamped seals and executive credentials.
- **Candidate Portal**: Responsive, zero-friction verification portal enabling candidates to review and digitally execute binding agreements on any mobile or workstation environment.
- **Audit-Ready Chronology**: Exact date, timestamp, and verification metadata stamped directly onto the executed document.

### 📬 Transactional Event Orchestration
- Automated candidate dispatch with secure, direct-token portal access.
- Real-time execution notifications with dynamic PDF generation attached and distributed simultaneously to the Executive Office and the Candidate upon execution.

### 🛡️ Public Verification Gateway
- Every generated document embeds a tamper-evident cryptographic QR code.
- Third parties, embassies, and academic verification boards can validate document authenticity in real-time through the institutional verification portal.

---

## 🔒 Enterprise Security & Governance

The platform adheres to zero-trust security principles designed to safeguard organizational legal agreements:

- **Identity & Session Security**: Authentication leverages 12-round `bcrypt` password hashing alongside cryptographically signed `jose` JWT session tokens distributed exclusively through `HttpOnly`, `SameSite=Strict`, `Secure` cookies.
- **Restricted Surface API Guards**: All internal document generation, audit retrieval, and communication dispatch pipelines require authenticated executive session credentials.
- **Public Surface Isolation**: Candidate review channels operate in strict isolation, exposing only candidate-relevant metadata without granting unauthorized access to the broader document registry.
- **Stateless Verification**: Verification records validate authenticity against immutable primary cloud clusters without exposing sensitive employee compensation data.

---

## 🏗️ High-Level Platform Architecture

```
[ Executive Console ] ──► [ Secure Next.js Core ] ──► [ MongoDB Atlas Cloud ]
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
[ Transactional Gateway (Resend) ]       [ Dynamic PDF Engine ]
            │                                     │
            ▼                                     ▼
[ Candidate Signing Portal ]             [ Authenticated Delivery ]
```

- **Runtime & Interface**: Next.js 15 (React 19, TypeScript, Tailwind CSS).
- **Persistence Layer**: Cloud MongoDB Atlas clustered storage with schema-level validation.
- **Dispatch Infrastructure**: Resend Transactional Mail Engine with TLS delivery.
- **Document Renderer**: Vector-accurate multi-page A4 canvas compiler (`jsPDF` / `html2canvas-pro`).

---

## ⚙️ Deployment & Operations

This application is deployed and maintained continuously across high-availability cloud infrastructure:

- **Primary Production Domain**: `https://hr-doc-engine.creatibuzstudio.com/`
- **Secondary Failover Gateway**: `https://hr-doc-engine.vercel.app/`

> [!NOTE]
> Environment variables, cluster credentials, and encryption secrets are provisioned via secure internal secret managers and continuous deployment pipelines. Access is restricted to authorized platform administrators.

---

## 🏛️ Corporate Attribution

Developed and maintained by the Engineering & Operations Team at **Creatibuz Studio**.

- **Corporate Office**: Delduar Road, Tangail Shadar, Dhaka, Bangladesh
- **Institutional Inquiries**: [info@creatibuzstudio.com](mailto:info@creatibuzstudio.com)
- **Official Website**: [www.creatibuzstudio.com](https://www.creatibuzstudio.com)

---

## ⚖️ Legal & Confidentiality

**PROPRIETARY AND CONFIDENTIAL**

Copyright © 2026 **Creatibuz Studio**. All rights reserved.

This software, including its source code, architecture, design assets, and documentation, represents proprietary intellectual property of Creatibuz Studio. Unauthorized reproduction, distribution, reverse engineering, extraction, or publication without prior written consent from Creatibuz Studio is strictly prohibited.
