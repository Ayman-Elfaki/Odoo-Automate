import type { OptionEntity } from "@/utils/store";

export default defineUnlistedScript(async () => {
    document.addEventListener('onOptionsUpdated', function (event) {

        const { detail: { options } } = event as OptionsUpdatedEvent;

        if (!options) return;

        if (!window.odoo.info.server_version.includes('19') && !window.odoo.info.server_version.includes('18')) return;

        updateOrderCustomer(options);
        updateOderInvoicing(options);

    });
});

const getCurrentOrder = async () => {
    if (!window.posmodel) return;
    const orderPromise = 'getOrder' in window.posmodel ? window.posmodel.getOrder() : window.posmodel.get_order();
    return await orderPromise;
}

const updateOrderCustomer = async (options?: OptionEntity) => {
    const order = await getCurrentOrder();
    if (!options || !options.customer || !order) return;
    if (!order.partner_id || order.partner_id !== options.customer.id) {
        order.partner_id = options.customer.id;
    }
}

const updateOderInvoicing = async (options?: OptionEntity) => {
    const order = await getCurrentOrder();
    if (!options || options?.autoInvoice === 'false' || !order) return;
    order.to_invoice = true;
}