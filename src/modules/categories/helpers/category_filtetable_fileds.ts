import { FilterableFieldsConfig } from "../../common/query-filters";

export const CATEGORY_FILTEABLE_FILEDS: FilterableFieldsConfig = {
    id: ['eq','like'],
    name: ['eq','like'],
    active: ['eq'],
    createdAt : ['eq','in','gte','lte'],
    updatedAt: ['eq','in','gte','lte'],
}