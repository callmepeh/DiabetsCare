class DiabetesCareService:
    def __init__(self, repository):
        self.repository = repository

    def adicionar_registro(self, dados):
        registros = self.repository.carregar()
        registros.append(dados)
        self.repository.salvar(registros)

    def listar_registros(self):
        return self.repository.carregar()
