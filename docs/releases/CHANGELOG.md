# Changelog

Todas as mudanças relevantes deste projeto serão documentadas neste arquivo.

O formato deste arquivo é baseado no padrão **Keep a Changelog**.

O ADCS Presença adota os seguintes padrões de engenharia:

- GitHub Flow Strategy
- Semantic Versioning (SemVer)
- Conventional Commits

---

## Convenções

As versões são apresentadas da mais recente para a mais antiga.

As categorias utilizadas neste projeto são:

- Added
- Changed
- Deprecated
- Removed
- Fixed
- Infrastructure
- Documentation
- Security

---

## [0.1.0-rc.1] - 2026-08-01

### Added

- Primeira Release Candidate oficial do ADCS Presença.
- MVP operacional para registro de presença.
- Registro manual por matrícula.
- Registro de presença por QR Code.
- Integração com Cloud Firestore.
- Seleção de professor para registro de presença.
- Persistência de presenças em banco de dados.
- Validação para prevenção de presença duplicada.
- Leitura contínua de QR Code.
- Feedback visual para operações de registro.
- Organização modular do código JavaScript.
- Estrutura inicial da documentação técnica do projeto.

### Changed

- Evolução da arquitetura do Front-end.
- Modularização da aplicação JavaScript.
- Refinamentos da interface do usuário.
- Padronização da estrutura do projeto.
- Melhorias na organização do código para manutenção futura.

### Fixed

- Correções identificadas durante a homologação da Sprint 1.
- Ajustes na leitura contínua do QR Code.
- Correções na persistência de dados.
- Melhorias na organização interna da aplicação.
- Regularização da baseline homologada no repositório Git.

### Infrastructure

- Consolidação do Firebase Hosting.
- Consolidação da utilização do Cloud Firestore.
- Estruturação inicial da arquitetura Firebase.
- Organização definitiva do repositório Git.
- Consolidação da baseline homologada da Sprint 1.
- Implantação da estratégia oficial de branches.
- Preparação da infraestrutura para futuras automações de CI/CD.

### Documentation

- Publicação do ADR-001 — GitHub Flow Strategy.
- Publicação do ADR-002 — Semantic Versioning Strategy.
- Publicação do ADR-003 — Environment Strategy.
- Publicação do ADR-004 — Firebase Architecture.
- Publicação do ADR-005 — Release Management.
- Publicação do ADR-006 — CI/CD Strategy.
- Consolidação da documentação arquitetural estruturante.
- Inclusão da documentação de Git e DevOps.
- Publicação do presente CHANGELOG.

### Security

- Nenhuma alteração de segurança nesta versão.

---

Esta Release Candidate representa o pacote canônico homologado da Sprint 1 do ADCS Presença.

A versão **v0.1.0-rc.1** constitui a primeira baseline oficial versionada do projeto e estabelece a referência para todas as futuras Releases.

A partir desta versão, toda evolução do produto seguirá o processo oficial definido pelos Architecture Decision Records (ADR), pelo Product Office e pelas estratégias de GitHub Flow, Semantic Versioning, Release Management e CI/CD adotadas pelo projeto.