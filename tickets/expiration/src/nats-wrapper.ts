import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if(!this._client) throw new Error('Ntas is not init');

    return this._client;
  }

  connect(clusterId: string, clientID: string, url: string) {
    this._client = nats.connect(clusterId, clientID, { url });

    return new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });
      this.client.on('error', (err) => {
        reject(err);
      })
    });
  }
}

export const natsWrapper = new NatsWrapper();