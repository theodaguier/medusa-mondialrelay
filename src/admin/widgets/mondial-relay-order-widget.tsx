import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminOrder } from "@medusajs/framework/types"
import { Container, Heading, Button, Text, Badge } from "@medusajs/ui"

const MondialRelayOrderWidget = ({
    data: order
}: DetailWidgetProps<AdminOrder>) => {
    // Check if order has fulfillments
    const fulfillments = order?.fulfillments ?? []

    // Filter for Mondial Relay fulfillments (check provider_id)
    const mondialRelayFulfillments = fulfillments.filter((f: any) =>
        f.provider_id?.toLowerCase().includes("mondialrelay")
    )

    // If no MR fulfillments, don't show the widget
    if (mondialRelayFulfillments.length === 0) {
        return null
    }

    const handlePrintLabel = (labelUrl: string) => {
        window.open(labelUrl, "_blank")
    }

    return (
        <Container className="divide-y p-0">
            <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-2">
                    <svg
                        className="w-5 h-5 text-orange-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h3.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-4a1 1 0 00-.293-.707l-3-3A1 1 0 0016 5h-3V4a1 1 0 00-1-1H3zm10 2h2.586L17 7.414V8h-4V6z" />
                    </svg>
                    <Heading level="h2">Mondial Relay</Heading>
                </div>
                <Badge color="orange" size="small">
                    {mondialRelayFulfillments.length} envoi(s)
                </Badge>
            </div>

            <div className="px-6 py-4 space-y-4">
                {mondialRelayFulfillments.map((fulfillment: any, index: number) => {
                    // Get labels from fulfillment
                    const labels = fulfillment.labels ?? []
                    const firstLabel = labels[0]
                    const labelUrl = firstLabel?.label_url || fulfillment.data?.shipment_label
                    const trackingNumber = firstLabel?.tracking_number || fulfillment.data?.shipment_number
                    const parcelShopName = fulfillment.data?.parcel_shop_name

                    return (
                        <div key={fulfillment.id} className="border rounded-lg p-4 bg-ui-bg-subtle">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <Text className="font-medium text-ui-fg-base">
                                        Envoi #{trackingNumber || index + 1}
                                    </Text>
                                    {parcelShopName && (
                                        <Text className="text-ui-fg-subtle text-sm">
                                            Point Relais: {parcelShopName}
                                        </Text>
                                    )}
                                </div>
                            </div>

                            {trackingNumber && (
                                <div className="bg-white rounded p-3 mb-3">
                                    <Text className="text-xs text-ui-fg-muted uppercase mb-1">
                                        Numéro de suivi
                                    </Text>
                                    <Text className="font-mono font-semibold text-ui-fg-base">
                                        {trackingNumber}
                                    </Text>
                                </div>
                            )}

                            {labelUrl && (
                                <div className="flex gap-2">
                                    <Button
                                        variant="secondary"
                                        size="small"
                                        onClick={() => handlePrintLabel(labelUrl)}
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                        </svg>
                                        Imprimer l'étiquette
                                    </Button>
                                    <Button
                                        variant="transparent"
                                        size="small"
                                        onClick={() => window.open(labelUrl, "_blank")}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </Button>
                                </div>
                            )}

                            {!labelUrl && (
                                <Text className="text-ui-fg-muted text-sm italic">
                                    Aucune étiquette disponible
                                </Text>
                            )}
                        </div>
                    )
                })}
            </div>
        </Container>
    )
}

export const config = defineWidgetConfig({
    zone: "order.details.after",
})

export default MondialRelayOrderWidget
