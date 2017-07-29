var bs58check = require('bs58check');
var secp256k1 = require('secp256k1');
var bigi = require('bigi');
var zcrypto = require('./crypto');
var zconfig = require('./config');

/*
 * Converts a private key to WIF format
 * @param {String} privKey (private key)
 * @return {Sting} WIF format (uncompressed)
 */
function mkPrivKey(phrase) {
  return zcrypto.sha256(Buffer.from(phrase, 'utf-8'));
}

/*
 * Converts a private key to WIF format
 * @param {String} privKey (private key)
 * @return {Sting} WIF format (uncompressed)
 */
function privKeyToWIF(privKey) {
  // Add '01' to the end if you want the compressed version
  return bs58check.encode(Buffer.from(zconfig.wif + privKey, 'hex'));
}

/*
 * Returns private key's public Key
 * @param {String} privKey (private key)
 * @return {Sting} Public Key (default: uncompressed)
 */
function privKeyToPubKey(privKey, toCompressed) {
  toCompressed = toCompressed || false;

  const pkBuffer = Buffer.from(privKey, 'hex');
  var publicKey = secp256k1.publicKeyCreate(pkBuffer, toCompressed);
  return publicKey.toString('hex');
}

/*
 * Given a WIF format pk, convert it back to the original pk
 * @param {String} privKey (private key)
 * @return {Sting} Public Key (uncompressed)
 */
function WIFToPrivKey(wifPk) {
  var og = bs58check.decode(wifPk, 'hex').toString('hex');
  og = og.substr(2, og.length); // remove WIF format ('80')

  // remove the '01' at the end to 'compress it' during WIF conversion
  if (og.length > 64) {
    og = og.substr(0, 64);
  }

  return og;
}

/*
 * Converts public key to zencash address
 * @param {String} pubKey (public key)
 * @return {Sting} zencash address
 */
function pubKeyToAddr(pubKey) {
  const hash160 = zcrypto.hash160(Buffer.from(pubKey, 'hex'));
  return bs58check.encode(Buffer.from(zconfig.pubKeyHash + hash160, 'hex')).toString('hex');
}

module.exports = {
  mkPrivKey: mkPrivKey,
  privKeyToWIF: privKeyToWIF,
  privKeyToPubKey: privKeyToPubKey,
  pubKeyToAddr: pubKeyToAddr,
  WIFToPrivKey: WIFToPrivKey
};