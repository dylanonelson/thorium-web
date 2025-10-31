import logging
import os
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv


class Config:
    instance: Optional["Config"] = None

    def __init__(self):
        # Load environment variables from .env file
        env_path = Path(__file__).parent.parent / ".env"
        load_dotenv(dotenv_path=env_path)

        config_log_level = os.getenv("LOG_LEVEL", "WARNING").lower()
        logging_level = logging.WARNING
        if config_log_level == "debug":
            logging_level = logging.DEBUG
        elif config_log_level == "info":
            logging_level = logging.INFO
        elif config_log_level == "warning":
            logging_level = logging.WARNING
        elif config_log_level == "error":
            logging_level = logging.ERROR
        elif config_log_level == "critical":
            logging_level = logging.CRITICAL

        self.logging_level = logging_level
        logging.basicConfig(level=logging_level)

    @staticmethod
    def get_instance() -> "Config":
        if not hasattr(Config, "instance"):
            Config.instance = Config()
        return Config()

    @staticmethod
    def initialize() -> None:
        Config.get_instance()

    def get_logging_level(self) -> int:
        return self.logging_level
