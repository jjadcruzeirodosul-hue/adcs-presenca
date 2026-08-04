# Git Strategy

**Projeto:** ADCS Presença

**Responsável:** DevOps Engineer

**Status:** Oficial

**Versão:** 1.0

---

# Objetivo

Este documento define a estratégia oficial de utilização do Git durante todo o ciclo de desenvolvimento do ADCS Presença.

Seu objetivo é garantir:

- organização do código;
- rastreabilidade;
- segurança das integrações;
- facilidade para releases;
- facilidade para rollback;
- padronização entre todos os desenvolvedores.

Esta estratégia complementa o documento:

```
ADR-001 — GitHub Flow Strategy
```

---

# Estratégia adotada

O projeto utiliza oficialmente o modelo:

**GitHub Flow Estendido**

A estratégia foi escolhida por apresentar um excelente equilíbrio entre simplicidade, rastreabilidade e controle de releases.

---

# Branches oficiais

```
main
develop
feature/*
fix/*
release/*
hotfix/*
```

---

# Branch main

Representa o produto em produção.

Características:

- protegida;
- somente versões aprovadas;
- somente recebe merge via Pull Request;
- nunca utilizada para desenvolvimento diário.

---

# Branch develop

Representa a integração da Sprint.

Todas as funcionalidades concluídas convergem para esta branch.

É considerada o ambiente DEV do projeto.

---

# Branch feature/*

Utilizada para novas funcionalidades.

Origem

```
develop
```

Destino

```
develop
```

Exemplos

```
feature/login
feature/dashboard
feature/carteirinha-digital
feature/dashboard-presencas
```

---

# Branch fix/*

Correções de funcionalidades ainda não publicadas.

Origem

```
develop
```

Destino

```
develop
```

Exemplos

```
fix/firestore-query
fix/camera-ios
fix/layout-mobile
```

---

# Branch release/*

Preparação de uma publicação.

Origem

```
develop
```

Destino

```
main
```

Recebe apenas:

- pequenos ajustes;
- documentação;
- correções finais;
- validações.

Exemplo

```
release/v0.3.0
```

---

# Branch hotfix/*

Correções urgentes em produção.

Origem

```
main
```

Destino

```
main
```

Após publicação deverá ser integrada novamente em:

```
develop
```

Exemplo

```
hotfix/login
```

---

# Fluxo oficial

```
feature/*
        │
        ▼
develop
        │
        ▼
release/*
        │
        ▼
main
```

Correções emergenciais

```
main
   │
   ▼
hotfix/*
   │
   ▼
main
   │
   ▼
develop
```

---

# Convenção de nomenclatura

Sempre utilizar letras minúsculas.

Separação por hífen.

Exemplos

```
feature/carteirinha-digital

feature/dashboard-presencas

fix/camera-mobile

release/v0.3.0

hotfix/login
```

Evitar:

```
feature/NovaTela

feature_Teste

MinhaBranch
```

---

# Pull Requests

Pull Requests deverão conter:

- objetivo;
- descrição da alteração;
- módulos impactados;
- evidências quando aplicável;
- referência da Sprint.

---

# Merge

A estratégia oficial é:

**Squash Merge**

Benefícios:

- histórico limpo;
- um commit por funcionalidade;
- facilidade para rollback;
- melhor leitura do histórico.

---

# Commits

O projeto utiliza oficialmente:

**Conventional Commits**

Exemplos

```
feat: adiciona leitura contínua do QR Code

fix: corrige duplicidade de presença

docs: atualiza estratégia Git

refactor: reorganiza estrutura do frontend

test: adiciona casos de teste

chore: atualiza configuração do Firebase

build: ajusta processo de deploy

ci: adiciona pipeline GitHub Actions
```

---

# Boas práticas

Nunca desenvolver diretamente na branch:

```
main
```

Nunca utilizar Force Push.

Nunca excluir branches protegidas.

Sempre atualizar sua branch antes de iniciar uma funcionalidade.

Commits devem ser pequenos e objetivos.

Cada Pull Request deve representar uma única entrega lógica.

---

# Fluxo de trabalho

```
Atualizar develop

↓

Criar feature

↓

Desenvolver

↓

Testar

↓

Commit

↓

Push

↓

Merge em develop

↓

Release

↓

Pull Request

↓

Merge em main

↓

Deploy
```

---

# Relação com outros documentos

ADR-001 — GitHub Flow Strategy

ADR-002 — Semantic Versioning Strategy

Branching.md

Pull-Requests.md

Conventional-Commits.md