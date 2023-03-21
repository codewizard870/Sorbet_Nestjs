import { Storage } from '@google-cloud/storage';
import * as path from 'path';
import fs from 'fs';
import { getSecretValue } from './secrets';


export class StorageClass {
  storage: Storage | null = null;
  private static instance: StorageClass;

  private constructor() { }

  private async initStorage(): Promise<Storage> {
    try {
      const secretFilePath = '/secrets/aerobic-badge-379110-bcaae1f06e2b'
      const secretContent = fs.readFileSync(secretFilePath, 'utf-8')
      console.log('secretContent', secretContent)
      const keyFilename = secretContent
        // process.env.NODE_ENV === 'production'
        //   ? 
          // await getSecretValue()
        //   : 
          // path.join(__dirname, '../../aerobic-badge-379110-bcaae1f06e2b.json')

      console.log('keyFilename', keyFilename)
      this.storage = new Storage({
        projectId: 'aerobic-badge-379110',
        keyFilename: path.join(__dirname, '../../aerobic-badge-379110-bcaae1f06e2b.json'),
      })

      return this.storage
    } 
    catch (error) {
      console.error(error)
      throw new Error('Error initializing Google Cloud Storage')
    }
  }

  static async getInstance(): Promise<StorageClass> {
    if (!StorageClass.instance) {
    console.log('HEYY')
      StorageClass.instance = new StorageClass();
      await StorageClass.instance.initStorage();
    }
    return StorageClass.instance;
  }
}
