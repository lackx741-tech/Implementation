#!/usr/bin/env bash
set -euo pipefail

# Development-only deployment helper. Provide RPC_URL and DEPLOYER_PRIVATE_KEY
# locally through an untracked environment file. Never commit credentials.
: "${RPC_URL:?Set RPC_URL for a local or test network}"
: "${DEPLOYER_PRIVATE_KEY:?Set DEPLOYER_PRIVATE_KEY in the shell environment}"

forge create contracts/src/WorkflowRegistry.sol:WorkflowRegistry \
  --rpc-url "$RPC_URL" \
  --private-key "$DEPLOYER_PRIVATE_KEY" \
  --broadcast
