from pydantic import BaseModel


class HealthResponseModel(BaseModel):
    ok: bool
    timestamp_ms: int

class LocationsModel(BaseModel):
    """
    Locations object within a Locator
    https://readium.org/architecture/models/locators/
    """
    fragments: list[str] | None = None  # List of one or more fragment in the resource referenced by the locator
    position: int | None = None  # Position in the publication (page number, etc.)
    progression: float | None = None  # Progression within the resource (0.0 to 1.0)
    totalProgression: float | None = None  # Progression within the entire publication (0.0 to 1.0)


class TextModel(BaseModel):
    """
    Text context object within a Locator
    https://readium.org/architecture/models/locators/
    """
    before: str | None = None  # Text before the locator
    highlight: str | None = None  # Text at the locator
    after: str | None = None  # Text after the locator


class LocatorModel(BaseModel):
    """
    Readium Web Publication Manifest Locator
    https://readium.org/architecture/models/locators/#the-locator-object
    """
    href: str  # Required: The URI of the resource
    type: str  # Media type of the resource
    title: str | None = None  # Optional: Title of the chapter or section
    
    # Locations object - one or more ways to locate a position
    locations: LocationsModel | None = None  # Contains position, progression, totalProgression, etc.
    text: TextModel | None = None  # Optional: Text context





class AskRequestModel(BaseModel):
    question: str
    locator: LocatorModel
    publication_id: str


class AskResponseModel(BaseModel):
    answer: str


