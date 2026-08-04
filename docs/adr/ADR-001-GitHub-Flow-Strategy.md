# ADR-001 — GitHub Flow Strategy

| Campo | Valor |
|--------|--------|
| ADR | 001 |
| Título | GitHub Flow Strategy |
| Status | Aprovado |
| Versão | Definitiva |
| Data | 27/07/2026 |
| Autor | DevOps Engineer / Release Manager |
| Projeto | ADCS Presença |

---

# Contexto

O ADCS Presença iniciou seu desenvolvimento como uma aplicação web baseada em HTML, CSS e JavaScript, utilizando a plataforma Firebase.

Durante a Sprint 0 (Estruturação do Produto) foram concluídas as atividades de implantação da infraestrutura inicial do projeto, incluindo:

- configuração do repositório GitHub;
- configuração inicial da plataforma Firebase;
- configuração do Cloud Firestore;
- configuração do Firebase Hosting;
- primeira versão funcional da aplicação.

Com o início oficial do desenvolvimento do produto, tornou-se necessária a definição de uma estratégia de versionamento e gerenciamento de código-fonte que fosse:

- simples;
- rastreável;
- escalável;
- compatível com equipes pequenas;
- preparada para crescimento futuro.

---

# Problema

Até esta decisão existia apenas uma única branch (`main`), utilizada para todo o desenvolvimento.

Esse modelo apresentava alguns riscos:

- alterações diretamente na produção;
- ausência de ambiente de integração;
- dificuldade para homologação;
- inexistência de estratégia de releases;
- maior risco de regressões.

Era necessário definir um fluxo oficial para desenvolvimento, integração e publicação do software.

---

# Alternativas consideradas

## GitHub Flow tradicional

### Vantagens

- extremamente simples;
- poucas branches;
- aprendizado rápido.

### Desvantagens

- pouco adequado para releases planejadas;
- dificulta homologação;
- menor separação entre desenvolvimento e produção.

---

## GitFlow completo

### Vantagens

- excelente organização;
- ideal para grandes equipes;
- releases bem controladas.

### Desvantagens

- elevado número de branches;
- maior burocracia;
- excesso de complexidade para o estágio atual do projeto.

---

## GitHub Flow Estendido

### Vantagens

- simples;
- organizado;
- permite ambiente de integração;
- compatível com releases;
- preparado para crescimento futuro.

### Desvantagens

- exige disciplina na utilização das branches.

---

# Decisão

Foi adotado oficialmente o modelo **GitHub Flow Estendido** como estratégia de versionamento e colaboração do ADCS Presença.

A estratégia será composta pelas seguintes branches permanentes e temporárias:

```
main
develop
feature/*
fix/*
release/*
hotfix/*
```

---

# Objetivo de cada branch

## main

Representa a versão estável do produto.

Somente versões aprovadas poderão ser integradas.

Os deploys para o ambiente de produção deverão ser realizados exclusivamente a partir desta branch.

---

## develop

Branch permanente de integração.

Recebe todas as funcionalidades aprovadas durante a Sprint.

É a principal branch de desenvolvimento do projeto.

Os deploys destinados ao ambiente DEV seguem a estratégia definida no ADR-003 — Environment Strategy.

---

## feature/*

Destinada ao desenvolvimento de novas funcionalidades.

Origem:

```
develop
```

Destino:

```
develop
```

---

## fix/*

Destinada à correção de defeitos ainda não publicados.

Origem:

```
develop
```

Destino:

```
develop
```

---

## release/*

Utilizada para preparação de uma nova versão do produto.

Recebe apenas:

- pequenos ajustes;
- documentação;
- correções finais;
- validação;
- homologação.

Origem:

```
develop
```

Destino:

```
main
```

Após a publicação, deverá ser integrada novamente em:

```
develop
```

---

## hotfix/*

Utilizada para correções urgentes em produção.

Origem:

```
main
```

Destino:

```
main
```

Após a publicação deverá ser integrada novamente em:

```
develop
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

Correções emergenciais:

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

# Estratégia de Merge

A integração entre branches seguirá as seguintes diretrizes:

- utilização obrigatória de Pull Requests para branches protegidas;
- revisão antes da integração;
- utilização de Squash Merge;
- adoção de Conventional Commits;
- proteção permanente da branch `main`;
- commits diretos na branch `main` não fazem parte do fluxo oficial.

---

# Versionamento

O projeto utilizará Versionamento Semântico (Semantic Versioning — SemVer).

Formato:

```
MAJOR.MINOR.PATCH
```

Exemplos:

```
v0.2.0
v0.3.0
v0.3.1
v1.0.0
```

---

# Ambientes

Esta estratégia suporta o fluxo oficial de desenvolvimento entre os ambientes do projeto:

- DEV;
- QA;
- PROD.

A estratégia de ambientes, a utilização de projetos Firebase independentes, a promoção entre ambientes e a configuração dos ambientes são definidas pelo ADR-003 — Environment Strategy.

---

# Benefícios esperados

- organização do desenvolvimento;
- padronização do fluxo de colaboração;
- redução do risco de regressões;
- maior rastreabilidade;
- releases controladas;
- facilidade para rollback;
- preparação para CI/CD.

---

# Consequências

Todo o desenvolvimento do ADCS Presença deverá seguir a estratégia definida neste ADR.

Mudanças nesta estratégia somente poderão ocorrer mediante aprovação de um novo ADR.

---

# ADRs relacionados

- ADR-002 — Firebase Architecture
- ADR-003 — Environment Strategy
- ADR-005 — Release Management
- ADR-006 — CI/CD Strategy

---

# Histórico

| Data | Alteração |
|--------|-----------|
| 27/07/2026 | Criação inicial do ADR-001. |
| 27/07/2026 | Revisão editorial, adequação ao template oficial, consolidação da estratégia GitHub Flow Estendido e publicação da versão definitiva. |