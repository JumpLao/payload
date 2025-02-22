import { Payload } from '../..';
import { AccessResult } from '../../config/types';
import { SanitizedCollectionConfig, TypeWithID } from '../../collections/config/types';
import { SanitizedGlobalConfig } from '../../globals/config/types';
declare type Arguments<T> = {
    payload: Payload;
    entity: SanitizedCollectionConfig | SanitizedGlobalConfig;
    doc: T;
    locale: string;
    accessResult: AccessResult;
};
declare const replaceWithDraftIfAvailable: <T extends TypeWithID>({ payload, entity, doc, locale, accessResult, }: Arguments<T>) => Promise<T>;
export default replaceWithDraftIfAvailable;
