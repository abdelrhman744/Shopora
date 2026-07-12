from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..dependencies import get_current_admin

router = APIRouter(prefix="/api/categories", tags=["categories"])


@router.get("", response_model=list[schemas.CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    rows = (
        db.query(models.Category, func.count(models.Product.id).label("product_count"))
        .outerjoin(models.Product, models.Product.category_id == models.Category.id)
        .group_by(models.Category.id)
        .order_by(models.Category.name)
        .all()
    )
    result = []
    for category, product_count in rows:
        out = schemas.CategoryOut.model_validate(category)
        out.product_count = product_count
        result.append(out)
    return result


@router.post("", response_model=schemas.CategoryOut, status_code=201)
def create_category(
    payload: schemas.CategoryCreate,
    db: Session = Depends(get_db),
    _admin: models.User = Depends(get_current_admin),
):
    existing = db.query(models.Category).filter(models.Category.name == payload.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category already exists")
    category = models.Category(**payload.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    out = schemas.CategoryOut.model_validate(category)
    out.product_count = 0
    return out


@router.put("/{category_id}", response_model=schemas.CategoryOut)
def update_category(
    category_id: int,
    payload: schemas.CategoryUpdate,
    db: Session = Depends(get_db),
    _admin: models.User = Depends(get_current_admin),
):
    category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(category, key, value)
    db.commit()
    db.refresh(category)
    out = schemas.CategoryOut.model_validate(category)
    out.product_count = db.query(models.Product).filter(models.Product.category_id == category_id).count()
    return out


@router.delete("/{category_id}", status_code=204)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    _admin: models.User = Depends(get_current_admin),
):
    category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    in_use = db.query(models.Product).filter(models.Product.category_id == category_id).count()
    if in_use > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete category with {in_use} product(s) assigned to it",
        )
    db.delete(category)
    db.commit()
