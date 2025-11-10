# Utilitários do Frontend

Esta pasta contém utilitários e helpers que são usados pelo frontend.

## threading_helper.py

Módulo que separa a lógica de threading das views, mantendo o código mais limpo e organizado.

### Uso

```python
from frontend.utils.threading_helper import AsyncOperation

# Na sua view
async_op = AsyncOperation(self)  # self é o widget Tkinter
async_op.executar(
    operacao=lambda: self.controller.service.alguma_operacao(),
    on_success=self._on_success,
    on_error=self._on_error
)
```

### Benefícios

- ✅ Views focadas apenas na UI
- ✅ Lógica de threading centralizada e reutilizável
- ✅ Código mais limpo e fácil de manter
- ✅ Tratamento de erros padronizado

