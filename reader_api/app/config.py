import logging
import os
from pathlib import Path
from dataclasses import dataclass
from typing import Optional, Tuple
from urllib.parse import urlparse

from dotenv import load_dotenv


@dataclass(frozen=True)
class Auth0Config:
    api_audience: str
    issuer_domain: str
    algorithms: Tuple[str, ...]


@dataclass(frozen=True)
class LoggingConfig:
    level_name: str
    level: int


class Config:
    instance: Optional["Config"] = None

    def __init__(self):
        # Load environment variables from .env file
        env_path = Path(__file__).parent.parent / ".env"
        load_dotenv(dotenv_path=env_path)

        self.auth0 = self._load_auth0_config()
        self.logging = self._load_logging_config()

        logging.basicConfig(level=self.logging.level)

    def _load_auth0_config(self) -> Auth0Config:
        api_audience = self._require_env("AUTH0_API_AUDIENCE")
        issuer_domain = self._require_env("AUTH0_ISSUER_DOMAIN")
        if not issuer_domain:
            raise ValueError("AUTH0_ISSUER_DOMAIN must include a valid domain")
        algorithms_value = self._require_env("AUTH0_ALGORITHMS")
        algorithms = tuple(
            algorithm.strip()
            for algorithm in algorithms_value.split(",")
            if algorithm.strip()
        )
        if not algorithms:
            raise ValueError("AUTH0_ALGORITHMS must specify at least one algorithm")
        return Auth0Config(
            api_audience=api_audience,
            issuer_domain=issuer_domain,
            algorithms=algorithms,
        )

    def _load_logging_config(self) -> LoggingConfig:
        level_name = os.getenv("LOG_LEVEL", "WARNING").strip().upper()
        level_mapping = {
            "DEBUG": logging.DEBUG,
            "INFO": logging.INFO,
            "WARNING": logging.WARNING,
            "ERROR": logging.ERROR,
            "CRITICAL": logging.CRITICAL,
        }
        level = level_mapping.get(level_name, logging.WARNING)
        resolved_name = level_name if level_name in level_mapping else "WARNING"
        return LoggingConfig(level_name=resolved_name, level=level)

    @staticmethod
    def _require_env(var_name: str) -> str:
        value = os.getenv(var_name)
        if value is None or value.strip() == "":
            raise ValueError(f"Environment variable {var_name} is required")
        return value.strip()

    @staticmethod
    def get_instance() -> "Config":
        if not hasattr(Config, "instance"):
            Config.instance = Config()
        return Config()

    @staticmethod
    def initialize() -> None:
        Config.get_instance()

    def get_logging_level(self) -> int:
        return self.logging.level
