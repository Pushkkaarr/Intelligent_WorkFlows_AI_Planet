from sqlalchemy.orm import Session
from app.models import User
from app.utils.security import hash_password, verify_password
from app.schemas import UserRegister, UserLogin
from fastapi import HTTPException, status


class UserService:
    """Service for user operations"""
    
    @staticmethod
    def create_user(db: Session, user_data: UserRegister) -> User:
        """Create a new user"""
        # Check if user already exists
        existing_user = db.query(User).filter(
            (User.email == user_data.email) | (User.username == user_data.username)
        ).first()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email or username already exists"
            )
        
        # Hash password
        hashed_password = hash_password(user_data.password)
        
        # Create user
        user = User(
            email=user_data.email,
            username=user_data.username,
            hashed_password=hashed_password
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def authenticate_user(db: Session, user_data: UserLogin) -> User:
        """Authenticate user and return user object"""
        user = db.query(User).filter(User.email == user_data.email).first()
        
        if not user or not verify_password(user_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive"
            )
        
        return user
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: str) -> User:
        """Get user by ID"""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user
