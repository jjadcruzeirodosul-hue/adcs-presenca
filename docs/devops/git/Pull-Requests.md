# Pull Requests

**Projeto:** ADCS Presença

**Responsável:** DevOps Engineer

**Status:** Oficial

**Versão:** 1.0

---

# Objetivo

Este documento define o processo oficial para criação, revisão, aprovação e integração de Pull Requests (PRs) do projeto ADCS Presença.

Seu objetivo é garantir:

- qualidade do código;
- rastreabilidade das alterações;
- integração segura entre branches;
- histórico organizado;
- alinhamento com o Product Office.

Este documento complementa:

- ADR-001 — GitHub Flow Strategy
- Git-Strategy.md
- Branching.md

---

# Quando abrir um Pull Request

Um Pull Request deverá ser aberto sempre que houver necessidade de integrar uma branch em outra.

Exemplos:

```
feature/* → develop

fix/* → develop

release/* → main

hotfix/* → main
```

Nunca realizar merge direto em branches protegidas.

---

# Estrutura obrigatória

Todo Pull Request deverá conter:

## Título

Utilizar um título objetivo.

Exemplos:

```
feat: adiciona dashboard

fix: corrige leitura da câmera

docs: atualiza estratégia Git
```

---

## Descrição

A descrição deverá informar:

- objetivo da alteração;
- contexto;
- impacto esperado;
- módulos alterados.

Exemplo:

```
Implementa a tela de Dashboard de Presenças.

Inclui:

- gráfico diário
- gráfico semanal
- indicadores
- consultas Firestore
```

---

## Sprint

Informar sempre a Sprint relacionada.

Exemplo

```
Sprint 1
```

---

## Issue

Caso exista Issue correspondente, informar.

Exemplo

```
Closes #12
```

---

## Evidências

Sempre que possível anexar:

- capturas de tela;
- GIFs;
- vídeos;
- evidências de testes.

---

# Checklist obrigatório

Antes de solicitar aprovação, confirmar:

- [ ] Código compilando
- [ ] Testes executados
- [ ] Sem conflitos
- [ ] Documentação atualizada
- [ ] Changelog atualizado (quando aplicável)
- [ ] Product Office atualizado (quando aplicável)

---

# Critérios de revisão

O revisor deverá verificar:

- aderência ao padrão do projeto;
- legibilidade;
- simplicidade;
- segurança;
- impacto em outras funcionalidades;
- nomenclatura;
- organização do código.

---

# Critérios de aprovação

Um Pull Request somente poderá ser aprovado quando:

- atender aos critérios técnicos;
- passar pelos testes;
- não apresentar conflitos;
- possuir documentação atualizada quando necessário.

---

# Estratégia de Merge

O projeto adota oficialmente:

**Squash Merge**

Motivos:

- histórico limpo;
- um commit por entrega;
- facilidade para rollback;
- melhor rastreabilidade.

---

# Após o Merge

Após integração:

- excluir a branch concluída;
- sincronizar a branch local;
- atualizar a branch develop quando necessário.

---

# Fluxo

```
Criar branch

↓

Desenvolver

↓

Commit

↓

Push

↓

Pull Request

↓

Revisão

↓

Aprovação

↓

Squash Merge

↓

Excluir branch

↓

Atualizar develop
```

---

# Responsabilidades

## Autor

- desenvolver a funcionalidade;
- executar testes;
- atualizar documentação;
- criar Pull Request;
- responder comentários da revisão.

---

## Revisor

- revisar código;
- validar arquitetura;
- sugerir melhorias;
- aprovar ou solicitar ajustes.

---

## Product Owner

Quando aplicável:

- validar regra de negócio;
- aprovar funcionalidade;
- confirmar critérios de aceite.

---

# Boas práticas

Pull Requests pequenos.

Uma única entrega por PR.

Evitar centenas de arquivos modificados.

Descrição clara.

Commits organizados.

Responder rapidamente às solicitações de ajuste.

---

# Relação com outros documentos

- ADR-001 — GitHub Flow Strategy
- ADR-002 — Semantic Versioning Strategy
- Git-Strategy.md
- Branching.md
- Conventional-Commits.md