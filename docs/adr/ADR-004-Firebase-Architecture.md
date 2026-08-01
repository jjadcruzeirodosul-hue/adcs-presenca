# ADR-004 — Firebase Architecture

| Campo | Valor |
|--------|--------|
| ADR | 004 |
| Título | Firebase Architecture |
| Status | Aprovado |
| Versão | Definitiva |
| Data | 27/07/2026 |
| Autor | Solution Architect / DevOps Engineer |
| Projeto | ADCS Presença |

---

# Contexto

O ADCS Presença é uma aplicação Web destinada ao gerenciamento da presença de alunos em atividades esportivas e sociais, desenvolvida utilizando tecnologias Web modernas e a plataforma Firebase como Backend as a Service (BaaS).

Após a aprovação das decisões arquiteturais referentes ao fluxo de desenvolvimento (ADR-001 — GitHub Flow Strategy), à estratégia de versionamento (ADR-002 — Semantic Versioning Strategy) e à estratégia de ambientes (ADR-003 — Environment Strategy), tornou-se necessário estabelecer oficialmente a arquitetura da plataforma Firebase adotada pelo projeto.

Este documento consolida as decisões relacionadas à utilização dos serviços da plataforma Firebase, definindo suas responsabilidades, limites, integrações e princípios arquiteturais, garantindo padronização, escalabilidade, segurança e facilidade de manutenção durante todo o ciclo de vida do produto.

---

# Problema

A plataforma Firebase oferece diversos serviços que podem ser utilizados de maneiras distintas.

Sem uma arquitetura oficialmente definida, podem ocorrer:

- utilização inadequada dos serviços;
- sobreposição de responsabilidades;
- inconsistência entre ambientes;
- dificuldades de manutenção;
- aumento da complexidade operacional;
- riscos de segurança;
- dificuldades para evolução futura do produto.

Era necessário definir uma arquitetura oficial que estabelecesse claramente:

- quais serviços Firebase serão utilizados;
- quais serviços não serão utilizados nesta fase;
- responsabilidades de cada serviço;
- organização dos ambientes;
- organização dos dados;
- estratégia de autenticação;
- estratégia de armazenamento;
- estratégia de segurança;
- princípios de escalabilidade.

---

# Objetivos

Esta ADR possui como objetivos:

- padronizar a arquitetura Firebase do projeto;
- definir responsabilidades para cada serviço utilizado;
- estabelecer limites arquiteturais claros;
- facilitar futuras evoluções;
- reduzir acoplamento;
- aumentar a segurança da aplicação;
- preparar a plataforma para crescimento;
- permitir automações futuras de CI/CD;
- servir como referência arquitetural oficial para todo o projeto.

---

# Escopo

Esta ADR aplica-se a todos os ambientes do ADCS Presença:

- DEV
- QA
- PROD

e a todos os serviços Firebase utilizados pelo projeto.

---

# Alternativas consideradas

## Alternativa 1 — Backend próprio

Consistia na construção de uma API utilizando tecnologias como Node.js, Java, .NET ou PHP, hospedada em infraestrutura própria.

### Vantagens

- total controle da infraestrutura;
- flexibilidade máxima;
- independência de fornecedor.

### Desvantagens

- maior custo operacional;
- necessidade de administrar servidores;
- implantação mais complexa;
- maior tempo de desenvolvimento;
- necessidade de monitoramento constante.

---

## Alternativa 2 — Plataforma Supabase

Foi considerada a utilização do Supabase como Backend as a Service.

### Vantagens

- PostgreSQL nativo;
- autenticação integrada;
- armazenamento integrado.

### Desvantagens

- maior esforço de configuração;
- menor integração com hospedagem estática;
- menor maturidade da equipe em relação à plataforma.

---

## Alternativa 3 — Plataforma Firebase

Consiste na utilização da plataforma Firebase como Backend as a Service.

Serviços principais:

- Firebase Hosting;
- Cloud Firestore;
- Firebase Authentication;
- Firebase Storage.

### Vantagens

- elevada disponibilidade;
- excelente integração entre serviços;
- hospedagem simplificada;
- escalabilidade automática;
- gerenciamento reduzido de infraestrutura;
- integração nativa com aplicações Web;
- forte integração futura com GitHub Actions e CI/CD.

### Desvantagens

- dependência da plataforma Google;
- limitações específicas do Cloud Firestore;
- necessidade de planejamento cuidadoso da modelagem dos dados.

---

# Decisão

Foi aprovada oficialmente a adoção da plataforma Firebase como infraestrutura principal do backend do ADCS Presença.

A arquitetura deverá utilizar exclusivamente os serviços definidos nesta ADR, respeitando suas responsabilidades específicas.

A estratégia de ambientes permanece definida pelo ADR-003, utilizando projetos Firebase independentes para DEV, QA e PROD.

Cada serviço Firebase deverá possuir uma única responsabilidade arquitetural, evitando sobreposição de funções e mantendo baixo acoplamento entre os componentes da solução.

---

# Princípios Arquiteturais

A arquitetura Firebase do ADCS Presença deverá observar permanentemente os seguintes princípios.

## Simplicidade

A solução deverá priorizar implementações simples, reduzindo complexidade desnecessária.

---

## Responsabilidade Única

Cada serviço Firebase deverá possuir uma responsabilidade claramente definida.

---

## Baixo Acoplamento

Os módulos deverão depender minimamente entre si.

Mudanças em um componente não deverão exigir alterações significativas em outros componentes.

---

## Escalabilidade

A arquitetura deverá permitir crescimento gradual sem necessidade de grandes reestruturações.

---

## Segurança por padrão

Todos os serviços deverão ser configurados considerando o princípio do menor privilégio.

O acesso aos dados deverá ocorrer somente mediante regras explícitas de autorização.

---

## Isolamento entre ambientes

Os ambientes DEV, QA e PROD deverão permanecer completamente isolados conforme definido no ADR-003.

Não haverá compartilhamento de:

- Cloud Firestore;
- Firebase Authentication;
- Firebase Storage;
- Firebase Hosting;
- Security Rules;
- credenciais;
- configurações;
- dados.

---

## Evolução incremental

Novos serviços Firebase somente poderão ser incorporados mediante avaliação arquitetural e aprovação de um novo ADR, quando representarem mudança significativa na arquitetura da solução.

---

# Arquitetura Geral da Plataforma

A arquitetura do ADCS Presença adota o modelo **Backend as a Service (BaaS)** utilizando a plataforma Firebase.

Toda a infraestrutura de backend será composta por serviços gerenciados da plataforma Firebase, eliminando a necessidade de servidores de aplicação próprios nesta fase do projeto.

A aplicação Web comunica-se diretamente com os serviços Firebase por meio do SDK oficial, respeitando as regras de autenticação e autorização definidas para cada ambiente.

A arquitetura foi projetada para privilegiar:

- simplicidade;
- escalabilidade;
- segurança;
- baixo custo operacional;
- facilidade de manutenção;
- integração contínua;
- evolução incremental.

---

# Visão Geral da Arquitetura

```
                     Usuário

                        │

                        ▼

              Aplicação Web (HTML/CSS/JavaScript)

                        │

        ┌───────────────┼────────────────┐
        │               │                │
        ▼               ▼                ▼

 Firebase Hosting   Firebase Authentication   Cloud Firestore

                        │
                        ▼

                Firebase Storage

```

Cada serviço possui responsabilidades específicas e independentes, reduzindo o acoplamento entre os componentes da solução.

---

# Organização dos Ambientes

Conforme estabelecido pelo ADR-003 — Environment Strategy, o ADCS Presença utilizará ambientes completamente independentes.

```
                DEV
                 │
          Homologação
                 ▼
                QA
                 │
        Aprovação da Release
                 ▼
               PROD
```

Cada ambiente possuirá:

- projeto Firebase independente;
- banco de dados independente;
- autenticação independente;
- armazenamento independente;
- regras de segurança independentes;
- configurações independentes;
- credenciais independentes.

Não haverá compartilhamento de recursos entre ambientes.

---

# Projetos Firebase

A arquitetura oficial utilizará três projetos Firebase permanentes.

| Ambiente | Projeto Firebase | Alias Firebase CLI |
|-----------|------------------|--------------------|
| DEV | ADCS Presença DEV | dev |
| QA | ADCS Presença QA | qa |
| PROD | ADCS Presença PROD | prod |

A identificação oficial de cada ambiente ocorrerá por meio de:

- Project Name;
- Project ID;
- Alias do Firebase CLI.

A classificação visual do projeto na Console Firebase não possui impacto arquitetural.

---

# Serviços Oficiais Utilizados

A arquitetura oficial utilizará os seguintes serviços da plataforma Firebase.

## Firebase Hosting

Responsável exclusivamente pela hospedagem da aplicação Web.

Responsabilidades:

- hospedagem dos arquivos HTML;
- hospedagem dos arquivos CSS;
- hospedagem dos arquivos JavaScript;
- distribuição global por CDN;
- HTTPS automático;
- deploy por ambiente;
- integração futura com GitHub Actions.

Não armazenará dados da aplicação.

---

## Cloud Firestore

Responsável exclusivamente pelo armazenamento persistente dos dados do sistema.

Responsabilidades:

- alunos;
- professores;
- presenças;
- configurações;
- auditoria;
- dados administrativos;
- futuras entidades do sistema.

Toda persistência da aplicação ocorrerá através do Cloud Firestore.

---

## Firebase Authentication

Responsável exclusivamente pela autenticação dos usuários.

Responsabilidades:

- login;
- logout;
- gerenciamento de identidade;
- emissão de tokens;
- autenticação dos administradores;
- autenticação dos professores;
- autenticação de futuros perfis.

Não armazenará dados de negócio.

---

## Firebase Storage

Responsável exclusivamente pelo armazenamento de arquivos.

Responsabilidades:

- fotos;
- documentos;
- imagens;
- arquivos enviados pelos usuários;
- anexos futuros.

Nenhum arquivo binário deverá ser armazenado no Cloud Firestore.

---

# Responsabilidade dos Serviços

Cada serviço possui uma responsabilidade única.

| Serviço | Responsabilidade |
|-----------|------------------|
| Firebase Hosting | Hospedagem da aplicação |
| Cloud Firestore | Dados da aplicação |
| Firebase Authentication | Identidade dos usuários |
| Firebase Storage | Arquivos |

Essa separação reduz acoplamento e facilita futuras evoluções.

---

# Serviços Não Utilizados

Os seguintes serviços da plataforma Firebase não fazem parte da arquitetura oficial nesta fase do projeto.

## Realtime Database

Não será utilizado.

Motivos:

- arquitetura baseada em documentos;
- melhor aderência do Cloud Firestore;
- maior flexibilidade para consultas.

---

## Cloud Functions

Não será utilizado na versão inicial.

Motivos:

- redução da complexidade;
- ausência de regras de negócio que justifiquem processamento server-side;
- foco na simplicidade arquitetural.

Sua adoção poderá ocorrer futuramente mediante aprovação de novo ADR.

---

## Firebase Data Connect

Não será utilizado.

Motivo:

A arquitetura do projeto não utiliza banco de dados relacional.

---

## Firebase AI Logic / Vertex AI

Não será utilizado nesta fase.

Sua utilização dependerá de necessidades futuras envolvendo inteligência artificial.

---

## Firebase App Check

Não será utilizado na primeira versão.

Sua adoção será reavaliada após a estabilização do produto.

---

## Firebase Remote Config

Não será utilizado inicialmente.

Caso futuramente seja necessário alterar comportamentos da aplicação sem novas publicações, sua adoção poderá ser avaliada.

---

## Firebase Cloud Messaging (FCM)

Não será utilizado.

O produto não possui, nesta fase, funcionalidades de notificações push.

---

# Evolução da Arquitetura

A arquitetura foi projetada para permitir a incorporação futura de novos serviços Firebase sem necessidade de reestruturação da solução.

Novos serviços deverão ser avaliados considerando:

- benefício arquitetural;
- impacto operacional;
- impacto financeiro;
- complexidade de manutenção;
- alinhamento com os princípios definidos nesta ADR.

A adoção de novos componentes que alterem significativamente a arquitetura deverá ser formalizada por meio de um novo Architecture Decision Record (ADR).

---

# Arquitetura do Cloud Firestore

O Cloud Firestore é o banco de dados oficial do ADCS Presença e será responsável por toda a persistência dos dados da aplicação.

Sua utilização deverá seguir os princípios arquiteturais definidos nesta ADR, priorizando:

- simplicidade;
- baixo acoplamento;
- alta escalabilidade;
- consultas eficientes;
- consistência dos dados;
- facilidade de manutenção.

O modelo adotado será baseado em documentos (Document Database), utilizando coleções independentes para cada entidade do domínio da aplicação.

---

# Princípios de Modelagem

A modelagem do Cloud Firestore deverá observar permanentemente os seguintes princípios.

## Coleções independentes

Cada entidade principal deverá possuir sua própria coleção.

Exemplos:

- alunos
- professores
- presencas
- usuarios
- configuracoes

---

## Documentos autocontidos

Cada documento deverá conter todas as informações necessárias para sua utilização, evitando dependências desnecessárias entre coleções.

Sempre que fizer sentido, poderão ser utilizadas pequenas duplicações controladas de dados para otimizar consultas e reduzir leituras adicionais.

---

## Baixo acoplamento

As coleções deverão possuir o menor número possível de dependências diretas.

A exclusão ou alteração de um documento não deverá comprometer a integridade estrutural das demais coleções.

---

## Escalabilidade

A estrutura deverá permitir crescimento para milhares de alunos e milhões de registros de presença sem necessidade de remodelagem significativa.

---

## Organização por domínio

As coleções deverão representar entidades do domínio do negócio, e não funcionalidades da aplicação.

---

# Estrutura Inicial das Coleções

A arquitetura inicial do Cloud Firestore será composta pelas seguintes coleções.

| Coleção | Finalidade |
|----------|------------|
| alunos | Cadastro de alunos |
| professores | Cadastro de professores |
| presencas | Registro de presenças |
| usuarios | Usuários autenticados |
| configuracoes | Configurações gerais do sistema |
| auditoria | Registro de eventos relevantes |

Novas coleções poderão ser adicionadas futuramente mediante necessidade funcional, preservando os princípios arquiteturais desta ADR.

---

# Coleção "alunos"

Responsável pelo cadastro oficial dos alunos.

Exemplos de atributos:

- id
- matricula
- nome
- nomeNormalizado
- faixa
- grau
- dataNascimento
- telefone
- responsavel
- ativo
- createdAt
- updatedAt

Cada aluno deverá possuir matrícula única.

A matrícula será utilizada como principal identificador funcional da aplicação.

---

# Coleção "professores"

Responsável pelo cadastro dos professores autorizados.

Exemplos de atributos:

- id
- nome
- telefone
- email
- ativo
- createdAt
- updatedAt

---

# Coleção "presencas"

Responsável pelo histórico de presenças dos alunos.

Cada documento representará um único registro de presença.

Exemplos de atributos:

- id
- alunoId
- matricula
- professorId
- data
- hora
- timestamp
- ambiente
- origem
- createdAt

A estratégia de prevenção de duplicidade será implementada utilizando identificadores determinísticos e validações transacionais, conforme definido pelas regras de negócio do projeto.

---

# Coleção "usuarios"

Responsável pelo vínculo entre usuários autenticados no Firebase Authentication e os perfis internos da aplicação.

Exemplos de atributos:

- uid
- nome
- email
- perfil
- ativo
- ultimoLogin
- createdAt

Esta coleção armazenará apenas informações complementares ao processo de autenticação.

A identidade do usuário permanecerá sob responsabilidade exclusiva do Firebase Authentication.

---

# Coleção "configuracoes"

Responsável pelas configurações globais da aplicação.

Exemplos:

- nome da instituição;
- parâmetros do sistema;
- funcionalidades habilitadas;
- configurações administrativas.

---

# Coleção "auditoria"

Responsável pelo registro de eventos relevantes do sistema.

Exemplos:

- login;
- alterações cadastrais;
- exclusões;
- mudanças administrativas;
- configurações críticas.

Essa coleção permitirá futura implementação de trilhas de auditoria e rastreabilidade operacional.

---

# Estratégia de Identificadores

Cada documento deverá possuir um identificador único.

Sempre que possível será utilizado o identificador automático do Cloud Firestore.

Entretanto, documentos que necessitem garantir unicidade funcional poderão utilizar identificadores determinísticos.

Exemplos:

- matrícula do aluno;
- presença por aluno e data;
- configurações únicas do sistema.

Essa estratégia reduz riscos de duplicidade e facilita consultas.

---

# Estratégia de Datas

Todos os documentos deverão utilizar timestamps padronizados.

Campos recomendados:

- createdAt
- updatedAt

Sempre que necessário também poderão existir:

- deletedAt
- lastAccessAt
- lastUpdateAt

Todos os registros deverão utilizar o horário oficial do servidor Firebase.

---

# Índices

A criação de índices compostos deverá ocorrer apenas quando necessária para otimização de consultas.

Não serão criados índices antecipadamente sem demanda comprovada.

Essa abordagem reduz complexidade de manutenção e custos operacionais.

---

# Estratégia de Evolução do Banco

A evolução do Cloud Firestore deverá seguir os seguintes princípios:

- evitar alterações incompatíveis;
- preservar compatibilidade sempre que possível;
- utilizar migrações controladas quando necessárias;
- documentar alterações estruturais relevantes;
- registrar mudanças arquiteturais por meio de ADR quando houver impacto significativo.

A arquitetura do banco deverá evoluir de forma incremental, preservando estabilidade e rastreabilidade durante todo o ciclo de vida do produto.

---

# Arquitetura do Firebase Authentication

O Firebase Authentication será o serviço oficial de gerenciamento de identidade do ADCS Presença.

Sua responsabilidade limita-se exclusivamente ao processo de autenticação dos usuários da aplicação.

Não será utilizado para armazenamento de informações de negócio.

---

# Responsabilidades

O Firebase Authentication será responsável por:

- autenticação dos usuários;
- gerenciamento de credenciais;
- emissão de tokens de acesso;
- recuperação de senha;
- gerenciamento de sessões;
- integração com as Security Rules.

As informações funcionais dos usuários permanecerão armazenadas no Cloud Firestore.

---

# Estratégia de Perfis

A arquitetura prevê suporte aos seguintes perfis:

- Administrador
- Professor
- Coordenador
- Usuários futuros

Os perfis de acesso serão armazenados no Cloud Firestore e utilizados pelas Security Rules para autorização das operações.

---

# Arquitetura do Firebase Storage

O Firebase Storage será o repositório oficial de arquivos do projeto.

Seu objetivo é armazenar arquivos binários de forma segura e escalável.

---

# Tipos de Arquivos

Entre os arquivos previstos estão:

- fotografias de alunos;
- fotografias de professores;
- documentos;
- imagens institucionais;
- anexos administrativos;
- arquivos futuros.

---

# Princípios de Armazenamento

Nenhum arquivo deverá ser armazenado diretamente no Cloud Firestore.

O Cloud Firestore armazenará apenas os metadados necessários, como:

- nome do arquivo;
- caminho;
- URL;
- tipo;
- tamanho;
- data de envio.

---

# Arquitetura do Firebase Hosting

O Firebase Hosting será responsável pela disponibilização da aplicação Web.

Sua responsabilidade inclui:

- hospedagem dos arquivos HTML;
- hospedagem dos arquivos CSS;
- hospedagem dos arquivos JavaScript;
- distribuição por CDN;
- HTTPS automático;
- versionamento das publicações;
- deploy independente por ambiente.

Nenhuma lógica de negócio será executada no Firebase Hosting.

---

# Arquitetura das Security Rules

As Security Rules representam a primeira camada de proteção dos dados da aplicação.

Todas as operações deverão respeitar o princípio do menor privilégio.

---

# Princípios de Segurança

As Security Rules deverão seguir os seguintes princípios:

- negar acesso por padrão;
- liberar apenas operações explicitamente autorizadas;
- separar permissões por perfil;
- impedir acesso entre ambientes;
- validar autenticação antes da autorização;
- minimizar exposição de dados.

---

# Estratégia de Autorização

A autorização será baseada em:

- usuário autenticado;
- perfil do usuário;
- regras específicas da coleção;
- contexto da operação.

As regras poderão evoluir conforme novos módulos forem incorporados ao sistema.

---

# Escalabilidade

A arquitetura foi projetada para crescimento gradual.

O aumento do número de:

- alunos;
- professores;
- registros de presença;
- usuários;
- arquivos;

não deverá exigir alterações estruturais significativas.

A expansão ocorrerá por meio da própria escalabilidade automática dos serviços Firebase.

---

# Backup e Recuperação

Os dados deverão possuir estratégia de backup compatível com cada ambiente.

Diretrizes gerais:

- DEV poderá utilizar dados descartáveis;
- QA utilizará dados de homologação;
- PROD deverá possuir estratégia formal de backup e recuperação.

A definição operacional do processo de backup será documentada em documentação específica de DevOps.

---

# Observabilidade

A plataforma deverá utilizar os mecanismos disponibilizados pelo ecossistema Firebase e Google Cloud para monitoramento operacional.

Sempre que aplicável poderão ser utilizados:

- Firebase Console;
- Google Cloud Logging;
- Google Cloud Monitoring;
- métricas de uso;
- métricas de desempenho;
- relatórios de erros.

---

# Integração com GitHub Actions

A arquitetura foi preparada para integração futura com GitHub Actions.

O processo de automação poderá contemplar:

- validação do código;
- execução de testes;
- build da aplicação;
- deploy automatizado;
- publicação por ambiente;
- versionamento automático;
- geração de releases.

---

# Integração com CI/CD

A estratégia de CI/CD seguirá os princípios definidos pelo ADR-006.

O fluxo esperado será:

```
feature/*
    ↓
develop
    ↓
DEV
    ↓
release/*
    ↓
QA
    ↓
main
    ↓
PROD
```

Cada promoção entre ambientes deverá respeitar os critérios de qualidade estabelecidos pelo processo de Release Management.

---

# Benefícios Esperados

A arquitetura definida nesta ADR proporciona:

- padronização tecnológica;
- baixo custo operacional;
- alta disponibilidade;
- elevada escalabilidade;
- facilidade de manutenção;
- simplicidade arquitetural;
- separação clara de responsabilidades;
- maior segurança;
- facilidade para evolução futura;
- integração com práticas modernas de DevOps.

---

# Consequências

Todas as decisões arquiteturais relacionadas à utilização da plataforma Firebase deverão observar obrigatoriamente esta ADR.

Mudanças significativas na arquitetura somente poderão ocorrer mediante aprovação de um novo Architecture Decision Record.

A adoção de novos serviços Firebase que alterem substancialmente a arquitetura também deverá ser formalizada por meio de ADR.

---

# ADRs Relacionados

- ADR-001 — GitHub Flow Strategy
- ADR-002 — Semantic Versioning Strategy
- ADR-003 — Environment Strategy
- ADR-005 — Release Management
- ADR-006 — CI/CD Strategy

---

# Referências

- Firebase Documentation
  https://firebase.google.com/docs

- Firebase Hosting Documentation
  https://firebase.google.com/docs/hosting

- Cloud Firestore Documentation
  https://firebase.google.com/docs/firestore

- Firebase Authentication Documentation
  https://firebase.google.com/docs/auth

- Firebase Storage Documentation
  https://firebase.google.com/docs/storage

---

# Histórico

| Data | Alteração |
|--------|-----------|
| 27/07/2026 | Criação inicial do ADR-004. |
| 27/07/2026 | Consolidação da arquitetura oficial da plataforma Firebase do ADCS Presença. |
| 27/07/2026 | Publicação da versão definitiva. |