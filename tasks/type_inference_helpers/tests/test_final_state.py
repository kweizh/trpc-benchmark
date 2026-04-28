import os
import subprocess
import pytest

PROJECT_DIR = "/home/user/project"

def test_tsc_no_emit():
    """Verify there are no TypeScript errors in the project."""
    result = subprocess.run(
        ["npx", "tsc", "--noEmit"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"TypeScript compilation failed:\n{result.stdout}\n{result.stderr}"

def test_client_functions():
    """Verify the exported functions in client.ts behave correctly."""
    # First compile the TypeScript files
    compile_result = subprocess.run(
        ["npx", "tsc"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert compile_result.returncode == 0, f"Failed to compile TypeScript files:\n{compile_result.stdout}\n{compile_result.stderr}"

    # Write a test script to verify the functions
    test_script_path = os.path.join(PROJECT_DIR, "verify_client.js")
    with open(test_script_path, "w") as f:
        f.write("""
const client = require('./client');

try {
    const user = { id: 1, name: 'TestUser' };
    const printed = client.printUser(user);
    if (printed !== 'User: TestUser') {
        console.error('printUser returned incorrect value: ' + printed);
        process.exit(1);
    }

    const defaultInput = client.getDefaultCreateUserInput();
    if (!defaultInput || defaultInput.name !== 'Default') {
        console.error('getDefaultCreateUserInput returned incorrect value: ' + JSON.stringify(defaultInput));
        process.exit(1);
    }

    console.log('Success');
} catch (err) {
    console.error('Error executing client functions:', err);
    process.exit(1);
}
""")

    # Run the test script
    run_result = subprocess.run(
        ["node", "verify_client.js"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    
    assert run_result.returncode == 0, f"Client function verification failed:\n{run_result.stderr}"
    assert "Success" in run_result.stdout, f"Client function verification did not print Success:\n{run_result.stdout}"

def test_exported_types():
    """Verify that the required types are exported from client.ts using a TypeScript test file."""
    test_ts_path = os.path.join(PROJECT_DIR, "verify_types.ts")
    with open(test_ts_path, "w") as f:
        f.write("""
import { RouterInput, RouterOutput, User, CreateUserInput } from './client';

// These assignments will fail to compile if the types are incorrect
const input: RouterInput = { user: { createUser: { name: 'test' } } };
const output: RouterOutput = { user: { getUser: { id: 1, name: 'test' }, createUser: { id: 2, name: 'test' } } };

const user: User = { id: 1, name: 'test' };
const createInput: CreateUserInput = { name: 'test' };

// To prevent unused variable errors if strict is on
console.log(input, output, user, createInput);
""")

    # Compile the test file to check types
    result = subprocess.run(
        ["npx", "tsc", "--noEmit"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    
    assert result.returncode == 0, f"Type verification failed. The exported types in client.ts are missing or incorrect:\n{result.stdout}\n{result.stderr}"
