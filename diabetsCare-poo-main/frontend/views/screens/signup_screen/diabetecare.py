import tkinter as tk
from tkinter import font
from PIL import Image, ImageTk  # pip install pillow

root = tk.Tk()
root.title("DiabetesCare")
screen_width = root.winfo_screenwidth()
screen_height = root.winfo_screenheight()
root.geometry(f"{screen_width}x{screen_height}")
root.resizable(False, False)
root.configure(bg="white")

# Configurar grid principal para dividir a tela em 2 colunas iguais
root.grid_columnconfigure(0, weight=1, uniform="col")
root.grid_columnconfigure(1, weight=1, uniform="col")
root.grid_rowconfigure(0, weight=1)

# =============== FRAME ESQUERDA ==================
frame_left = tk.Frame(root, bg="white")
frame_left.grid(row=0, column=0, sticky="nsew")

# Centralizar conteúdo
container_left = tk.Frame(frame_left, bg="white")
container_left.place(relx=0.5, rely=0.5, anchor="center")

# Título
titulo = tk.Label(container_left, text="Cadastre-se", font=("Arial", 36, "bold"), fg="#1E90FF", bg="white")
titulo.pack(pady=(0, 10))

subtitulo = tk.Label(container_left, text="Adicione os detalhes da sua conta", font=("Arial", 14), bg="white", fg="gray")
subtitulo.pack(pady=(0, 20))

# Campos
usuario_label = tk.Label(container_left, text="Nome de usuário", font=("Arial", 12), fg="gray", bg="white")
usuario_label.pack(anchor="w")
usuario_entry = tk.Entry(container_left, width=40, font=("Arial", 14), bd=0, relief="flat",
                         highlightbackground="#E0E0E0", highlightthickness=1)
usuario_entry.pack(pady=(0, 15), ipady=8)

senha_label = tk.Label(container_left, text="Senha", font=("Arial", 12), fg="gray", bg="white")
senha_label.pack(anchor="w")
senha_entry = tk.Entry(container_left, width=40, font=("Arial", 14), bd=0, relief="flat",
                       highlightbackground="#E0E0E0", highlightthickness=1, show="*")
senha_entry.pack(pady=(0, 20), ipady=8)

# Opções
tipo_var = tk.StringVar(value="Comum")
frame_tipo = tk.Frame(container_left, bg="white")
frame_tipo.pack(pady=10)

tk.Radiobutton(frame_tipo, text="Comum", variable=tipo_var, value="Comum", bg="white", font=("Arial", 10)).grid(row=0, column=0, padx=30)
tk.Radiobutton(frame_tipo, text="Profissional", variable=tipo_var, value="Profissional", bg="white", font=("Arial", 10)).grid(row=0, column=1, padx=30)

# Botão cadastro
btn_cadastrar = tk.Button(container_left, text="Cadastre-se", bg="#1E90FF", fg="white", font=("Arial", 12, "bold"),
                          relief="flat", width=20, height=2, cursor="hand2")
btn_cadastrar.pack(pady=20)

# Login
frame_login = tk.Frame(container_left, bg="white")
frame_login.pack(pady=10)

tk.Label(frame_login, text="Já possui uma conta?", font=("Arial", 10), bg="white", fg="gray").grid(row=0, column=0)
tk.Button(frame_login, text="Login", bg="#1E90FF", fg="white", font=("Arial", 10, "bold"),
          relief="flat", cursor="hand2").grid(row=0, column=1, padx=5)


# =============== FRAME DIREITA ==================
frame_right = tk.Frame(root, bg="#1E90FF")
frame_right.grid(row=0, column=1, sticky="nsew")

# Centralizar conteúdo
container_right = tk.Frame(frame_right, bg="#1E90FF")
container_right.place(relx=0.5, rely=0.5, anchor="center")

# Carregar imagens decorativas
bg1 = ImageTk.PhotoImage(Image.open("signup_screen/Vector1.png").resize((180,180)))
bg2 = ImageTk.PhotoImage(Image.open("signup_screen/Vector2.png").resize((180,180)))
bg3 = ImageTk.PhotoImage(Image.open("signup_screen/Vector3.png").resize((180,180)))
icon = ImageTk.PhotoImage(Image.open("signup_screen/report (1) 2.png").resize((300,300)))

lbl_bg1 = tk.Label(frame_right, image=bg1, bg="#1E90FF", border=0)
lbl_bg1.place(x=300, y=10)

lbl_bg2 = tk.Label(frame_right, image=bg2, bg="#1E90FF", border=0)
lbl_bg2.place(x=-50, y=90)

lbl_bg3 = tk.Label(frame_right, image=bg3, bg="#1E90FF", border=0)
lbl_bg3.place(x=10, y=400)

# Texto de boas-vindas
title_font = font.Font(family="Arial", size=24, weight="bold")
subtitle_font = font.Font(family="Arial", size=40, weight="bold")

tk.Label(container_right, text="Bem-Vindo ao", bg="#1E90FF", fg="white", font=title_font).pack()
tk.Label(container_right, text="DiabetesCare", bg="#1E90FF", fg="white", font=subtitle_font).pack()
tk.Label(container_right, text="Faça o login para acessar sua conta ou cadastre-se",
         bg="#1E90FF", fg="white", font=("Arial", 14)).pack(pady=10)

# Ícone central
lbl_icon = tk.Label(container_right, image=icon, bg="#1E90FF", border=0)
lbl_icon.pack(pady=20)

root.mainloop()
