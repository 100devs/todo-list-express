// Similar to the fetch method, but you can put anything here and it'll be converted to JSON to send.
function sendJSON(url, json, init = {}) {
    return fetch(url, Object.assign(init, {
        body: JSON.stringify(json),
        headers: {"Content-Type": "application/json"},
    }));
}