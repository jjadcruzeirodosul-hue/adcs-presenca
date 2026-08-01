# ADR-005 — Release Management

| Campo | Valor |
|--------|--------|
| ADR | 005 |
| Título | Release Management |
| Status | Aprovado |
| Versão | Definitiva |
| Data | 27/07/2026 |
| Autor | Solution Architect / DevOps Engineer |
| Projeto | ADCS Presença |

---

# Contexto

O ADCS Presença adota um processo estruturado de desenvolvimento baseado no GitHub Flow, versionamento semântico e ambientes independentes para desenvolvimento, homologação e produção.

As decisões arquiteturais formalizadas pelos ADR-001 (GitHub Flow Strategy), ADR-002 (Semantic Versioning Strategy), ADR-003 (Environment Strategy) e ADR-004 (Firebase Architecture) estabeleceram as bases para o desenvolvimento, versionamento, organização dos ambientes e arquitetura da plataforma.

Entretanto, tornou-se necessário definir oficialmente como uma nova funcionalidade percorre todo o ciclo de entrega até sua disponibilização em produção.

Esta ADR estabelece a estratégia oficial de Release Management do projeto, definindo processos, responsabilidades, critérios de aprovação, controle de versões, promoção entre ambientes, rollback e rastreabilidade das entregas.

Seu objetivo é garantir previsibilidade, estabilidade operacional, qualidade das entregas e governança durante todo o ciclo de vida do produto.

---

# Problema

Sem um processo formal de Release Management podem ocorrer:

- publicações não controladas;
- ausência de critérios objetivos para promoção entre ambientes;
- inconsistência entre versões implantadas;
- dificuldade de rastreamento das alterações;
- aumento do risco operacional;
- falhas durante implantações;
- dificuldade para execução de rollback;
- baixa previsibilidade das entregas.

Era necessário definir oficialmente:

- quando uma Release pode ser criada;
- como ocorre a promoção entre ambientes;
- quais critérios devem ser atendidos antes da publicação;
- quais responsabilidades cabem a cada participante;
- como controlar versões;
- como tratar correções emergenciais;
- como executar rollback quando necessário.

---

# Objetivos

Esta ADR possui como objetivos:

- padronizar o processo de Release Management;
- garantir rastreabilidade das entregas;
- reduzir riscos durante implantações;
- estabelecer critérios objetivos de aprovação;
- definir responsabilidades durante o processo de Release;
- assegurar qualidade antes da publicação em produção;
- integrar o fluxo de desenvolvimento aos ambientes DEV, QA e PROD;
- preparar o projeto para automação futura através de CI/CD;
- servir como referência oficial para todas as publicações do ADCS Presença.

---

# Escopo

Esta ADR aplica-se a:

- todas as Releases do ADCS Presença;
- todos os módulos do sistema;
- todos os ambientes oficiais (DEV, QA e PROD);
- todos os colaboradores envolvidos no ciclo de desenvolvimento;
- todas as publicações realizadas durante o ciclo de vida do produto.

O processo definido nesta ADR deverá ser seguido independentemente do porte da alteração, incluindo:

- novas funcionalidades;
- correções de defeitos;
- melhorias;
- refatorações;
- alterações de infraestrutura;
- mudanças arquiteturais;
- atualizações de configuração.

---

# Alternativas Consideradas

## Alternativa 1 — Publicação Direta em Produção

Consistia na publicação imediata das alterações diretamente no ambiente de produção após sua conclusão.

### Vantagens

- processo simples;
- menor quantidade de etapas;
- menor tempo até a disponibilização.

### Desvantagens

- elevado risco operacional;
- ausência de homologação;
- baixa rastreabilidade;
- maior probabilidade de indisponibilidade;
- dificuldade para identificar regressões.

---

## Alternativa 2 — Processo Manual sem Padronização

Consistia na realização das implantações utilizando procedimentos definidos conforme cada necessidade.

### Vantagens

- maior flexibilidade operacional;
- adaptação rápida a diferentes cenários.

### Desvantagens

- ausência de padronização;
- dependência de conhecimento individual;
- dificuldade de auditoria;
- baixa previsibilidade;
- elevado risco de erros humanos.

---

## Alternativa 3 — Processo Estruturado de Release Management

Consiste na adoção de um processo padronizado de gerenciamento de Releases, baseado em critérios objetivos de qualidade, promoção controlada entre ambientes, versionamento semântico, rastreabilidade completa e aprovação formal antes da publicação.

### Vantagens

- maior estabilidade operacional;
- redução de riscos;
- previsibilidade das implantações;
- facilidade para auditoria;
- rastreabilidade completa;
- integração com GitHub Flow;
- preparação para automação via GitHub Actions;
- facilidade para rollback.

### Desvantagens

- maior quantidade de etapas;
- necessidade de disciplina operacional;
- aumento inicial do esforço de governança.

---

# Decisão

Foi aprovada oficialmente a adoção de um processo estruturado de Release Management para o ADCS Presença.

Todas as publicações deverão seguir obrigatoriamente o fluxo oficial de promoção entre ambientes, respeitando os critérios de qualidade definidos nesta ADR.

Nenhuma alteração poderá ser implantada diretamente em produção sem ter percorrido todas as etapas de validação estabelecidas pelo processo oficial de Release Management.

Toda Release deverá possuir:

- versão identificável;
- rastreabilidade completa;
- critérios objetivos de aprovação;
- possibilidade de rollback;
- registro histórico;
- alinhamento com o processo de versionamento definido pelo ADR-002.

---

# Princípios do Release Management

O processo oficial de Release Management observará permanentemente os seguintes princípios.

## Qualidade antes da velocidade

A estabilidade do produto possui prioridade sobre a rapidez da publicação.

Nenhuma Release deverá ser publicada sem atender aos critérios mínimos de qualidade definidos nesta ADR.

---

## Rastreabilidade

Toda alteração deverá possuir origem claramente identificável.

Será possível identificar:

- funcionalidade implementada;
- branch de origem;
- Pull Request;
- versão publicada;
- ambiente;
- responsável pela aprovação;
- data da publicação.

---

## Promoção Controlada

Toda Release deverá seguir obrigatoriamente a sequência oficial de promoção entre ambientes.

Não serão permitidas publicações que ignorem etapas obrigatórias do processo.

---

## Reprodutibilidade

A mesma versão homologada em QA deverá ser exatamente a versão publicada em produção.

Não serão permitidas alterações entre a homologação e a implantação final.

---

## Segurança Operacional

Toda publicação deverá preservar a disponibilidade do sistema e minimizar riscos operacionais.

Sempre que necessário deverá existir estratégia formal de rollback.

---

## Melhoria Contínua

O processo de Release Management poderá evoluir continuamente, desde que alterações relevantes sejam formalizadas por meio de novos ADRs.

---

# Arquitetura do Processo de Release

O processo oficial de Release Management do ADCS Presença estabelece um fluxo controlado para promoção das alterações entre os ambientes de desenvolvimento, homologação e produção.

Seu objetivo é garantir que todas as funcionalidades sejam desenvolvidas, testadas, homologadas e aprovadas antes de serem disponibilizadas aos usuários finais.

Todo o processo foi projetado para integrar-se às estratégias definidas pelos seguintes documentos:

- ADR-001 — GitHub Flow Strategy;
- ADR-002 — Semantic Versioning Strategy;
- ADR-003 — Environment Strategy;
- ADR-004 — Firebase Architecture.

A automação deste processo será formalizada futuramente pelo ADR-006 — CI/CD Strategy.

---

# Fluxo Oficial de Release

Toda alteração deverá seguir obrigatoriamente o fluxo abaixo.

```
                  feature/*

                       │

              Desenvolvimento

                       ▼

                  develop

                       │

                Deploy DEV

                       ▼

                     DEV

                       │

          Testes de Desenvolvimento

                       ▼

                 release/*

                       │

                Deploy QA

                       ▼

                      QA

                       │

              Homologação Oficial

                       ▼

                     main

                       │

               Deploy Produção

                       ▼

                     PROD
```

Nenhuma etapa poderá ser ignorada.

---

# Ciclo de Vida de uma Release

Toda Release percorrerá obrigatoriamente as seguintes fases.

## 1. Desenvolvimento

A implementação ocorre em uma branch do tipo:

```
feature/*
```

Durante esta etapa poderão ocorrer:

- desenvolvimento da funcionalidade;
- correções locais;
- testes unitários;
- validações do desenvolvedor.

Ao término do desenvolvimento deverá ser aberto um Pull Request para a branch **develop**.

---

## 2. Integração

Após aprovação do Pull Request, a alteração será incorporada à branch **develop**.

A branch develop representa o ambiente oficial de integração contínua do projeto.

Seu objetivo é consolidar funcionalidades concluídas antes da homologação.

---

## 3. Publicação em DEV

Toda alteração integrada em develop deverá ser publicada no ambiente DEV.

Objetivos desta etapa:

- validação funcional;
- integração entre módulos;
- testes exploratórios;
- identificação de regressões;
- validação técnica.

Caso sejam encontrados defeitos, novas branches **fix/** poderão ser abertas para correção.

Após a correção, o fluxo retorna para develop.

---

## 4. Criação da Release

Quando o conjunto de funcionalidades planejadas estiver concluído e validado em DEV, será criada uma branch do tipo:

```
release/x.y.z
```

Exemplos:

```
release/1.2.0
release/2.0.0
release/2.1.3
```

A Release representa exatamente o conjunto de alterações candidato à produção.

Após sua criação, não deverão ser adicionadas novas funcionalidades.

Serão permitidas apenas:

- correções de defeitos;
- ajustes de configuração;
- pequenas melhorias indispensáveis para aprovação da Release.

---

## 5. Publicação em QA

A branch Release será publicada no ambiente QA.

O ambiente QA representa o ambiente oficial de homologação.

Seu objetivo é validar:

- funcionamento completo da aplicação;
- regras de negócio;
- experiência do usuário;
- estabilidade;
- integração entre módulos;
- conformidade da Release.

O ambiente QA deverá reproduzir, sempre que possível, as condições do ambiente PROD.

---

## 6. Homologação

A homologação representa a aprovação formal da Release.

Somente Releases aprovadas poderão seguir para produção.

Durante esta etapa deverão ser realizados:

- testes funcionais;
- testes de regressão;
- testes de integração;
- validação dos requisitos;
- conferência da documentação;
- verificação dos critérios de aceite.

Caso a Release seja reprovada, o fluxo retornará para a branch Release para realização das correções necessárias.

---

## 7. Publicação em Produção

Após aprovação da homologação, a Release será incorporada à branch **main**.

A branch main representa exatamente a versão em produção.

A publicação deverá utilizar a mesma versão previamente homologada em QA.

Não serão permitidas alterações entre a homologação e a implantação em produção.

---

# Estados Oficiais da Release

Durante seu ciclo de vida, toda Release poderá assumir um dos seguintes estados.

| Estado | Descrição |
|---------|-----------|
| Em Desenvolvimento | Funcionalidade em implementação |
| Em Integração | Alteração incorporada à develop |
| Em Validação DEV | Testes técnicos em andamento |
| Em Preparação | Branch release criada |
| Em Homologação | Publicada no ambiente QA |
| Aprovada | Homologação concluída |
| Publicada | Implantada em produção |
| Cancelada | Release descontinuada |
| Rejeitada | Homologação não aprovada |
| Revertida | Release removida mediante rollback |

Todos os estados deverão possuir rastreabilidade durante o ciclo de vida da Release.

---

# Princípios da Promoção entre Ambientes

A promoção entre ambientes deverá observar permanentemente os seguintes princípios.

## Ordem obrigatória

Toda Release deverá seguir obrigatoriamente:

```
DEV

↓

QA

↓

PROD
```

Não serão permitidas promoções diretas entre desenvolvimento e produção.

---

## Imutabilidade da Release

Após iniciada a homologação, a Release deverá permanecer congelada.

Não poderão ser adicionadas novas funcionalidades.

Somente correções indispensáveis poderão ser realizadas.

---

## Consistência

A versão publicada em produção deverá ser exatamente a mesma versão aprovada em QA.

Não serão permitidas diferenças de código entre os ambientes.

---

## Controle de Alterações

Toda modificação realizada durante uma Release deverá possuir:

- Commit;
- Pull Request;
- histórico de aprovação;
- identificação da versão;
- responsável pela alteração.

---

## Governança

Nenhuma publicação em produção poderá ocorrer sem aprovação formal da Release.

Todas as etapas deverão permanecer registradas para fins de auditoria e rastreabilidade.

---

# Papéis e Responsabilidades

O processo de Release Management depende da atuação coordenada dos participantes envolvidos no ciclo de desenvolvimento do ADCS Presença.

Cada papel possui responsabilidades claramente definidas, evitando sobreposição de funções e garantindo adequada governança das publicações.

---

# Desenvolvedor

O Desenvolvedor é responsável pela implementação técnica das funcionalidades e correções.

Suas responsabilidades incluem:

- desenvolver novas funcionalidades;
- corrigir defeitos;
- realizar testes locais;
- manter conformidade com os padrões de codificação;
- utilizar o fluxo oficial de branches;
- criar Pull Requests;
- corrigir apontamentos provenientes de Code Review;
- manter documentação técnica atualizada quando aplicável.

O Desenvolvedor não poderá realizar publicação direta em produção.

---

# Solution Architect

O Solution Architect é responsável por garantir que todas as alterações permaneçam aderentes à arquitetura oficial do projeto.

Suas responsabilidades incluem:

- validar impacto arquitetural;
- garantir conformidade com os ADRs publicados;
- aprovar mudanças estruturais;
- avaliar impactos sobre escalabilidade, segurança e manutenção;
- propor novos ADRs quando necessário.

Mudanças arquiteturais significativas deverão ser formalizadas por meio de novos Architecture Decision Records.

---

# Product Owner

O Product Owner representa o negócio durante o processo de Release.

Suas responsabilidades incluem:

- definir prioridades;
- validar requisitos funcionais;
- aprovar critérios de aceite;
- decidir sobre inclusão ou adiamento de funcionalidades;
- aprovar a publicação da Release sob a perspectiva de negócio.

---

# Product Manager

O Product Manager é responsável pela governança do produto.

Suas responsabilidades incluem:

- planejamento das Releases;
- gestão do Roadmap;
- acompanhamento do Product Backlog;
- definição do conteúdo funcional de cada Release;
- alinhamento entre negócio e tecnologia.

---

# DevOps Engineer

O DevOps Engineer é responsável pelo processo operacional de implantação.

Suas responsabilidades incluem:

- gerenciamento dos ambientes;
- execução dos processos de deploy;
- administração da infraestrutura;
- configuração dos pipelines de CI/CD;
- gerenciamento das credenciais;
- definição dos procedimentos de rollback;
- monitoramento das implantações.

---

# Quality Assurance (QA)

O responsável pela Qualidade possui como objetivo validar que a Release atende aos requisitos estabelecidos.

Suas responsabilidades incluem:

- executar testes funcionais;
- executar testes de regressão;
- validar critérios de aceite;
- registrar defeitos encontrados;
- aprovar ou reprovar a homologação.

---

# Stakeholders

Os Stakeholders representam os usuários responsáveis pela homologação funcional da Release.

Suas responsabilidades incluem:

- validar regras de negócio;
- verificar aderência aos requisitos;
- aprovar funcionalidades sob a perspectiva operacional;
- registrar solicitações de ajustes quando necessário.

---

# Responsabilidade Compartilhada

A qualidade da Release é responsabilidade de toda a equipe.

Cada participante deverá garantir que suas atividades sejam executadas de acordo com os processos definidos nesta ADR.

---

# Matriz RACI

A matriz abaixo define as responsabilidades oficiais durante o processo de Release.

| Atividade | Desenvolvedor | Solution Architect | Product Owner | Product Manager | DevOps | QA |
|------------|---------------|--------------------|----------------|-----------------|--------|-----|
| Desenvolvimento | R | C | I | I | I | I |
| Code Review | R | A | I | I | I | I |
| Aprovação Arquitetural | C | A | I | I | I | I |
| Planejamento da Release | I | C | A | R | I | I |
| Deploy DEV | I | I | I | I | R/A | I |
| Testes DEV | R | C | I | I | I | C |
| Deploy QA | I | I | I | I | R/A | I |
| Homologação | I | C | A | C | I | R |
| Aprovação da Release | I | C | A | R | I | C |
| Deploy Produção | I | I | I | I | R/A | I |
| Rollback | I | C | I | I | R/A | C |

Legenda:

- **R** — Responsible (Executa)
- **A** — Accountable (Responsável final)
- **C** — Consulted (Consultado)
- **I** — Informed (Informado)

---

# Critérios de Aprovação (Go / No-Go)

Antes da promoção para produção deverá ocorrer uma reunião formal de decisão Go/No-Go, ainda que composta por uma única pessoa em projetos de pequeno porte.

Essa avaliação deverá verificar se todos os critérios obrigatórios foram atendidos.

---

## Critérios Obrigatórios

A Release somente poderá ser aprovada quando:

- todas as funcionalidades previstas estiverem concluídas;
- todos os Pull Requests estiverem aprovados;
- todos os testes obrigatórios tiverem sido executados;
- não existirem defeitos críticos em aberto;
- a documentação estiver atualizada;
- a versão estiver corretamente identificada;
- os critérios de aceite tiverem sido aprovados;
- existir plano de rollback documentado.

---

## Critérios para No-Go

A Release deverá ser adiada quando ocorrer qualquer uma das seguintes situações:

- falhas críticas durante homologação;
- defeitos que comprometam regras de negócio;
- inconsistências entre ambientes;
- documentação incompleta;
- falhas no processo de deploy;
- ausência de aprovação formal;
- riscos operacionais considerados elevados.

---

# Critérios de Qualidade

Todas as Releases deverão atender aos seguintes requisitos mínimos de qualidade.

## Estabilidade

A aplicação deverá operar sem falhas críticas durante os testes de homologação.

---

## Integridade

As alterações não poderão comprometer funcionalidades previamente existentes.

---

## Segurança

As alterações deverão respeitar integralmente as Security Rules, os perfis de acesso e os princípios definidos no ADR-004.

---

## Conformidade Arquitetural

Nenhuma Release poderá introduzir alterações incompatíveis com os ADRs vigentes.

---

## Documentação

Toda alteração relevante deverá possuir documentação correspondente antes da publicação.

---

# Registro da Aprovação

Cada Release deverá possuir um registro formal contendo, no mínimo:

- versão publicada;
- data da aprovação;
- ambiente homologado;
- responsável pela homologação;
- responsável pela publicação;
- resumo das alterações;
- referência ao Pull Request;
- referência ao Release Notes;
- decisão Go/No-Go.

Esse registro constitui parte da rastreabilidade oficial do processo de Release Management.

---

# Estratégia de Versionamento das Releases

O ADCS Presença adota o Versionamento Semântico (Semantic Versioning), conforme estabelecido pelo ADR-002.

Toda Release deverá possuir uma versão única, permitindo identificar com precisão o conjunto de alterações disponibilizadas em cada publicação.

A versão oficial acompanhará todo o ciclo de vida da Release, desde sua criação até a implantação em produção.

---

# Estrutura da Versão

O padrão oficial será:

```
MAJOR.MINOR.PATCH
```

Exemplos:

```
1.0.0
1.1.0
1.2.3
2.0.0
```

Onde:

- **MAJOR** representa alterações incompatíveis com versões anteriores;
- **MINOR** representa novas funcionalidades compatíveis;
- **PATCH** representa correções de defeitos sem impacto funcional.

A definição da numeração deverá seguir integralmente o ADR-002.

---

# Branches de Release

Quando o conjunto planejado de funcionalidades estiver concluído e validado no ambiente DEV, deverá ser criada uma branch de Release.

Padrão oficial:

```
release/x.y.z
```

Exemplos:

```
release/1.0.0
release/1.3.0
release/2.0.0
```

A criação da branch de Release caracteriza o congelamento funcional da versão.

Após esse momento não deverão ser adicionadas novas funcionalidades.

---

# Congelamento da Release

Após a criação da branch **release/**, somente serão permitidas alterações destinadas à estabilização da versão.

São permitidas:

- correções de defeitos;
- pequenos ajustes de interface;
- ajustes de configuração;
- atualização de documentação;
- correções identificadas durante homologação.

Não serão permitidas:

- novas funcionalidades;
- alterações arquiteturais;
- mudanças estruturais de banco de dados sem aprovação específica;
- alterações de escopo da Release.

---

# Correções Durante a Homologação

Caso sejam identificados defeitos durante a homologação, as correções deverão ocorrer diretamente na branch da Release.

Após a correção, a nova versão deverá ser novamente publicada no ambiente QA para validação.

Somente após aprovação integral a Release poderá seguir para produção.

---

# Publicação da Release

Uma Release será considerada oficialmente publicada quando:

- estiver aprovada na homologação;
- for incorporada à branch **main**;
- for implantada no ambiente PROD;
- possuir registro formal da publicação;
- possuir Release Notes atualizadas.

---

# Release Notes

Toda Release deverá possuir documentação resumindo as alterações entregues.

As Release Notes deverão conter, no mínimo:

- versão;
- data da publicação;
- objetivo da Release;
- funcionalidades adicionadas;
- melhorias implementadas;
- defeitos corrigidos;
- mudanças técnicas relevantes;
- limitações conhecidas;
- observações para implantação.

As Release Notes deverão permanecer disponíveis juntamente com o histórico oficial do projeto.

---

# Correções Emergenciais (Hotfix)

Situações críticas poderão exigir correções imediatas em produção.

Nestes casos será utilizado o fluxo oficial de Hotfix.

---

# Branches Hotfix

O padrão oficial será:

```
hotfix/x.y.z
```

Exemplos:

```
hotfix/1.0.1
hotfix/1.2.4
```

As branches Hotfix deverão ser criadas exclusivamente a partir da branch **main**.

---

# Aplicação de Hotfix

O fluxo oficial será:

```
main

↓

hotfix/x.y.z

↓

Correção

↓

Homologação

↓

main

↓

PROD

↓

Merge em develop
```

Após a publicação do Hotfix, as alterações deverão obrigatoriamente ser incorporadas à branch **develop**, garantindo sincronização entre desenvolvimento e produção.

---

# Critérios para Hotfix

Um Hotfix somente deverá ser utilizado quando ocorrer pelo menos uma das seguintes situações:

- indisponibilidade do sistema;
- falha crítica em produção;
- vulnerabilidade de segurança;
- perda de dados;
- erro que impeça utilização normal da aplicação;
- necessidade urgente de correção operacional.

Problemas de baixa prioridade deverão seguir o fluxo normal de Release.

---

# Rollback

Toda Release deverá possuir estratégia formal de rollback antes de sua publicação.

O rollback consiste no retorno controlado à última versão estável da aplicação.

Seu objetivo é restaurar rapidamente a operação em caso de falhas críticas após a implantação.

---

# Situações que Podem Exigir Rollback

Entre as situações previstas estão:

- falhas críticas em produção;
- indisponibilidade da aplicação;
- degradação significativa de desempenho;
- perda de funcionalidades essenciais;
- falhas de segurança;
- erros de implantação;
- inconsistências de dados.

---

# Princípios do Rollback

O processo de rollback deverá observar os seguintes princípios.

## Rapidez

O retorno à versão anterior deverá ocorrer no menor tempo possível.

---

## Segurança

O rollback deverá preservar a integridade dos dados da aplicação.

---

## Rastreabilidade

Todo rollback deverá possuir registro formal contendo:

- data;
- horário;
- versão revertida;
- versão restaurada;
- motivo da reversão;
- responsável pela decisão;
- responsável pela execução.

---

## Reprodutibilidade

O processo deverá ser suficientemente documentado para permitir sua repetição sempre que necessário.

---

# Gestão de Incidentes Durante Releases

Caso ocorra qualquer incidente durante uma publicação, deverá ser iniciado imediatamente o processo de gerenciamento de incidente.

Entre as ações previstas estão:

- interromper a implantação quando necessário;
- preservar evidências;
- comunicar os responsáveis;
- avaliar impacto;
- decidir pela continuidade ou rollback;
- registrar o incidente;
- documentar lições aprendidas.

---

# Lições Aprendidas

Após toda Release relevante ou incidente operacional deverá ser realizada uma análise retrospectiva.

Essa análise deverá identificar:

- causas dos problemas encontrados;
- oportunidades de melhoria;
- ajustes no processo;
- ações preventivas;
- melhorias para futuras Releases.

A melhoria contínua do processo de Release Management constitui responsabilidade permanente da equipe do projeto.

---

# Checklists Oficiais de Release

Todo processo de publicação deverá ser precedido pela execução dos checklists definidos nesta ADR.

Os checklists têm como objetivo reduzir riscos operacionais, padronizar as implantações e garantir que todos os critérios mínimos de qualidade tenham sido atendidos antes da promoção entre ambientes.

Nenhuma etapa poderá ser considerada concluída sem a verificação dos itens correspondentes.

---

# Checklist de Desenvolvimento (DEV)

Antes da publicação para o ambiente DEV deverão ser verificados os seguintes itens.

## Desenvolvimento

- Funcionalidade implementada.
- Código revisado pelo próprio desenvolvedor.
- Padrões de codificação respeitados.
- Commits organizados e identificáveis.
- Conventional Commits utilizados corretamente.

---

## Testes

- Testes unitários executados.
- Testes locais concluídos.
- Fluxos principais validados.
- Não existem erros conhecidos que impeçam integração.

---

## Documentação

- Código comentado quando necessário.
- Documentação técnica atualizada.
- ADRs atualizados quando aplicável.

---

## Controle de Código

- Branch atualizada.
- Pull Request criado.
- Conflitos resolvidos.
- Merge aprovado.

---

# Critérios para Promoção ao Ambiente DEV

A alteração poderá ser implantada em DEV quando:

- o Pull Request tiver sido aprovado;
- não existirem conflitos de merge;
- o código estiver compilando corretamente;
- os testes obrigatórios tiverem sido concluídos.

---

# Checklist do Ambiente DEV

Após o deploy em DEV deverão ser realizadas as seguintes validações.

## Validação Técnica

- Aplicação inicia corretamente.
- Firebase Hosting funcionando.
- Cloud Firestore acessível.
- Firebase Authentication funcionando (quando aplicável).
- Firebase Storage funcionando (quando aplicável).

---

## Validação Funcional

- Funcionalidade implementada opera corretamente.
- Funcionalidades existentes permanecem operacionais.
- Não foram identificadas regressões.

---

## Validação Arquitetural

- Estrutura compatível com os ADRs.
- Não existem alterações arquiteturais não aprovadas.
- Security Rules permanecem válidas.

---

# Critérios para Criação da Release

A branch Release somente poderá ser criada quando:

- todas as funcionalidades planejadas estiverem concluídas;
- todas as correções previstas estiverem implementadas;
- o ambiente DEV estiver estável;
- não existirem defeitos críticos em aberto;
- a documentação estiver atualizada.

---

# Checklist de Homologação (QA)

Antes da aprovação da Release deverão ser executadas todas as validações abaixo.

## Funcionalidades

- Todas as funcionalidades previstas estão presentes.
- Critérios de aceite atendidos.
- Requisitos funcionais aprovados.

---

## Regressão

- Funcionalidades existentes continuam operando corretamente.
- Não foram identificadas regressões.

---

## Integração

- Integração entre módulos validada.
- Fluxos completos executados.
- Dados consistentes.

---

## Interface

- Layout aprovado.
- Responsividade validada.
- Mensagens corretas.
- Navegação consistente.

---

## Segurança

- Perfis de acesso validados.
- Permissões corretas.
- Security Rules funcionando.
- Não existe exposição indevida de dados.

---

## Banco de Dados

- Dados persistidos corretamente.
- Consultas funcionando.
- Integridade preservada.

---

## Documentação

- Release Notes elaboradas.
- Changelog atualizado.
- Product Office atualizado quando aplicável.

---

# Critérios para Aprovação da Homologação

Uma Release somente será considerada homologada quando:

- todos os testes forem aprovados;
- não existirem defeitos críticos;
- Product Owner aprovar funcionalmente a entrega;
- Quality Assurance concluir a validação;
- houver decisão formal de Go.

---

# Checklist de Publicação em Produção (PROD)

Antes do deploy em produção deverão ser verificados os seguintes itens.

## Release

- Release homologada.
- Versão confirmada.
- Branch main atualizada.
- Tag criada quando aplicável.

---

## Infraestrutura

- Ambiente PROD disponível.
- Configurações revisadas.
- Credenciais válidas.
- Backup disponível.

---

## Segurança

- Security Rules revisadas.
- Perfis conferidos.
- Configurações sensíveis verificadas.

---

## Banco de Dados

- Estrutura consistente.
- Migrações concluídas.
- Dados preservados.

---

## Deploy

- Plano de implantação validado.
- Procedimento conhecido pela equipe.
- Janela de publicação definida quando necessária.

---

## Rollback

Antes da publicação deverá existir confirmação de que:

- procedimento de rollback está documentado;
- última versão estável encontra-se disponível;
- equipe conhece o procedimento de reversão;
- tempo estimado de rollback é conhecido.

---

# Validação Pós-Implantação

Após a publicação em produção deverão ser executadas validações imediatas.

## Disponibilidade

- Aplicação acessível.
- Firebase Hosting operacional.
- Certificado HTTPS válido.

---

## Funcionalidades Críticas

- Login.
- Cadastro.
- Registro de presença.
- Consultas.
- Operações administrativas.

---

## Monitoramento

- Não existem erros críticos.
- Logs sem falhas relevantes.
- Desempenho dentro do esperado.

---

## Integridade

- Dados preservados.
- Consultas funcionando.
- Arquivos acessíveis.

---

# Encerramento da Release

Uma Release será considerada oficialmente encerrada quando:

- implantação concluída com sucesso;
- validações pós-publicação aprovadas;
- monitoramento inicial sem incidentes críticos;
- Release Notes publicadas;
- histórico atualizado;
- Product Office atualizado;
- documentação revisada.

Somente após o encerramento formal a equipe poderá iniciar o ciclo da próxima Release.

---

# Integração com os Demais ADRs

O processo de Release Management integra e consolida as decisões arquiteturais previamente estabelecidas para o ADCS Presença.

Cada publicação deverá observar obrigatoriamente as diretrizes definidas pelos ADRs vigentes.

## Integração com o ADR-001 — GitHub Flow Strategy

O fluxo de Release utiliza integralmente a estratégia de branches definida pelo ADR-001.

As seguintes branches fazem parte do processo oficial:

- feature/*
- fix/*
- release/*
- hotfix/*
- develop
- main

Toda promoção entre ambientes deverá respeitar esse fluxo.

---

## Integração com o ADR-002 — Semantic Versioning Strategy

Toda Release deverá utilizar o Versionamento Semântico.

A identificação oficial das versões seguirá o padrão:

```
MAJOR.MINOR.PATCH
```

Nenhuma publicação poderá ocorrer sem uma versão oficialmente definida.

---

## Integração com o ADR-003 — Environment Strategy

As Releases deverão respeitar a arquitetura de ambientes independentes.

Fluxo obrigatório:

```
DEV

↓

QA

↓

PROD
```

Cada ambiente permanecerá isolado, utilizando seu respectivo projeto Firebase, configurações, dados e credenciais.

---

## Integração com o ADR-004 — Firebase Architecture

As publicações deverão preservar integralmente a arquitetura oficial da plataforma Firebase.

Em especial deverão ser observados:

- responsabilidades de cada serviço Firebase;
- arquitetura do Cloud Firestore;
- Security Rules;
- autenticação;
- armazenamento;
- separação entre ambientes.

Nenhuma Release poderá violar os princípios arquiteturais definidos no ADR-004.

---

## Integração com o ADR-006 — CI/CD Strategy

O presente ADR define o processo operacional de Release Management.

O ADR-006 será responsável por automatizar esse processo por meio de pipelines de Integração Contínua (CI) e Entrega Contínua (CD).

Toda automação deverá reproduzir fielmente o fluxo definido neste documento.

---

# Preparação para GitHub Actions

A estratégia de Release foi projetada para futura automação utilizando GitHub Actions.

Entre as automações previstas destacam-se:

- validação automática de Pull Requests;
- execução de testes;
- validação da estrutura do projeto;
- geração automática de artefatos;
- publicação em Firebase Hosting;
- promoção entre ambientes;
- criação de Releases;
- geração de Release Notes;
- criação de Tags;
- notificações de implantação.

A adoção dessas automações será formalizada pelo ADR-006.

---

# Métricas do Processo de Release

O processo de Release Management deverá permitir acompanhamento contínuo por meio de indicadores operacionais.

Entre os indicadores recomendados destacam-se:

- quantidade de Releases realizadas;
- frequência de publicação;
- tempo médio entre Releases;
- tempo médio de homologação;
- tempo médio de implantação;
- quantidade de Rollbacks;
- quantidade de Hotfixes;
- taxa de aprovação em primeira homologação;
- quantidade de defeitos pós-produção;
- tempo médio de recuperação de incidentes.

Esses indicadores apoiarão a melhoria contínua do processo de entrega.

---

# Benefícios Esperados

A adoção desta estratégia proporciona:

- padronização das publicações;
- previsibilidade operacional;
- maior estabilidade do produto;
- redução de riscos durante implantações;
- rastreabilidade completa das alterações;
- melhoria da governança do projeto;
- integração entre desenvolvimento, testes e operações;
- facilidade para auditoria;
- simplificação do processo de rollback;
- preparação para automação via CI/CD;
- alinhamento às boas práticas de Engenharia de Software, DevOps e ITIL.

---

# Consequências

A partir da aprovação desta ADR:

- todas as Releases deverão seguir obrigatoriamente o fluxo definido neste documento;
- publicações diretas em produção deixam de ser permitidas;
- toda Release deverá possuir aprovação formal antes da implantação;
- Hotfixes deverão utilizar o fluxo específico estabelecido nesta ADR;
- Rollbacks deverão seguir procedimento previamente documentado;
- toda alteração relevante deverá permanecer rastreável durante todo seu ciclo de vida.

Alterações significativas no processo de Release Management deverão ser formalizadas mediante novo Architecture Decision Record.

---

# ADRs Relacionados

- ADR-001 — GitHub Flow Strategy
- ADR-002 — Semantic Versioning Strategy
- ADR-003 — Environment Strategy
- ADR-004 — Firebase Architecture
- ADR-006 — CI/CD Strategy

---

# Referências

- GitHub Flow Documentation  
  https://docs.github.com

- Semantic Versioning 2.0.0  
  https://semver.org

- Firebase Documentation  
  https://firebase.google.com/docs

- Google Cloud Architecture Framework  
  https://cloud.google.com/architecture/framework

- ITIL® 4 Foundation

- Continuous Delivery – Jez Humble & David Farley

- Accelerate – Nicole Forsgren, Jez Humble & Gene Kim

---

# Histórico

| Data | Alteração |
|--------|-----------|
| 27/07/2026 | Criação inicial do ADR-005. |
| 27/07/2026 | Definição oficial do processo de Release Management do ADCS Presença. |
| 27/07/2026 | Consolidação da estratégia de promoção entre ambientes, governança de Releases, Hotfix, Rollback e Checklists Operacionais. |
| 27/07/2026 | Publicação da versão definitiva. |