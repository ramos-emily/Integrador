from rest_framework import serializers
from .models import Sensor, Historico, Ambientes

class SensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sensor
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(SensorSerializer, self).__init__(*args, **kwargs)
        for field in self.fields.values():
            field.required = False

class HistoricoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Historico
        fields = ['id', 'sensor', 'ambiente', 'valor', 'timestamp', 'observacoes']

class AmbientesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ambientes
        fields = ['id', 'sig', 'descricao', 'ni', 'responsavel']