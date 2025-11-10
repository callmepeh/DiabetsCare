import json
import os

class FileRepository:
    def __init__(self, caminho_arquivo):
        self.caminho = caminho_arquivo
        if not os.path.exists(self.caminho):
            with open(self.caminho, 'w') as f:
                json.dump([], f)

    def salvar(self, dados):
        with open(self.caminho, 'w', encoding='utf-8') as f:
            json.dump(dados, f, ensure_ascii=False, indent=4)

    def carregar(self):
        with open(self.caminho, 'r', encoding='utf-8') as f:
            return json.load(f)
