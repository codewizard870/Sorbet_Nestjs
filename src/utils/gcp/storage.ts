import { Storage } from '@google-cloud/storage';
import * as path from 'path';
import { accessSecretVersion } from './secrets';

export class StorageClass {
  storage: Storage | null = null;
  private static instance: StorageClass;

  private constructor() { }

  private async initStorage(): Promise<Storage> {
    try {
      const keyFilename =
        process.env.NODE_ENV === 'production'
          ? await accessSecretVersion()
          : path.join(__dirname, '../../aerobic-badge-379110-bcaae1f06e2b.json');

      this.storage = new Storage({
        keyFilename: keyFilename,
      });

      return this.storage;
    } catch (error) {
      // handle error
    }
  }

  static async getInstance(): Promise<StorageClass> {
    if (!StorageClass.instance) {
      StorageClass.instance = new StorageClass();
      await StorageClass.instance.initStorage();
    }
    return StorageClass.instance;
  }
}
