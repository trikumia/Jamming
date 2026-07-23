const CLIENT_ID = "c7ce8efb5bde49b0a7ebb8ee239debae";
const REDIRECT_URI = "http://127.0.0.1:5173/callback";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPES = [
    "playlist-modify-public",
    "playlist-modify-private",
];

let accessToken = "";
let tokenExpirationTime = 0;

const buildAuthUrl = () => {
    const scope = encodeURIComponent(SCOPES.join(" "));
    return `${AUTH_ENDPOINT}?client_id=${encodeURIComponent(CLIENT_ID)}&response_type=${RESPONSE_TYPE}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${scope}`;
};

const clearUrlHash = () => {
    window.history.pushState({}, document.title, window.location.pathname);
};

const clearAccessToken = () => {
    accessToken = "";
    tokenExpirationTime = 0;
};

const setAccessTokenFromUrl = () => {
    const hash = window.location.hash.substring(1); // remove '#'
    const params = new URLSearchParams(hash);
    const token = params.get("access_token");
    const expiresIn = params.get("expires_in");

    if (!token || !expiresIn) {
        return null;
    }

    accessToken = token;
    tokenExpirationTime = Date.now() + Number(expiresIn) * 1000; // Convert to milliseconds

    window.setTimeout(clearAccessToken, Number(expiresIn) * 1000); // Clear token after expiration
    clearUrlHash();

    return accessToken;
};

export const authorize = () => {
    window.location = buildAuthUrl();
};

export const getAccessToken = () => {
    if (accessToken && Date.now() < tokenExpirationTime) {
        return accessToken;
    }
    const tokenFromUrl = setAccessTokenFromUrl();
    if (tokenFromUrl) {
        return tokenFromUrl;
    }
    return null;
};

export const spotifyRequest = async (endpoint, options = {}) => {
    const token = getAccessToken();
    if(!token) {
        throw new Error("Spotify access token is not available. Please authorize first.");
    }

    const cleanedEndpoint = endpoint.replace(/^\/+/, ""); // Remove leading slashes
    const url = `https://api.spotify.com/v1/${cleanedEndpoint}`;
    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers, 
    };

    if (options.body) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });
    
    if (!response.ok) {
        if (response.status === 401) {
            clearAccessToken();
        }
        throw new Error(`Spotify request failed: ${response.status}`);
    }

    return response.json();
};