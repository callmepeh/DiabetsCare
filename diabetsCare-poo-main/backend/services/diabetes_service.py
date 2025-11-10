import os
import csv
import time
from datetime import datetime

class Servico_Diabets_Care:
    def __init__(self, repositorio_post, repositorio_glicemia):
        self.repositorio_post = repositorio_post
        self.repositorio_glicemia = repositorio_glicemia

    def adicionarPost(self, conteudo):
        if isinstance(conteudo, str):
            texto = conteudo.strip()
            if not texto:
                raise ValueError("O conteúdo do post não pode ser vazio.")
            post_data = {"user": "Usuário Padrão", "content": texto}
            self.repositorio_post.adiciona(post_data)
            return

        if isinstance(conteudo, dict):
            if not conteudo:
                raise ValueError("Os dados do post não podem ser vazios.")
            post_data = conteudo.copy()
            post_data.setdefault("user", "Usuário Padrão")
            post_data.setdefault("type", "registro_glicemia")
            self.repositorio_post.adiciona(post_data)
            return

        raise ValueError("Conteúdo inválido.")

    def getPost(self):
        return self.repositorio_post.getPost()

    def adicionarGlicemia(self, dados_glicemia):
        if not dados_glicemia:
            raise ValueError("Os dados de glicemia não podem estar vazios.")

        registro = {
            "id": int(time.time()),
            "data": datetime.now().strftime("%d/%m/%Y"),
            "hora": datetime.now().strftime("%H:%M:%S"),
            "valor": dados_glicemia.get("valor", ""),
            "observacoes": dados_glicemia.get("observacoes", "")
        }

        self.repositorio_glicemia.salvar_csv(registro)

    def getHistoricoPost(self):
        return self.repositorio_post.getPost()


class RepositorioPost:
    def __init__(self):
        self.posts = []

    def adiciona(self, post):
        self.posts.insert(0, post)

    def getPost(self):
        return self.posts


class RepositorioGlicemia:
    def __init__(self):
        self.pasta_dados = "data"
        self.arquivo = os.path.join(self.pasta_dados, "glicemia.csv")
        self.cabecalho = ["id", "data", "hora", "valor", "observacoes"]

        os.makedirs(self.pasta_dados, exist_ok=True)
        if not os.path.exists(self.arquivo):
            with open(self.arquivo, mode="w", newline="", encoding="utf-8") as f:
                escritor = csv.DictWriter(f, fieldnames=self.cabecalho)
                escritor.writeheader()

    def salvar_csv(self, registro):
        with open(self.arquivo, mode="a", newline="", encoding="utf-8") as f:
            escritor = csv.DictWriter(f, fieldnames=self.cabecalho)
            escritor.writerow(registro)
