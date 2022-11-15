# Changelog

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
