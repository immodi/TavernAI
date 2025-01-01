#!/bin/bash

echo "Testing DNS..."

ping -c 1 api.trycloudflare.com || echo "DNS warning, continuing anyway..."
cloudflared tunnel --url http://localhost:7860 & node server.js
