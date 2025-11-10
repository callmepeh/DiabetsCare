# backend/Services/glicemia_service.py
from datetime import datetime
from backend.repositories.repositorio_glicemia import RepositorioGlicemia


class GlicemiaService:
  

    def __init__(self):
        self.repositorio = RepositorioGlicemia()

    def adicionarGlicemia(self, dados_tela: dict) -> bool:
       
        if not isinstance(dados_tela, dict):
            raise ValueError("dados_tela deve ser um dicionário")

       
        jejum = str(dados_tela.get("jejum", ""))
        pos_prandial = str(dados_tela.get("pos_prandial", ""))
        dormir = str(dados_tela.get("dormir", ""))
        observacoes = str(dados_tela.get("observacoes", "")).strip()

        registro = {
            "jejum": jejum,
            "pos_prandial": pos_prandial,
            "dormir": dormir,
            "observacoes": observacoes,
            "data_criacao": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

      
        self.repositorio.append_glycemia_record(registro)
        return True

    def obter_historico(self):
        return self.repositorio.load_glycemia_records()
