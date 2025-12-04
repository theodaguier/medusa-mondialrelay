import MondialRelayFulfillmentService from "./service.js"
import { ModuleProvider, Modules } from "@medusajs/framework/utils"

export default ModuleProvider(Modules.FULFILLMENT, {
    services: [MondialRelayFulfillmentService],
})
