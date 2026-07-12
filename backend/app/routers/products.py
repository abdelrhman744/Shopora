import os
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..dependencies import get_current_admin

router = APIRouter(prefix="/api/products", tags=["products"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}


def _to_out(product: models.Product) -> schemas.ProductOut:
    return schemas.ProductOut(
        id=product.id,
        name=product.name,
        description=product.description or "",
        price=product.price,
        original_price=product.original_price,
        category_id=product.category_id,
        category_name=product.category.name if product.category else "",
        stock_quantity=product.stock_quantity,
        in_stock=product.in_stock,
        image_url=product.image_url or "",
        badge=product.badge or "",
        rating=product.rating,
        reviews_count=product.reviews_count,
        created_at=product.created_at,
    )


@router.get("", response_model=schemas.ProductListOut)
def list_products(
    search: Optional[str] = Query(default=None),
    category: Optional[str] = Query(default=None),
    min_price: Optional[float] = Query(default=None, ge=0),
    max_price: Optional[float] = Query(default=None, ge=0),
    sort: Optional[str] = Query(default="popular"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(models.Product).join(models.Category)

    if search:
        query = query.filter(models.Product.name.ilike(f"%{search}%"))
    if category and category.lower() != "all":
        query = query.filter(models.Category.name == category)
    if min_price is not None:
        query = query.filter(models.Product.price >= min_price)
    if max_price is not None:
        query = query.filter(models.Product.price <= max_price)

    if sort == "price_asc":
        query = query.order_by(models.Product.price.asc())
    elif sort == "price_desc":
        query = query.order_by(models.Product.price.desc())
    elif sort == "newest":
        query = query.order_by(models.Product.created_at.desc())
    elif sort == "rating":
        query = query.order_by(models.Product.rating.desc())
    else:
        query = query.order_by(models.Product.reviews_count.desc())

    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    return schemas.ProductListOut(items=[_to_out(p) for p in items], total=total)


@router.get("/{product_id}", response_model=schemas.ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return _to_out(product)


def _validate_category(db: Session, category_id: int) -> None:
    exists = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not exists:
        raise HTTPException(status_code=400, detail="Category does not exist")


@router.post("", response_model=schemas.ProductOut, status_code=201)
def create_product(
    payload: schemas.ProductCreate,
    db: Session = Depends(get_db),
    _admin: models.User = Depends(get_current_admin),
):
    _validate_category(db, payload.category_id)
    product = models.Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return _to_out(product)


@router.put("/{product_id}", response_model=schemas.ProductOut)
def update_product(
    product_id: int,
    payload: schemas.ProductUpdate,
    db: Session = Depends(get_db),
    _admin: models.User = Depends(get_current_admin),
):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    data = payload.model_dump(exclude_unset=True)
    if "category_id" in data:
        _validate_category(db, data["category_id"])
    for key, value in data.items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return _to_out(product)


@router.delete("/{product_id}", status_code=204)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    _admin: models.User = Depends(get_current_admin),
):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()


@router.post("/upload-image")
def upload_image(
    file: UploadFile = File(...),
    _admin: models.User = Depends(get_current_admin),
):
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported image type")

    ext = os.path.splitext(file.filename or "")[1] or ".jpg"
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    contents = file.file.read()
    max_size = 5 * 1024 * 1024
    if len(contents) > max_size:
        raise HTTPException(status_code=400, detail="Image must be smaller than 5MB")

    with open(filepath, "wb") as f:
        f.write(contents)

    return {"image_url": f"/static/uploads/{filename}"}
