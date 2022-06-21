import { useEffect, useMemo, useState } from "react";
import './App.css';
import { LocalStorageInput } from "./LocalStorageInput";

function App() {
    console.log(process.env)
    const [oktaDomain, setOktaDomain] = useState<string>();
    const [clientId, setClientId] = useState<string>();
    const [accessToken, setAccessToken] = useState<string>();
    const [oktaPopup, setOktaPopup] = useState<Window>();

    /** The URL to open in the popup. */
    const authUrl = useMemo(() => {
        if (!clientId) return;
        try {
            // https://developer.okta.com/docs/reference/api/oidc/#authorize
            const url = new URL(`${oktaDomain}/oauth2/v1/authorize`);
            url.searchParams.set("redirect_uri", window.location.href);
            url.searchParams.set("client_id", clientId);
            url.searchParams.set("response_type", "token");
            url.searchParams.set("scope", "openid");
            url.searchParams.set("state", "some-state");
            url.searchParams.set("nonce", "some-nonce");
            url.searchParams.set("response_mode", "okta_post_message");
            return url.toString();
        }
        catch (e) { return; }
    }, [oktaDomain, clientId]);

    // listener for okta to send an access token
    useEffect(() => window.addEventListener("message", event => {
        if (event.data.source === "react-devtools-bridge") return;
        if (event.origin !== oktaDomain) return;

        console.log(event.data)
        const { access_token, error } = event.data;
        oktaPopup?.close();
        if (error) throw event.data;
        setAccessToken(access_token);
    }), [oktaDomain, oktaPopup]);

    return <div>
        <form onSubmit={(e) => {
            e.preventDefault();
            if (!authUrl) return;
            const oktaPopup = window.open(authUrl);
            if (!oktaPopup) return alert("Please disable popup blocker. Cannot pop up OKTA signin page.")
            setOktaPopup(oktaPopup);
        }}>
            <LocalStorageInput
                placeholder="https://example.okta.com"
                lsKey="okta-domain"
                onChange={setOktaDomain}
            />
            <LocalStorageInput
                placeholder="Client ID"
                lsKey="client-id"
                onChange={setClientId}
            />
            <textarea cols={50} rows={5} value={authUrl} /> <br />
            <button type="submit">Authenticate</button>
        </form>
        <hr />

        {accessToken
            ? <div>
                <h1>✅ Successfully retreived access token!</h1>
                <textarea rows={10} cols={50} value={accessToken} />
            </div>
            : <div>Waiting for access token...</div>
        }
    </div>;
}

export default App;
