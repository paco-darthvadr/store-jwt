const { VerusIdInterface, primitives } = require("../../verusid-ts-client");
const axios = require("axios");
const express = require("express");
const cors = require("cors");


const app = express();

const vrsctest = axios.create({
    baseURL: "http://localhost:18299/" , //process.env.VRSCTEST_RPC_URL,
    auth: {
        username: "verusdesktop" , //process.env.VRSCTEST_RPC_USER || '',
        password: "fBMqvHKVQpDkjKSYPQbVjF7hU8FgsiaWon0TVy0TovI", // process.env.VRSCTEST_RPC_PASSWORD || '',
    }
});


const verusClient = {
    vrsctest,
    // add more verus pbaas chain clients here
}

app.post("/verusIdLogin", async (req,res) => {
    const verusd = new VerusIdInterface("vrsctest", "http://localhost", vrsctest);

    const identityres = await verusClient['vrsctest'].post('', {
        jsonrpc: '2.0',
        method: 'getidentity',
        params: [
            "yolo1@"
        ]
    });
    console.log(identityres.data.result)

    const info = await verusClient['vrsctest'].post('', {
        jsonrpc: '2.0',
        method: 'getinfo',
        params: []
    });
    console.log(info.data.result);

    const challenge = await verusClient['vrsctest'].post('', {
        jsonrpc: '2.0',
        method: 'getvdxfid',
        params: [`yolo1.${uuidv4()}`]
    });
    console.log(challenge.data.result);

    const loginConsentRequest = await verusd.createLoginConsentRequest(
        "i71AgMMLXfU5MsN1STecDDVhS9FpdxJ9sh", // yolo1@
        new primitives.LoginConsentChallenge({
            challenge_id: challenge.data.result.vdxfid,
            requested_access: [
                new primitives.RequestedPermission(primitives.IDENTITY_VIEW.vdxfid),
            ],
            request_uris: [
                `http://localhost:3000/verifylogin?`,
                primitives.LOGIN_CONSENT_REDIRECT_VDXF_KEY.vdxfid
            ],
            subject: [
                new primitives.Subject(
                    `http://localhost:${Number(process.env.PORT)}/api/provision`,
                    primitives.LOGIN_CONSENT_WEBHOOK_VDXF_KEY.vdxfid
                ),
            ],
            created_at: Number((Date.now() / 1000).toFixed(0)),
        }),
        "UuTgbGEQ2ZJVm5JzmYk8Qp2Uju9qWjXrScvHmCKhCagks2LBQJpT",
        identityres.data.result,
        info.data.result.longestchain,
        "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV"
    );

    const deepLink = loginConsentRequest.toWalletDeeplinkUri();
    res.send({
        "challengeId": challenge.data.result.vdxfid,
        "deepLink": deepLink,
    });
});