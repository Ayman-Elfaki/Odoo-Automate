import type { OptionEntity } from "@/services/store";

export default defineUnlistedScript(async () => {
    document.addEventListener('onOptionsUpdated', function (event) {
        const { detail: { options } } = event as OptionsUpdatedEvent
        if (!options) return;
        updateOrderCustomer(options);
        updateOderInvoicing(options);
    });
});

const updateOrderCustomer = async (options?: OptionEntity) => {
    const order = await window.posmodel?.getOrder();
    if (!options || !options.customer || !order) return;
    if (!order.partner_id || order.partner_id !== options.customer.id) {
        order.partner_id = options.customer.id;
    }
}

const updateOderInvoicing = async (options?: OptionEntity) => {
    const order = await window.posmodel?.getOrder();
    if (!options || options?.autoInvoice === 'false' || !order) return;
    order.to_invoice = true;
}