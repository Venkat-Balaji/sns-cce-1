from rest_framework import serializers
from bson import ObjectId  # Import BSON ObjectId

class JobSerializer(serializers.Serializer):
    id = serializers.CharField()  # Convert ObjectId to string
    title = serializers.CharField()
    description = serializers.CharField()
    
    def to_representation(self, instance):
        """Convert ObjectId to string in the response"""
        ret = super().to_representation(instance)
        if isinstance(ret.get('id'), ObjectId):
            ret['id'] = str(ret['id'])
        return ret