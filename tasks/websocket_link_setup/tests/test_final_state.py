import os
import subprocess
import pytest

PROJECT_DIR = "/home/user/app"

def test_typecheck():
    """Priority 1: Use npm run typecheck to verify TypeScript compilation."""
    result = subprocess.run(
        ["npm", "run", "typecheck"],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    assert result.returncode == 0, \
        f"'npm run typecheck' failed. There are TypeScript errors: {result.stdout}\n{result.stderr}"

def test_test_suite():
    """Priority 1: Use npm test to verify the client configuration logic."""
    result = subprocess.run(
        ["npm", "test"],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    assert result.returncode == 0, \
        f"'npm test' failed. The client configuration is incorrect: {result.stdout}\n{result.stderr}"

def test_client_ts_content():
    """Priority 3: Check specific strings in client.ts to ensure splitLink is used correctly."""
    client_path = os.path.join(PROJECT_DIR, "src", "client.ts")
    with open(client_path, "r") as f:
        content = f.read()
        
    assert "splitLink" in content, "Expected 'splitLink' to be used in client.ts."
    assert "wsLink" in content, "Expected 'wsLink' to be used in client.ts."
    assert "createWSClient" in content, "Expected 'createWSClient' to be used in client.ts."
    assert "ws://localhost:3001" in content, "Expected WebSocket URL 'ws://localhost:3001' in client.ts."
    assert "http://localhost:3000/trpc" in content, "Expected HTTP URL 'http://localhost:3000/trpc' in client.ts."
    assert "notifications.onNewMessage" in content, "Expected 'notifications.onNewMessage' as the split condition in client.ts."
    assert "export const trpcClient" in content, "Expected 'trpcClient' to be exported in client.ts."
