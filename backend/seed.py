"""
Seed the database with the two admin accounts, starter categories, and
sample products matching the Figma design.

Usage:
    python seed.py
"""
from app.auth import hash_password
from app.database import Base, SessionLocal, engine
from app.models import Category, Product, User

Base.metadata.create_all(bind=engine)

ADMINS = [
    {"name": "Mohamed", "email": "admin1@mo.io", "password": "mohamed12$$"},
    {"name": "Abdelrhman", "email": "admin2@hetta.io", "password": "Abdo122000*&"},
]

CATEGORIES = [
    {"name": "Audio", "icon": "🎧"},
    {"name": "Wearables", "icon": "⌚"},
    {"name": "Displays", "icon": "🖥️"},
    {"name": "Peripherals", "icon": "⌨️"},
    {"name": "Accessories", "icon": "🔌"},
    {"name": "Gaming", "icon": "🎮"},
]

PRODUCTS = [
    {"name": "Aurora X Pro Headphones", "description": "Experience audio excellence with the Aurora X Pro Headphones. Crafted for discerning audiophiles and tech enthusiasts, this premium device delivers unmatched performance with a futuristic design aesthetic.", "price": 349, "original_price": 499, "category": "Audio", "stock_quantity": 42, "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format", "badge": "Best Seller", "rating": 4.9, "reviews_count": 2847},
    {"name": "Nebula Smart Watch Ultra", "description": "The Nebula Smart Watch Ultra tracks everything you need with stunning accuracy. Gorgeous display, exceptional battery life.", "price": 599, "original_price": 799, "category": "Wearables", "stock_quantity": 30, "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format", "badge": "New", "rating": 4.8, "reviews_count": 1923},
    {"name": "Prism 4K Gaming Monitor", "description": "The Prism 4K Gaming Monitor delivers stunning visuals with ultra-low latency for competitive gaming.", "price": 899, "original_price": 1199, "category": "Displays", "stock_quantity": 18, "image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format", "badge": "Sale", "rating": 4.7, "reviews_count": 934},
    {"name": "Quantum Mechanical Keyboard", "description": "The Quantum Mechanical Keyboard offers a tactile typing experience built for speed and precision.", "price": 189, "original_price": 249, "category": "Peripherals", "stock_quantity": 55, "image_url": "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop&auto=format", "badge": "Hot", "rating": 4.9, "reviews_count": 3201},
    {"name": "Eclipse Wireless Earbuds", "description": "The Eclipse Wireless Earbuds combine compact design with immersive, room-filling sound.", "price": 229, "original_price": 299, "category": "Audio", "stock_quantity": 60, "image_url": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&auto=format", "badge": "Popular", "rating": 4.6, "reviews_count": 1654},
    {"name": "Vortex Gaming Mouse", "description": "The Vortex Gaming Mouse is engineered for precision tracking and blazing-fast response times.", "price": 129, "original_price": 179, "category": "Peripherals", "stock_quantity": 0, "image_url": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop&auto=format", "badge": "Top Pick", "rating": 4.8, "reviews_count": 2103},
    {"name": "Horizon Laptop Stand Pro", "description": "The Horizon Laptop Stand Pro elevates your workspace with adjustable ergonomic positioning.", "price": 89, "original_price": 129, "category": "Accessories", "stock_quantity": 75, "image_url": "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop&auto=format", "badge": "Deal", "rating": 4.5, "reviews_count": 876},
    {"name": "Stellar USB-C Hub 12-in-1", "description": "The Stellar USB-C Hub 12-in-1 expands your connectivity with blazing-fast data transfer.", "price": 149, "original_price": 199, "category": "Accessories", "stock_quantity": 40, "image_url": "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=400&fit=crop&auto=format", "badge": "Trending", "rating": 4.7, "reviews_count": 1432},
]


def run():
    db = SessionLocal()
    try:
        for admin in ADMINS:
            if not db.query(User).filter(User.email == admin["email"]).first():
                db.add(User(
                    name=admin["name"],
                    email=admin["email"],
                    hashed_password=hash_password(admin["password"]),
                    is_admin=True,
                ))
        db.commit()

        category_map = {}
        for cat in CATEGORIES:
            existing = db.query(Category).filter(Category.name == cat["name"]).first()
            if not existing:
                existing = Category(name=cat["name"], icon=cat["icon"])
                db.add(existing)
                db.commit()
                db.refresh(existing)
            category_map[cat["name"]] = existing.id

        for p in PRODUCTS:
            if not db.query(Product).filter(Product.name == p["name"]).first():
                db.add(Product(
                    name=p["name"],
                    description=p["description"],
                    price=p["price"],
                    original_price=p["original_price"],
                    category_id=category_map[p["category"]],
                    stock_quantity=p["stock_quantity"],
                    image_url=p["image_url"],
                    badge=p["badge"],
                    rating=p["rating"],
                    reviews_count=p["reviews_count"],
                ))
        db.commit()

        print("Seed complete.")
        print("Admin accounts:")
        for admin in ADMINS:
            print(f"  {admin['email']} / {admin['password']}")
    finally:
        db.close()


if __name__ == "__main__":
    run()
