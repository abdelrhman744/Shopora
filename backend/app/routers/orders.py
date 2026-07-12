import random
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..dependencies import get_current_user

router = APIRouter(prefix="/api/orders", tags=["orders"])


def _generate_order_number() -> str:
    year = datetime.now(timezone.utc).year
    return f"NX-{year}-{random.randint(10000, 99999)}"


@router.post("", response_model=schemas.OrderOut, status_code=201)
def create_order(
    payload: schemas.OrderCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    subtotal = 0.0
    order_items = []
    for item in payload.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        if product.stock_quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for '{product.name}' (only {product.stock_quantity} left)",
            )
        line_total = product.price * item.quantity
        subtotal += line_total
        order_items.append((product, item.quantity))

    shipping = 0.0 if subtotal > 99 else 12.0
    tax = round(subtotal * 0.08, 2)
    total = round(subtotal + shipping + tax, 2)

    order_number = _generate_order_number()
    while db.query(models.Order).filter(models.Order.order_number == order_number).first():
        order_number = _generate_order_number()

    order = models.Order(
        order_number=order_number,
        user_id=current_user.id,
        full_name=payload.full_name,
        email=payload.email,
        address=payload.address,
        city=payload.city,
        subtotal=round(subtotal, 2),
        shipping=shipping,
        tax=tax,
        total=total,
        status="Processing",
    )
    db.add(order)
    db.flush()

    for product, quantity in order_items:
        db.add(models.OrderItem(
            order_id=order.id,
            product_id=product.id,
            product_name=product.name,
            unit_price=product.price,
            quantity=quantity,
        ))
        product.stock_quantity -= quantity

    db.commit()
    db.refresh(order)
    return order


@router.get("", response_model=list[schemas.OrderOut])
def list_my_orders(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return (
        db.query(models.Order)
        .filter(models.Order.user_id == current_user.id)
        .order_by(models.Order.created_at.desc())
        .all()
    )


@router.get("/{order_id}", response_model=schemas.OrderOut)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order or (order.user_id != current_user.id and not current_user.is_admin):
        raise HTTPException(status_code=404, detail="Order not found")
    return order
