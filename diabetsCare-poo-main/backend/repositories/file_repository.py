import json
import os

class FileRepository:
    def __init__(self, filename):
        self.filename = filename

    def load_data(self):
        if not os.path.exists(self.filename):
            return []
        with open(self.filename, 'r', encoding='utf-8') as f:
            return json.load(f)

    def save_data(self, data):
        with open(self.filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4)
