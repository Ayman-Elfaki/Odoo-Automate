export type PosOrder = {
    id: string
    name: string
    date_order: string
    user_id: number
    lines: Array<string>
    company_id: number
    partner_id?: number
    sequence_number: number
    session_id: number
    config_id: number
    state: string
    picking_ids: Array<any>
    picking_type_id: number
    stock_reference_ids: Array<any>
    general_customer_note: string
    internal_note: string
    nb_print: number
    pos_reference: string
    payment_ids: Array<any>
    to_invoice: boolean
    ticket_code: string
    tracking_number: string
    uuid: string
    available_payment_method_ids: Array<any>
    reversed_move_ids: Array<any>
    settled_order_line_ids: Array<any>
    JSONuiState: string
}



declare global {
    interface Window {
        odoo: {
            info: {
                db: string
                server_version: string
                server_version_info: [number, number, number, string, number, string]
                isEnterprise: boolean
            }
        },
        posmodel?: { getOrder: () => Promise<PosOrder> } | { get_order: () => Promise<PosOrder> }
    }
}