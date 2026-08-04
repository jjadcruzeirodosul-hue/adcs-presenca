# Conventional Commits

**Projeto:** ADCS Presença

**Responsável:** DevOps Engineer

**Status:** Oficial

**Versão:** 1.0

---

# Objetivo

Este documento define o padrão oficial para mensagens de commit do projeto ADCS Presença.

O objetivo é garantir:

- histórico organizado;
- fácil identificação das alterações;
- geração automática de Release Notes;
- integração futura com CI/CD;
- rastreabilidade das entregas.

Este documento complementa:

- ADR-001 — GitHub Flow Strategy
- ADR-002 — Semantic Versioning Strategy
- Git-Strategy.md
- Branching.md
- Pull-Requests.md

---

# Estrutura do Commit

Formato oficial:

```
tipo(escopo): descrição
```

O escopo é opcional.

Exemplos:

```
feat: adiciona dashboard

fix: corrige leitura da câmera

docs: atualiza documentação

feat(firebase): adiciona autenticação

fix(frontend): corrige layout mobile
```

---

# Tipos oficiais

## feat

Nova funcionalidade.

Exemplos:

```
feat: adiciona dashboard

feat: implementa carteirinha digital

feat: adiciona autenticação Firebase
```

---

## fix

Correção de defeitos.

Exemplos:

```
fix: corrige leitura QR Code

fix: ajusta consulta Firestore

fix: remove duplicidade de presença
```

---

## docs

Alterações exclusivamente na documentação.

Exemplos:

```
docs: cria ADR-003

docs: atualiza estratégia Git

docs: revisa README
```

---

## style

Alterações que não modificam o comportamento do sistema.

Exemplos:

- formatação;
- espaços;
- identação;
- organização visual.

---

## refactor

Refatoração.

Sem alteração funcional.

Exemplos:

```
refactor: reorganiza frontend

refactor: simplifica consulta Firestore
```

---

## perf

Melhoria de desempenho.

Exemplos:

```
perf: otimiza leitura QR

perf: reduz consultas Firestore
```

---

## test

Testes.

Exemplos:

```
test: adiciona testes de autenticação

test: cria casos de teste Dashboard
```

---

## build

Alterações relacionadas ao processo de build.

Exemplos:

```
build: atualiza Firebase Hosting

build: ajusta configuração Web
```

---

## ci

Alterações relacionadas ao processo de integração contínua.

Exemplos:

```
ci: adiciona GitHub Actions

ci: configura pipeline DEV
```

---

## chore

Tarefas administrativas.

Exemplos:

```
chore: atualiza dependências

chore: reorganiza diretórios

chore: atualiza configuração Firebase
```

---

## revert

Reversão de commits.

Exemplo:

```
revert: remove autenticação experimental
```

---

# Escopos recomendados

Quando fizer sentido, utilizar escopos.

Exemplos:

```
frontend

firebase

firestore

hosting

dashboard

admin

database

auth

camera

presence

reports

devops

documentation
```

Exemplo completo:

```
feat(dashboard): adiciona gráfico semanal

fix(camera): corrige foco automático

docs(devops): atualiza estratégia Git
```

---

# Convenções

Utilizar:

- letras minúsculas;
- verbo no presente;
- descrição objetiva;
- sem ponto final.

Correto:

```
feat: adiciona dashboard

fix: corrige layout mobile
```

Evitar:

```
Novo Dashboard

Correções

Update

Alterações

Teste

Commit

aaaa
```

---

# Commits pequenos

Sempre preferir commits pequenos e específicos.

Bom exemplo:

```
feat: adiciona autenticação Firebase

fix: corrige layout login

docs: atualiza documentação Auth
```

Evitar:

```
feat: várias alterações
```

---

# Relação com Pull Requests

Um Pull Request pode conter diversos commits.

Após aprovação, será utilizado:

**Squash Merge**

O histórico final permanecerá limpo.

---

# Relação com Versionamento

Os tipos de commit poderão futuramente ser utilizados para:

- geração automática de changelog;
- geração automática de Release Notes;
- automação de versões;
- pipelines CI/CD.

---

# Exemplos do ADCS Presença

```
feat(auth): adiciona login do professor

feat(camera): implementa leitura contínua

fix(camera): corrige travamento Android

fix(firestore): remove registros duplicados

docs(devops): adiciona manual Git

docs(database): atualiza modelo Firestore

refactor(frontend): reorganiza JavaScript

perf(camera): melhora velocidade da leitura

build(firebase): atualiza hosting

ci(github): adiciona workflow deploy
```

---

# Boas práticas

Um commit deve representar uma única alteração lógica.

Evitar commits genéricos.

Escrever mensagens claras.

Utilizar escopos sempre que agregarem contexto.

---

# Relação com outros documentos

- ADR-001 — GitHub Flow Strategy
- ADR-002 — Semantic Versioning Strategy
- Git-Strategy.md
- Branching.md
- Pull-Requests.md