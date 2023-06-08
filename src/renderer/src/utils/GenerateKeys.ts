async function GenerateKeys() {
    const keyPair = await window.crypto.subtle.generateKey({
        name: 'RSA-PSS',
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: {name: 'SHA-256'}
    },
    true,
    ['sign', 'verify'])

    const publicKey = await window.crypto.subtle.exportKey('spki', keyPair.publicKey)

    const privateKey = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey)

    return {
        publicKey,
        privateKey
    }
}

export default GenerateKeys;