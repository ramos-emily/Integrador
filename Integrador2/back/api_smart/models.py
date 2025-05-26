from django.db import models

class Ambientes(models.Model):
    sig = models.CharField(max_length=100, unique=True)
    descricao = models.CharField(max_length=100)
    ni = models.CharField(max_length=100)
    responsavel = models.CharField(max_length=100)

    def __str__(self):
        return self.descricao

class Sensor(models.Model):
    STATUS_CHOICES = [
        ('ativo', 'Ativo'),
        ('inativo', 'Inativo'),
    ]

    SENSOR_CHOICES = [
        ("umidade", "umidade"),
        ("temperatura", "temperatura"),
        ("luminosidade", "luminosidade"),
        ("contador", "contador")
    ]

    sensor = models.CharField(max_length=50, choices=SENSOR_CHOICES)  
    mac_address = models.CharField(max_length=100, unique=True)
    unidade_medida = models.CharField(max_length=100)
    valor = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='ativo')
    timestamp = models.DateTimeField()

class Historico(models.Model):
    sensor = models.ForeignKey(Sensor, related_name='historicos', on_delete=models.CASCADE)
    ambiente = models.ForeignKey(Ambientes, related_name='historicos', on_delete=models.CASCADE)
    valor = models.CharField(max_length=100, default='0') 
    timestamp = models.DateTimeField()
    observacoes = models.TextField(blank=True, default='')

    def __str__(self):
        return f"{self.sensor} - {self.timestamp}"