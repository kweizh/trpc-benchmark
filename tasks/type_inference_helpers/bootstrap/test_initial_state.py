import os
import shutil
import subprocess
import pytest

PROJECT_DIR = "/home/user/project"

def test_node_binary_available():
    assert shutil.which("node") is not None, "node binary not found in PATH."

def test_npm_binary_available():
    assert shutil.which("npm") is not None, "npm binary not found in PATH."

def test_project_dir_exists():
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} does not exist."

def test_server_ts_exists():
    server_path = os.path.join(PROJECT_DIR, "server.ts")
    assert os.path.isfile(server_path), f"File {server_path} does not exist."

def test_client_ts_exists():
    client_path = os.path.join(PROJECT_DIR, "client.ts")
    assert os.path.isfile(client_path), f"File {client_path} does not exist."

def test_package_json_exists():
    pkg_path = os.path.join(PROJECT_DIR, "package.json")
    assert os.path.isfile(pkg_path), f"File {pkg_path} does not exist."

def test_tsconfig_json_exists():
    tsconfig_path = os.path.join(PROJECT_DIR, "tsconfig.json")
    assert os.path.isfile(tsconfig_path), f"File {tsconfig_path} does not exist."
