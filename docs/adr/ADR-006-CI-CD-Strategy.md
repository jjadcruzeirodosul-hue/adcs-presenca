# ADR-006 — CI/CD Strategy

| Campo | Valor |
|--------|--------|
| ADR | 006 |
| Título | CI/CD Strategy |
| Status | Aprovado |
| Versão | Definitiva |
| Data | 27/07/2026 |
| Autor | Solution Architect / DevOps Engineer |
| Projeto | ADCS Presença |

---

# Contexto

O ADCS Presença adota uma arquitetura moderna baseada em GitHub Flow, Versionamento Semântico, ambientes independentes e infraestrutura em Firebase.

As decisões arquiteturais estabelecidas pelos ADR-001 (GitHub Flow Strategy), ADR-002 (Semantic Versioning Strategy), ADR-003 (Environment Strategy), ADR-004 (Firebase Architecture) e ADR-005 (Release Management) definiram a estrutura de desenvolvimento, versionamento, arquitetura da plataforma e governança das publicações.

Entretanto, a execução manual das atividades de integração, validação, testes e implantação aumenta o esforço operacional, reduz a previsibilidade das entregas e eleva o risco de erros humanos.

Esta ADR estabelece oficialmente a estratégia de Integração Contínua (Continuous Integration) e Entrega Contínua (Continuous Delivery) do ADCS Presença, definindo como o processo de desenvolvimento será automatizado utilizando GitHub Actions e os recursos disponibilizados pela plataforma Firebase.

Seu objetivo é garantir maior qualidade, repetibilidade, segurança, rastreabilidade e velocidade nas entregas do produto.

---

# Problema

A ausência de um processo automatizado de CI/CD pode ocasionar:

- implantações inconsistentes;
- falhas humanas durante publicações;
- divergência entre ambientes;
- baixa rastreabilidade das implantações;
- maior tempo para disponibilização de novas versões;
- dificuldade na execução de testes repetitivos;
- ausência de validações automáticas;
- aumento do risco operacional.

Era necessário definir oficialmente:

- quando os pipelines deverão ser executados;
- quais validações serão automatizadas;
- quais ambientes receberão implantações automáticas;
- como ocorrerá a promoção entre ambientes;
- como serão protegidas as credenciais utilizadas;
- quais etapas permanecerão dependentes de aprovação humana;
- como integrar CI/CD ao processo oficial de Release Management.

---

# Objetivos

Esta ADR possui como objetivos:

- automatizar o processo de integração contínua;
- automatizar o processo de entrega contínua;
- reduzir falhas operacionais;
- aumentar a qualidade das Releases;
- garantir repetibilidade das implantações;
- reduzir tempo de publicação;
- padronizar o processo de deploy;
- aumentar a rastreabilidade das implantações;
- preparar a plataforma para evolução contínua;
- servir como referência oficial da estratégia de CI/CD do projeto.

---

# Escopo

Esta ADR aplica-se a:

- todos os módulos do ADCS Presença;
- todos os repositórios oficiais do projeto;
- todos os ambientes (DEV, QA e PROD);
- todos os pipelines automatizados;
- todos os processos de build, validação, testes e deploy.

O processo definido nesta ADR deverá ser seguido por qualquer implantação realizada durante o ciclo de vida do produto.

---

# Alternativas Consideradas

## Alternativa 1 — Processo Totalmente Manual

Consistia na execução manual de todas as atividades de integração, testes e implantação.

### Vantagens

- simplicidade inicial;
- baixo esforço de configuração;
- facilidade de compreensão.

### Desvantagens

- elevado risco operacional;
- maior possibilidade de erro humano;
- baixa rastreabilidade;
- maior tempo de implantação;
- baixa repetibilidade.

---

## Alternativa 2 — Ferramenta Externa de CI/CD

Consistia na utilização de plataformas dedicadas como:

- Jenkins;
- Azure DevOps;
- GitLab CI;
- CircleCI;
- Bitbucket Pipelines.

### Vantagens

- elevada flexibilidade;
- grande quantidade de recursos;
- ampla capacidade de personalização.

### Desvantagens

- maior complexidade operacional;
- necessidade de administração adicional;
- aumento do custo de manutenção;
- menor integração nativa com GitHub.

---

## Alternativa 3 — GitHub Actions Integrado ao Firebase

Consiste na utilização do GitHub Actions como plataforma oficial de CI/CD integrada ao ecossistema Firebase.

### Vantagens

- integração nativa com GitHub;
- suporte oficial ao Firebase;
- redução da complexidade operacional;
- gerenciamento centralizado;
- facilidade de manutenção;
- pipelines versionados juntamente com o código;
- escalabilidade;
- facilidade de auditoria.

### Desvantagens

- dependência do ecossistema GitHub;
- limitações específicas da plataforma;
- necessidade de configuração inicial dos workflows.

---

# Decisão

Foi aprovada oficialmente a adoção do GitHub Actions como plataforma de Integração Contínua e Entrega Contínua do ADCS Presença.

Os pipelines definidos nesta ADR serão responsáveis por automatizar todas as atividades recorrentes de validação, construção e implantação da aplicação.

As implantações deverão respeitar obrigatoriamente:

- GitHub Flow;
- Versionamento Semântico;
- Environment Strategy;
- Firebase Architecture;
- Release Management.

A automação jamais substituirá as decisões de negócio ou as aprovações formais previstas no ADR-005.

---

# Princípios da Estratégia de CI/CD

A estratégia oficial de CI/CD deverá observar permanentemente os seguintes princípios.

## Automação

Toda atividade repetitiva deverá ser automatizada sempre que tecnicamente viável.

---

## Reprodutibilidade

Uma mesma versão deverá produzir exatamente os mesmos resultados independentemente da execução.

---

## Segurança

Nenhuma credencial sensível poderá permanecer armazenada no código-fonte.

Todas as credenciais deverão ser gerenciadas utilizando os mecanismos oficiais do GitHub.

---

## Rastreabilidade

Toda execução de pipeline deverá permanecer registrada.

Será possível identificar:

- commit executado;
- workflow utilizado;
- ambiente;
- responsável;
- horário;
- versão publicada;
- resultado da execução.

---

## Qualidade

Nenhuma implantação automática deverá ocorrer sem que todas as validações obrigatórias tenham sido aprovadas.

---

## Padronização

Todos os pipelines deverão seguir um padrão único de nomenclatura, estrutura e organização.

---

## Baixo Acoplamento

Os workflows deverão possuir responsabilidades específicas e independentes, facilitando manutenção e evolução.

---

## Evolução Incremental

Novos pipelines poderão ser incorporados futuramente desde que respeitem os princípios definidos nesta ADR e não comprometam a estabilidade da plataforma.

---

# Arquitetura da Pipeline de CI/CD

A estratégia oficial de CI/CD do ADCS Presença estabelece um conjunto de pipelines automatizados responsáveis pela integração contínua, validação, construção e entrega da aplicação.

O objetivo da arquitetura é garantir que todas as alterações percorram um fluxo controlado desde sua implementação até a publicação em produção, preservando a qualidade, a rastreabilidade e a estabilidade do produto.

A arquitetura de CI/CD integra-se diretamente às decisões estabelecidas pelos seguintes documentos:

- ADR-001 — GitHub Flow Strategy;
- ADR-002 — Semantic Versioning Strategy;
- ADR-003 — Environment Strategy;
- ADR-004 — Firebase Architecture;
- ADR-005 — Release Management.

---

# Arquitetura Geral

A estratégia oficial é composta por duas grandes etapas.

## Continuous Integration (CI)

Responsável por validar automaticamente toda alteração realizada no código-fonte.

Entre suas responsabilidades estão:

- validação da estrutura do projeto;
- instalação das dependências;
- execução de verificações automáticas;
- execução de testes;
- geração de artefatos quando aplicável;
- aprovação técnica da alteração.

---

## Continuous Delivery (CD)

Responsável pela implantação automatizada da aplicação nos ambientes oficiais.

Entre suas responsabilidades estão:

- publicação em Firebase Hosting;
- implantação das Security Rules;
- implantação dos índices do Cloud Firestore;
- publicação das configurações oficiais;
- promoção entre ambientes;
- disponibilização da nova versão.

---

# Fluxo Oficial da Pipeline

Toda alteração deverá seguir obrigatoriamente o fluxo abaixo.

```text
feature/*

      │

      ▼

Pull Request

      │

      ▼

Continuous Integration

      │

      ▼

Merge em develop

      │

      ▼

Deploy DEV

      │

      ▼

Validação DEV

      │

      ▼

release/x.y.z

      │

      ▼

Deploy QA

      │

      ▼

Homologação

      │

      ▼

Merge em main

      │

      ▼

Deploy PROD

      │

      ▼

Monitoramento
```

Cada etapa dependerá da aprovação da etapa anterior.

---

# Eventos que Disparam os Pipelines

Os pipelines poderão ser iniciados automaticamente mediante eventos específicos do GitHub.

---

## Push

Executado quando ocorrer envio de commits para determinadas branches.

Utilização prevista:

- develop;
- feature/*;
- fix/*;
- hotfix/*.

Objetivo:

- validar rapidamente alterações em desenvolvimento.

---

## Pull Request

Executado sempre que um Pull Request for aberto, atualizado ou sincronizado.

Objetivos:

- validar qualidade do código;
- executar verificações automáticas;
- impedir merge de alterações inválidas.

---

## Merge

Após aprovação do Pull Request e incorporação da alteração na branch de destino poderão ser iniciados os pipelines de entrega contínua.

---

## Release

A criação de uma Release oficial poderá iniciar automaticamente o pipeline de publicação correspondente.

Esse processo será utilizado principalmente para publicação em produção.

---

## Workflow Dispatch

Todos os principais workflows deverão permitir execução manual quando necessário.

Essa funcionalidade será utilizada para:

- republicações controladas;
- validações extraordinárias;
- testes operacionais;
- recuperação de falhas.

---

# Integração com GitHub Flow

Os pipelines deverão respeitar integralmente a estratégia definida pelo ADR-001.

Cada branch possui responsabilidade específica.

| Branch | Finalidade | Pipeline |
|---------|------------|----------|
| feature/* | Desenvolvimento | CI |
| fix/* | Correções | CI |
| hotfix/* | Correções emergenciais | CI + CD |
| develop | Integração | CI + Deploy DEV |
| release/* | Homologação | CI + Deploy QA |
| main | Produção | CI + Deploy PROD |

Nenhuma automação poderá alterar esse fluxo.

---

# Relação entre Branches e Ambientes

Cada ambiente oficial será abastecido exclusivamente por sua branch correspondente.

| Branch | Ambiente |
|----------|-----------|
| develop | DEV |
| release/* | QA |
| main | PROD |

Essa separação garante isolamento entre ambientes e previsibilidade das implantações.

---

# Fluxo de Promoção entre Ambientes

O processo de promoção seguirá obrigatoriamente a sequência abaixo.

```text
feature/*

↓

develop

↓

DEV

↓

release/x.y.z

↓

QA

↓

main

↓

PROD
```

Não serão permitidas promoções diretas entre ambientes.

---

# Critérios para Execução Automática

Antes da execução de qualquer implantação automática deverão ser atendidos os seguintes critérios.

## Para DEV

- merge aprovado em develop;
- pipeline de CI concluída com sucesso;
- validações obrigatórias aprovadas.

---

## Para QA

- branch Release criada;
- versão identificada;
- pipeline de CI aprovada;
- critérios definidos pelo ADR-005 atendidos.

---

## Para PROD

- homologação aprovada;
- merge realizado em main;
- versão oficialmente publicada;
- autorização formal conforme processo de Release Management.

---

# Estratégia de Isolamento

Cada pipeline executará suas atividades utilizando exclusivamente os recursos pertencentes ao ambiente correspondente.

Isso inclui:

- projeto Firebase;
- Firebase Hosting;
- Cloud Firestore;
- Firebase Authentication;
- Firebase Storage;
- Security Rules;
- credenciais;
- variáveis de ambiente.

Em nenhuma hipótese uma pipeline poderá utilizar recursos pertencentes a outro ambiente.

---

# Princípios da Promoção Automatizada

A automação deverá preservar permanentemente os seguintes princípios.

## Imutabilidade

A versão implantada em QA deverá ser exatamente a mesma publicada em produção.

---

## Rastreabilidade

Toda implantação deverá possuir histórico completo.

---

## Reprodutibilidade

A mesma pipeline deverá produzir sempre o mesmo resultado para a mesma versão.

---

## Segurança

Toda implantação deverá utilizar credenciais específicas do ambiente correspondente.

---

## Governança

Mesmo com automação, as aprovações formais previstas no ADR-005 permanecem obrigatórias para as implantações em produção.

---

# Estratégia de Continuous Integration (CI)

A Integração Contínua (Continuous Integration – CI) consiste na execução automática de validações técnicas sempre que ocorrer uma alteração no código-fonte do ADCS Presença.

Seu objetivo é identificar falhas o mais cedo possível, reduzir o risco de integração entre funcionalidades e garantir que apenas código validado seja promovido para os ambientes oficiais.

Toda alteração deverá passar obrigatoriamente pela pipeline de CI antes de prosseguir para qualquer etapa de entrega contínua.

---

# Objetivos da Continuous Integration

A pipeline de CI possui os seguintes objetivos:

- validar automaticamente todas as alterações;
- reduzir erros de integração;
- impedir a promoção de código inconsistente;
- aumentar a qualidade do produto;
- fornecer feedback rápido aos desenvolvedores;
- padronizar as validações técnicas do projeto.

---

# Estrutura da Pipeline de CI

A pipeline oficial será composta pelas seguintes etapas.

```text
Checkout

↓

Instalação de Dependências

↓

Validação da Estrutura

↓

Build

↓

Lint

↓

Testes Automatizados

↓

Quality Gates

↓

Geração de Artefatos

↓

Resultado Final
```

Cada etapa dependerá da conclusão bem-sucedida da etapa anterior.

---

# Checkout do Código

A primeira etapa da pipeline consiste na obtenção da versão exata do código correspondente ao commit que iniciou a execução.

Essa etapa garante que todas as validações ocorram sobre uma versão imutável do projeto.

---

# Instalação das Dependências

Após o checkout deverão ser instaladas automaticamente todas as dependências declaradas pelo projeto.

Essa etapa deverá utilizar versões controladas, garantindo reprodutibilidade entre diferentes execuções.

Caso existam inconsistências nas dependências, a pipeline deverá ser interrompida.

---

# Validação da Estrutura do Projeto

Antes da compilação serão executadas verificações estruturais.

Entre elas:

- existência dos arquivos obrigatórios;
- consistência da estrutura de diretórios;
- presença dos arquivos de configuração;
- validação da configuração do Firebase;
- validação da configuração do GitHub Actions.

Caso qualquer inconsistência seja encontrada, a execução deverá ser encerrada.

---

# Build da Aplicação

Após a validação estrutural deverá ser executado o processo de construção da aplicação.

O objetivo é garantir que o código esteja tecnicamente consistente e apto para implantação.

Nenhuma etapa posterior será executada caso o Build apresente falhas.

---

# Validação Estática (Lint)

Após o Build deverão ser executadas verificações automáticas de qualidade do código.

Essas verificações têm como objetivo identificar:

- erros de sintaxe;
- inconsistências de formatação;
- utilização de práticas não recomendadas;
- código potencialmente inseguro;
- problemas de manutenção.

Sempre que possível deverão ser utilizadas ferramentas oficiais do ecossistema JavaScript.

---

# Testes Automatizados

Concluída a validação estática, deverão ser executados os testes automatizados definidos para o projeto.

Os testes poderão incluir:

- testes unitários;
- testes de integração;
- testes de componentes;
- testes de validação de regras de negócio.

A evolução da cobertura de testes deverá ocorrer de forma incremental ao longo do ciclo de vida do produto.

---

# Quality Gates

Os Quality Gates representam os critérios mínimos para aprovação técnica da pipeline.

A execução somente será considerada bem-sucedida quando todos os critérios forem atendidos.

Entre os critérios previstos destacam-se:

- Build executado com sucesso;
- ausência de erros críticos;
- validação estrutural aprovada;
- testes obrigatórios aprovados;
- verificações estáticas concluídas;
- execução integral da pipeline.

Caso qualquer critério falhe, a pipeline será encerrada imediatamente.

---

# Geração de Artefatos

Após aprovação dos Quality Gates poderão ser gerados artefatos destinados às etapas posteriores da entrega contínua.

Dependendo da evolução do projeto, poderão ser produzidos:

- pacotes de implantação;
- arquivos compilados;
- relatórios de testes;
- relatórios de cobertura;
- registros de execução;
- documentação gerada automaticamente.

Todos os artefatos deverão possuir rastreabilidade e identificação da versão correspondente.

---

# Resultado da Pipeline

Ao término da execução será produzido um resultado oficial.

Os estados possíveis são:

| Estado | Descrição |
|---------|-----------|
| Sucesso | Todas as etapas concluídas |
| Falha | Execução interrompida por erro |
| Cancelada | Execução encerrada manualmente |
| Ignorada | Pipeline não aplicável ao evento |

O histórico das execuções deverá permanecer disponível para consulta e auditoria.

---

# Critérios para Aprovação da CI

Uma alteração somente será considerada aprovada quando:

- todas as etapas da pipeline forem concluídas com sucesso;
- não existirem falhas críticas;
- os testes obrigatórios forem aprovados;
- os Quality Gates forem atendidos;
- o Pull Request permanecer apto para merge.

---

# Tratamento de Falhas

Quando ocorrer qualquer falha durante a pipeline:

- o processo deverá ser interrompido imediatamente;
- nenhuma implantação automática será iniciada;
- o desenvolvedor deverá corrigir a causa da falha;
- uma nova execução será realizada após novo commit ou reexecução autorizada.

Nenhuma exceção deverá permitir a continuidade da pipeline com erros conhecidos.

---

# Responsabilidades

## Desenvolvedor

Responsável por corrigir falhas identificadas durante a CI.

---

## GitHub Actions

Responsável pela execução automática da pipeline.

---

## Solution Architect

Responsável por definir os padrões técnicos utilizados nas validações.

---

## DevOps Engineer

Responsável pela manutenção dos workflows, Quality Gates e infraestrutura de CI.

---

# Princípios da Continuous Integration

A estratégia oficial observará permanentemente os seguintes princípios.

## Feedback Rápido

Toda alteração deverá receber retorno técnico o mais cedo possível.

---

## Automação

As validações recorrentes deverão ocorrer sem intervenção manual.

---

## Consistência

A mesma alteração deverá produzir sempre o mesmo resultado quando executada nas mesmas condições.

---

## Confiabilidade

A aprovação da pipeline deverá representar confiança suficiente para permitir a promoção da alteração às etapas seguintes do processo de entrega.

---

## Evolução Contínua

Novas validações poderão ser incorporadas à pipeline sempre que agregarem qualidade ao processo de desenvolvimento, preservando compatibilidade com esta ADR.

---

# Estratégia de Continuous Delivery (CD)

A Entrega Contínua (Continuous Delivery – CD) é responsável por automatizar a implantação das versões aprovadas nos ambientes oficiais do ADCS Presença.

Seu objetivo é garantir que todas as implantações ocorram de forma previsível, padronizada, segura e rastreável, reduzindo a intervenção manual e preservando os critérios de governança estabelecidos pelo ADR-005 — Release Management.

A pipeline de CD somente será iniciada após a aprovação da etapa de Continuous Integration.

---

# Objetivos da Continuous Delivery

A pipeline de CD possui os seguintes objetivos:

- automatizar implantações;
- reduzir erros operacionais;
- padronizar o processo de deploy;
- garantir consistência entre ambientes;
- preservar a rastreabilidade das implantações;
- reduzir o tempo de disponibilização das novas versões;
- integrar a estratégia de Release Management ao processo de automação.

---

# Estrutura da Pipeline de CD

A pipeline oficial será composta pelas seguintes etapas.

```text
Recebimento da Versão

↓

Validação do Ambiente

↓

Autenticação no Firebase

↓

Deploy da Aplicação

↓

Deploy das Configurações

↓

Validações Pós-Deploy

↓

Publicação

↓

Monitoramento
```

Cada etapa dependerá da conclusão bem-sucedida da etapa anterior.

---

# Validação do Ambiente

Antes da implantação deverão ser verificadas automaticamente as configurações do ambiente de destino.

Entre as verificações previstas estão:

- identificação do projeto Firebase;
- alias correspondente ao ambiente;
- variáveis de ambiente;
- credenciais;
- configuração do Firebase CLI;
- disponibilidade do ambiente.

Caso qualquer inconsistência seja identificada, a implantação deverá ser interrompida.

---

# Autenticação

A autenticação deverá ocorrer utilizando exclusivamente credenciais de serviço específicas para cada ambiente.

Não será permitida autenticação interativa durante a execução das pipelines.

Toda autenticação deverá utilizar:

- Service Accounts;
- GitHub Secrets;
- credenciais segregadas por ambiente.

---

# Deploy do Firebase Hosting

Após a autenticação será realizada a publicação da aplicação no Firebase Hosting correspondente ao ambiente.

Cada ambiente deverá possuir seu próprio projeto Firebase.

O deploy deverá ocorrer exclusivamente no projeto associado ao ambiente da pipeline.

---

# Deploy do Cloud Firestore

Quando houver alterações estruturais aprovadas, a pipeline poderá implantar automaticamente:

- Security Rules;
- Firestore Indexes;
- arquivos oficiais de configuração.

As alterações deverão respeitar integralmente o ADR-004 — Firebase Architecture.

---

# Deploy do Firebase Storage

Quando aplicável, a pipeline poderá publicar automaticamente:

- Storage Security Rules;
- configurações oficiais do Firebase Storage.

Nenhuma implantação poderá comprometer a política oficial de segurança do projeto.

---

# Deploy de Configurações

Sempre que necessário poderão ser publicados automaticamente:

- arquivos de configuração;
- parâmetros de ambiente;
- configurações de Hosting;
- redirecionamentos;
- cabeçalhos HTTP;
- políticas de cache.

Toda configuração deverá permanecer versionada juntamente com o código-fonte.

---

# Estratégia por Ambiente

Cada ambiente possui objetivos específicos durante o processo de entrega contínua.

---

## Ambiente DEV

Objetivo:

- validação técnica;
- testes exploratórios;
- integração entre funcionalidades.

Implantação:

- automática após merge em **develop**.

---

## Ambiente QA

Objetivo:

- homologação oficial;
- testes funcionais;
- testes de regressão;
- validação do Product Owner.

Implantação:

- automática após atualização da branch **release/**.

---

## Ambiente PROD

Objetivo:

- disponibilização da versão oficial aos usuários finais.

Implantação:

- somente após aprovação formal prevista no ADR-005.

Mesmo utilizando automação, a publicação em produção permanecerá condicionada à autorização da Release.

---

# Preview Channels

Durante o desenvolvimento poderão ser utilizados os Firebase Preview Channels.

Seu objetivo é disponibilizar ambientes temporários para validação antes da integração oficial.

Os Preview Channels poderão ser utilizados para:

- validação técnica;
- demonstrações;
- revisão de interface;
- testes exploratórios;
- aprovação preliminar.

Os Preview Channels não substituem os ambientes DEV, QA ou PROD.

---

# Promoção entre Ambientes

A promoção automatizada seguirá obrigatoriamente o fluxo abaixo.

```text
develop

↓

Deploy DEV

↓

release/*

↓

Deploy QA

↓

main

↓

Deploy PROD
```

Não serão permitidas promoções que ignorem qualquer etapa obrigatória.

---

# Validações Pós-Deploy

Após cada implantação deverão ser executadas verificações automáticas.

Entre elas:

- disponibilidade da aplicação;
- resposta do Firebase Hosting;
- publicação correta dos arquivos;
- validação das Security Rules;
- consistência das configurações;
- acessibilidade da aplicação.

Caso qualquer validação falhe, a implantação deverá ser considerada malsucedida.

---

# Critérios para Conclusão do Deploy

Uma implantação será considerada concluída quando:

- todos os recursos forem publicados;
- todas as validações forem aprovadas;
- não existirem erros críticos;
- o ambiente estiver operacional;
- a execução for registrada com sucesso.

---

# Tratamento de Falhas

Caso ocorra falha durante o processo de entrega:

- a execução será interrompida;
- o ambiente permanecerá na última versão estável;
- os responsáveis serão notificados;
- o histórico da execução permanecerá registrado.

Sempre que necessário deverão ser aplicados os procedimentos de rollback definidos no ADR-005.

---

# Responsabilidades

## GitHub Actions

Responsável pela execução automática das implantações.

---

## Firebase CLI

Responsável pela comunicação com a plataforma Firebase durante o deploy.

---

## DevOps Engineer

Responsável pela manutenção das pipelines de entrega contínua.

---

## Product Owner

Responsável pela aprovação da publicação em produção.

---

# Princípios da Continuous Delivery

A estratégia oficial observará permanentemente os seguintes princípios.

## Segurança

Toda implantação deverá utilizar credenciais protegidas e específicas para cada ambiente.

---

## Consistência

A mesma versão aprovada em QA deverá ser exatamente a versão publicada em produção.

---

## Isolamento

Cada ambiente deverá permanecer completamente independente dos demais.

---

## Automatização Controlada

A automação deverá eliminar atividades repetitivas sem substituir as decisões formais de governança previstas pelo processo de Release Management.

---

## Auditabilidade

Toda implantação deverá permanecer registrada, permitindo identificar:

- versão publicada;
- ambiente;
- workflow executado;
- responsável pela aprovação;
- data e horário da implantação;
- resultado da execução.


---

# GitHub Actions

O GitHub Actions foi adotado como plataforma oficial para automação dos processos de Integração Contínua e Entrega Contínua do ADCS Presença.

Todos os workflows deverão permanecer versionados juntamente com o código-fonte, permitindo rastreabilidade, auditoria e evolução controlada da infraestrutura de automação.

A estrutura deverá ser organizada conforme as boas práticas recomendadas pelo GitHub.

---

# Organização dos Workflows

Os workflows deverão ser armazenados no diretório oficial:

```text
.github/
└── workflows/
```

Cada workflow deverá possuir responsabilidade única e claramente definida.

Entre os workflows previstos destacam-se:

| Workflow | Objetivo |
|-----------|----------|
| ci.yml | Pipeline oficial de Continuous Integration |
| deploy-dev.yml | Implantação automática no ambiente DEV |
| deploy-qa.yml | Implantação automática no ambiente QA |
| deploy-prod.yml | Implantação em produção |
| rollback.yml | Processo automatizado de rollback |
| release.yml | Automação do processo de Release |
| dependency-check.yml | Verificação periódica de dependências |

Novos workflows poderão ser incorporados futuramente, desde que respeitem os princípios definidos nesta ADR.

---

# Estratégia de GitHub Environments

Os ambientes do GitHub deverão refletir exatamente a arquitetura definida pelo ADR-003.

Serão utilizados os seguintes Environments:

| Environment | Finalidade |
|-------------|------------|
| DEV | Desenvolvimento |
| QA | Homologação |
| PROD | Produção |

Cada Environment possuirá configurações independentes.

Entre elas:

- Secrets próprios;
- regras de aprovação;
- restrições de publicação;
- histórico de implantações;
- controle de acesso.

---

# GitHub Secrets

Nenhuma informação sensível poderá permanecer armazenada no repositório.

Todas as credenciais deverão ser mantidas utilizando GitHub Secrets.

Entre os Secrets previstos destacam-se:

## Ambiente DEV

- Firebase Service Account DEV
- Firebase Project ID DEV
- Firebase Token DEV

---

## Ambiente QA

- Firebase Service Account QA
- Firebase Project ID QA
- Firebase Token QA

---

## Ambiente PROD

- Firebase Service Account PROD
- Firebase Project ID PROD
- Firebase Token PROD

---

# Service Accounts

Cada ambiente Firebase deverá possuir sua própria Service Account.

Será vedado o compartilhamento de credenciais entre ambientes.

Cada Service Account deverá possuir apenas as permissões estritamente necessárias para execução das pipelines.

Esse princípio segue o conceito de menor privilégio (*Principle of Least Privilege*).

---

# Gerenciamento de Credenciais

Todas as credenciais deverão observar os seguintes princípios:

- armazenamento exclusivo em GitHub Secrets;
- segregação por ambiente;
- acesso restrito;
- rotação periódica;
- proibição de armazenamento em arquivos do projeto;
- proibição de armazenamento em código-fonte.

Caso ocorra comprometimento de qualquer credencial, deverá ser realizada imediatamente sua revogação e substituição.

---

# Proteção das Branches

A automação deverá respeitar integralmente as regras de proteção definidas para o repositório.

Entre elas destacam-se:

- Pull Request obrigatório;
- aprovação antes do Merge;
- proibição de Push direto na branch principal;
- execução obrigatória da pipeline de CI;
- histórico preservado;
- proteção contra exclusão acidental.

Essas regras complementam o ADR-001 — GitHub Flow Strategy.

---

# Aprovação dos Ambientes

A automação não elimina o processo formal de aprovação definido pelo ADR-005.

Os ambientes poderão exigir aprovação manual antes da execução da implantação.

Recomenda-se a seguinte configuração:

| Ambiente | Aprovação |
|-----------|-----------|
| DEV | Não obrigatória |
| QA | Opcional |
| PROD | Obrigatória |

Essa estratégia preserva a governança das implantações em produção.

---

# Estratégia de Rollback Automatizado

Sempre que tecnicamente possível, deverá existir um workflow específico para execução controlada de rollback.

Seu objetivo é reduzir o tempo necessário para restauração da última versão estável.

O rollback automatizado deverá:

- identificar a versão estável anterior;
- restaurar os artefatos correspondentes;
- publicar novamente a versão selecionada;
- registrar toda a execução;
- notificar os responsáveis.

---

# Critérios para Execução de Rollback

O rollback automatizado poderá ser iniciado quando ocorrer:

- falha crítica após implantação;
- indisponibilidade da aplicação;
- erro de configuração;
- degradação severa de desempenho;
- incidente de segurança;
- decisão formal de rollback.

O procedimento deverá permanecer alinhado ao ADR-005.

---

# Auditoria das Pipelines

Toda execução deverá permanecer registrada.

O histórico deverá permitir identificar:

- workflow executado;
- commit correspondente;
- versão;
- ambiente;
- responsável pela aprovação;
- responsável pela execução;
- horário de início;
- horário de conclusão;
- duração;
- resultado.

Essas informações deverão permanecer disponíveis para fins de auditoria e rastreabilidade.

---

# Boas Práticas para Workflows

Todos os workflows deverão observar as seguintes recomendações:

- responsabilidade única;
- reutilização sempre que possível;
- nomenclatura padronizada;
- documentação adequada;
- execução determinística;
- mensagens claras de erro;
- versionamento juntamente com o código;
- manutenção simplificada.

---

# Princípios de Segurança

A estratégia oficial de automação observará permanentemente os seguintes princípios.

## Menor Privilégio

Cada workflow deverá possuir apenas as permissões necessárias para execução de suas atividades.

---

## Segregação

Credenciais, ambientes e permissões deverão permanecer completamente isolados.

---

## Auditabilidade

Toda execução deverá gerar evidências suficientes para rastreamento completo.

---

## Integridade

Nenhuma pipeline poderá modificar artefatos aprovados durante o processo de Release.

---

## Governança

Mesmo com elevado nível de automação, as decisões formais de aprovação continuarão sendo responsabilidade das pessoas designadas pelo processo de Release Management.

---

---

# Observabilidade da Plataforma de CI/CD

A estratégia de CI/CD do ADCS Presença deverá incorporar mecanismos de observabilidade capazes de fornecer visibilidade completa sobre a execução das pipelines, o estado das implantações e a estabilidade operacional dos ambientes.

A observabilidade permitirá identificar rapidamente falhas, reduzir o tempo de recuperação e apoiar a melhoria contínua dos processos de desenvolvimento e entrega.

---

# Objetivos da Observabilidade

A observabilidade possui os seguintes objetivos:

- monitorar continuamente as pipelines;
- identificar falhas automaticamente;
- facilitar a investigação de incidentes;
- reduzir o tempo de diagnóstico;
- fornecer indicadores operacionais;
- apoiar decisões de melhoria contínua;
- aumentar a confiabilidade das implantações.

---

# Estratégia de Monitoramento

Todo processo automatizado deverá ser monitorado durante sua execução.

O monitoramento deverá abranger, no mínimo:

- execução das pipelines;
- implantações;
- tempo de execução;
- falhas;
- cancelamentos;
- rollbacks;
- disponibilidade dos ambientes;
- integridade das publicações.

---

# Logs das Pipelines

Cada execução deverá produzir registros suficientes para permitir auditoria completa.

Os logs deverão registrar, no mínimo:

- workflow executado;
- branch de origem;
- commit correspondente;
- ambiente de destino;
- versão implantada;
- horário de início;
- horário de término;
- duração da execução;
- resultado da pipeline;
- mensagens de erro quando aplicável.

Os registros deverão permanecer disponíveis para consulta durante todo o ciclo de vida da Release.

---

# Histórico das Implantações

Cada implantação deverá possuir histórico próprio.

O histórico deverá conter:

- ambiente;
- versão publicada;
- responsável pela aprovação;
- workflow executado;
- data e horário da implantação;
- duração;
- resultado;
- referência ao Pull Request;
- referência à Release.

Esse histórico constitui parte da rastreabilidade oficial do projeto.

---

# Indicadores Operacionais

A estratégia de CI/CD deverá permitir acompanhamento contínuo por meio de indicadores.

Entre os indicadores recomendados destacam-se:

- quantidade de pipelines executadas;
- taxa de sucesso das pipelines;
- taxa de falhas;
- tempo médio de execução;
- tempo médio de implantação;
- quantidade de rollbacks;
- quantidade de Hotfixes;
- frequência de implantações;
- tempo médio entre falhas;
- tempo médio de recuperação.

Esses indicadores apoiarão a evolução contínua do processo de entrega.

---

# Alertas

Sempre que possível deverão ser configurados mecanismos automáticos de notificação para eventos relevantes.

Entre os eventos previstos destacam-se:

- falha em pipeline;
- falha durante deploy;
- rollback executado;
- publicação concluída;
- erro de autenticação;
- falha de infraestrutura;
- interrupção inesperada da execução.

A forma de envio das notificações poderá evoluir conforme a maturidade da plataforma.

---

# Health Checks

Após cada implantação deverão ser executadas verificações automáticas de integridade da aplicação.

Os Health Checks poderão validar:

- disponibilidade da aplicação;
- resposta do Firebase Hosting;
- acessibilidade dos recursos publicados;
- disponibilidade dos serviços principais;
- funcionamento das rotas públicas;
- consistência das configurações.

Caso qualquer verificação falhe, a implantação deverá ser sinalizada para análise imediata.

---

# Gestão de Incidentes

Ocorrendo qualquer incidente relacionado às pipelines ou às implantações, deverá ser iniciado o processo oficial de gerenciamento de incidentes definido pelo ADR-005.

Entre as ações previstas estão:

- registrar o incidente;
- preservar evidências;
- avaliar impacto;
- comunicar os responsáveis;
- decidir pela continuidade ou rollback;
- documentar a causa raiz;
- registrar as lições aprendidas.

---

# Continuidade Operacional

A estratégia de CI/CD deverá assegurar que falhas pontuais não comprometam a continuidade operacional do projeto.

Para isso deverão ser observados os seguintes princípios:

- isolamento entre ambientes;
- versionamento dos workflows;
- repetibilidade das execuções;
- possibilidade de reexecução controlada;
- rollback documentado;
- preservação dos históricos.

---

# Recuperação de Desastres

Em caso de falha grave da infraestrutura de automação, deverá ser possível restaurar rapidamente o processo de entrega.

O plano de recuperação deverá contemplar:

- restauração dos workflows;
- recuperação das configurações;
- recriação dos GitHub Environments;
- restauração dos GitHub Secrets;
- recuperação das Service Accounts;
- reconfiguração do Firebase CLI;
- validação das pipelines restauradas.

---

# Melhoria Contínua

A estratégia de CI/CD deverá evoluir continuamente ao longo do ciclo de vida do produto.

Entre as iniciativas previstas destacam-se:

- ampliação da cobertura de testes;
- melhoria dos workflows;
- otimização do tempo de execução;
- inclusão de novas verificações automáticas;
- evolução dos indicadores;
- fortalecimento dos controles de segurança;
- revisão periódica das pipelines.

Toda melhoria relevante deverá respeitar os princípios definidos nesta ADR.

---

# Princípios da Observabilidade

A estratégia oficial observará permanentemente os seguintes princípios.

## Transparência

Toda execução deverá produzir informações suficientes para permitir entendimento completo do processo.

---

## Disponibilidade

As informações necessárias para operação e auditoria deverão permanecer acessíveis aos responsáveis autorizados.

---

## Rastreabilidade

Toda alteração deverá possuir histórico completo desde o commit até sua implantação.

---

## Confiabilidade

Os indicadores produzidos deverão representar fielmente a situação operacional da plataforma.

---

## Evolução Contínua

A observabilidade deverá evoluir continuamente acompanhando o crescimento do ADCS Presença, mantendo alinhamento com as boas práticas de DevOps, SRE e Engenharia de Software.

---

---

# Integração com os Demais ADRs

A estratégia de CI/CD consolida e automatiza as decisões arquiteturais previamente estabelecidas para o ADCS Presença.

Todos os pipelines deverão respeitar integralmente os princípios definidos pelos ADRs vigentes, garantindo que a automação permaneça alinhada à arquitetura oficial do projeto.

---

## Integração com o ADR-001 — GitHub Flow Strategy

Os pipelines deverão respeitar integralmente a estratégia oficial de branches.

As automações deverão operar sobre as seguintes branches:

- feature/*
- fix/*
- release/*
- hotfix/*
- develop
- main

Os eventos utilizados pelo GitHub Actions deverão estar diretamente associados ao fluxo estabelecido pelo ADR-001.

Nenhuma automação poderá alterar a estratégia oficial de GitHub Flow.

---

## Integração com o ADR-002 — Semantic Versioning Strategy

Toda implantação deverá estar vinculada a uma versão oficial do projeto.

A identificação da versão seguirá obrigatoriamente o padrão:

```text
MAJOR.MINOR.PATCH
```

As pipelines deverão utilizar essa identificação em:

- artefatos;
- logs;
- histórico de implantações;
- Releases;
- auditorias.

---

## Integração com o ADR-003 — Environment Strategy

A estratégia de CI/CD deverá preservar integralmente a arquitetura de ambientes independentes.

Cada pipeline utilizará exclusivamente os recursos do ambiente correspondente.

Fluxo oficial:

```text
DEV

↓

QA

↓

PROD
```

Não serão permitidas implantações cruzadas entre ambientes.

---

## Integração com o ADR-004 — Firebase Architecture

Toda implantação automatizada deverá respeitar a arquitetura oficial da plataforma Firebase.

Entre os recursos contemplados destacam-se:

- Firebase Hosting;
- Cloud Firestore;
- Firebase Authentication;
- Firebase Storage;
- Security Rules;
- Firestore Indexes.

As pipelines deverão utilizar apenas configurações oficialmente versionadas.

---

## Integração com o ADR-005 — Release Management

O ADR-005 define o processo oficial de gerenciamento de Releases.

O presente ADR automatiza esse processo, preservando todas as aprovações formais estabelecidas anteriormente.

A automação não substitui a governança do processo de Release Management.

---

# Roadmap de Evolução da Automação

A estratégia definida nesta ADR representa a base da automação do ADCS Presença.

Ao longo da evolução do produto poderão ser incorporadas novas capacidades.

Entre elas destacam-se:

- ampliação da cobertura de testes automatizados;
- validação automática de qualidade de código;
- análise estática de segurança;
- verificação automática de dependências;
- geração automática de documentação técnica;
- publicação automática de Release Notes;
- integração com ferramentas de monitoramento;
- notificações automatizadas;
- métricas avançadas de DevOps;
- suporte a múltiplos módulos da aplicação.

Toda evolução deverá preservar compatibilidade com esta ADR.

---

# Benefícios Esperados

A adoção desta estratégia proporcionará:

- redução significativa de erros operacionais;
- maior previsibilidade das implantações;
- padronização do processo de entrega;
- maior velocidade de publicação;
- aumento da qualidade das Releases;
- rastreabilidade completa das implantações;
- redução do esforço manual;
- maior confiabilidade dos ambientes;
- facilidade para auditoria;
- melhoria contínua do processo de desenvolvimento;
- preparação para crescimento do produto;
- alinhamento às boas práticas de DevOps, Engenharia de Software e ITIL.

---

# Consequências

A partir da aprovação desta ADR:

- GitHub Actions torna-se a plataforma oficial de CI/CD do ADCS Presença;
- todas as implantações automatizadas deverão seguir os workflows oficiais;
- toda automação deverá respeitar a estratégia de GitHub Flow;
- as credenciais deverão permanecer protegidas por GitHub Secrets;
- a promoção entre ambientes continuará obedecendo ao fluxo DEV → QA → PROD;
- toda implantação permanecerá rastreável;
- alterações significativas nos pipelines deverão ser formalizadas por meio de novos ADRs.

---

# Conformidade

A estratégia definida nesta ADR está alinhada às seguintes práticas reconhecidas da indústria:

- Continuous Integration;
- Continuous Delivery;
- GitOps;
- Infrastructure as Code;
- DevOps;
- Site Reliability Engineering (SRE);
- ITIL 4;
- Engenharia de Software Moderna.

Essa conformidade reforça a adoção de processos padronizados, auditáveis e escaláveis para o ciclo de vida do ADCS Presença.

---

# ADRs Relacionados

- ADR-001 — GitHub Flow Strategy
- ADR-002 — Semantic Versioning Strategy
- ADR-003 — Environment Strategy
- ADR-004 — Firebase Architecture
- ADR-005 — Release Management

---

# Referências

- GitHub Actions Documentation  
  https://docs.github.com/actions

- GitHub Environments Documentation  
  https://docs.github.com/actions/deployment/targeting-different-environments

- Firebase Hosting Documentation  
  https://firebase.google.com/docs/hosting

- Cloud Firestore Documentation  
  https://firebase.google.com/docs/firestore

- Google Cloud Architecture Framework  
  https://cloud.google.com/architecture/framework

- DevOps Handbook — Gene Kim, Jez Humble, Patrick Debois e John Willis

- Continuous Delivery — Jez Humble & David Farley

- Accelerate — Nicole Forsgren, Jez Humble & Gene Kim

- ITIL® 4 Foundation

- Firebase CLI Documentation
  https://firebase.google.com/docs/cli

---

# Histórico

| Data | Alteração |
|--------|-----------|
| 27/07/2026 | Criação inicial do ADR-006. |
| 27/07/2026 | Definição oficial da estratégia de Continuous Integration (CI). |
| 27/07/2026 | Definição oficial da estratégia de Continuous Delivery (CD). |
| 27/07/2026 | Consolidação da arquitetura de pipelines, GitHub Actions, segurança, observabilidade e automação do processo de Release. |
| 27/07/2026 | Publicação da versão definitiva. |