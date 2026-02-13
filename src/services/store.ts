import { Dexie, type EntityTable } from "dexie"

type CustomerEntity = {
    id: number,
    name: string
}

type OptionEntity = {
    id: number,
    autoInvoice: 'true' | 'false',
    customer?: CustomerEntity
}

type AppDbContext = Dexie & {
    options: EntityTable<OptionEntity, "id">
}

export class OptionRepository {

    private db: AppDbContext;

    constructor() {
        this.db = new Dexie("odoo-automate-database") as AppDbContext
        this.db.version(1).stores({ options: "++id, autoInvoice, customer.id, customer.name" });
    }

    async initialize() {
        const option = await this.db.options.toCollection().first();
        if (!option) this.db.options.add({ autoInvoice: 'false', customer: undefined })
    }

    async getOptions() {
        return await this.db.options.toCollection().first();
    }

    async setOptions(options: Partial<OptionEntity>) {
        await this.db.transaction('rw', this.db.options, async () => {
            await this.db.options.toCollection().modify({ ...options });
        });
    }
}

export { OptionEntity };