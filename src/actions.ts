/**
 * Created by Administrator on 2017/8/21.
 */
import {makeEmptyAction, makePayloadAction} from "guguder";
export const getBillingOrders = makeEmptyAction('getBillingOrders');
export const setBillingOrders = makePayloadAction("setBillingOrders");
export const addBillingOrder = makePayloadAction("addBillingOrder");
export const setBillingVisible = makePayloadAction("setBillingVisible");