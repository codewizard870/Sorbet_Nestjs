import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
const client = new SecretManagerServiceClient();
const secretName = 'projects/351257798442/secrets/aerobic-badge-379110-bcaae1f06e2b/versions/1';

export async function accessSecretVersion(): Promise<string> {
  const [version] = await client.accessSecretVersion({
    name: secretName,
  })
  console.log('version', version)
  const secretContent = version.payload.data.toString()
  console.log('secretContent', secretContent)
  return secretContent
}