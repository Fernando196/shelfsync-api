import { FilterableFieldsConfig } from "../../common/query-filters";

export const USERS_FILTEABLE_FILEDS: FilterableFieldsConfig = {
    id: ['eq','like'],
    email: ['eq','like'],
    fullName: ['eq','like'],
    createdAt : ['eq','in','gte','lte'],
    updatedAt: ['eq','in','gte','lte'],
}