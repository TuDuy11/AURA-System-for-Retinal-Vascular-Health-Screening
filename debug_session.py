#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Debug script để kiểm tra session persistence
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from dotenv import load_dotenv
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(env_path)

from create_app import create_app
import json

app = create_app()
client = app.test_client()

print("\n" + "="*70)
print("DEBUG: SESSION PERSISTENCE TEST")
print("="*70 + "\n")

# Test 1: Register user
print("STEP 1: Register new user")
print("-" * 50)
register_data = {
    "email": "debug_test@example.com",
    "password": "TestPass123",
    "fullName": "Debug Test"
}
resp = client.post('/api/auth/register', 
                   data=json.dumps(register_data),
                   content_type='application/json')
print(f"Response Status: {resp.status_code}")
result = resp.get_json()
print(f"Response Data: {json.dumps(result, indent=2)[:200]}...")

if resp.status_code != 201:
    print(f"❌ REGISTER FAILED! Response: {result}")
    sys.exit(1)

user_id = result['data']['user']['id']
new_token = result['data']['accessToken']
print(f"[OK] User registered: ID={user_id[:8]}...")

# Test 2: Immediately try to login with same credentials
print("\n\nSTEP 2: Login with same credentials (immediate)")
print("-" * 50)
login_data = {
    "email": "debug_test@example.com",
    "password": "TestPass123"
}
resp = client.post('/api/auth/login',
                   data=json.dumps(login_data),
                   content_type='application/json')
print(f"Response Status: {resp.status_code}")
result = resp.get_json()
print(f"Response: {json.dumps(result, indent=2)[:300]}...")

if resp.status_code == 200:
    print(f"[OK] LOGIN SUCCESS!")
    login_token = result['data']['accessToken']
else:
    print(f"[FAIL] LOGIN FAILED!")
    print(f"Error: {result.get('error', 'Unknown error')}")

# Test 3: Check user in GET /me
print("\n\nSTEP 3: Check user in GET /api/auth/me")
print("-" * 50)
headers = {"Authorization": f"Bearer {new_token}"}
resp = client.get('/api/auth/me', headers=headers)
print(f"Response Status: {resp.status_code}")
result = resp.get_json()
print(f"Response: {json.dumps(result, indent=2)[:300]}...")

if resp.status_code == 200:
    print(f"[OK] GET /ME SUCCESS!")
else:
    print(f"[FAIL] GET /ME FAILED!")

print("\n" + "="*70)
print("TEST COMPLETE")
print("="*70 + "\n")
