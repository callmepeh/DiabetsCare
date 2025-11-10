"""
Helper para operações assíncronas com threading
Separa a lógica de threading das views para manter o código limpo
"""
import threading
from tkinter import messagebox
from typing import Callable, Any, Optional


class ThreadingHelper:
    """Classe auxiliar para executar operações em threads separadas"""
    
    @staticmethod
    def executar_em_thread(
        widget,
        operacao: Callable,
        on_success: Optional[Callable] = None,
        on_error: Optional[Callable] = None,
        *args,
        **kwargs
    ):
        """
        Executa uma operação em thread separada
        
        Args:
            widget: Widget Tkinter que será usado para atualizar a GUI (via after)
            operacao: Função a ser executada em thread separada
            on_success: Callback chamado no thread principal em caso de sucesso
            on_error: Callback chamado no thread principal em caso de erro
            *args, **kwargs: Argumentos para a operação
        """
        def _executar():
            try:
                resultado = operacao(*args, **kwargs)
                if on_success:
                    widget.after(0, lambda: on_success(resultado))
            except Exception as e:
                if on_error:
                    widget.after(0, lambda err=e: on_error(err))
                else:
                    widget.after(0, lambda err=e: ThreadingHelper._erro_padrao(err))

        
        thread = threading.Thread(target=_executar)
        thread.daemon = True
        thread.start()
    
    @staticmethod
    def _erro_padrao(erro: Exception):
        """Exibe mensagem de erro padrão"""
        messagebox.showerror("Erro", f"Ocorreu um erro: {str(erro)}")


class AsyncOperation:
    """Wrapper para operações assíncronas com callbacks"""
    
    def __init__(self, widget):
        self.widget = widget
    
    def executar(
        self,
        operacao: Callable,
        on_success: Optional[Callable] = None,
        on_error: Optional[Callable] = None,
        *args,
        **kwargs
    ):
        """Executa a operação de forma assíncrona"""
        ThreadingHelper.executar_em_thread(
            self.widget,
            operacao,
            on_success,
            on_error,
            *args,
            **kwargs
        )

