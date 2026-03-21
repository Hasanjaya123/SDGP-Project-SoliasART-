import inspect
from typing import Type
from fastapi import Form
from pydantic import BaseModel


def as_form(cls: Type[BaseModel]):
    """
    Decorator to make a Pydantic class usable with FastAPI Form() data.
    (Compatible with Pydantic v1)
    """
    new_params = []

    for field_name, model_field in cls.__fields__.items():
        new_params.append(
            inspect.Parameter(
                field_name,
                inspect.Parameter.POSITIONAL_ONLY,
                default=Form(...) if model_field.required else Form(model_field.default),
                annotation=model_field.outer_type_,
            )
        )

    cls.__signature__ = inspect.Signature(new_params)
    return cls