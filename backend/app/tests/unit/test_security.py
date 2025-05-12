from app.core.security import hash_password

def test_hash_password():
    password = "securepassword123"
    hashed = hash_password(password)

    assert hashed != password
    assert isinstance(hashed, str)
    assert len(hashed) == 64  # Because SHA-256 hashes are 64 hex characters
