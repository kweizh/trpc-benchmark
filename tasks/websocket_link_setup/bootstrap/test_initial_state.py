import os
import shutil
import subprocess
import pytest

PROJECT_DIR = "/home/user/app"

def test_npm_binary_available():
    assert shutil.which("npm") is not None, "npm binary not found in PATH."

def test_project_directory_exists():
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} does not exist."

def test_client_ts_exists():
    client_path = os.path.join(PROJECT_DIR, "src", "client.ts")
    assert os.path.isfile(client_path), f"Client file {client_path} does not exist."

def test_package_json_exists():
    package_json_path = os.path.join(PROJECT_DIR, "package.json")
    assert os.path.isfile(package_json_path), f"Package file {package_json_path} does not exist."
