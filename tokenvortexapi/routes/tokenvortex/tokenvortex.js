const crypto = require('crypto');
var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var cors = require('cors');
router.use(cors());
router.use(express.json({limit: '50mb'}));
router.use(express.urlencoded({limit: '50mb',extended: false}));
router.use(bodyParser.json({extended: false}));

router.use(cors());
var sequencesRouter = require('./api/sequences/sequences');
var btcRouter = require('./api/btc/btc');
var stepsRouter = require('./api/steps/steps');
var logsRouter = require('./api/logs/logs');
var entitiesRouter = require('./api/entities/entities');
const { generateKeyPair } = require('crypto');

router.use('/sequences', sequencesRouter); 
router.use('/steps', stepsRouter);
router.use('/btc', btcRouter);
router.use('/logs', logsRouter);
router.use('/entities', entitiesRouter);


router.get('/generatekeypair/:_id', function(req, res) {
    let tmpPassphrase = req.params._id || '';
    generateKeyPair('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: tmpPassphrase
      }
    }, (err, public, private) => {
        let privateKey = private.split('-----')[2];
        let publicKey = public.split('-----')[2];
        let result = {privateKey,publicKey};
        res.send(result);
    });
  });
    
  
router.get('/newSecretHashPair/', function(req, res) {
    let hashPair = newSecretHashPair();
     return  res.json(hashPair);
  });
  
const bufToStr = b => '0x' + b.toString('hex');

const sha256 = x =>
  crypto
    .createHash('sha256')
    .update(x)
    .digest()

const random32 = () => crypto.randomBytes(32)

const isSha256Hash = hashStr => /^0x[0-9a-f]{64}$/i.test(hashStr)

const newSecretHashPair = () => {
  const secret = random32()
  const hash = sha256(secret)
  return {
    secret: bufToStr(secret),
    hash: bufToStr(hash),
  }
}


module.exports = router;
