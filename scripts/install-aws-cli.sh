#!/bin/sh
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install || true

aws --version
curl "https://s3.us-west-2.amazonaws.com/lightsailctl/latest/linux-amd64/lightsailctl" -o "lightsailctl"
sudo mv "lightsailctl" "/usr/local/bin/lightsailctl"
sudo chmod +x /usr/local/bin/lightsailctl