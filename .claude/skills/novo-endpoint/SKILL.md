---
name: novo-endpoint
description: Adiciona um novo recurso de conteúdo à "API" mockada (contrato, dados pt-br/en-us, handler MSW, serviço com httpResource e teste). Use quando uma seção precisar de dados novos vindos da API.
---

# Novo endpoint de conteúdo

Siga as etapas na ordem; cada uma depende da anterior.

1. **Contrato** em `libs/contracts/src/lib/portfolio-content.ts`: crie a interface e adicione o campo em `PortfolioContent`. Datas como `YearMonth` ('yyyy-mm'), nunca strings já formatadas.
2. **Dados** em `libs/mocks/src/data/pt-br.ts` e `en-us.ts`. Os dois precisam estar completos (o TypeScript acusa se faltar campo). O inglês deve ser uma tradução natural, não literal.
3. **Handler** em `libs/mocks/src/handlers.ts`:

       http.get('*/api/<recurso>', async ({ request }) => {
         await delay(LATENCY_MS);
         return HttpResponse.json(contentFor(request).<recurso>);
       }),

4. **Serviço** em `PortfolioContentService` (ou num serviço de data-access do escopo certo):

       readonly <recurso> = httpResource<Tipo>(() => this.request('api/<recurso>'));

   O idioma precisa ser lido dentro da função de request para que a troca de idioma refaça a chamada.
5. **Teste** no spec do serviço com `HttpTestingController`: header `Accept-Language` correto e nova requisição ao trocar o idioma (use `TestBed.tick()`).
6. **Validação**: `npx nx affected -t lint test build`.

Conteúdo nunca vai para os JSON de tradução: lá ficam apenas textos de interface.
