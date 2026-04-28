import os
import subprocess
import pytest

PROJECT_DIR = "/home/user/project"

def test_test_script_exists():
    test_path = os.path.join(PROJECT_DIR, "test.ts")
    assert os.path.isfile(test_path), f"test.ts not found at {test_path}"

def test_router_script_exists():
    router_path = os.path.join(PROJECT_DIR, "router.ts")
    assert os.path.isfile(router_path), f"router.ts not found at {router_path}"

def test_test_script_execution():
    result = subprocess.run(
        ["npx", "tsx", "test.ts"],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    assert result.returncode == 0, f"'npx tsx test.ts' failed with stderr: {result.stderr}"
    assert "Hello, World!" in result.stdout, f"Expected 'Hello, World!' in stdout, got: {result.stdout}"
