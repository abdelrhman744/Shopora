from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, EmailStr, Field, ConfigDict


# ---------- Auth / User ----------

class UserRegister(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: EmailStr
    is_admin: bool
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ---------- Category ----------

class CategoryBase(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    icon: str = Field(default="📦", max_length=16)


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=120)
    icon: Optional[str] = Field(default=None, max_length=16)


class CategoryOut(CategoryBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_count: int = 0


# ---------- Product ----------

class ProductBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str = ""
    price: float = Field(gt=0)
    original_price: Optional[float] = Field(default=None, gt=0)
    category_id: int
    stock_quantity: int = Field(ge=0, default=0)
    image_url: str = ""
    badge: str = ""


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = None
    price: Optional[float] = Field(default=None, gt=0)
    original_price: Optional[float] = Field(default=None, gt=0)
    category_id: Optional[int] = None
    stock_quantity: Optional[int] = Field(default=None, ge=0)
    image_url: Optional[str] = None
    badge: Optional[str] = None


class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str
    price: float
    original_price: Optional[float]
    category_id: int
    category_name: str
    stock_quantity: int
    in_stock: bool
    image_url: str
    badge: str
    rating: float
    reviews_count: int
    created_at: datetime


class ProductListOut(BaseModel):
    items: List[ProductOut]
    total: int


# ---------- Orders ----------

class OrderItemIn(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class OrderCreate(BaseModel):
    full_name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    address: str = Field(min_length=1, max_length=255)
    city: str = Field(min_length=1, max_length=120)
    items: List[OrderItemIn] = Field(min_length=1)


class OrderItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    product_name: str
    unit_price: float
    quantity: int


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    order_number: str
    full_name: str
    email: str
    address: str
    city: str
    subtotal: float
    shipping: float
    tax: float
    total: float
    status: str
    created_at: datetime
    items: List[OrderItemOut]
