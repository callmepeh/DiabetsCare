# backend/Repositories/repositorio_glicemia.py
import csv
import os
import time
from datetime import datetime
from typing import Dict


class RepositorioGlicemia:
    """Classe responsável por salvar e ler registros de glicemia em arquivo CSV"""

    def __init__(self, pasta_dados: str = "data"):
        self.pasta_dados = pasta_dados
        self.arquivo = os.path.join(self.pasta_dados, "glicemia.csv")
        self.cabecalho = ["id", "data", "hora", "valor", "observacoes"]

        # Cria a pasta e o arquivo se não existirem
        os.makedirs(self.pasta_dados, exist_ok=True)
        if not os.path.exists(self.arquivo):
            with open(self.arquivo, mode="w", newline="", encoding="utf-8") as f:
                escritor = csv.DictWriter(f, fieldnames=self.cabecalho)
                escritor.writeheader()

    def append_glycemia_record(self, registro: Dict[str, str]):
        """Adiciona um registro de glicemia no CSV"""
        try:
            # Monta o registro completo com data/hora/id
            linha = {
                "id": int(time.time()),
                "data": datetime.now().strftime("%d/%m/%Y"),
                "hora": datetime.now().strftime("%H:%M:%S"),
                "valor": registro.get("valor", ""),
                "observacoes": registro.get("observacoes", "")
            }
            print("DEBUG: RepositorioGlicemia.salvando ->", linha)
            with open(self.arquivo, mode="a", newline="", encoding="utf-8") as f:
                escritor = csv.DictWriter(f, fieldnames=self.cabecalho)
                escritor.writerow(linha)

        except Exception as e:
            raise IOError(f"Erro ao salvar registro de glicemia: {e}")

    def load_glycemia_records(self):
        """Lê todos os registros do CSV"""
        registros = []
        try:
            with open(self.arquivo, mode="r", newline="", encoding="utf-8") as f:
                leitor = csv.DictReader(f)
                registros = list(leitor)
        except FileNotFoundError:
            return []
        return registros



if __name__ == "__main__":
    repo = RepositorioGlicemia()
    repo.append_glycemia_record({
        "valor": "Glicemia: Jejum: 95 | Pós-prandial: 120 | Antes de Dormir: 110.",
        "observacoes": "Teste manual"
    })
    print("✅ Registro adicionado com sucesso!")
    print("Registros atuais:", repo.load_glycemia_records())
