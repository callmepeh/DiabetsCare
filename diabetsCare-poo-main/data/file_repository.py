import json
import os
from datetime import datetime

class FileRepository:
    def __init__(self, posts_file='posts.json'):
        self.posts_file = posts_file

    def load_posts(self):
        """Lê todos os posts do arquivo JSON."""
        if not os.path.exists(self.posts_file):
            return []

        with open(self.posts_file, 'r', encoding='utf-8') as file:
            try:
                return json.load(file)
            except json.JSONDecodeError:
                return []

    def save_posts(self, posts):
        """Salva a lista completa de posts no arquivo JSON."""
        with open(self.posts_file, 'w', encoding='utf-8') as file:
            json.dump(posts, file, indent=4, ensure_ascii=False)

    def get_next_post_id(self):
        """Retorna o próximo ID disponível para um novo post."""
        posts = self.load_posts()
        if not posts:
            return 1
        return max(post['id'] for post in posts) + 1

    def add_post(self, content, user="Usuário Padrão"):
        posts = self.load_posts()
        post_id = max([p.get("id", 0) for p in posts], default=0) + 1
        post_data = {
            "id": post_id,
            "content": content,
            "user": user,
            "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        posts.append(post_data)
        self.save_posts(posts)
        return post_data

    def get_posts_by_user(self, user):
        return [p for p in self.load_posts() if p.get("user") == user]
    
    def getPost(self):
        return self.load_posts()