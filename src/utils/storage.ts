import Arweave from 'arweave';

export class ArweaveStorage {
    private conn: Arweave;

    constructor() {
        this.conn = Arweave.init({
            host: 'arweave.net',
            port: 443,        
            protocol: 'https',  
            timeout: 20000,     
            logging: true,    
        });
    }

    public async upload(data: any): Promise<string> {
        const wallet = await this.conn.wallets.generate();
        const tx = await this.conn.createTransaction({ data }, wallet);
        // tx.addTag('Content-Type', 'text');
        await this.conn.transactions.sign(tx, wallet);
        const response = await this.conn.transactions.post(tx);
        return tx.id;
    }

    public async download(tranId: string): Promise<any> {
        const result = await this.conn.transactions.getData(tranId, { decode: true, string: true });
        return result;
    }
}