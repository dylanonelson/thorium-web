from typing import List, Dict
from app.models import LocatorModel
from app.prompts import prompt_v0


def get_messages(
    question: str,
    location: LocatorModel,
    *,
    title: str,
    author: str,
    prompt_version: str = "v0",
) -> List[Dict[str, str]]:
    if prompt_version == "v0":
        return [
            {"role": "system", "content": prompt_v0.get_system_prompt(title, author)},
            {"role": "user", "content": prompt_v0.get_user_prompt(question, location)},
        ]
    else:
        raise ValueError(f"Invalid prompt version: {prompt_version}")
