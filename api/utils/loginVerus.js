const { Client } = require('verus-typescript-primitives/dist/vdxf/classes/Client');
const {LOGIN_CONSENT_REQUEST_SIG_VDXF_KEY, LOGIN_CONSENT_REDIRECT_VDXF_KEY, VerusIDSignature, LoginConsentRequest}  = require('verus-typescript-primitives');
const { Challenge } = require('verus-typescript-primitives/dist/vdxf/classes/Challenge');
//const { default: VerusIdInterface} = require("../../verusid-ts-client/lib/VerusIdInterface");
const deep = require("./deepLink");
const { signMessage } = require("./nodeCalls");
const jwt = require("jsonwebtoken");

//const verusd = new VerusIdInterface("vrsctest", "http://api.verus.services",config)

const { 
    v1: uuidv1,
    v4: uuidv4,
  } = require('uuid');

const verusLogin = async () => {
   
    const challengeClient = new Client({
        client_id: 'yolo1',
        name: 'yolo1',
        //@ts-ignore
        redirect_uris: ["http://localhost:3000/verifylogin?"].map(uri => ({type: LOGIN_CONSENT_REDIRECT_VDXF_KEY.vdxfid, uri})),
    })
    console.log("ChallangeClient", challengeClient.toString());

    const uuid = uuidv4();

    const token = jwt.sign(   
        { uuid: uuid },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "2h",
        }
      );

    const challengeParams  = {
        uuid: uuid,
        request_url:"",
        login_challenge: token,
        requested_scope: ["i71AgMMLXfU5MsN1STecDDVhS9FpdxJ9sh"], 
        client: challengeClient
    }

    const loginConsentChallenge = new Challenge(challengeParams);

    console.log("message to be signed: ", loginConsentChallenge.toString());
    const result = await signMessage(loginConsentChallenge);

    //let buff = loginConsentChallenge.toString();
   // console.log("buff", buff);

    const signature = result; 
    
    const verusIdSignature = new VerusIDSignature({signature
    }, LOGIN_CONSENT_REQUEST_SIG_VDXF_KEY);

    //console.log("here", signature.toString())

    const loginConsentRequest = new LoginConsentRequest({
        chain_id: "iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq",
        signing_id: 'yolo1@',
        signature: verusIdSignature,
        challenge: loginConsentChallenge,
        redirect_uris: ["http://localhost:3000/login"].map(uri => ({type: LOGIN_CONSENT_REDIRECT_VDXF_KEY.vdxfid, uri})),
    });

    console.log("Key",LOGIN_CONSENT_REDIRECT_VDXF_KEY.vdxfid)


    const walletRedirectUrl = deep(loginConsentRequest);
    console.log("walletRedirectUrl:\n", walletRedirectUrl);
    
    return walletRedirectUrl;
    //window.location.assign(walletRedirectUrl);
  
};

module.exports = verusLogin ;