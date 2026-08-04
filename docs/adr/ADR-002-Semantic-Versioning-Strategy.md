# ADR-002 — Semantic Versioning Strategy

| Campo | Valor |
|--------|--------|
| ADR | 002 |
| Título | Semantic Versioning Strategy |
| Status | Aprovado |
| Versão | Definitiva |
| Data | 27/07/2026 |
| Autor | DevOps Engineer / Release Manager |
| Projeto | ADCS Presença |

---

# Contexto

Com a definição da estratégia de versionamento e colaboração do projeto (ADR-001 — GitHub Flow Strategy), tornou-se necessária a adoção de uma política oficial para identificação das versões do software.

O versionamento é um elemento essencial para garantir a rastreabilidade da evolução do produto, o controle das publicações e a correta identificação das versões implantadas em cada ambiente.

A adoção de uma convenção padronizada permite estabelecer um processo consistente para releases, rollback, automações futuras e integração contínua, além de facilitar a comunicação entre desenvolvimento, testes, operação e gestão do produto.

---

# Problema

Durante a fase inicial do projeto, o desenvolvimento ocorreu de forma incremental sem uma convenção oficial de versionamento.

Era necessário definir:

- como numerar as versões;
- quando alterar cada componente da versão;
- como identificar releases;
- como criar tags no Git;
- como registrar as publicações;
- como manter o histórico das versões publicadas.

Sem uma estratégia padronizada torna-se difícil identificar exatamente qual versão está implantada em cada ambiente, bem como rastrear alterações entre diferentes releases.

---

# Alternativas consideradas

## Versionamento sequencial

Exemplo:

```
Versão 1
Versão 2
Versão 3
```

### Vantagens

- extremamente simples;
- fácil compreensão.

### Desvantagens

- não indica o impacto das alterações;
- não informa compatibilidade entre versões;
- pouco utilizado em projetos modernos.

---

## Versionamento baseado em data

Exemplo:

```
2026.07.27
```

### Vantagens

- identifica facilmente a data da publicação.

### Desvantagens

- não demonstra o impacto técnico das mudanças;
- dificulta o controle de compatibilidade;
- não comunica o tipo de evolução realizada.

---

## Semantic Versioning (SemVer)

Formato:

```
MAJOR.MINOR.PATCH
```

### Vantagens

- padrão internacional amplamente adotado;
- comunica claramente o impacto das alterações;
- facilita rollback;
- compatível com GitHub;
- compatível com automações e CI/CD;
- melhora a rastreabilidade das releases.

---

# Decisão

Foi adotado oficialmente o padrão **Semantic Versioning (SemVer)** como estratégia de versionamento do ADCS Presença.

O formato oficial será:

```
MAJOR.MINOR.PATCH
```

Exemplo:

```
v0.2.0
```

---

# Regras de versionamento

## MAJOR

Incrementado quando ocorrerem mudanças incompatíveis com versões anteriores.

Exemplos:

- alterações arquiteturais significativas;
- mudanças incompatíveis em APIs;
- mudanças incompatíveis na estrutura do banco de dados;
- grandes reestruturações do produto.

Exemplo:

```
v1.0.0 → v2.0.0
```

---

## MINOR

Incrementado quando novas funcionalidades forem adicionadas mantendo compatibilidade com versões anteriores.

Exemplos:

- novos módulos;
- novas telas;
- novos relatórios;
- novas funcionalidades.

Exemplo:

```
v0.2.0 → v0.3.0
```

---

## PATCH

Incrementado para alterações compatíveis que não adicionam funcionalidades.

Exemplos:

- correção de defeitos;
- melhorias internas;
- otimizações;
- ajustes de interface;
- pequenas correções.

Exemplo:

```
v0.3.0 → v0.3.1
```

---

# Estratégia inicial de versionamento

Durante a fase inicial do desenvolvimento do ADCS Presença, o projeto utilizará versões da série **0.x.y**, conforme recomendado pela especificação do Semantic Versioning.

Exemplos:

```
v0.1.0
v0.2.0
v0.3.0
```

A evolução para a versão **1.0.0** ocorrerá quando o produto atingir estabilidade funcional, cumprir os critérios definidos para sua primeira versão oficial de produção e tiver sua liberação aprovada pelo processo de Release Management.

A publicação da versão 1.0.0 deverá ser registrada formalmente no Product Office.

---

# Convenção de Tags

Toda versão oficialmente publicada deverá possuir uma tag Git.

Formato:

```
vMAJOR.MINOR.PATCH
```

Exemplos:

```
v0.2.0
v0.3.0
v0.3.1
v1.0.0
```

Cada tag deverá corresponder a uma Release oficial do projeto.

---

# Relação entre Sprint e Versão

Uma Sprint poderá conter diversas versões internas.

A publicação de uma nova versão dependerá da conclusão dos critérios de qualidade, homologação e aprovação da release.

Nem toda Sprint resultará obrigatoriamente em uma nova versão de produção.

---

# Pré-releases

Quando necessário, poderão ser utilizadas versões de pré-lançamento para testes internos ou homologação.

Serão adotadas as convenções:

```
v1.0.0-beta.1
v1.0.0-beta.2

v1.0.0-rc.1
v1.0.0-rc.2
```

A utilização de versões Beta, Release Candidate (RC) ou outras convenções será opcional e dependerá da estratégia definida para cada release.

---

# Releases

Cada versão oficial deverá possuir:

- Tag Git;
- Release publicada no GitHub;
- Release Notes;
- Changelog atualizado;
- Evidências de homologação;
- Registro no Product Office.

---

# Benefícios esperados

- rastreabilidade completa das versões;
- padronização do processo de releases;
- facilidade para rollback;
- melhor comunicação entre desenvolvimento, testes e operação;
- previsibilidade da evolução do produto;
- compatibilidade com CI/CD;
- preparação para automações futuras.

---

# Consequências

Toda publicação oficial do ADCS Presença deverá seguir obrigatoriamente esta estratégia de versionamento.

Mudanças nesta política somente poderão ocorrer mediante aprovação de um novo ADR.

---

# ADRs relacionados

- ADR-001 — GitHub Flow Strategy
- ADR-003 — Environment Strategy
- ADR-005 — Release Management
- ADR-006 — CI/CD Strategy

---

# Histórico

| Data | Alteração |
|--------|-----------|
| 27/07/2026 | Criação inicial do ADR-002. |
| 27/07/2026 | Revisão editorial, adequação ao template oficial, consolidação da estratégia Semantic Versioning e publicação da versão definitiva. |