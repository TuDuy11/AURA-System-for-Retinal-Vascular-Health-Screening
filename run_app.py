#!/usr/bin/env python
import sys
import os

# Load environment variables from .env FIRST - before anything else
from dotenv import load_dotenv
env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
print(f"[STARTUP] Loading .env from: {env_path}")
print(f"[STARTUP] .env exists: {os.path.exists(env_path)}")
load_dotenv(env_path)
print(f"[STARTUP] DATABASE_URI: {os.getenv('DATABASE_URI', 'NOT SET')}")

# Add src directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from app import app

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=9999, debug=False, threaded=False, use_reloader=False)
