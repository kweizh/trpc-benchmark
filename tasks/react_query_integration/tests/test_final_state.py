import os
import json
import subprocess
import pytest

PROJECT_DIR = "/home/user/app"

def test_dependencies_installed():
    package_json_path = os.path.join(PROJECT_DIR, "package.json")
    with open(package_json_path) as f:
        data = json.load(f)
    
    deps = data.get("dependencies", {})
    assert "@trpc/react-query" in deps, "Expected '@trpc/react-query' in dependencies."
    assert "@tanstack/react-query" in deps, "Expected '@tanstack/react-query' in dependencies."
    assert "@trpc/server" in deps, "Expected '@trpc/server' in dependencies."
    assert "@trpc/client" in deps, "Expected '@trpc/client' in dependencies."

def test_server_trpc_exports():
    server_path = os.path.join(PROJECT_DIR, "src/server/trpc.ts")
    assert os.path.isfile(server_path), f"{server_path} does not exist."
    with open(server_path) as f:
        content = f.read()
    assert "export const appRouter" in content, "Expected 'export const appRouter' in src/server/trpc.ts."
    assert "export type AppRouter" in content, "Expected 'export type AppRouter' in src/server/trpc.ts."

def test_utils_trpc_exports():
    utils_path = os.path.join(PROJECT_DIR, "src/utils/trpc.ts")
    assert os.path.isfile(utils_path), f"{utils_path} does not exist."
    with open(utils_path) as f:
        content = f.read()
    assert "createTRPCReact" in content, "Expected 'createTRPCReact' in src/utils/trpc.ts."

def test_app_tsx_providers():
    app_path = os.path.join(PROJECT_DIR, "src/App.tsx")
    assert os.path.isfile(app_path), f"{app_path} does not exist."
    with open(app_path) as f:
        content = f.read()
    assert "QueryClientProvider" in content, "Expected 'QueryClientProvider' in src/App.tsx."
    assert "trpc.Provider" in content or "Provider" in content, "Expected trpc Provider in src/App.tsx."

def test_typescript_build():
    """Priority 1: Use CLI to verify build succeeds without type errors."""
    result = subprocess.run(
        ["npm", "run", "build"],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    assert result.returncode == 0, f"'npm run build' failed, there might be TypeScript errors: {result.stderr}\n{result.stdout}"
