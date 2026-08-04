# Branching

**Projeto:** ADCS Presença

**Responsável:** DevOps Engineer

**Status:** Oficial

**Versão:** 1.0

---

# Objetivo

Este documento define o ciclo de vida das branches utilizadas no desenvolvimento do ADCS Presença.

Complementa os documentos:

- ADR-001 — GitHub Flow Strategy
- Git-Strategy.md

---

# Estrutura das Branches

O projeto utiliza as seguintes branches:

```
main
develop
feature/*
fix/*
release/*
hotfix/*
```

Cada uma possui uma finalidade específica e um fluxo de utilização definido.

---

# Branch main

Representa o ambiente de Produção (PROD).

Características:

- protegida;
- somente recebe versões homologadas;
- nunca recebe desenvolvimento direto;
- deploy oficial é realizado a partir desta branch.

Fluxo:

```
release/*
        │
        ▼
main
```

---

# Branch develop

Representa o ambiente de Desenvolvimento (DEV).

É a branch de integração da Sprint.

Todas as funcionalidades concluídas convergem para ela.

Fluxo:

```
feature/*
        │
        ▼
develop
```

---

# Branch feature/*

Utilizada para implementação de novas funcionalidades.

Origem:

```
develop
```

Destino:

```
develop
```

Exemplos:

```
feature/registro-presenca
feature/carteirinha-digital
feature/dashboard
feature/login
```

Fluxo:

```
develop
     │
     ▼
feature/*
     │
     ▼
develop
```

---

# Branch fix/*

Utilizada para corrigir funcionalidades ainda não publicadas.

Origem:

```
develop
```

Destino:

```
develop
```

Exemplos:

```
fix/leitura-qr
fix/firestore-query
fix/layout-mobile
```

---

# Branch release/*

Preparação da publicação.

Recebe apenas:

- correções finais;
- documentação;
- ajustes de configuração;
- revisão.

Origem:

```
develop
```

Destino:

```
main
```

Após publicação:

```
main
        │
        ▼
develop
```

Exemplo:

```
release/v0.3.0
```

---

# Branch hotfix/*

Correções urgentes em produção.

Origem:

```
main
```

Destino:

```
main
```

Após publicação:

```
main
        │
        ▼
develop
```

Exemplo:

```
hotfix/firestore-timeout
```

---

# Fluxo completo de uma Sprint

```
develop

↓

feature/registro-presenca

↓

Commit

↓

Push

↓

Pull Request

↓

Merge em develop

↓

Homologação

↓

release/v0.3.0

↓

Pull Request

↓

Merge em main

↓

Deploy
```

---

# Fluxo de Hotfix

```
main

↓

hotfix/correcao-urgente

↓

Commit

↓

Push

↓

Pull Request

↓

Merge em main

↓

Deploy

↓

Merge em develop
```

---

# Convenções

Sempre utilizar:

- letras minúsculas;
- hífen como separador;
- nomes objetivos.

Exemplos corretos:

```
feature/dashboard-presencas

feature/carteirinha-digital

fix/camera-mobile

release/v0.3.0

hotfix/login
```

Evitar:

```
feature/NovaTela

feature_dashboard

NovaBranch

teste
```

---

# Exemplos para o ADCS Presença

Sprint 1

```
feature/dashboard

feature/carteirinha-digital

feature/painel-admin
```

Sprint 2

```
feature/dashboard-relatorios

feature/autenticacao

feature/firebase-auth
```

Correções

```
fix/layout-mobile

fix/firestore-index

fix/leitura-camera
```

---

# Boas práticas

Criar uma branch para cada funcionalidade.

Nunca desenvolver diretamente em:

```
main
```

Evitar Pull Requests muito grandes.

Finalizar uma branch logo após o merge.

Excluir branches concluídas.

Sincronizar frequentemente com:

```
develop
```

---

# Comandos Git

Criar nova feature

```bash
git checkout develop
git pull
git checkout -b feature/dashboard
```

Enviar alterações

```bash
git add .
git commit -m "feat: adiciona dashboard"
git push origin feature/dashboard
```

Atualizar develop

```bash
git checkout develop
git pull origin develop
```

Criar release

```bash
git checkout develop
git checkout -b release/v0.3.0
```

Criar hotfix

```bash
git checkout main
git pull
git checkout -b hotfix/login
```

---

# Relação com outros documentos

- ADR-001 — GitHub Flow Strategy
- ADR-002 — Semantic Versioning Strategy
- Git-Strategy.md
- Pull-Requests.md
- Conventional-Commits.md