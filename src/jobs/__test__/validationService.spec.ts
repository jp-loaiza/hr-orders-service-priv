//@ts-ignore
import { mockOrder } from "../../events/__test__/mockValues";
import {
    canUploadCsv,
    canSendOrderUpdate,
    canSendOrderEmailNotification,
    canSendConversionToAlgolia,
    canSendPurchaseEventToDY,
    canSendOrderToNarvar,
    canSendOrderToSegment,
    canSendConversionToCJ,
    canLogStuckOrder
} from "../validationService";

describe("validationService", () => {
    it('should return true if canUploadCsv for valid order', () => {
        //@ts-ignore
        expect(canUploadCsv(mockOrder('PENDING', ''))).toBeTruthy()
    })

    it('should return true if sendOrderUpdate for valid order', () => {
        //@ts-ignore
        expect(canSendOrderUpdate(mockOrder('SUCCESS', 'PENDING'))).toBeTruthy()
    })

    it('should return true if canSendOrderEmailNotification for valid order', () => {
        //@ts-ignore
        expect(canSendOrderEmailNotification(mockOrder('', ''))).toBeTruthy()
    })

    it('should return true if canSendConversionToAlgolia for valid order', () => {
        //@ts-ignore
        expect(canSendConversionToAlgolia(mockOrder('', ''))).toBeTruthy()
    })

    it('should return true if canSendPurchaseEventToDY for valid order', () => {
        //@ts-ignore
        expect(canSendPurchaseEventToDY(mockOrder('', ''))).toBeTruthy()
    })

    it('should return true if canSendOrderToNarvar for valid order', () => {
        //@ts-ignore
        expect(canSendOrderToNarvar(mockOrder('', ''))).toBeTruthy()
    })

    it('should return true if canSendOrderToSegment for valid order', () => {
        //@ts-ignore
        expect(canSendOrderToSegment(mockOrder('', ''))).toBeTruthy()
    })

    it('should return true if canSendConversionToCJ for valid order', () => {
        //@ts-ignore
        expect(canSendConversionToCJ(mockOrder('', ''))).toBeTruthy()
    })

    it('should return true if canLogStuckOrder for valid order', () => {
        const now = new Date()
        let oneWeekAgo = new Date()
        oneWeekAgo.setDate(now.getDate() - 7)
        //@ts-ignore
        expect(canLogStuckOrder(mockOrder('PENDING', '', oneWeekAgo.toJSON()))).toBeTruthy()
    })
})
