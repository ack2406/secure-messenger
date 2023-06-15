import { JSEncrypt } from 'jsencrypt'
import CryptoJS from 'crypto-js'

function generateKeys() {
  const encrypt = new JSEncrypt({ default_key_size: '1024' })
  const privateKey = encrypt.getPrivateKey()
  const publicKey = encrypt.getPublicKey()
  return { privateKey, publicKey }
}

function saveKeysToFile(publicKey: string, privateKey: string, friend: string) {
  window.electron.ipcRenderer.send('save-pubkey', publicKey, friend)
  window.electron.ipcRenderer.send('save-privkey', privateKey, friend)
}

function loadPublicKey(friend: string, password: string) {
  const pubkey = window.electron.ipcRenderer.sendSync('get-pubkey', friend)
  console.log(pubkey)

  const localkey = CryptoJS.SHA1(password).toString()

  console.log('LOCAL KEY: ' + localkey)

  const encryptedpubkey = decryptAES(pubkey, localkey).toString()

  console.log('ENCRYPTED KEY: ' + encryptedpubkey)

  const encrypt = new JSEncrypt({ default_key_size: '1024' })

  encrypt.setPublicKey(encryptedpubkey)

  return encrypt
}

function loadPrivateKey(friend: string, password: string) {
  const privkey = window.electron.ipcRenderer.sendSync('get-privkey', friend)
  console.log(privkey)

  const localkey = CryptoJS.SHA1(password).toString()

  const encryptedprivkey = decryptAES(privkey, localkey).toString()

  const encrypt = new JSEncrypt({ default_key_size: '1024' })

  encrypt.setPrivateKey(encryptedprivkey)

  return encrypt
}

function generateSessionKey() {
  // create a 256 bit key using a random number generator, save it as a hex string
  const sessionKey = window.crypto.getRandomValues(new Uint8Array(32))
  const sessionKeyHex = Array.from(sessionKey)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return sessionKeyHex
}

function encryptAES(message: string, sessionKey: string, mode = 'ECB') {
  const newMode = mode === 'ECB' ? CryptoJS.mode.ECB : CryptoJS.mode.CBC

  return CryptoJS.AES.encrypt(message, sessionKey, {
    mode: newMode
  }).toString()
}

function decryptAES(message: string, sessionKey: string) {
  let decrypted = CryptoJS.AES.decrypt(message, sessionKey, {
    mode: CryptoJS.mode.ECB
  })

  if (!decrypted) {
    decrypted = CryptoJS.AES.decrypt(message, sessionKey, {
      mode: CryptoJS.mode.CBC
    })
  }

  return decrypted.toString(CryptoJS.enc.Utf8)
}

export {
  generateKeys,
  saveKeysToFile,
  loadPublicKey,
  loadPrivateKey,
  generateSessionKey,
  encryptAES,
  decryptAES
}
