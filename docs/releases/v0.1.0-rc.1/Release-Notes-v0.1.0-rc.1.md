# Release Notes

| Campo | Valor |
|--------|--------|
| Produto | ADCS Presença |
| Versão | v0.1.0-rc.1 |
| Tipo | Release Candidate |
| Data | 01/08/2026 |
| Sprint | Sprint 1 |
| Status | Release Candidate |
| Responsável | Engenharia de Release |

---

# Estado da Release

| Item | Situação |
|-------|----------|
| Baseline | Homologada |
| Sprint | Concluída |
| Testes e Qualidade (QA) | Aprovado |
| Engenharia de Release | Aprovado |
| Product Office | Aguardando registro oficial |

---

# Resumo Executivo

A versão **v0.1.0-rc.1** representa a primeira Release Candidate oficial do **ADCS Presença**.

Esta versão corresponde ao **pacote canônico homologado da Sprint 1** e consolida o primeiro MVP operacional do produto.

A Release Candidate foi preparada conforme os processos oficiais definidos pelos ADRs aprovados, preservando integralmente a rastreabilidade entre desenvolvimento, homologação, documentação, versionamento e gestão de configuração.

---

# Objetivo da Release

Disponibilizar uma versão candidata à primeira publicação oficial do ADCS Presença, contendo todas as funcionalidades aprovadas durante a Sprint 1 e devidamente preparadas para validação final do processo de Release.

---

# Escopo da Release

Esta Release Candidate contempla exclusivamente as funcionalidades aprovadas durante a Sprint 1.

Nenhuma nova funcionalidade foi incorporada durante a preparação da Release Candidate.

As atividades desta fase limitaram-se à:

- consolidação da baseline homologada;
- gestão de configuração;
- documentação técnica;
- versionamento;
- preparação para publicação;
- preparação do processo oficial de Release.

---

# Escopo Entregue

A Sprint 1 entrega um MVP funcional capaz de registrar presenças utilizando duas formas de identificação:

- Matrícula;
- QR Code.

Além disso, foram entregues:

- integração com Cloud Firestore;
- persistência das presenças;
- prevenção de registros duplicados;
- seleção do professor responsável;
- feedback visual das operações;
- organização modular do Front-end;
- documentação arquitetural estruturante.

---

# Principais Funcionalidades

## Registro Manual

Permite registrar a presença do aluno por meio da matrícula.

---

## Registro por QR Code

Permite registrar presenças utilizando leitura contínua de QR Code.

---

## Integração com Firebase

Persistência dos dados utilizando:

- Firebase Hosting;
- Cloud Firestore.

---

## Regras de Negócio

Implementação das principais validações do MVP:

- prevenção de presença duplicada;
- validação de matrícula;
- associação da presença ao professor selecionado.

---

# Arquitetura e Governança

Esta Release Candidate encontra-se integralmente aderente aos documentos oficiais do projeto:

- ADR-001 — GitHub Flow Strategy;
- ADR-002 — Semantic Versioning Strategy;
- ADR-003 — Environment Strategy;
- ADR-004 — Firebase Architecture;
- ADR-005 — Release Management;
- ADR-006 — CI/CD Strategy.

Também incorpora os padrões definidos pelo:

- Product Office;
- DEVSTD-001 — Organização do Front-end.

---

# Qualidade e Homologação

A Sprint 1 foi submetida ao processo oficial de homologação.

Durante a etapa de Testes e Qualidade foram executados:

- testes funcionais;
- testes de integração;
- validação da persistência dos dados;
- validação do fluxo de registro por matrícula;
- validação do fluxo de registro por QR Code;
- testes de prevenção de duplicidade;
- validação da estrutura do projeto.

## Resultado

**GO**

Não foram identificadas não conformidades bloqueantes.

O Product Office autorizou oficialmente a preparação da primeira Release Candidate do projeto.

---

# Limitações Conhecidas

Por se tratar da primeira Release Candidate do projeto, permanecem fora do escopo desta versão:

- autenticação de usuários;
- painel administrativo;
- dashboard gerencial;
- carteirinha digital;
- funcionalidades previstas para as próximas Sprints.

Esses itens permanecem registrados no Product Backlog e serão tratados conforme o Roadmap oficial do produto.

---

# Evidências

Foram produzidos os seguintes artefatos oficiais desta Release Candidate:

- pacote canônico homologado da Sprint 1;
- baseline oficial versionada;
- branch `release/v0.1.0-rc.1`;
- CHANGELOG.md;
- Release Notes v0.1.0-rc.1;
- documentação arquitetural (ADR-001 ao ADR-006);
- documentação Git e DevOps.

---

# Próximos Passos

Concluída a preparação documental da Release Candidate, deverão ser executadas as seguintes atividades:

- criação da tag oficial da versão;
- publicação da Release Candidate;
- implantação no ambiente correspondente;
- execução do Smoke Test;
- validação operacional pós-deploy;
- entrega das evidências ao Product Office.

---

# Parecer da Engenharia de Release

A Engenharia de Release conclui que a versão **v0.1.0-rc.1** atende aos critérios estabelecidos pelos Architecture Decision Records (ADR), pela Definition of Done da Sprint 1 e pelos processos oficiais de Release Management do projeto.

A baseline encontra-se:

- identificada;
- homologada;
- versionada;
- rastreável;
- reproduzível;
- documentada.

Dessa forma, a Release Candidate encontra-se **apta para prosseguir para as próximas etapas do processo oficial de Release**.

---

# Aprovações

| Área | Situação |
|-------|----------|
| Desenvolvimento | ✅ Concluído |
| Testes e Qualidade | ✅ Aprovado |
| Engenharia de Release | ✅ Aprovado |
| Product Office | ⏳ Aguardando registro oficial |

---

**Documento elaborado pela Engenharia de Release do projeto ADCS Presença.**

**Versão:** v0.1.0-rc.1

**Situação:** Aprovado para publicação.