import nacl.pwhash
import os

def do_login(account, password):
    if (account != os.environ['ADMIN_ACCOUNT']):
        return False

    try:
        ret = nacl.pwhash.verify(str.encode(os.environ['ADMIN_PASSWORD']), str.encode(password))
        if (ret):
            return True
        else:
            return False
    except Exception as e:
        print(e)
        return False
