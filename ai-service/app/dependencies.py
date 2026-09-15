from fastapi import Header, HTTPException, status

from app.config.settings import INTERNAL_API_KEY


async def require_internal_key(x_internal_key: str | None = Header(default=None)) -> None:
    """Reject calls that don't come from the Ascenta backend.

    Only enforced when INTERNAL_API_KEY is configured, so local development
    keeps working without extra setup (PHASES.md Phase 12 - API protection).
    """
    if not INTERNAL_API_KEY:
        return

    if x_internal_key != INTERNAL_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid service key",
        )