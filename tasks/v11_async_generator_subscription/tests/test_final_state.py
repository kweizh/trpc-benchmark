import os
import subprocess
import pytest

PROJECT_DIR = "/home/user/project"

def test_dependencies_installed():
    package_json_path = os.path.join(PROJECT_DIR, "package.json")
    with open(package_json_path) as f:
        content = f.read()
    assert "@trpc/server" in content, "@trpc/server is not installed."
    assert "@trpc/client" in content, "@trpc/client is not installed."
    assert "zod" in content, "zod is not installed."

def test_server_and_client_files_exist():
    assert os.path.isfile(os.path.join(PROJECT_DIR, "server.ts")), "server.ts does not exist."
    assert os.path.isfile(os.path.join(PROJECT_DIR, "client.ts")), "client.ts does not exist."

def test_client_uses_http_subscription_link():
    with open(os.path.join(PROJECT_DIR, "client.ts")) as f:
        content = f.read()
    assert "httpSubscriptionLink" in content, "client.ts does not use httpSubscriptionLink."

def test_server_uses_async_generator():
    with open(os.path.join(PROJECT_DIR, "server.ts")) as f:
        content = f.read()
    assert "async function*" in content or "async function *" in content, "server.ts does not use an async generator for the subscription."

def test_subscription_output_log():
    log_path = os.path.join(PROJECT_DIR, "output.log")
    assert os.path.isfile(log_path), "output.log does not exist. Did you run the client script and redirect output?"
    with open(log_path) as f:
        content = f.read()
    assert "3" in content, "Expected 3 in the subscription output."
    assert "2" in content, "Expected 2 in the subscription output."
    assert "1" in content, "Expected 1 in the subscription output."
