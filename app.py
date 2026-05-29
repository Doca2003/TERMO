import json
import random

palavras=["coisa", "amado", "junho", "basta"]

with open("palavras.json", "w") as f:
    json.dump(palavras, f)