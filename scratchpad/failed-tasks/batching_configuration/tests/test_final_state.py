import os
import subprocess
import pytest

PROJECT_DIR = "/home/user/project"
CLIENT_FILE = os.path.join(PROJECT_DIR, "client.ts")

def test_http_batch_link_imported():
    """Verify that httpBatchLink is imported from @trpc/client."""
    assert os.path.isfile(CLIENT_FILE), f"Client file not found at {CLIENT_FILE}"
    
    with open(CLIENT_FILE, 'r') as f:
        content = f.read()
        
    assert "httpBatchLink" in content, "httpBatchLink is not imported or used in client.ts"
    assert "from '@trpc/client'" in content, "@trpc/client import is missing"

def test_http_link_removed():
    """Verify that httpLink is no longer used."""
    assert os.path.isfile(CLIENT_FILE), f"Client file not found at {CLIENT_FILE}"
    
    with open(CLIENT_FILE, 'r') as f:
        content = f.read()
        
    # It might still be in the import statement if they just added httpBatchLink, 
    # but it shouldn't be used in the links array.
    # A stricter check: httpLink({ should not be present
    assert "httpLink({" not in content.replace(" ", ""), "httpLink is still being used in the links array"

def test_client_runs_successfully():
    """Verify that the client script runs without errors, implying correct setup."""
    # Start the server in the background
    server_process = subprocess.Popen(
        ["npx", "tsx", "server.ts"],
        cwd=PROJECT_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    import time
    time.sleep(2) # Wait for server to start
    
    try:
        # Run the client
        result = subprocess.run(
            ["npx", "tsx", "client.ts"],
            cwd=PROJECT_DIR,
            capture_output=True,
            text=True,
            timeout=10
        )
        
        assert result.returncode == 0, f"Client script failed to run: {result.stderr}"
        assert "Hello world 1" in result.stdout, "Expected output from client not found"
        
    finally:
        # Terminate the server
        server_process.terminate()
        server_process.wait(timeout=5)
