from rest_framework import serializers

class SearchRequestSerializer(serializers.Serializer):
    query = serializers.CharField(min_length=3)
    type = serializers.ChoiceField(choices=['user', 'repo'])
