import bcrypt
from random import randint


def hash_password(password):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt).decode()
    return hashed


def check_password(password, hashed):
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode())


def generate_confirmation_code():
    code = ''
    for _ in range(5):
        code += str(randint(0, 9))

    return code