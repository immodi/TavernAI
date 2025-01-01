const { spawn } = require("child_process");

// Define the command and arguments
const cloudflaredCmd = "./cloudflared";
const args = ["tunnel", "--url", "http://localhost:7860"];

// Spawn the cloudflared subprocess
const cloudflaredProcess = spawn(cloudflaredCmd, args);

// This will store the tunnel URL
let tunnelUrl = "";
let isMessageSent = false;
let outputBuffer = "";

// Handle standard output (stdout)
cloudflaredProcess.stdout.on("data", (data) => {
  outputBuffer += data.toString();
  const url = getUrl(outputBuffer);
  if (url && !isMessageSent) {
    tunnelUrl = url;
    console.log(`cloudflared: ${url}`);
    // sendNotification(url);
    isMessageSent = true;
  }
});

// Handle standard error (stderr)
cloudflaredProcess.stderr.on("data", (data) => {
  outputBuffer += data.toString();
  const url = getUrl(outputBuffer);
  if (url && !isMessageSent) {
    tunnelUrl = url;
    console.log(`cloudflared: ${url}`);
    // sendNotification(url);
    isMessageSent = true;
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
  const match = data.match(urlRegex);
  return match ? match[1] : null;
};

// const sendNotification = (message) => {
//   (async () => {
//     const fetch = await import("node-fetch").then((module) => module.default);
//     fetch("http://ntfy/tavern", {
//       method: "POST",
//       body: `The Tavern AI global link: ${message}`,
//       headers: {
//         Priority: "urgent",
//         Actions: `view, Open Link, ${message}`,
//       },
//     })
//       .then(() => {
//         console.log("Notification sent successfully.");
//       })
//       .catch((err) => {
//         console.error("Failed to send notification:", err);
//       });
//   })();
// };
