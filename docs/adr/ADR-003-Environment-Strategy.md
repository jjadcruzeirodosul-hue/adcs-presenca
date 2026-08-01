# ADR-003 — Environment Strategy

| Campo | Valor |
|---|---|
| ADR | 003 |
| Título | Environment Strategy |
| Status | Aprovado |
| Data | 27/07/2026 |
| Autor | DevOps Engineer / Release Manager / Configuration Manager |
| Projeto | ADCS Presença |

---

# Contexto

O ADCS Presença utiliza Firebase Hosting, Cloud Firestore e prevê a utilização futura de Firebase Authentication, Storage, App Check e outros serviços da plataforma.

Durante a fase inicial do produto, foi criado apenas um projeto Firebase:

```text
adcs-presenca-jiu-jitsu
```

Esse projeto contém atualmente:

- aplicação Web;
- Firebase Hosting;
- Cloud Firestore;
- coleções `alunos`, `professores` e `presencas`;
- dados utilizados durante o desenvolvimento inicial;
- histórico inicial de deploys.

Com o início oficial das Sprints de desenvolvimento, tornou-se necessário definir uma estratégia de ambientes que permita desenvolver, testar, homologar e publicar o produto de forma segura e rastreável.

---

# Problema

A utilização de um único projeto Firebase para desenvolvimento, homologação e produção apresenta riscos relevantes:

- testes podem alterar dados de produção;
- regras experimentais podem afetar usuários reais;
- falhas de desenvolvimento podem indisponibilizar o sistema;
- autenticação e usuários de teste podem se misturar aos usuários reais;
- não existe isolamento entre dados, configurações e deploys;
- o rollback e a homologação tornam-se menos seguros;
- não é possível identificar claramente qual versão está implantada em cada ambiente.

Era necessário definir uma estratégia que garantisse isolamento, segurança e rastreabilidade.

---

# Alternativas consideradas

## Alternativa A — Projeto Firebase único

Um único projeto Firebase seria utilizado para DEV, QA e PROD.

A diferenciação ocorreria por meio de:

- branches;
- Firebase Hosting Preview Channels;
- coleções ou configurações separadas;
- convenções internas.

### Vantagens

- menor quantidade de projetos;
- configuração inicial mais simples;
- menor esforço administrativo;
- adequada para protótipos temporários.

### Desvantagens

- compartilhamento do mesmo Firestore;
- risco de mistura entre dados de teste e dados reais;
- regras de segurança compartilhadas;
- usuários de autenticação compartilhados;
- menor isolamento operacional;
- maior risco durante testes e deploys;
- recuperação e rollback mais complexos.

---

## Alternativa B — Projeto Firebase independente por ambiente

Cada ambiente possuirá um projeto Firebase próprio.

Estrutura prevista:

```text
ADCS Presença DEV
ADCS Presença QA
ADCS Presença PROD
```

Cada projeto possuirá recursos independentes:

- Firebase Hosting;
- Cloud Firestore;
- Firebase Authentication;
- Firebase Storage;
- Security Rules;
- índices;
- configurações;
- logs;
- métricas;
- usuários;
- dados.

### Vantagens

- isolamento completo entre ambientes;
- testes sem impacto em produção;
- maior segurança;
- homologação controlada;
- deploys independentes;
- melhor rastreabilidade;
- preparação adequada para CI/CD;
- menor risco operacional;
- facilidade para testar regras e migrações.

### Desvantagens

- maior esforço de configuração;
- necessidade de manter configurações sincronizadas;
- necessidade de controlar aliases e credenciais;
- maior quantidade de projetos para administrar.

---

# Decisão

Foi adotada oficialmente a estratégia de **um projeto Firebase independente por ambiente**.

Os ambientes permanentes serão:

```text
DEV
QA
PROD
```

Cada ambiente deverá possuir isolamento completo de:

- Hosting;
- Firestore;
- Authentication;
- Storage;
- regras de segurança;
- índices;
- configurações;
- dados;
- logs;
- credenciais administrativas.

---

# Ambiente DEV

## Objetivo

Ambiente destinado ao desenvolvimento e à integração contínua das funcionalidades da Sprint.

## Características

- poderá receber alterações frequentes;
- poderá conter funcionalidades ainda não homologadas;
- utilizará somente dados fictícios ou controlados;
- poderá receber deploys manuais ou automáticos;
- será associado principalmente à branch `develop`.

## Projeto atual

O projeto Firebase existente será utilizado como ambiente DEV:

```text
Project ID: adcs-presenca-jiu-jitsu
Nome do projeto: ADCS Presença DEV
Alias Firebase CLI: dev
Tipo de ambiente no Firebase Console: Não especificado
```

O nome do projeto deverá ser alterado de `ADCS Presenca Jiu-Jitsu` para `ADCS Presença DEV`, preservando o mesmo Project ID.

O Project ID permanecerá inalterado, pois esse identificador não pode ser renomeado após a criação do projeto.

### Classificação no Firebase Console

Na interface atual do Firebase Console, as classificações disponíveis são:

- `Não especificado`;
- `Produção`.

Como o projeto representa o ambiente de desenvolvimento, ele permanecerá configurado como:

```text
Tipo de ambiente: Não especificado
```

Essa classificação possui finalidade exclusivamente visual no Firebase Console.

Ela não altera o comportamento do Firebase Hosting, Cloud Firestore, Firebase Authentication, Firebase Storage, Security Rules ou qualquer outro serviço da plataforma.

---

# Ambiente QA

## Objetivo

Ambiente destinado aos testes integrados, regressão, homologação e aceite da versão.

## Características

- receberá somente funcionalidades consideradas concluídas;
- utilizará dados de teste controlados;
- será utilizado pelo responsável por Testes e Qualidade;
- será utilizado pelo Product Owner durante a homologação;
- deverá reproduzir, tanto quanto possível, a configuração de produção;
- não deverá receber desenvolvimento experimental.

## Projeto previsto

```text
Nome sugerido: ADCS Presença QA
Project ID sugerido: adcs-presenca-qa
Alias Firebase CLI: qa
```

A disponibilidade do Project ID deverá ser confirmada no momento da criação.

### Classificação no Firebase Console

Como o Firebase Console não oferece uma classificação específica para ambientes de homologação, o projeto QA deverá permanecer configurado como:

```text
Tipo de ambiente: Não especificado
```

Essa classificação possui finalidade exclusivamente visual no Firebase Console.

A identificação oficial do ambiente QA será realizada pelo Project ID, nome do projeto, alias do Firebase CLI e documentação oficial do produto.

---

# Ambiente PROD

## Objetivo

Ambiente oficial utilizado pelos usuários do ADCS Presença.

## Características

- conterá dados reais;
- receberá apenas versões aprovadas;
- será protegido contra alterações não autorizadas;
- deploy somente após homologação;
- exigirá checklist de release;
- exigirá plano de rollback;
- será associado à branch `main`.

## Projeto previsto

```text
Nome sugerido: ADCS Presença PROD
Project ID sugerido: adcs-presenca-prod
Alias Firebase CLI: prod
```

A disponibilidade do Project ID deverá ser confirmada no momento da criação.

### Classificação no Firebase Console

O projeto PROD deverá ser configurado no Firebase Console como:

```text
Tipo de ambiente: Produção
```

Essa classificação possui finalidade exclusivamente visual no Firebase Console, facilitando a identificação do ambiente de produção.

Ela não altera o comportamento do Firebase Hosting, Cloud Firestore, Firebase Authentication, Firebase Storage, Security Rules ou qualquer outro serviço da plataforma.

Ela não substitui a identificação oficial do ambiente, que continuará sendo realizada pelo Project ID, nome do projeto, alias do Firebase CLI e documentação oficial do produto.

---

# Matriz dos ambientes

| Item | DEV | QA | PROD |
|---|---|---|---|
| Finalidade | Desenvolvimento | Testes e homologação | Uso real |
| Branch principal | `develop` | `release/*` | `main` |
| Dados | Fictícios/controlados | Fictícios/homologação | Reais |
| Deploy | Frequente | Controlado | Aprovado |
| Estabilidade | Variável | Candidata a release | Estável |
| Acesso | Equipe técnica | QA e Product Owner | Usuários autorizados |
| Rollback formal | Recomendado | Recomendado | Obrigatório |
| Evidência de deploy | Recomendável | Obrigatória | Obrigatória |

---

# Firebase CLI e aliases

O repositório utilizará aliases para selecionar explicitamente o projeto de destino.

Aliases oficiais:

```text
dev
qa
prod
```

Estrutura esperada no arquivo `.firebaserc`:

```json
{
  "projects": {
    "dev": "adcs-presenca-jiu-jitsu",
    "qa": "adcs-presenca-qa",
    "prod": "adcs-presenca-prod"
  }
}
```

Os aliases `qa` e `prod` somente deverão ser adicionados após a criação efetiva dos respectivos projetos.

Nenhum alias poderá apontar para um projeto inexistente ou incorreto.

---

# Identificação oficial dos ambientes

Cada ambiente do ADCS Presença será identificado oficialmente pela combinação dos seguintes elementos:

- Project ID do Firebase;
- nome do projeto no Firebase Console;
- alias configurado no Firebase CLI;
- documentação oficial do produto (Product Office).

A classificação exibida no Firebase Console ("Não especificado" ou "Produção") possui finalidade exclusivamente visual e não deve ser utilizada como identificação oficial do ambiente.

A tabela abaixo resume essa padronização:

| Ambiente | Project ID | Nome do projeto | Alias CLI | Classificação no Firebase Console |
|----------|------------|-----------------|-----------|-----------------------------------|
| DEV | `adcs-presenca-jiu-jitsu` | ADCS Presença DEV | `dev` | Não especificado |
| QA | `adcs-presenca-qa` | ADCS Presença QA | `qa` | Não especificado |
| PROD | `adcs-presenca-prod` | ADCS Presença PROD | `prod` | Produção |

---

# Promoção entre ambientes

O fluxo oficial será:

```text
Desenvolvimento
      ↓
DEV
      ↓
Testes técnicos
      ↓
Preparação da release
      ↓
QA
      ↓
Homologação
      ↓
Aprovação
      ↓
PROD
```

A promoção ocorrerá por meio da publicação da mesma versão controlada, e não por cópia manual de arquivos alterados.

---

# Princípio de build único

Quando o projeto possuir processo formal de build, a versão homologada em QA deverá ser a mesma promovida para PROD.

Não deverá existir reconstrução ou alteração funcional entre a homologação e a publicação em produção.

Objetivo:

```text
Build once, promote the same artifact
```

Enquanto a aplicação permanecer estática e sem etapa formal de compilação, o mesmo commit e a mesma tag deverão ser utilizados para QA e PROD.

---

# Preview Channels

Firebase Hosting Preview Channels poderão ser utilizados para:

- validação visual;
- revisão de Pull Requests;
- testes temporários;
- demonstração de funcionalidades.

Preview Channels não substituem o ambiente QA permanente.

Eles não deverão utilizar dados reais de produção.

---

# Dados entre ambientes

Não será realizada sincronização automática de dados reais de PROD para DEV ou QA.

Quando dados de produção forem necessários para diagnóstico:

- deverão ser anonimizados;
- deverão ser reduzidos ao mínimo necessário;
- deverão ser aprovados;
- não poderão expor dados pessoais;
- não deverão ser mantidos além do período necessário.

---

# Configuração e segredos

Cada ambiente deverá possuir suas próprias configurações.

Credenciais administrativas, tokens e segredos:

- não poderão ser versionados no Git;
- não poderão ser incluídos em documentação;
- deverão ser armazenados em mecanismos seguros;
- deverão respeitar o princípio do menor privilégio.

As configurações públicas do Firebase Web SDK não devem ser tratadas como substitutas das Security Rules. A proteção dos dados dependerá das regras e dos controles de acesso configurados.

---

# Regras e índices

As regras do Firestore, Storage e os índices deverão ser versionados no repositório.

A promoção deverá seguir a ordem:

```text
DEV
 ↓
QA
 ↓
PROD
```

Alterações de regras ou índices deverão ser testadas antes da implantação em PROD.

---

# Critérios de promoção DEV → QA

Uma versão somente poderá ser promovida para QA quando:

- o desenvolvimento estiver concluído;
- os critérios de aceite técnicos tiverem sido atendidos;
- os testes locais e em DEV tiverem sido executados;
- não houver erros bloqueadores conhecidos;
- a documentação impactada estiver atualizada;
- a versão candidata estiver identificada;
- o responsável técnico liberar a promoção.

---

# Critérios de promoção QA → PROD

Uma versão somente poderá ser promovida para PROD quando:

- a homologação em QA estiver concluída;
- os testes de regressão aplicáveis tiverem sido aprovados;
- não existirem defeitos críticos ou bloqueadores;
- o Product Owner tiver aprovado a entrega;
- o checklist de release estiver concluído;
- o plano de rollback estiver definido;
- as Release Notes estiverem preparadas;
- a versão e o commit estiverem identificados;
- o Product Office estiver atualizado ou preparado para atualização final.

---

# Rollback

Cada ambiente deverá permitir o retorno para a última versão estável conhecida.

Em PROD, o rollback deverá utilizar:

- versão anterior identificada;
- commit ou tag correspondente;
- histórico de deploy;
- procedimento documentado;
- registro da ocorrência.

Rollback de Hosting não implica automaticamente rollback de dados ou estrutura do Firestore.

Alterações de dados deverão possuir estratégia específica de recuperação ou migração reversível.

---

# Benefícios esperados

- segurança operacional;
- isolamento de dados;
- homologação confiável;
- redução de risco;
- maior controle de configuração;
- preparação para automação;
- rastreabilidade das versões;
- operação profissional do produto.

---

# Consequências

A adoção desta estratégia exige:

- criação e manutenção de três projetos Firebase;
- configuração de aliases;
- controle de acesso independente;
- replicação controlada de regras e índices;
- dados de teste para DEV e QA;
- documentação de cada ambiente;
- disciplina no processo de promoção.

Nenhuma funcionalidade deverá depender de recursos existentes em apenas um ambiente sem que essa diferença esteja formalmente documentada.

---

# Implementação gradual

A implantação desta estratégia ocorrerá de forma incremental, seguindo a ordem abaixo:

1. reclassificar e renomear o projeto Firebase atual como ambiente DEV;
2. criar e configurar o projeto Firebase do ambiente QA;
3. criar e configurar o projeto Firebase do ambiente PROD;
4. configurar os aliases oficiais (`dev`, `qa` e `prod`) no Firebase CLI;
5. validar o fluxo de deploy independente para cada ambiente;
6. revisar e publicar as Security Rules e índices em todos os ambientes;
7. documentar oficialmente a estratégia no Product Office;
8. implantar o fluxo de promoção entre ambientes;
9. preparar a automação futura por GitHub Actions e CI/CD.

Nenhum deploy em PROD deverá ocorrer antes que o ambiente esteja criado, validado, documentado e aprovado.

---

# ADRs relacionados

- ADR-001 — GitHub Flow Strategy
- ADR-002 — Semantic Versioning Strategy
- ADR-004 — Firebase Architecture
- ADR-005 — Release Management
- ADR-006 — CI/CD Strategy

---

# Histórico

| Data       | Alteração                                                                                                                                                              |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 27/07/2026 | Criação inicial do ADR-003.                                                                                                                                            |
| 27/07/2026 | Revisão arquitetural completa, definição da estratégia de ambientes DEV/QA/PROD, padronização da identificação oficial dos ambientes e aprovação da versão definitiva. |
