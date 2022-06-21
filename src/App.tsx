import { useState } from "react";
import './App.css';
import { LocalStorageInput } from "./LocalStorageInput";

function App() {
    const [url, setUrl] = useState<string>();

    return <div>
        <form>
            <LocalStorageInput placeholder="https://example.okta.com" key="url" onChange={setUrl} />
            <LocalStorageInput placeholder="Client ID" key="client-id" onChange={setUrl} />
            <button type="submit">Authenticate</button>
        </form>
    </div>;
}

export default App;
