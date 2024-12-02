from rest_framework import serializers


class DataRowSerializer(serializers.Serializer):
    description = serializers.CharField(source="Description")
    unit_of_measure = serializers.CharField(source="Unit of measure")
    attributes = serializers.CharField(source="Attributes")
    label = serializers.CharField(source="Label")
    year_2010 = serializers.FloatField(source="2010")
    year_2011 = serializers.FloatField(source="2011")
    year_2012 = serializers.FloatField(source="2012")
    year_2013 = serializers.FloatField(source="2013")
    year_2014 = serializers.FloatField(source="2014")
    year_2015 = serializers.FloatField(source="2015")
    year_2016 = serializers.FloatField(source="2016")
    year_2017 = serializers.FloatField(source="2017")
    year_2018 = serializers.FloatField(source="2018")
    year_2019 = serializers.FloatField(source="2019")
    year_2020 = serializers.FloatField(source="2020")
    normalized_data = serializers.CharField(source="Normalized_Data")
    cluster = serializers.IntegerField(source="Cluster")