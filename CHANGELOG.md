# 1.0.0 (2025-11-08)


### Bug Fixes

* adiciona extensões de arquivo explícitas a imports ([c2b4977](https://github.com/arthreis/myfinances-api/commit/c2b49771b46b8303d07babeb3a96d5819567ca30))
* **api:** corrige busca de dados na rota /transactions ([c076087](https://github.com/arthreis/myfinances-api/commit/c0760877b41369e76a1bf0602c64e8c1e82d3180))
* corrigir import do app no server para caminho relativo ([74fee64](https://github.com/arthreis/myfinances-api/commit/74fee641bae1e8b1e60e2372552e08a59d56990d))
* corrigir problema de inferência de tipo no TypeORM ([d00c167](https://github.com/arthreis/myfinances-api/commit/d00c1673e98369cd6f43e3eb742aed5356cb6524))
* **date:** incompatibilidade com data salva no banco (semtimezone) e node(brt), agora é usado UTC ([78686b9](https://github.com/arthreis/myfinances-api/commit/78686b986d35702f3dc2e46e969c0202f66ef7d2))
* **typeorm:** usa Relation nas entidades para corrigir ([269d129](https://github.com/arthreis/myfinances-api/commit/269d129295b5b22464b29ad8e14784b800ff5d7c))


### Features

* adiciona endpoint /metrics para o prometheus ([74a1ba1](https://github.com/arthreis/myfinances-api/commit/74a1ba16a8f6f3f50f028366ef48ddfa0dbb5abb))
* adiciona GitHub Actions para CI/CD e inclusao do ambiente no log de inicio do app ([80de934](https://github.com/arthreis/myfinances-api/commit/80de934966eb127f0392694d6f04e99cae10c983))
* **api:** adiciona rota raiz '/' e '/healthcheck' ([a190eb4](https://github.com/arthreis/myfinances-api/commit/a190eb424493c597c54b9826749bd09663ed8393))
* **config:** adiciona validacao para variaveis obrigatorias no .env ([fbf3802](https://github.com/arthreis/myfinances-api/commit/fbf38025ecc5887fff21676cbc7e17a7ce56d262))
* parametriza o inicio da semana para exibir no grafico semanal ([5b11eb6](https://github.com/arthreis/myfinances-api/commit/5b11eb604a78e857360063a253ba5feb44aff212))
* reduz as cores light e dark de categoria em apenas uma ([bf4e01d](https://github.com/arthreis/myfinances-api/commit/bf4e01d265ebd3cb3e2e649d31be682a49b3d28f))
* **tests:** configura globalsetup/teardown do jest e melhora carregamento de variáveis de ambiente ([7af260e](https://github.com/arthreis/myfinances-api/commit/7af260ead7575d5acd37e481018b18641a2e4d36))
