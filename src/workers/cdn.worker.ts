const ctx: Worker = self as any;

ctx.postMessage("Hello from CDN worker!");

ctx.addEventListener("message", (event) => {});
