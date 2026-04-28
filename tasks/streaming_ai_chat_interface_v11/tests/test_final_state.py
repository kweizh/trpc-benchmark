import os
import json
import subprocess
import pytest

PROJECT_DIR = "/home/user/project"

def test_dependencies_installed():
    package_json_path = os.path.join(PROJECT_DIR, "package.json")
    with open(package_json_path) as f:
        pkg = json.load(f)
    
    deps = pkg.get("dependencies", {})
    assert "@trpc/server" in deps, "@trpc/server not found in dependencies."
    assert "@trpc/client" in deps, "@trpc/client not found in dependencies."
    assert "@trpc/react-query" in deps, "@trpc/react-query not found in dependencies."
    assert "@tanstack/react-query" in deps, "@tanstack/react-query not found in dependencies."

def test_http_batch_stream_link_used():
    cmd = ["grep", "-rnw", PROJECT_DIR, "-e", "httpBatchStreamLink"]
    result = subprocess.run(cmd, capture_output=True, text=True)
    assert result.returncode == 0, "httpBatchStreamLink not found in any project file."

def test_async_generator_used():
    cmd = ["grep", "-rnE", "async\\s+function\\s*\\*", PROJECT_DIR]
    result = subprocess.run(cmd, capture_output=True, text=True)
    assert result.returncode == 0, "async generator (async function*) not found in any project file."

def test_project_builds():
    result = subprocess.run(["npm", "run", "build"], cwd=PROJECT_DIR, capture_output=True, text=True)
    assert result.returncode == 0, f"Project failed to build. Output:\n{result.stderr}\n{result.stdout}"
