import open from 'open';
import clipboardy from 'clipboardy';
import sanitizeHtml from 'sanitize-html';
function requestCopy(text: string) {
    // open a new tab with confirmation.
    confirmationKey = crypto.randomUUID()
    content_to_copy = text
    open(`http://localhost:${process.env.PORT || 3000}/confirm?key=${confirmationKey}`)
}
let confirmationKey = null
let content_to_copy = null
function copy(){
    clipboardy.writeSync(content_to_copy!)
    content_to_copy = null
    confirmationKey = null
}
// create bun http server
const server = Bun.serve({
    port: process.env.PORT ||3000,
   async fetch(req) {
// function to convert body to json 
        // const body = await req.json();
        // console.log(body);
        // send response
   if(req.url.endsWith('/copy') && req.method === 'POST') {
        const body = await req.text();
        console.log(body);
requestCopy(body)
        return new Response('copied');
    } else if (req.url.includes('/confirm?') && req.method === 'GET') {
        // 
        return new Response(`<html><body>
            <main><center>
            <h1>Do you want to copy this?</h1>
            <p>${
sanitizeHtml(content_to_copy!)
            }
            </p>
            <button onclick="window.location.href='/confirmed?key=${confirmationKey!}'">Yes</button>
            <button onclick="window.location.href='/'">No</button>
            </center></main>
            </body></html>`, {
                headers: {
                    "Content-Type": "text/html",
                }
            })
    } else if (req.url.includes('/confirmed?') && req.method === 'GET') {
    if(!content_to_copy!) return new Response('not found')
        if(confirmationKey! === req.url.split('key=')[1]){
            copy()
            return new Response('copied');
        }
    }
    return new Response('not found');
    }
});
// server. 