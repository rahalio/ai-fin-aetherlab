/**
 * IdGeneratorService Port — starter prefixes (extend in consumer repos).
 */

import type { DomainCode } from '@aetherlab/core/_shared/helpers';

export interface IdGeneratorService {
  tntId(): string;
  keyId(): string;
  idnId(): string;
  autId(): string;
  prjId(): string;
  mdlId(): string;
  dstId(): string;
  trnId(): string;
  evlId(): string;
  depId(): string;
  monId(): string;
  evpId(): string;
  generateIdForDomain(domainCode: DomainCode): string;
}
