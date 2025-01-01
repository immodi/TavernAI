const { spawn } = require("child_process");

// Define the command and arguments
const cloudflaredCmd = "./cloudflared";
const args = ["tunnel", "--url", "http://localhost:7860"];

// Spawn the cloudflared subprocess
const cloudflaredProcess = spawn(cloudflaredCmd, args);

// This will store the tunnel URL
let tunnelUrl = "";
let isMessageSent = false;

// Handle standard output (stdout)
cloudflaredProcess.stdout.on("data", (data) => {
  if (getUrl(data) != null) {
    console.log(`cloudflared: ${getUrl(data)}`);
  }
});

// Handle standard error (stderr)
cloudflaredProcess.stderr.on("data", (data) => {
  if (getUrl(data) != null && !isMessageSent) {
    // sendNotification(getUrl(data));
    console.log(`cloudflared: ${getUrl(data)}`);
  }
});

// Handle process exit
cloudflaredProcess.on("close", (code) => {
  console.log(`cloudflared process exited with code ${code}`);
  if (tunnelUrl) {
    console.log(`Final Tunnel URL: ${tunnelUrl}`);
  } else {
    console.log("No Tunnel URL found in the output.");
  }
});

// Handle any errors when spawning the process
cloudflaredProcess.on("error", (err) => {
  console.error("Failed to start cloudflared process:", err);
});

const getUrl = (data) => {
  const urlRegex = /(https:\/\/[a-zA-Z0-9.-]+\.trycloudflare\.com)/;
  const output = data.toString();

  // Try to extract the tunnel URL from the output
  const match = output.match(urlRegex);
  if (match) {
    tunnelUrl = match[1];
  } else {
    tunnelUrl = null;
  }

  return tunnelUrl;
};

// const sendNotification = (message) => {
//   (async () => {
//     const fetch = await import("node-fetch").then((module) => module.default);
//     fetch("http://ntfy/tavern", {
//       method: "POST",
//       body: "The Tavern AI golabal link.",
//       headers: {
//         Priority: "urgent",
//         Actions: `view, Open Link, ${message}`,
//       },
//     })
//       .then(() => {
//         isMessageSent = true;
//       })
//       .catch((err) => {
//         console.error("err: " + err);
//       });
//   })();
// };
