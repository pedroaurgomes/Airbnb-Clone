from app.core.security import hash_password, verify_password

def test_hash_password():
    password = "securepassword123"
    hashed = hash_password(password)

    assert hashed != password
    assert isinstance(hashed, str)
    assert len(hashed) == 64  # Because SHA-256 hashes are 64 hex characters

def test_verify_password_success():
    password = "securepassword123"
    hashed = hash_password(password)
    assert verify_password(password, hashed) == True

def test_verify_password_failure():
    password = "securepassword123"
    hashed = hash_password(password)
    assert verify_password("wrongpassword", hashed) == False
