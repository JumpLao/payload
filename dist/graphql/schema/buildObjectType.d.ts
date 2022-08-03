import { GraphQLFieldConfig, GraphQLObjectType } from 'graphql';
import { Field } from '../../fields/config/types';
import { Payload } from '../..';
export declare type ObjectTypeConfig = {
    [path: string]: GraphQLFieldConfig<any, any>;
};
declare function buildObjectType(payload: Payload, name: string, fields: Field[], parentName: string, baseFields?: ObjectTypeConfig): GraphQLObjectType;
export default buildObjectType;
