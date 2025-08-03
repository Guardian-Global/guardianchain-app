#!/bin/bash
echo "🔧 Installing Veritas Node..."
sudo apt update && sudo apt install -y git python3-pip
git clone https://github.com/guardianchain/veritas-node.git
cd veritas-node
pip3 install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
