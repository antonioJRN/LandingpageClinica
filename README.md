# Clínica Sorrir Mais · Macaúbas, BA

Landing page da Clínica Sorrir Mais, feita com o engine [scroll-craft](https://github.com/nateherkai/scroll-craft) (licença MIT, em `docs/SCROLLCRAFT-LICENSE`).

## O que tem na página

- **Herói:** um dente em camadas sobre a pedra Azul Macaúbas, com o "+" da marca. O dente reage ao mouse.
- **O dente se abre (o momento principal):** ao rolar a página, o dente se separa em esmalte, dentina, polpa e raiz, e cada camada explica o que a clínica trata.
- **Navegação em forma de sorriso:** os 9 dentes do topo são os links das seções e ficam brancos conforme você avança.
- **Tratamentos:** um trilho lateral com 10 ilustrações. O botão "Quero esse" já coloca o tratamento na mensagem.
- **Antes e depois:** dois casos reais do Instagram, com arraste para comparar.
- **Equipe:** os três dentistas, com o CRO de cada um.
- **Onde estamos:** a foto da fachada, os horários, a rota no Maps e o Instagram.
- **Marcar:** a pessoa monta a mensagem (nome, tratamento, período) e o WhatsApp abre com tudo escrito.

## Como editar

Os dados ficam no topo do arquivo `site.js`, no bloco `CONFIG`:

| Campo | Para que serve |
|---|---|
| `whatsapp` | Número com país e DDD, só dígitos (hoje: `5577999994451`) |
| `instagram`, `rota` | Links do perfil e do Google Maps |
| `endereco` | Rua e número, se quiser mostrar o endereço escrito |
| `horarios` | Lista de pares `["Dia", "Horário"]` |
| `responsavel` | Responsável técnico e CRO (o CFO exige isso em anúncios) |

As fotos ficam em `assets/fotos/`. Para trocar uma, mantenha o mesmo nome de arquivo ou ajuste o caminho no `index.html`. Os casos de antes e depois ficam na lista `CASOS`, dentro do `site.js`.

## Rodar no computador

```bash
python3 -m http.server 4500
# abra http://localhost:4500
```

## Publicar grátis (GitHub Pages)

Em Settings > Pages, escolha "Deploy from a branch", depois a branch e a pasta `/ (root)`.

## Observações

- As fotos foram recortadas de capturas de tela do Instagram, então a resolução é baixa. Fotos originais em alta deixam o site bem melhor.
- Antes e depois em anúncio de odontologia exige autorização do paciente (Resolução CFO 196/2019). Confirme que há termo assinado para os dois casos.
- O planejamento criativo (brief, curva de emoção, estrutura) está em `docs/BRIEF.md`.
