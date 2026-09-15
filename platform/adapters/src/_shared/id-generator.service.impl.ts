/**
 * ID Generator Service Implementation — starter prefixes.
 */

import type { DomainCode } from '@aetherlab/core/_shared/helpers';
import { DOMAIN_PREFIX_MAP, isValidDomainId } from '@aetherlab/core';
import { ulid } from 'ulid';
import type { IdGeneratorService } from '@aetherlab/services/_shared';

export function generateIdWithPrefix(prefix: string): string {
  if (!prefix || prefix.length !== 3 || !/^[a-z]{3}$/.test(prefix)) {
    throw new Error(
      `Invalid domain prefix: "${prefix}". Must be exactly 3 lowercase letters.`
    );
  }
  const id = `${prefix}_${ulid().toLowerCase()}`;
  if (!isValidDomainId(id)) {
    throw new Error(`Generated ID "${id}" failed validation.`);
  }
  return id;
}

export class DefaultIdGeneratorService implements IdGeneratorService {
  tntId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.tenant);
  }
  keyId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.apiKey);
  }
  idnId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.identity);
  }
  autId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.auth);
  }
  prjId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.projects);
  }
  mdlId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.models);
  }
  dstId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.datasets);
  }
  trnId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.trainingjobs);
  }
  evlId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.evaluations);
  }
  depId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.deployments);
  }
  monId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.monitors);
  }
  evpId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.evidencepacks);
  }
  generateIdForDomain(domainCode: DomainCode): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP[domainCode]);
  }
}

let idGeneratorService: DefaultIdGeneratorService | null = null;

export function getIdGeneratorService(): DefaultIdGeneratorService {
  if (!idGeneratorService) {
    idGeneratorService = new DefaultIdGeneratorService();
  }
  return idGeneratorService;
}
