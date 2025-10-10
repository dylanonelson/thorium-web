from pydantic import BaseModel


class HealthResponseModel(BaseModel):
    ok: bool
    timestamp_ms: int


class LocatorModel(BaseModel):
    pass


class AskRequestModel(BaseModel):
    question: str
    location: LocatorModel


class AskResponseModel(BaseModel):
    answer: str


