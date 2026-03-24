import type { OptionEntity } from "@/utils/store";
import { PosOrder18 } from "@/utils/types";

export default defineUnlistedScript(async () => {
    document.addEventListener('onOptionsUpdated', function (event) {

        const { detail: { options } } = event as OptionsUpdatedEvent;

        if (!options || !window.odoo || !window.posmodel) return;

        if (!window.odoo.info.server_version.includes('19') && !window.odoo.info.server_version.includes('18')) return;

        updateOrderCustomer(options);
        updateOderInvoicing(options);

    });
});


const getCurrentOrder = async (): Promise<PosOrder19 | PosOrder18 | undefined> => {
    if (!window.posmodel) return undefined;
    if ('getOrder' in window.posmodel)
        return await window.posmodel.getOrder();
    else if ('get_order' in window.posmodel) {
        return await window.posmodel.get_order();
    }
}

const updateOrderCustomer = async (options?: OptionEntity) => {
    const order = await getCurrentOrder();

    if (!options || !options.customer || !order) return;

    if (!order.partner_id || order.partner_id !== options.customer.id) {
        if ('set_partner' in order) {
            order.set_partner(options.customer.id);
        } else {
            order.partner_id = options.customer.id;
        }
    }
}

const updateOderInvoicing = async (options?: OptionEntity) => {
    const order = await getCurrentOrder();
    if (!options || options?.autoInvoice === 'false' || !order) return;
    order.to_invoice = true;
}