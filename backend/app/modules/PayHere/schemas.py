from pydantic import BaseModel
from typing import List


class PaymentInitiateRequest(BaseModel):
    
    artwork_ids: List[str]


class PaymentInitiateResponse(BaseModel):
    
    merchant_id: str
    return_url: str
    cancel_url: str
    notify_url: str
    order_id: str
    items: str
    currency: str
    amount: str
    first_name: str
    last_name: str
    email: str
    phone: str
    address: str
    city: str
    country: str
    hash: str
