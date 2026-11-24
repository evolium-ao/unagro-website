# UNAGRO

## Pontos de Reajustes

| # | Ponto | Estado Atual | Acao/Correcao | Estado |
| --- | :--- | :--- | :--- | --- |
| 1 | Indicadores | Indicadores Globais, de Projetos e de outras sao Estaticos | Os indicadores globais, de projetos e de outras Entidades devem ser dinamicos vindo da `api` e cadastradas no `backoffice` e exibidos conforme a `page` renderizada | ``Pendente`` |
| 2 | Partilha | Recurso de Partilha Customizada | O Recurso de Partilha deve ser Nativo | Resolvido |
| 3 | Partilha em Card | Os botoes de partilha aparecem nos `cards` de noticias (tambem oscilam na exibicao) | Remover os botoes de partilha nos `cards`, manter apenas na `page` de leitura | Cancelado |
| 4 | Detalhes de Evento | Eventos nao sao exibidos na totalidade e nao possuem pagina de setalhes | `Decidir`: (a) Exibir os detalhes no `card` de Evento, (b) Exibir detalhes do num `modal` e (c) Exibir os detalhes numa `page` | `Decidir` |
| 5 | Botao Modal Sucesso | O botao de fechar o modal de Sucesso em Inscrever-se em Eventos so aparece por `:hover` | Corrigir erro de `UI/UX` | Resolvido |
| 6 | Diferentes Feedbacks | Existem diferentes feedbacks no projeto como: ao Inscrever-se a um evento (`modal`), enviar `form` de contato (texto), Candidatar-se a Estudante e Docente | Uniformizar os Feedbacks  | Resolvido |
| 7 | Eventos Passados | A `api` tras eventos com datas passadas | `api`: Filtrar os Eventos de modos a listar apenas os Eventos por se realizar, nao os que ja foram realizados (os que a data eh passada) | `Pendente` |
| 8 | `select` do Evento/Curso na Inscricao | Ao se inscrever num evento o user pode alternar de Evento/Curso por meio de um `select` | Julgo desnecessario e potencialmente motivo de erro humano. <br> Remover o `select` de Evento/Curso no `modal` uma vez que o `modal` so eh exibido apos um `click` no botao inscrever-se dentro de um `card` de Evento/Curso | Resolvido |
| 9 | Inscricoes duplicadas | A `api` tolera Inscricoes do mesmo evento com os mesmos dados (email, tel, etc) | `api`: Verificar a existencia de Inscricao por email e retornar aviso ao Usuario caso ja estiver Inscrito | `Pendente` |
| 10 | Noticias em Destaque | Hoje, as noticias sao exibidas em 3 tipo de `cards`, a qual um serve para as noticias em Destaque, porem, mesmo que uma noticia nao estaja em destaque ela eh exbida no `card` de noticia em destaque | Substituir o card de noticia em destaque por outra variacao de `card` de noticia se nao haver noticias em destaque | Resolvido |
| 11 | Noticas em Destaques em primeiro | As noticias em destaques sao exibidas na primeira paginacao mesmo em variacoes de `card` de noticia nao aplicaveis em noticias em destaque | `Decidir`: exibir 1 noticia em destaque (a) por paginacao ou (b) por slide | `Decidir` |
| 12 | `modal` do Evento em Destaque | Atualmente o Evento em destaque possui um botao que apenas leva para a `page` de Eventos | Exbir detalhes do evento em destaque num `modal` com possibilidade de se inscrever | Resolvido |
| 13 | Noticias Estudantis: mock data | A `page` de Estudantes renderiza `cards` de noticias a partir de `mock data` | Renderizar Noticias com atributo `tipo_noticia`: `estudantil`  | Resolvido |
| 14 | Notas Informativas: mock data | O site disponibiliza, na `page` de Estudantes, um seccao de Notas informativas de interesse dos Estudantes, porem a partir de `mock data` | `Decidir`: (a) Alimentar com Noticias com atributo `tipo_noticia`: `nota_informativa` ou (b) alimentar com uma nova Entidade `Notas Informativas` | `Decidir` |
| 15 | Pagina de Noticias | Hoje, o website nao possui uma pagina dedicada a listagem de Noticas |`Decidir`: (a) manter as Noticias como seccao de `pages` como `HomeComponent`, `InscricaoComponent` e outros ou (b) desenhar uma `page` especifica para listagem de todas as Noticias, podendo segmentar entre Noticias Estudantis e Gerais | `Decidir` |
| 16 | `form` multistep ficticio | O `form` de Candidatura de Estudante aparenta ser multistep, porem nao existe as outras Etapas | (a) remover os indicadores de multistep ou (b) tornar o `form`, de fato, multistep | `Decidir` |
| 17 | Documento ficticio | Na `page` de Candidatura a Estudantes e Docente existe um botao secundario no `banner` para `download` de um documento, porem sem o doc. atrelado | `Decidir`: (a) Elaborar uma Brochura para `download` ou (b) remover o botao secundario | `Decidir` |
| 18 | Opcao Todos em `selects` | Os `selects` na seccao Oferta Academica em Mais Informacoes na aba Candidaturas nao sao reversiveis para Todas opcoes (sem filtro) | Tornar Possivel Voltar a opcao todas opcoes | Resolvido |
| 19 | Calendario Academico Estatico | Hoje, a seccao de Calendario Academico eh Estatico por `mock data` | `api`: O calendario academico deve ser dinamico vindo da `api` e cadastrado no `backoffice` | `Pendente` |
| 20 | Continuar Candidatura | Continuar Candidatura nao Funcional | `Decidir`: (a) Tornar funcional o fluxo de Continuacao de Candidatura ou (b) remover o gatilho para esse fluxo (inexistente) | `Decidir` |
| 21 | Consultar Estado de Candidatura | Consultar Estado de Candidatura nao Funcional | `api`: Possibilitar a consulta de Estado de Candidura | `Pendente` |
| 22 | Recuperar Codigo de Acesso | Recuperar Codigo de Acesso nao Funcional | Remover, julgo desnecessario | Resolvido |
| 23 | Seccao Próximas Datas | Atualmenete os dados da seccao Próximas Datas veem a partir de `mock data` | `api`: Os itens da seccao Proximas Datas devem ser dinamicos vindo da api e cadastrados no backoffice | `Pendente` |
| 24 | `modal` a seccao Proximas Datas | Hoje, a seccao Proximas Datas nao possui uma continuacao de fluxo para o gatilho nos seus `card` | `Decidir`, `api`: (a) Os itens da seccao Proximas Datas devem ser exibidos em um `modal` ou (b) remover esta seccao | `Decidir` |
| 25 | Baixar e Validar Certificado | Os botoes de Baixar e Validar Certificados na seccao Já concluiu seu curso? nao sao funcionais | `Decidir`: (a) criar um fluxo para baixar o certificado ou (b) remover esta seccao | Decidido:b |
| 26 | Projectos Inovadores: `mock data` | O projeto ainda possui `mock data` na seccao Projectos Inovadores na `page` HUB UNAGRO | A seccao eh alimentada por pojetos, portanto podera consumir projetos com atributo `inovador`: `true` | `Pendente` |
| 27 | Botao Apoiar Projeto | Hoje o botao Apoiar Projeto se encontra sem funcionamento | Atrelar a um link com a logica de `/projetos/1#formulario-interesse | Resolvido |
| 28 | Acompanhar Projectos: Erro de UI | Fundo irregular branco abaixo do `input[type="email"]` | Remover o fundo branco e certificar da uniformidade desta seccao com o restante design | Resolvido |
| 29 | Acompanhar Projectos | Newsletter Acompanhar Projetos nao funcional | `Decidir`, `api`: (a) desenvolver recursos necessarios para a funcionalidade desta seccao ou (b) remover esta seccao | `Decidir` |
| 30 | Selecionar Laboratorio no Agendamento de Visita | Seguindo uma logica volatil existente no projeto eh necessario selecionar o laboratorio ao agendar uma visita | Remover a listagem de laboratorios e passar o id de outra forma, ex.: ao clicar no botao nos `cards` de Laboratorios | Resolvido |
| 31 | Agendamento no mesmo horario e/ou mesmos dados | Hoje o agendamento de visita a laboratorios pode ser feita no mesmo laboratorio ou diferentes, no mesmo horario ou diferentes com os mesmo dados | `Decidir`, `api`: criar uma logica de negocio para agendamento de labotorios com suas restricoes | `Decidir` |
| 32 | Sem email de confirmacao no agendamento | Hoje, o usuario apenas recebe um feedback dentro do website a confirmar sucesso no seu agendamento a visita de laboratorios | `api`: Julgo necessario enviar um email de confirmacao sendo que trata-se de uma visita | `Pendente` |
| 33 | CTA com gatilho inativo | Na `page` Desenvolvimento, na seccao Linhas de Investigação Estratégica ha um CTA com o titulo Impacto Ambiental & Sustentabilidade com botao Ver Agenda 2030 inativo  | Corrigir a visibilidade do botao e liga-lo a pagina Eventos com/sem algum filtro (ano ou tema) | Resolvido |
| 34 | Indicadores: `mock data` | Na pagina Desenvolvimento ha a seccao Impacto em Números com indicadores alimentados por `mock data` | `api`: os indicadores devem ser dinamicos vindo da `api` e cadastradas no `backoffice` | `Pendente` |
| 35 | Botao filtro inativo | Na `page` Desenvolvimento, na seccao de Listagem de Publicações Recentes ha um filtro inativo | Abrir modal para filtro com `datas`, `lingua`, `projeto` e etc | Resolvido |

## Ponto de Situacao

### Fluxos e Modulos

#### Modulo de Desenho de Interface

100% Concluido relativamente ao `figma`.
- O `figma` nao contem certos fluxos/modulos como por exemlo: Cadastro, Login, Dashboards, etc.

#### BackOffice para Gestao de Informacoes

Hoje, o projeto UNAGRO nao possui um backoffice para gestao das informacoes a serem exibidas e as informacoes coletadas nos formularios, como Contato em Projetos, Candidaturas, etc.
