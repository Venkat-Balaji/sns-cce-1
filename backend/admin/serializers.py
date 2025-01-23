from rest_framework import serializers
from bson import ObjectId  # Import BSON ObjectId
from .models import Job

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ('created_by', 'created_at', 'updated_at', 'views', 'pinned')

    def to_representation(self, instance):
        """Convert ObjectId to string in the response"""
        ret = super().to_representation(instance)
        if isinstance(ret.get('id'), ObjectId):
            ret['id'] = str(ret['id'])
        return ret