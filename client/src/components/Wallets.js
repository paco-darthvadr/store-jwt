import { Card } from "react-bootstrap";

//import {Row, Col} from 'react-bootstrap';
function Wallets() {

    return (
        <>
            <h1 align="center" className="p-3">Download a wallet</h1><br/>
            <p align="center">There are a few options for a wallet. Choose from ether CLI, GUI or Mobile wallets.<br/>
            Please make sure to download from an official source and <h3>Save Your Keys</h3><br/>
            <Card>
                <Card.Body>
            For Mobile go to <a href="https://github.com/VerusCoin/Verus-Mobile/releases/tag/v1.0.6">Here</a><br/>
            <br/>
            For GUI go to <a href="https://github.com/VerusCoin/Verus-Desktop/releases/tag/v1.1.2">Here</a><br/>
            <br/>
            For CLI go to <a href="https://github.com/VerusCoin/VerusCoin/releases/tag/v1.1.2">Here</a><br/>
            </Card.Body>
            </Card>
            </p>
        </>
    )
}

export default Wallets;