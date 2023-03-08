# Changelog

## [1.7.7](https://github.com/HarryRosen/hr-orders-service/compare/v1.7.6...v1.7.7) (2023-03-08)


### Bug Fixes

* HRC-5778: format to view log errors ([#483](https://github.com/HarryRosen/hr-orders-service/issues/483)) ([0805225](https://github.com/HarryRosen/hr-orders-service/commit/0805225517b0c2cafe4b879347ad4fcb813fe209))

## [1.7.6](https://github.com/HarryRosen/hr-orders-service/compare/v1.7.5...v1.7.6) (2023-03-06)


### Bug Fixes

* HRC-6480: DY expects an object ([#481](https://github.com/HarryRosen/hr-orders-service/issues/481)) ([0ec8694](https://github.com/HarryRosen/hr-orders-service/commit/0ec8694e0062a5ddc6ff0330b4cc7551ca4645e3))

## [1.7.5](https://github.com/HarryRosen/hr-orders-service/compare/v1.7.4...v1.7.5) (2023-03-06)


### Bug Fixes

* HRC-6480: segment message &gt; 32kb issue ([#479](https://github.com/HarryRosen/hr-orders-service/issues/479)) ([c8fde29](https://github.com/HarryRosen/hr-orders-service/commit/c8fde295187c1378101195c854e233c69f49e2b8))

## [1.7.4](https://github.com/HarryRosen/hr-orders-service/compare/v1.7.3...v1.7.4) (2023-03-06)


### Bug Fixes

* HRC-6480: resolve uncaughtException issue ([#477](https://github.com/HarryRosen/hr-orders-service/issues/477)) ([76b9637](https://github.com/HarryRosen/hr-orders-service/commit/76b96377abad5c15cd90db09b49854a0b5d04e6b))

## [1.7.3](https://github.com/HarryRosen/hr-orders-service/compare/v1.7.2...v1.7.3) (2023-03-03)


### Bug Fixes

* HRC-6480: parse env vars correctly ([#475](https://github.com/HarryRosen/hr-orders-service/issues/475)) ([e1468da](https://github.com/HarryRosen/hr-orders-service/commit/e1468dadfa6d1da159cd3c598e9a4211e7fdbc30))

## [1.7.2](https://github.com/HarryRosen/hr-orders-service/compare/v1.7.1...v1.7.2) (2023-03-03)


### Bug Fixes

* HRC-6480: cleanup that was forgotten ([#473](https://github.com/HarryRosen/hr-orders-service/issues/473)) ([b2f4400](https://github.com/HarryRosen/hr-orders-service/commit/b2f4400adaeb50475b51c0c270e9c678971bc66a))

## [1.7.1](https://github.com/HarryRosen/hr-orders-service/compare/v1.7.0...v1.7.1) (2023-03-02)


### Bug Fixes

* HRC-6480: correct CheckJobsHealth issue ([#471](https://github.com/HarryRosen/hr-orders-service/issues/471)) ([7bc072f](https://github.com/HarryRosen/hr-orders-service/commit/7bc072fa67b83e80ff9652be157d8309aa698d8a))

## [1.7.0](https://github.com/HarryRosen/hr-orders-service/compare/v1.6.0...v1.7.0) (2023-03-01)


### Features

* HRC-6480: New consumer for hr-commerce order processing ([#467](https://github.com/HarryRosen/hr-orders-service/issues/467)) ([9736f6f](https://github.com/HarryRosen/hr-orders-service/commit/9736f6fa4742acc5782a69b6d800857f7b740932))

## [1.6.0](https://github.com/HarryRosen/hr-orders-service/compare/v1.5.8...v1.6.0) (2023-02-10)


### Features

* HRC-6525 - adding signature requirements for EDOM csv ([#465](https://github.com/HarryRosen/hr-orders-service/issues/465)) ([c4eb8db](https://github.com/HarryRosen/hr-orders-service/commit/c4eb8db0f46fb3cdb876f0d6abe90b074e44c790))

## [1.5.8](https://github.com/HarryRosen/hr-orders-service/compare/v1.5.7...v1.5.8) (2023-01-19)


### Bug Fixes

* HRC-6439: filter the DLQ logic for invalid msg ([#463](https://github.com/HarryRosen/hr-orders-service/issues/463)) ([1bd3330](https://github.com/HarryRosen/hr-orders-service/commit/1bd3330c99b03e61683a8443d3ed0887298f9269))

## [1.5.7](https://github.com/HarryRosen/hr-orders-service/compare/v1.5.6...v1.5.7) (2023-01-16)


### Bug Fixes

* HRC-6439: Fix the kafka order-save message format issue ([#461](https://github.com/HarryRosen/hr-orders-service/issues/461)) ([554bee7](https://github.com/HarryRosen/hr-orders-service/commit/554bee744ea322f15f57b55eb20a8c33f332698a))

## [1.5.6](https://github.com/HarryRosen/hr-orders-service/compare/v1.5.5...v1.5.6) (2023-01-13)


### Bug Fixes

* HRC-6439: restructure jobs to produce message ([#459](https://github.com/HarryRosen/hr-orders-service/issues/459)) ([a899083](https://github.com/HarryRosen/hr-orders-service/commit/a899083870e21eb448df2055ca4e1f12074006b4))

## [1.5.5](https://github.com/HarryRosen/hr-orders-service/compare/v1.5.4...v1.5.5) (2023-01-12)


### Bug Fixes

* HRC-6388: Added the logs for importing and exporting orders ([#457](https://github.com/HarryRosen/hr-orders-service/issues/457)) ([c370ccc](https://github.com/HarryRosen/hr-orders-service/commit/c370ccc59ff80a9712b52fd5a398b76e2f048ea9))

## [1.5.4](https://github.com/HarryRosen/hr-orders-service/compare/v1.5.3...v1.5.4) (2023-01-10)


### Bug Fixes

* HRC-6441: fix for environment variables ([#455](https://github.com/HarryRosen/hr-orders-service/issues/455)) ([8aef9b4](https://github.com/HarryRosen/hr-orders-service/commit/8aef9b4be582b5db5d9b09a0a58d94ddda7a4357))

## [1.5.3](https://github.com/HarryRosen/hr-orders-service/compare/v1.5.2...v1.5.3) (2023-01-10)


### Features

* HRC-6441: create order-service actor for consume message and update CT orders ([#451](https://github.com/HarryRosen/hr-orders-service/issues/451)) ([bb90db8](https://github.com/HarryRosen/hr-orders-service/commit/bb90db8be54165d0cf2675fe756cbe2be8435508))

## [1.5.2](https://github.com/HarryRosen/hr-orders-service/compare/v1.5.1...v1.5.2) (2023-01-10)


### Bug Fixes

* HRC-6388: To fix the issue that is broken on the DD related to orders ([#452](https://github.com/HarryRosen/hr-orders-service/issues/452)) ([ea46e6b](https://github.com/HarryRosen/hr-orders-service/commit/ea46e6bb7a28fb752323a2019e4879bf05ea9788))

## [1.5.1](https://github.com/HarryRosen/hr-orders-service/compare/v1.5.0...v1.5.1) (2023-01-09)


### Bug Fixes

* added the logs to check the status of metrics ([#449](https://github.com/HarryRosen/hr-orders-service/issues/449)) ([ffde7d4](https://github.com/HarryRosen/hr-orders-service/commit/ffde7d49e18ae0ff58284c4a80099dea1faefdda))

## [1.5.0](https://github.com/HarryRosen/hr-orders-service/compare/v1.4.2...v1.5.0) (2023-01-05)


### Features

* HRC-6452: update orderservice CT SDK to V2 ([#447](https://github.com/HarryRosen/hr-orders-service/issues/447)) ([d77356c](https://github.com/HarryRosen/hr-orders-service/commit/d77356cfaa3911ac9d6259df93deb6bb0f763e1e))

## [1.4.2](https://github.com/HarryRosen/hr-orders-service/compare/v1.4.1...v1.4.2) (2022-12-27)


### Bug Fixes

* HRC-6386: fix unix-dgram missing error ([#445](https://github.com/HarryRosen/hr-orders-service/issues/445)) ([2a258bd](https://github.com/HarryRosen/hr-orders-service/commit/2a258bd3e81ada9d892d1faf4ad708023c17ab6c))

## [1.4.1](https://github.com/HarryRosen/hr-orders-service/compare/v1.4.0...v1.4.1) (2022-12-27)


### Bug Fixes

* HRC-6386: Logger error ([#443](https://github.com/HarryRosen/hr-orders-service/issues/443)) ([bf2b01c](https://github.com/HarryRosen/hr-orders-service/commit/bf2b01cfda4aba2623ee8bbd3204464bf3c1431b))

## [1.4.0](https://github.com/HarryRosen/hr-orders-service/compare/v1.3.10...v1.4.0) (2022-12-23)


### Features

* HRC-6386: Upgrade node, add dd-trace and make ts ready ([#441](https://github.com/HarryRosen/hr-orders-service/issues/441)) ([308352f](https://github.com/HarryRosen/hr-orders-service/commit/308352fea288c09ae8fc90740cb1d401803cd8b2))

## [1.3.10](https://github.com/HarryRosen/hr-orders-service/compare/v1.3.9...v1.3.10) (2022-11-26)


### Bug Fixes

* HRC-6313: Adding flag to change sort direction for narvar job ([083efe7](https://github.com/HarryRosen/hr-orders-service/commit/083efe7a59391c5676cf379caafc06b6c2522650))

## [1.3.9](https://github.com/HarryRosen/hr-orders-service/compare/v1.3.8...v1.3.9) (2022-11-26)


### Bug Fixes

* HRC-6313: Narvar batch size is configurable ([68c1f51](https://github.com/HarryRosen/hr-orders-service/commit/68c1f518046d0f58319db7b0eb394a2cfb0a796b))

## [1.3.8](https://github.com/HarryRosen/hr-orders-service/compare/v1.3.7...v1.3.8) (2022-11-26)


### Bug Fixes

* HRC-6313: Retry with new version upon concurrent modification failure ([#437](https://github.com/HarryRosen/hr-orders-service/issues/437)) ([9026362](https://github.com/HarryRosen/hr-orders-service/commit/9026362afb526657a5c354b36fde14606eed3b4d))

## [1.3.7](https://github.com/HarryRosen/hr-orders-service/compare/v1.3.6...v1.3.7) (2022-11-26)


### Bug Fixes

* HRC-6313: Optimizing Narvar sending functionality ([#435](https://github.com/HarryRosen/hr-orders-service/issues/435)) ([b7e9c68](https://github.com/HarryRosen/hr-orders-service/commit/b7e9c68698b598e785c81380720bdbc6c91c70e2))

## [1.3.6](https://github.com/HarryRosen/hr-orders-service/compare/v1.3.5...v1.3.6) (2022-11-26)


### Bug Fixes

* HRC-6313: Correcting sort structure. ([ed1fd57](https://github.com/HarryRosen/hr-orders-service/commit/ed1fd570a11b44deadfffc74997ef43a6affcc39))

## [1.3.5](https://github.com/HarryRosen/hr-orders-service/compare/v1.3.4...v1.3.5) (2022-11-26)


### Bug Fixes

* HRC-6313: Reversing Narvar order fetch to LIFO ([#432](https://github.com/HarryRosen/hr-orders-service/issues/432)) ([989bce4](https://github.com/HarryRosen/hr-orders-service/commit/989bce4a34c606936dc0b0c6d445617e6e41992c))

## [1.3.4](https://github.com/HarryRosen/hr-orders-service/compare/v1.3.3...v1.3.4) (2022-11-23)


### Bug Fixes

* HRC-6313 removing sorting method ([#430](https://github.com/HarryRosen/hr-orders-service/issues/430)) ([9b8dc38](https://github.com/HarryRosen/hr-orders-service/commit/9b8dc389d79463f11516078ee0acd754ebaeb393))

## [1.3.3](https://github.com/HarryRosen/hr-orders-service/compare/v1.3.2...v1.3.3) (2022-11-22)


### Bug Fixes

* HRC-6306 - Adding sort param to the query so it can grab the proper shipment ([#428](https://github.com/HarryRosen/hr-orders-service/issues/428)) ([f17bd4c](https://github.com/HarryRosen/hr-orders-service/commit/f17bd4cec012d87035da8d1c507c79b28c1eee8c))

## [1.3.2](https://github.com/HarryRosen/hr-orders-service/compare/v1.3.1...v1.3.2) (2022-11-11)


### Bug Fixes

* HRC-6218 - fixing query params to retrieve shipments properly ([#426](https://github.com/HarryRosen/hr-orders-service/issues/426)) ([3afbd16](https://github.com/HarryRosen/hr-orders-service/commit/3afbd16065635fc5594af7a19798fa0c8f405ffb))

## [1.3.1](https://github.com/HarryRosen/hr-orders-service/compare/v1.3.0...v1.3.1) (2022-11-08)


### Bug Fixes

* HRC-6222: Fixed the indentation issues ([#423](https://github.com/HarryRosen/hr-orders-service/issues/423)) ([c0ad65a](https://github.com/HarryRosen/hr-orders-service/commit/c0ad65a6d2f459f4b8c59e1391e7a2ce22a7b8cb))

## [1.3.0](https://github.com/HarryRosen/hr-orders-service/compare/v1.2.3...v1.3.0) (2022-11-03)


### Features

* added the DD metrics to show the graph for csv ([#421](https://github.com/HarryRosen/hr-orders-service/issues/421)) ([5981f1f](https://github.com/HarryRosen/hr-orders-service/commit/5981f1fab28007d9d9b42ae7fe5d72b2b0c84c23))

## [1.2.3](https://github.com/HarryRosen/hr-orders-service/compare/v1.2.2...v1.2.3) (2022-10-28)


### Bug Fixes

* CDP-34: Added Identify Calls for Order Created Events ([#419](https://github.com/HarryRosen/hr-orders-service/issues/419)) ([86da10b](https://github.com/HarryRosen/hr-orders-service/commit/86da10b7be3a1775b6c9ba1ecd48c9ee916dc84a))

## [1.2.2](https://github.com/HarryRosen/hr-orders-service/compare/v1.2.1...v1.2.2) (2022-10-27)


### Bug Fixes

* CDP-34: renamed customer_id to loginradius_id ([#417](https://github.com/HarryRosen/hr-orders-service/issues/417)) ([5a731c5](https://github.com/HarryRosen/hr-orders-service/commit/5a731c509f69d40b25fee613002ffc81b22c907c))

## [1.2.1](https://github.com/HarryRosen/hr-orders-service/compare/v1.2.0...v1.2.1) (2022-10-03)


### Bug Fixes

* HRC-6074 - fixing query fields to CT ([#415](https://github.com/HarryRosen/hr-orders-service/issues/415)) ([406af89](https://github.com/HarryRosen/hr-orders-service/commit/406af897b855d569adb8a3c76d66774876e4923e))

## [1.2.0](https://github.com/HarryRosen/hr-orders-service/compare/v1.1.4...v1.2.0) (2022-09-28)


### Features

* CDP-3 -- Add Segment to `hr-orders-service` ([#412](https://github.com/HarryRosen/hr-orders-service/issues/412)) ([32de03d](https://github.com/HarryRosen/hr-orders-service/commit/32de03d8ac3090debb3d13ee969b7c5347fb923a))

## [1.1.4](https://github.com/HarryRosen/hr-orders-service/compare/v1.1.3...v1.1.4) (2022-09-22)


### Bug Fixes

* removed the commented lines ([bbe6874](https://github.com/HarryRosen/hr-orders-service/commit/bbe6874155c6bdda83dac3d4126c9e81fc30d0ee))
* removed the logic for ensuring the correct emailid to csv ([7be3be1](https://github.com/HarryRosen/hr-orders-service/commit/7be3be13dad72f8d7c25bf34bd8a249345239294))

## [1.1.3](https://github.com/HarryRosen/hr-orders-service/compare/v1.1.2...v1.1.3) (2022-08-26)


### Bug Fixes

* refactored the file name to loginradiusclient ([16c2230](https://github.com/HarryRosen/hr-orders-service/commit/16c22303693a8e15f9bb9cacbdf733a8c826e8a2))
* removed the comments in the file ([aa6d846](https://github.com/HarryRosen/hr-orders-service/commit/aa6d846e537821cbb954ea3dd3bec2a5b753f078))
* to call LoginRadiusRepository from job.js  instead of calling Commercetools.js ([5fdf4e0](https://github.com/HarryRosen/hr-orders-service/commit/5fdf4e0038edca48fc94221471403ef67def16dc))

## [1.1.2](https://github.com/HarryRosen/hr-orders-service/compare/v1.1.1...v1.1.2) (2022-08-23)


### Bug Fixes

* **hrc-6023:** user customerEmail for salesPersonId filters ([#406](https://github.com/HarryRosen/hr-orders-service/issues/406)) ([c6e3d46](https://github.com/HarryRosen/hr-orders-service/commit/c6e3d469442d81c19df5146ee3e7e07b851d925a))

## [1.1.1](https://github.com/HarryRosen/hr-orders-service/compare/v1.1.0...v1.1.1) (2022-08-04)


### Bug Fixes

* **hrc-6023:** fix issue with assigning 999 ([d2a6449](https://github.com/HarryRosen/hr-orders-service/commit/d2a6449cbea5bfbcd4a77fe0322045ca3c71ef27))
* **hrc-6023:** revert salesPersonId changes ([897d8eb](https://github.com/HarryRosen/hr-orders-service/commit/897d8ebb6b42b10c0050ff18908d1caacdbacde8))

## [1.1.0](https://github.com/HarryRosen/hr-orders-service/compare/v1.0.1...v1.1.0) (2022-07-21)


### Features

* **hrc-5915:** add fully discounted orders ([9abdb64](https://github.com/HarryRosen/hr-orders-service/commit/9abdb645e2f22351c3df707aae8caad11f5b3134))
* **order csv:** set commerceTools salespersonId for harryrosen staff purchases ([c332451](https://github.com/HarryRosen/hr-orders-service/commit/c332451afed2ee7ba191c45564cc70640ead335a))


### Bug Fixes

* **hrc-5915:** fix csv creation ([94b6fdc](https://github.com/HarryRosen/hr-orders-service/commit/94b6fdcbddcf73c374101315c373e674c2306436))
* **hrc-5915:** remove ajv payments validation ([7b91dd0](https://github.com/HarryRosen/hr-orders-service/commit/7b91dd08cc86dbefdabe1d6157befe036454fa93))

## [1.0.1](https://github.com/HarryRosen/hr-orders-service/compare/v1.0.0...v1.0.1) (2022-07-21)


### Bug Fixes

* checking out code during image build ([30a0db7](https://github.com/HarryRosen/hr-orders-service/commit/30a0db7a36ac62401f3e2ed3c9bec0534825629b))

## [1.0.0](https://github.com/HarryRosen/hr-orders-service/compare/v0.1.1-prerelease1...v1.0.0) (2022-07-21)


### Bug Fixes

* follow pattern in other repos ([6b58ce4](https://github.com/HarryRosen/hr-orders-service/commit/6b58ce4623efdef01363c85b61ae2130e7bcd585))
* HRC-5908 ([074ecc5](https://github.com/HarryRosen/hr-orders-service/commit/074ecc5f1dd4cc2863fb0579436ede9d60b1039d))
* HRC-5908 - use proper semantic versioning ([074ecc5](https://github.com/HarryRosen/hr-orders-service/commit/074ecc5f1dd4cc2863fb0579436ede9d60b1039d))
* **hrc-5908:** modify test to run on PR creation, use semantic version correctly ([2546674](https://github.com/HarryRosen/hr-orders-service/commit/254667497108decbd0b11516ed5e2a59e549b29f))
