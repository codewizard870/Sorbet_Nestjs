import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import * as path from 'path'
import fs from 'fs'

const secretFilePath = '/secrets/aerobic-badge-379110-bcaae1f06e2b'
const secretContent = fs.readFileSync(secretFilePath, 'utf-8')

const client = new SecretManagerServiceClient({
  keyFilename: path.join(__dirname, '../../aerobic-badge-379110-bcaae1f06e2b.json')
})
const secretName = 'projects/351257798442/secrets/aerobic-badge-379110-bcaae1f06e2b/versions/1'

export async function getSecretValue(): Promise<string> {
    const [version] = await client.accessSecretVersion({
    name: secretName,
  })

  return version.payload.data.toString()
}