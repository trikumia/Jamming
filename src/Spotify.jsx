const CLIENT_ID = "c7ce8efb5bde49b0a7ebb8ee239debae";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const RESPONSE_TYPE = "code";
const SCOPES = [
    "playlist-modify-public",
    "playlist-modify-private",
];

let accessToken = "";
let tokenExpirationTime = 0;

const getRedirectUri = () => `${window.location.origin}/callback`;

const generateRandomString = (length = 128) => {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => ("0" + byte.toString(16)).slice(-2)).join("");
};

const base64UrlEncode = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let str = "";
  for (const byte of bytes) {
    str += String.fromCharCode(byte);
  }
  return btoa(str)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const sha256 = async (plain) => {
  const encoder = new TextEncoder();
  return await window.crypto.subtle.digest("SHA-256", encoder.encode(plain));
};

const buildAuthUrl = (codeChallenge) => {
    const scope = encodeURIComponent(SCOPES.join(" "));
    const redirectUri = encodeURIComponent(getRedirectUri());
    return `${AUTH_ENDPOINT}?client_id=${encodeURIComponent(CLIENT_ID)}&response_type=${RESPONSE_TYPE}&redirect_uri=${redirectUri}&scope=${scope}&code_challenge_method=S256&code_challenge=${encodeURIComponent(codeChallenge)}`;
};

const clearUrlQuery = () => {
  window.history.pushState({}, document.title, window.location.pathname);
};

const clearAccessToken = () => {
    accessToken = "";
    tokenExpirationTime = 0;
};

const setAccessTokenFromCode = async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (!code) return null;

    const verifier = sessionStorage.getItem("spotify_code_verifier");
    if (!verifier){
        throw new Error("Spotify PKCE verifier was not found. Please try again.");
        }
    const body = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: getRedirectUri(),
        client_id: CLIENT_ID,
        code_verifier: verifier,   
    });

    const response = await fetch (TOKEN_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type" : "application/x-www-form-urlencoded",
        },
        body: body.toString(),
    });

    if (!response.ok) {
    let errorMessage = `Spotify token exchange failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage += `: ${errorData.error_description || errorData.error || "unknown error"}`;
    } catch {
      const errorText = await response.text();
      errorMessage += `: ${errorText}`;
    }

    sessionStorage.removeItem("spotify_code_verifier");
    clearUrlQuery();
    
    throw new Error(errorMessage);
  }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpirationTime = Date.now() + Number(data.expires_in) * 1000;
    sessionStorage.removeItem("spotify_code_verifier");
    clearUrlQuery();

    window.setTimeout(clearAccessToken, Number(data.expires_in) * 1000);
    return accessToken;
};

export const authorize = async () => {
  const verifier = generateRandomString(128);
  const challenge = base64UrlEncode(await sha256(verifier));
  sessionStorage.setItem("spotify_code_verifier", verifier);
  window.location = buildAuthUrl(challenge);
};


export const getAccessToken = async () => {
    if (accessToken && Date.now() < tokenExpirationTime) {
        return accessToken;
    }

    const tokenFromCode = await setAccessTokenFromCode();
    if (tokenFromCode) {
        return tokenFromCode;
    }
    return null;
};

export const spotifyRequest = async (endpoint, options = {}) => {
    const token = await getAccessToken();
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