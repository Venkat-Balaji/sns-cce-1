from rest_framework import permissions
from .mongodb import admins_collection
from bson import ObjectId
import jwt
from django.conf import settings


class IsMongoDBAdmin(permissions.BasePermission):
    """
    Custom permission to only allow MongoDB admins to access the view.
    """

    def has_permission(self, request, view):
        try:
            # Get token from request
            auth_header = request.headers.get("Authorization", "")
            if not auth_header.startswith("Bearer "):
                return False

            token = auth_header.split(" ")[1]

            # Decode token
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")

            if not user_id:
                return False

            # Check if user exists in admins collection
            admin = admins_collection.find_one({"_id": ObjectId(user_id)})
            return admin is not None

        except (jwt.InvalidTokenError, jwt.ExpiredSignatureError):
            return False
        except Exception:
            return False
