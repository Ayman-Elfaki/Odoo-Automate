export type PosOrder19 = {
    id: string
    name: string
    company_id: number
    partner_id?: number
    nb_print: number
    to_invoice: boolean
}

export type PosOrder18 = {
    id: string
    name: string
    company_id: number
    partner_id?: number
    nb_print: number
    to_invoice: boolean
    set_partner: (id: number) => void
}


export type PosModel = {
    get_order: () => Promise<PosOrder18>
} | {
    getOrder: () => Promise<PosOrder19>
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
        posmodel?: PosModel
    }
}