#!/usr/bin/env python
import sys
import os

# Add src directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from app import app

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=9999, debug=True)
