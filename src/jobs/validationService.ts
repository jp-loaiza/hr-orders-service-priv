import { Order } from "@commercetools/platform-sdk";
import {
    ALGOLIA_CONVERSIONS_EVENT,
    CREATE_UPLOAD_CSV_EVENT,
    EMAIL_NOTIFY_CRM_EVENT,
    NARVAR_ORDER_EVENT,
    ORDER_CONVERSION_TO_CJ_EVENT,
    ORDER_UPDATE_EVENT,
    PURCHASE_EVENTS_DY_EVENT,
    SEGMENT_ORDER_EVENT
} from "../config";
import {
    DEFAULT_STALE_ORDER_CUTOFF_TIME_MS,
    SENT_TO_ALGOLIA_STATUSES,
    SENT_TO_CJ_STATUSES,
    SENT_TO_CRM_STATUS,
    SENT_TO_DYNAMIC_YIELD_STATUSES,
    SENT_TO_NARVAR_STATUSES,
    SENT_TO_OMS_STATUSES,
    SENT_TO_SEGMENT_STATUSES,
    UPDATE_TO_OMS_STATUSES
} from "../constants";

export function canUploadCsv(order: Order) {
    //query = `custom(fields(sentToOmsStatus != "${SENT_TO_OMS_STATUSES.FAILURE}")) and custom(fields(sentToOmsStatus != "${SENT_TO_OMS_STATUSES.SUCCESS}")) and (custom(fields(nextRetryAt <= "${(new Date().toJSON())}" or nextRetryAt is not defined))) and custom(fields(loginRadiusUid is defined))`
    return order.custom?.fields.sentToOmsStatus != SENT_TO_OMS_STATUSES.FAILURE
        && order.custom?.fields.sentToOmsStatus != SENT_TO_OMS_STATUSES.SUCCESS
        && (order.custom?.fields.nextRetryAt === undefined || order.custom?.fields.nextRetryAt <= new Date().toJSON())
        && order.custom?.fields.loginRadiusUid
        && CREATE_UPLOAD_CSV_EVENT
}

export function canSendOrderUpdate(order: Order) {
    //query = `custom(fields(omsUpdate = "${UPDATE_TO_OMS_STATUSES.PENDING}")) and custom(fields(sentToOmsStatus = "${SENT_TO_OMS_STATUSES.SUCCESS}")) and (custom(fields(omsUpdateNextRetryAt <= "${(new Date().toJSON())}" or omsUpdateNextRetryAt is not defined)))`
    return order.custom?.fields.omsUpdate === UPDATE_TO_OMS_STATUSES.PENDING
        && order.custom?.fields.sentToOmsStatus === SENT_TO_OMS_STATUSES.SUCCESS
        && (order.custom?.fields.omsUpdateNextRetryAt === undefined
            || Date.parse(order.custom?.fields.omsUpdateNextRetryAt) <= Date.parse(new Date().toJSON()))
        && ORDER_UPDATE_EVENT
}

export function canSendOrderEmailNotification(order: Order) {
    //query = `custom(fields(sentToCrmStatus = "${SENT_TO_CRM_STATUS.PENDING}" or sentToCrmStatus is not defined)) and custom is defined`
    return order.custom
        && (order.custom?.fields.sentToCrmStatus === undefined
            || order.custom?.fields.sentToCrmStatus === SENT_TO_CRM_STATUS.PENDING)
        && EMAIL_NOTIFY_CRM_EVENT
}

export function canSendConversionToAlgolia(order: Order) {
    //query = `(createdAt>"${oneWeekAgo.toJSON()}" and createdAt<="${now.toJSON()}" and (custom(fields(sentToAlgoliaStatus = "${SENT_TO_ALGOLIA_STATUSES.PENDING}")) or custom(fields(sentToAlgoliaStatus is not defined))) and lineItems(custom(fields(algoliaAnalyticsData is defined))) and (custom(fields(${ORDER_CUSTOM_FIELDS.ALGOLIA_CONVERSION_NEXT_RETRY_AT} <= "${now.toJSON()}" or ${ORDER_CUSTOM_FIELDS.ALGOLIA_CONVERSION_NEXT_RETRY_AT} is not defined))))`
    const now = new Date()
    let oneWeekAgo = new Date()
    oneWeekAgo.setDate(now.getDate() - 7)
    return Date.parse(order.createdAt) > Date.parse(oneWeekAgo.toJSON())
        && Date.parse(order.createdAt) <= Date.parse(now.toJSON())
        && (order.custom?.fields.sentToAlgoliaStatus === undefined || order.custom?.fields.sentToAlgoliaStatus === SENT_TO_ALGOLIA_STATUSES.PENDING)
        && order.lineItems.every(item => item.custom?.fields.algoliaAnalyticsData)
        && (order.custom?.fields.algoliaConversionNextRetryAt === undefined || order.custom?.fields.algoliaConversionNextRetryAt <= now.toJSON())
        && ALGOLIA_CONVERSIONS_EVENT
}

export function canSendOrderToNarvar(order: Order) {
    const now = new Date()
    let oneWeekAgo = new Date()
    oneWeekAgo.setDate(now.getDate() - 7)
    // query = `(custom(fields(${ORDER_CUSTOM_FIELDS.NARVAR_STATUS} = "${SENT_TO_NARVAR_STATUSES.PENDING}")) or custom(fields(${ORDER_CUSTOM_FIELDS.NARVAR_STATUS} is not defined))) and custom(fields(${ORDER_CUSTOM_FIELDS.NARVAR_NEXT_RETRY_AT} <= "${(new Date().toJSON())}" or ${ORDER_CUSTOM_FIELDS.NARVAR_NEXT_RETRY_AT} is not defined)) and (createdAt >= "2022-02-27")`
    return order.custom?.fields.narvarStatus === undefined || order.custom?.fields.narvarStatus === SENT_TO_NARVAR_STATUSES.PENDING
        && (order.custom?.fields.narvarNextRetryAt === undefined || order.custom?.fields.narvarNextRetryAt <= new Date().toJSON())
        && order.createdAt > '2022-02-27'
        && NARVAR_ORDER_EVENT
}

export function canSendPurchaseEventToDY(order: Order) {
    //query = `(createdAt>"${oneWeekAgo.toJSON()}" and createdAt<="${now.toJSON()}" and (custom(fields(${ORDER_CUSTOM_FIELDS.DYNAMIC_YIELD_PURCHASE_STATUS} = "${SENT_TO_DYNAMIC_YIELD_STATUSES.PENDING}")) or custom(fields(${ORDER_CUSTOM_FIELDS.DYNAMIC_YIELD_PURCHASE_STATUS} is not defined))) and custom(fields(dynamicYieldData is defined)) and (custom(fields(${ORDER_CUSTOM_FIELDS.DYNAMIC_YIELD_PURCHASE_NEXT_RETRY_AT} <= "${now.toJSON()}" or ${ORDER_CUSTOM_FIELDS.DYNAMIC_YIELD_PURCHASE_NEXT_RETRY_AT} is not defined))))`
    const now = new Date()
    let oneWeekAgo = new Date()
    oneWeekAgo.setDate(now.getDate() - 7)
    return order.createdAt > oneWeekAgo.toJSON()
        && order.createdAt <= now.toJSON()
        && (order.custom?.fields.sentToDynamicYieldStatus === undefined || order.custom?.fields.sentToDynamicYieldStatus === SENT_TO_DYNAMIC_YIELD_STATUSES.PENDING)
        && order.custom?.fields.dynamicYieldData
        && (order.custom?.fields.dynamicYieldPurchaseNextRetryAt === undefined || order.custom?.fields.dynamicYieldPurchaseNextRetryAt <= now.toJSON())
        && PURCHASE_EVENTS_DY_EVENT
}

export function canSendOrderToSegment(order: Order) {
    // query = `(custom(fields(${ORDER_CUSTOM_FIELDS.SEGMENT_STATUS} = "${SENT_TO_SEGMENT_STATUSES.PENDING}")) or custom(fields(${ORDER_CUSTOM_FIELDS.SEGMENT_STATUS} is not defined))) and (custom(fields(${ORDER_CUSTOM_FIELDS.LR_USER_ID} is defined))) and custom(fields(${ORDER_CUSTOM_FIELDS.SEGMENT_NEXT_RETRY_AT} <= "${(new Date().toJSON())}" or ${ORDER_CUSTOM_FIELDS.SEGMENT_NEXT_RETRY_AT} is not defined)) and (createdAt > "2022-03-27")`
    return order.custom?.fields.segmentStatus === undefined || order.custom?.fields.segmentStatus === SENT_TO_SEGMENT_STATUSES.PENDING
        && order.custom?.fields.loginRadiusUid
        && (order.custom?.fields.segmentNextRetryAt === undefined || order.custom?.fields.segmentNextRetryAt <= new Date().toJSON())
        && order.createdAt > '2022-03-27'
        && SEGMENT_ORDER_EVENT
}

export function canSendConversionToCJ(order: Order) {
    // query = `(custom(fields(${ORDER_CUSTOM_FIELDS.SENT_TO_CJ_STATUS} = "${SENT_TO_CJ_STATUSES.PENDING}")) or custom(fields(${ORDER_CUSTOM_FIELDS.SENT_TO_CJ_STATUS} is not defined))) and custom(fields(${ORDER_CUSTOM_FIELDS.CJ_EVENT} is defined)) and (custom(fields(${ORDER_CUSTOM_FIELDS.CJ_CONVERSION_NEXT_RETRY_AT} <= "${(new Date().toJSON())}" or ${ORDER_CUSTOM_FIELDS.CJ_CONVERSION_NEXT_RETRY_AT} is not defined)))`
    return order.custom?.fields.sentToCjStatus === undefined || order.custom?.fields.sentToCjStatus === SENT_TO_CJ_STATUSES.PENDING
        && order.custom?.fields.cjEvent
        && (order.custom?.fields.cjNextRetryAt === undefined || order.custom?.fields.cjNextRetryAt <= new Date().toJSON())
        && ORDER_CONVERSION_TO_CJ_EVENT
}

export function canLogStuckOrder(order: Order) {
    const staleOrderCutoffTimeMs = Number(process.env.STALE_ORDER_CUTOFF_TIME_MS) > 0 ? Number(process.env.STALE_ORDER_CUTOFF_TIME_MS) : DEFAULT_STALE_ORDER_CUTOFF_TIME_MS
    const staleOrderCutoffDate = new Date(Date.now() - staleOrderCutoffTimeMs)
    //query = `(custom(fields(sentToOmsStatus = "${SENT_TO_OMS_STATUSES.PENDING}")) or custom(fields(sentToOmsStatus is not defined))) and createdAt <= "${(staleOrderCutoffDate.toJSON())}"`
    return order.custom?.fields.sentToOmsStatus === undefined || order.custom?.fields.sentToOmsStatus === SENT_TO_OMS_STATUSES.PENDING && order.createdAt <= staleOrderCutoffDate.toJSON()
}