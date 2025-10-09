## Repo setup

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
# For pip-sync and pip-compile
pip install pip-tools
```

## Dependencies

Depdencies are tracked in _.in files and their versions are pinned in the corresponding _.txt file.

### Adding a new dependency

Edit requirements.in or dev.in; you can include version ranges.

```txt
# requirements.in
fastapi>=0.10,<0.13 or fastapi==8.*
```

```bash
pip-compile --generate-hashes requirements.in
pip-sync requirements.txt dev.txt
```

### Upgrade existing dependencies

```bash
# Upgrade one dependency
pip-compile --upgrade-package fastapi requirements.in

# Or:
pip-compile --upgrade-package fastapi==0.115.4

# Upgrade all dependencies
pip-compile --upgrade requirements.in

# Then install
pip-sync requirements.txt dev.txt
```
