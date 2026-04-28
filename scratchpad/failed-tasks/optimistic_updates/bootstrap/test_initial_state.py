import os
import shutil
import subprocess
import pytest

PROJECT_DIR = "/home/user/app"

def test_project_dir_exists():
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} does not exist."

def test_package_json_exists():
    pkg_path = os.path.join(PROJECT_DIR, "package.json")
    assert os.path.isfile(pkg_path), f"package.json not found at {pkg_path}."
    with open(pkg_path, 'r') as f:
        content = f.read()
    assert "@trpc/client" in content, "tRPC not found in package.json."
    assert "@tanstack/react-query" in content, "React Query not found in package.json."

def test_page_tsx_exists():
    page_path = os.path.join(PROJECT_DIR, "src", "app", "page.tsx")
    assert os.path.isfile(page_path), f"page.tsx not found at {page_path}."

def test_node_installed():
    assert shutil.which("node") is not None, "node binary not found in PATH."
    assert shutil.which("npm") is not None, "npm binary not found in PATH."
