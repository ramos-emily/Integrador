from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Sensor, Ambientes, Historico
from .serializers import SensorSerializer, AmbientesSerializer, HistoricoSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status
import pandas as pd
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.filters import SearchFilter


# ======================= Excel =======================
# Aqui criei uma view para exportar os sensores em formato Excel.
# Gero um DataFrame com pandas e uso o HttpResponse para enviar o arquivo gerado como anexo para o usuário.
# A rota exige que o usuário esteja autenticado.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def exportar_sensores_excel(request):
    sensores = Sensor.objects.all().values()  # Pego todos os sensores e transformo em dicionário
    df = pd.DataFrame(list(sensores))        # Crio um DataFrame com esses dados
    response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = 'attachment; filename=sensores.xlsx'  # Defino o nome do arquivo
    with pd.ExcelWriter(response, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Sensores')  # Escrevo os dados no Excel
    return response


# ======================= Cadastro =======================
# Classe para registrar novos usuários.
# Permito acesso aberto porque qualquer um pode criar conta.
# Valido se todos os campos foram enviados e se o username já existe.
# Se estiver tudo ok, crio o usuário com create_user do Django.
class RegisterAPIView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        
        # Verifico se campos obrigatórios estão presentes
        if not username or not email or not password:
            return Response({'error': 'Todos os campos são obrigatórios'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Verifico se username já existe
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Nome de usuário já existe'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Crio o usuário e retorno sucesso
        user = User.objects.create_user(username=username, email=email, password=password)
        return Response({'success': 'Usuário criado com sucesso'}, status=status.HTTP_201_CREATED)


# ======================= Ambientes =======================
# Função para listar todos os ambientes ou criar um novo ambiente via POST.
# Só permite acesso se o usuário estiver autenticado.
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def listar_ambientes(request):
    if request.method == 'GET':
        queryset = Ambientes.objects.all()
        serializer = AmbientesSerializer(queryset, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = AmbientesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# Views genéricas para listar e criar ambientes, proteger com autenticação
class AmbientesListCreateAPIView(ListCreateAPIView):
    queryset = Ambientes.objects.all()
    serializer_class = AmbientesSerializer
    permission_classes = [IsAuthenticated]

# View para detalhes, atualização e exclusão de ambientes, com autenticação
class AmbientesDetailAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Ambientes.objects.all()
    serializer_class = AmbientesSerializer
    permission_classes = [IsAuthenticated]

# View para buscar ambientes usando filtros e busca por campos específicos
class AmbientesSearchAPIView(ListAPIView):
    queryset = Ambientes.objects.all()
    serializer_class = AmbientesSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = (DjangoFilterBackend, SearchFilter)
    search_fields = ['id', 'sig', 'descricao', 'ni', 'responsavel']


# ======================= Sensores =======================
# Função para listar todos os sensores ou criar um novo sensor.
# Protegido para usuários autenticados.
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def listar_sensores(request):
    if request.method == 'GET':
        queryset = Sensor.objects.all()
        serializer = SensorSerializer(queryset, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = SensorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

# Views genéricas para listar/criar sensores, protegidas com autenticação
class SensorListCreateAPIView(ListCreateAPIView):
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer
    permission_classes = [IsAuthenticated]

# View para detalhes, editar e excluir sensores
class SensorDetailAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer
    permission_classes = [IsAuthenticated]

# View para busca filtrada dos sensores em vários campos
class SensoresSearchAPIView(ListAPIView):
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = (DjangoFilterBackend, SearchFilter)
    search_fields = ['id', 'sensor', 'mac_address', 'unidade_medida', 'latitude', 'longitude', 'status']


# ======================= Historico =======================
# Função para listar todo o histórico ou criar novos registros.
# Só para usuários autenticados.
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def listar_historico(request):
    if request.method == 'GET':
        queryset = Historico.objects.all()
        serializer = HistoricoSerializer(queryset, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = HistoricoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Views genéricas para listar/criar registros do histórico
class HistoricoListCreateAPIView(ListCreateAPIView):
    queryset = Historico.objects.all()
    serializer_class = HistoricoSerializer
    permission_classes = [IsAuthenticated]

# View para detalhes, editar e excluir registros do histórico
class HistoricoDetailAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Historico.objects.all()
    serializer_class = HistoricoSerializer
    permission_classes = [IsAuthenticated]

# View para busca filtrada no histórico usando campos relacionados a sensores e ambientes
class HistoricoSearchAPIView(ListAPIView):
    queryset = Historico.objects.all()
    serializer_class = HistoricoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = (DjangoFilterBackend, SearchFilter)
    search_fields = [
        'id',
        'sensor__sensor',
        'sensor__mac_address',
        'sensor__id',
        'ambiente__descricao',
        'ambiente__id',
        'timestamp',
        'valor'
    ]
