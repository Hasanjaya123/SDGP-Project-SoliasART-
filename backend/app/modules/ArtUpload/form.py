import inspect
from typing import Type
from fastapi import Form
from pydantic import BaseModel


def as_form(cls: Type[BaseModel]):
    new_params = [
        inspect.Parameter(
            field.alias or field_name,
            inspect.Parameter.POSITIONAL_ONLY,
            default=Form(...) if field.is_required() else Form(field.default),
            annotation=field.annotation,
        )
        for field_name, field in cls.model_fields.items()
    ]

    cls.__signature__ = inspect.Signature(new_params)
    return cls