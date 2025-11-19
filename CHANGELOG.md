# [1.4.0](https://github.com/nmoreno-dev/gestion-barrena/compare/v1.3.0...v1.4.0) (2025-11-19)

### Bug Fixes

- comment out Web Worker and chunkSize options in PapaParse config due to typing issues ([d4bc176](https://github.com/nmoreno-dev/gestion-barrena/commit/d4bc1760aa47e508cb64c714215ff8614cc5d650))
- replace store operation with transaction handling in batch update function ([8ffa1ba](https://github.com/nmoreno-dev/gestion-barrena/commit/8ffa1bad4cc67b0ac4b9af995ecf0def76698a45))
- update development API URL and port in configuration files ([98cf9a2](https://github.com/nmoreno-dev/gestion-barrena/commit/98cf9a29243cc80d093ad53620c4ba39599b3fee))

### Features

- add useCsvEnrichment hook for debtor enrichment and integrate with useCsvParser ([9c9b9c9](https://github.com/nmoreno-dev/gestion-barrena/commit/9c9b9c959bc286ec3033d6adc58f5a236b5f810a))
- enhance CsvLoadingModal and useCsvParser for improved ([f9fb08f](https://github.com/nmoreno-dev/gestion-barrena/commit/f9fb08f47b42c7a8f8a9e22dc13ab31f1ce0f0f0))
- enhance GestionModal with unique ID generation and improved state management ([2ada7ea](https://github.com/nmoreno-dev/gestion-barrena/commit/2ada7ea780d507020386f0fdb6a8761cb8e54b08))
- implement batch update for debtors in collection and add manual sync functionality ([2ac19b3](https://github.com/nmoreno-dev/gestion-barrena/commit/2ac19b3d099eb288f1cbb0504a43a71a5a3b1366))
- implement gestion management features including CRUD operations and UI components ([604a448](https://github.com/nmoreno-dev/gestion-barrena/commit/604a4486f62587942631e3ae214fe80436056b27))
- refactor CSV parsing logic and validation ([3026124](https://github.com/nmoreno-dev/gestion-barrena/commit/3026124077a9ce13215062fb7e8ff2522e541bf0))

# [1.3.0](https://github.com/nmoreno-dev/gestion-barrena/compare/v1.2.0...v1.3.0) (2025-10-24)

### Bug Fixes

- enhance DeudoresTabs with RGB color mapping for improved styling ([16fb1a6](https://github.com/nmoreno-dev/gestion-barrena/commit/16fb1a67850af1a0eeff31b1d563930c7a364798))
- improve DeudoresTabs styling and button interactions ([3b123e0](https://github.com/nmoreno-dev/gestion-barrena/commit/3b123e0712e7bf61339a5419c2371644136e77ad))
- update footer to include a link for the author ([85d659e](https://github.com/nmoreno-dev/gestion-barrena/commit/85d659e3b50ddf812ace9295e36279fc76d58c23))
- update storage references to use STORES.DEUDORES_DATA in deudoresApi ([680bad6](https://github.com/nmoreno-dev/gestion-barrena/commit/680bad62bac995125420d4d97a7c61c25e70c16b))

### Features

- add color management to collections with ColorPickerModal and update functionality ([0f57648](https://github.com/nmoreno-dev/gestion-barrena/commit/0f576484640a1ced0d287d285143fc85c048d3d4))
- add Deudores route and page for managing debtor information ([4daf5ee](https://github.com/nmoreno-dev/gestion-barrena/commit/4daf5ee85859726483036355ee8544d2ce5984d6))
- add DeudoresTabs component and integrate it into DeudoresPage ([3714153](https://github.com/nmoreno-dev/gestion-barrena/commit/3714153dc8aacbc3f82aca3bfde00652188a3411))
- add error logging and new index operation helper for Deudores collections ([e51283b](https://github.com/nmoreno-dev/gestion-barrena/commit/e51283b880f8505aa8971fdd4de030cca423d622))
- enhance DeudoresTabs and DeudoresPage with improved tab editing and deletion handling ([816813d](https://github.com/nmoreno-dev/gestion-barrena/commit/816813d4f29eb850ba920d440f429448f0c3a2b5))
- enhance DeudoresTabs with editing and deletion functionality ([5e005b5](https://github.com/nmoreno-dev/gestion-barrena/commit/5e005b546ff6c8bb27bd0ac93bba9e0c037eddf4))
- implement CollectionTable component and integrate it into DeudoresPage ([10e92b8](https://github.com/nmoreno-dev/gestion-barrena/commit/10e92b8cd278330229fee3e50a41bf86fcfe99d5))
- implement CRUD operations for Deudores with IndexedDB integration ([cf91007](https://github.com/nmoreno-dev/gestion-barrena/commit/cf91007c417025db9b93a5c3f115946a175a64b4))
- optimize IndexedDB schema with auto increment IDs and compressed fields for Deudores ([5cbfad2](https://github.com/nmoreno-dev/gestion-barrena/commit/5cbfad28f853bfd11da01a8fe9c4a16ed0f320ed))
- refactor plantilla selection to support multiple collections in DeudoresPage ([d7a34b2](https://github.com/nmoreno-dev/gestion-barrena/commit/d7a34b29c1b7e78dec8ccba510a92e5c3848d9fb))
- update DeudoresTabs to include Sheet icon and adjust button padding ([62982e1](https://github.com/nmoreno-dev/gestion-barrena/commit/62982e1106e5c708adf95ade1f505d30b5ff0ac1))
- update IndexedDB schema and implement collections management for Deudores ([b50013a](https://github.com/nmoreno-dev/gestion-barrena/commit/b50013ae572439fab50a7748f145bb4071058257))

# [1.2.0](https://github.com/nmoreno-dev/gestion-barrena/compare/v1.1.0...v1.2.0) (2025-10-23)

### Features

- add background and text color classes to body for improved styling ([710e3a1](https://github.com/nmoreno-dev/gestion-barrena/commit/710e3a1779a7351d42a0852b14b7cf418ef456c4))
- implement PlantillaForm and PlantillaPreview components ([c3f49ee](https://github.com/nmoreno-dev/gestion-barrena/commit/c3f49ee4420063f2250431066fe34ef4671c818f))
- remove sync step for main to testing in release workflow ([6c627a5](https://github.com/nmoreno-dev/gestion-barrena/commit/6c627a555a806727c2481909477a31bc3556b5a8))

# [1.1.0](https://github.com/nmoreno-dev/gestion-barrena/compare/v1.0.0...v1.1.0) (2025-10-22)

### Bug Fixes

- ensure sidebar navigation menu takes full width ([91ffc0e](https://github.com/nmoreno-dev/gestion-barrena/commit/91ffc0e3a64fbcd1f3c6b19169755230f108272c))
- update imports to reflect feature renaming from dataLoading to deudores ([03b6de8](https://github.com/nmoreno-dev/gestion-barrena/commit/03b6de8606dac42b3d6b1d187c7ff7c67e5bfac7))
- update start script path to use .dist directory ([d91c47d](https://github.com/nmoreno-dev/gestion-barrena/commit/d91c47df39fab83deb556f23d123dda90db84b9a))

### Features

- add Button CancelButton SubmitButton SelectField and TextField components with styling ([e1d311f](https://github.com/nmoreno-dev/gestion-barrena/commit/e1d311fadd4a25ee91cb821cad8e56ebb7bebce3))
- add class-variance-authority dependency to package.json and package-lock.json ([86f8866](https://github.com/nmoreno-dev/gestion-barrena/commit/86f8866d8d94b8a9c148b2cbe85eb4d602e298e0))
- add duplicate functionality for plantillas, implement slug-based editing route ([839e55d](https://github.com/nmoreno-dev/gestion-barrena/commit/839e55d37f766f9ed64cdedeea77897cfcf27871))
- add export for useCsvParser hook ([46da4ea](https://github.com/nmoreno-dev/gestion-barrena/commit/46da4eaa6d3b6d1922e8fe31863d2fe670f5c7da))
- add Header, Layout, and Sidebar components with sidebar functionality ([f1ea21a](https://github.com/nmoreno-dev/gestion-barrena/commit/f1ea21a4c2618335818e0631f5324bcef1d0180a))
- add PlantillaPreview component and integrate it into PlantillaForm for real-time preview ([ecdb903](https://github.com/nmoreno-dev/gestion-barrena/commit/ecdb9038c50685d14e2bd9a41417862402fd970a))
- enhance plantilla functionality with subject and BCC fields, update processing logic ([3868a4d](https://github.com/nmoreno-dev/gestion-barrena/commit/3868a4de575efffe7c2cffdb91a7002904c405cc))
- enhance plantilla selection logic in deudores feature, auto-select first plantilla on load ([b2dc342](https://github.com/nmoreno-dev/gestion-barrena/commit/b2dc34293626a0c78a4bc128743340cbe76ec62f))
- enhance PlantillaPreview with HTML sanitization and improved styling for preview content ([f98d864](https://github.com/nmoreno-dev/gestion-barrena/commit/f98d8645bffadd8f96208a29c70d116354610f97))
- implement centralized IndexedDB management and refactor plantillas API ([892805e](https://github.com/nmoreno-dev/gestion-barrena/commit/892805ef464eb069ae2ef00e76c7b5deda1d43da))
- implement Plantillas API with CRUD operations and template processing utilities ([d30570a](https://github.com/nmoreno-dev/gestion-barrena/commit/d30570a21e1c568fbaba1792fc07faa162b8ff66))
- implement Plantillas feature with sidebar navigation and routing ([a3643cd](https://github.com/nmoreno-dev/gestion-barrena/commit/a3643cd1c6b0454921c9c76d0686a40489beb5c4))
- integrate plantilla functionality into deudores feature, ([3c2109f](https://github.com/nmoreno-dev/gestion-barrena/commit/3c2109fd538f0c3686d4d8e186534afe6ef9fbe4))
- integrate PlantillasAccordion into PlantillaForm and update navigation ([3df10ad](https://github.com/nmoreno-dev/gestion-barrena/commit/3df10ad7b3bc43b70cceee77239700d49ab30abe))
- migrate to vite 7 ([7294385](https://github.com/nmoreno-dev/gestion-barrena/commit/7294385194c816d0a8fde248913e62a92478fb6f))
- plantillas components and routing ([41e8c24](https://github.com/nmoreno-dev/gestion-barrena/commit/41e8c24501c7bfafe0fa9def58d88e5df6ca0d4e))
- refactor plantilla components to use database queries, improve loading and error handling ([72d5b31](https://github.com/nmoreno-dev/gestion-barrena/commit/72d5b31f97fcca662bd337afd609e48e6d5f1188))
- remove preview functionality from Plantillas and PlantillasList components ([3656c55](https://github.com/nmoreno-dev/gestion-barrena/commit/3656c55ab36028ef848d4ce20ccf9886ac09770f))
- streamline email sending and message copying in TablaDeudores, remove createMessage utility ([83762f4](https://github.com/nmoreno-dev/gestion-barrena/commit/83762f4dbfd3373317ce851661a31f9b7d0fc2fb))
- update package.json scripts and dependencies, add serve for production start ([15ec234](https://github.com/nmoreno-dev/gestion-barrena/commit/15ec234c6686fd1f0aa63d0d396e96b6c2a92b82))

# 1.0.0 (2025-10-21)

### Bug Fixes

- add extra line break in banking details section of message template ([f97737f](https://github.com/nmoreno-dev/gestion-barrena/commit/f97737f30dc38a57e1976d46cc24b1cbc9db8d31))
- correct typo in message template for cancellation amount ([5819263](https://github.com/nmoreno-dev/gestion-barrena/commit/5819263ca1d298b8d50fd643f6f90a315a4e2ed0))
- lock vulnerabilities ([5ef1377](https://github.com/nmoreno-dev/gestion-barrena/commit/5ef13778040b67301f4e3dc56a4b9c5450ab7b9c))
- remove redundant 'cuit' label from debtor message template ([d1162d9](https://github.com/nmoreno-dev/gestion-barrena/commit/d1162d90ceec153d34099f0b52977de94ae7f0d9))
- update paths in tsconfig.json for shared and utils directories ([a4b29a9](https://github.com/nmoreno-dev/gestion-barrena/commit/a4b29a9732c070b4674899f170b3c767af3a4ee8))

### Features

- add clipboard message copying and toast notifications for debtor actions ([f292ef4](https://github.com/nmoreno-dev/gestion-barrena/commit/f292ef418481bf2c8c574c77d69e66b6f679e976))
- add generic table component with examples and csv loader ([c7d4411](https://github.com/nmoreno-dev/gestion-barrena/commit/c7d441156c82c86055cbdcea287a36183ebce69f))
- add paginationSize prop and enhance pagination controls in Table component ([c699418](https://github.com/nmoreno-dev/gestion-barrena/commit/c699418732f9b3439ce71ccac90b6573a9698ad8))
- enable filtering, pagination, and sorting in TablaDeudores table ([4745a64](https://github.com/nmoreno-dev/gestion-barrena/commit/4745a6480feda085b65096ec411e62f41682bf82))
- enhance clipboard functionality and add email sending capability for debtor actions ([bdd2b6a](https://github.com/nmoreno-dev/gestion-barrena/commit/bdd2b6a12645067a7bbc6fdbdb03e787435f0dba))
- format CUIL in message template for improved readability ([0efb01f](https://github.com/nmoreno-dev/gestion-barrena/commit/0efb01fa322172010fbc213d363bb17296eb024b))
- implement clipboard functionality for copying cuil and credit number ([70112a5](https://github.com/nmoreno-dev/gestion-barrena/commit/70112a5820dc6a91887d50682433d1e8374ac040))
- implement csv loading and debtor table components ([6ee98d8](https://github.com/nmoreno-dev/gestion-barrena/commit/6ee98d8e26e508d610adbee02a9db7a992d3099c))
- implement Indexeddb storage for debtor data with loading and clearing functionality ([ac6c64f](https://github.com/nmoreno-dev/gestion-barrena/commit/ac6c64f2500b56a86c4c4e4627584fa46cf7635a))
- update creditor details and message template for improved clarity ([be5efa7](https://github.com/nmoreno-dev/gestion-barrena/commit/be5efa77960092f27fe4b512369703a426311a2e))

# 1.0.0 (2025-07-30)

### Bug Fixes

- deps ([a1dfda8](https://github.com/Los-Galeses/Facturillo-app/commit/a1dfda831f15a4111a6ab81805f19e773fcd2410))

### Features

- add router and page setup ([d8db3df](https://github.com/Los-Galeses/Facturillo-app/commit/d8db3df1bcb1a9eb7b4876e3b123d32316178a5c))
