# ADCS Presença

Sistema de registro de presença para alunos de Jiu-Jitsu, desenvolvido para apoiar o projeto social da Assembleia de Deus Cruzeiro do Sul (ADCS).

O projeto utiliza arquitetura Web estática com Firebase e segue práticas formais de Engenharia de Software, incluindo versionamento semântico, documentação arquitetural, gestão de releases e rastreabilidade.

---

# Objetivo

Disponibilizar uma solução simples, rápida e confiável para o registro de presença dos alunos, utilizando:

- registro manual por matrícula;
- registro por QR Code;
- persistência em Cloud Firestore;
- arquitetura modular em JavaScript.

---

# Tecnologias

- HTML5
- CSS3
- JavaScript (ES6+)
- Firebase Hosting
- Cloud Firestore
- html5-qrcode

---

# Arquitetura

A arquitetura da solução está documentada em:

```text
docs/architecture/
```

As decisões arquiteturais encontram-se em:

```text
docs/adr/
```

---

# Documentação

A documentação oficial do projeto encontra-se organizada em:

```text
docs/
├── adr/
├── architecture/
├── database/
├── devops/
├── product/
├── qa/
└── releases/
```

---

# Releases

O histórico oficial de versões encontra-se em:

```text
docs/releases/CHANGELOG.md
```

As Release Notes de cada versão estão disponíveis em:

```text
docs/releases/
```

---

# Governança

O projeto adota oficialmente:

- GitHub Flow Strategy
- Semantic Versioning (SemVer)
- Conventional Commits
- Architecture Decision Records (ADR)
- Release Management
- CI/CD Strategy

---

# Estrutura do Projeto

```text
adcs-presenca/
├── assets/
├── docs/
├── js/
├── index.html
├── style.css
└── firebase.json
```

---

# Status do Projeto

**Versão atual**

`v0.1.0-rc.1`

**Situação**

Release Candidate em preparação.

---

# Licença

Projeto desenvolvido para fins educacionais e de apoio às atividades do projeto social ADCS.