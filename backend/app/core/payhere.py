import hashlib
from app.core.config import settings


def generate_payhere_hash(order_id: str, amount: str, currency: str = "LKR") -> str:
    """
    Generate the MD5 hash required by PayHere for payment verification.
    
    Hash formula (PayHere docs):
        md5(merchant_id + order_id + amount_formatted + currency + md5(merchant_secret).upper())
    """
    merchant_id = settings.PAYHERE_MERCHANT_ID
    merchant_secret = settings.PAYHERE_MERCHANT_SECRET

    # Step 1: MD5 hash of the merchant secret (uppercase)
    secret_hash = hashlib.md5(merchant_secret.encode()).hexdigest().upper()

    # Step 2: Concatenate and hash the full string
    raw = merchant_id + order_id + amount + currency + secret_hash
    generated_hash = hashlib.md5(raw.encode()).hexdigest().upper()

    return generated_hash


def verify_payhere_notification(
    merchant_id: str,
    order_id: str,
    payhere_amount: str,
    payhere_currency: str,
    status_code: str,
    md5sig: str,
) -> bool:
    """
    Verify the MD5 signature from a PayHere server notification (IPN).
    
    Verification hash formula:
        md5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + md5(merchant_secret).upper())
    """
    merchant_secret = settings.PAYHERE_MERCHANT_SECRET

    secret_hash = hashlib.md5(merchant_secret.encode()).hexdigest().upper()

    raw = merchant_id + order_id + payhere_amount + payhere_currency + status_code + secret_hash
    local_hash = hashlib.md5(raw.encode()).hexdigest().upper()

    return local_hash == md5sig.upper()