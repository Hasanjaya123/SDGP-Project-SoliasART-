import inspect
from typing import Type
from fastapi import Form
from pydantic import BaseModel, field_validator
from decimal import Decimal

def as_form(cls: Type[BaseModel]):
    """
    Decorator to make a Pydantic class usable with FastAPI Form() data.
    """
    new_params = [
        inspect.Parameter(
            field.alias or field_name,
            inspect.Parameter.POSITIONAL_ONLY,
            default=Form(field.default) if not field.is_required() else Form(...),
            annotation=field.annotation,
        )
        for field_name, field in cls.model_fields.items()
    ]

    cls.__signature__ = inspect.Signature(new_params)
    return cls