import { useMemo, useState } from "react";
import './App.css';
import { LocalStorageInput } from "./LocalStorageInput";

function App() {
    const [oktaDomain, setOktaDomain] = useState<string>();
    const [clientId, setClientId] = useState<string>();

    const authUrl = useMemo(() => {
        if (!clientId) return;
        try {
            const url = new URL(`${oktaDomain}/oauth2/v1/authorize`);
            url.searchParams.set("redirect_uri", window.location.href);
            url.searchParams.set("client_id", clientId);
            url.searchParams.set("response_type", "token id_token");
            url.searchParams.set("scope", "openid");
            url.searchParams.set("state", "some-state");
            url.searchParams.set("nonce", "some-nonce");
            return url.toString();
        }
        catch (e) { return; }
    }, [oktaDomain, clientId]);

    return <div>
        <form onSubmit={(e) => {
            e.preventDefault();
            if (!authUrl) return;
            window.open(authUrl);
        }}>
            <LocalStorageInput placeholder="https://example.okta.com" lsKey="okta-domain" onChange={setOktaDomain} />
            <LocalStorageInput placeholder="Client ID" lsKey="client-id" onChange={setClientId} />
            <pre>{authUrl}</pre>
            <button type="submit">Authenticate</button>
        </form>
    </div>;
}

export default App;
