import os
import pandas as pd
from django.core.management.base import BaseCommand
from api_smart.models import Ambientes, Sensor, Historico
from datetime import datetime

class Command(BaseCommand):
    
    #função que define o caminho base dos dados excel
    def handle(self, *args, **kwargs):
        caminho_base = os.path.join(os.getcwd(), 'api_smart', 'management', 'commands')

        caminho_ambientes = os.path.join(caminho_base, 'Ambientes.xlsx')
        if os.path.exists(caminho_ambientes):
            dados_ambientes = pd.read_excel(caminho_ambientes)
            self.stdout.write(f'Importando Ambientes - {len(dados_ambientes)} registros...')
            
            # Itera sobre as linhas do arquivo e cria ou atualiza os registros no banco
            for _, linha in dados_ambientes.iterrows():
                ambiente, criado = Ambientes.objects.update_or_create(
                    sig=linha['sig'],
                    defaults={
                        'descricao': linha['descricao'],
                        'ni': linha['ni'],
                        'responsavel': linha['responsavel'],
                    }
                )
                acao = "Criado" if criado else "Atualizado"
                self.stdout.write(f'{acao} Ambiente: {ambiente.sig}')
        else:
            self.stdout.write(self.style.ERROR(f'Arquivo Ambientes.xlsx não encontrado em {caminho_base}'))

        #Importa sensores da planilha por categoria
        def importar_sensores(planilha, tipo_sensor):
            caminho = os.path.join(caminho_base, planilha)
            if os.path.exists(caminho):
                dados = pd.read_excel(caminho)
                self.stdout.write(f'Importando sensores tipo {tipo_sensor} - {len(dados)} registros...')
                for _, linha in dados.iterrows():
                    endereco_mac = linha['mac_address']
                    unidade = linha['unidade_medida']
                    latitude = float(linha['latitude'])
                    longitude = float(linha['longitude'])
                    status = linha.get('status', 'ativo')

                    Sensor.objects.create(
                        mac_address=endereco_mac,
                        sensor=tipo_sensor,
                        unidade_medida=unidade,
                        latitude=latitude,
                        longitude=longitude,
                        status=status
                    )
                    self.stdout.write(f'Criado Sensor: {endereco_mac} ({tipo_sensor})')
            else:
                self.stdout.write(self.style.ERROR(f'Arquivo {planilha} não encontrado em {caminho_base}'))

        #Importa sensores da planilha por tipo
        importar_sensores('umidade.xlsx', 'umidade')
        importar_sensores('temperatura.xlsx', 'temperatura')
        importar_sensores('luminosidade.xlsx', 'luminosidade')
        importar_sensores('contador.xlsx', 'contador')

        def importar_historico(planilha):
            caminho = os.path.join(caminho_base, planilha)
            if os.path.exists(caminho):
                dados = pd.read_excel(caminho)
                self.stdout.write(f'Importando histórico - {len(dados)} registros...')
                for _, linha in dados.iterrows():
                    try:
                        sensor_id = int(linha['sensor'])
                        ambiente_id = int(linha['ambiente'])
                        valor = str(linha['valor'])
                        timestamp = pd.to_datetime(linha['timestamp'], dayfirst=True)

                        sensor = Sensor.objects.get(id=sensor_id)
                        ambiente = Ambientes.objects.get(id=ambiente_id)

                        Historico.objects.create(
                            sensor=sensor,
                            ambiente=ambiente,
                            valor=valor,
                            timestamp=timestamp,
                            observacoes=''
                        )
                        self.stdout.write(f'Histórico criado: Sensor {sensor_id}, Ambiente {ambiente_id}')
                    except Exception as e:
                        self.stdout.write(self.style.ERROR(f"Erro: {e}"))
            else:
                self.stdout.write(self.style.ERROR(f'Arquivo {planilha} não encontrado em {caminho_base}'))

        importar_historico('historico.xlsx')

        self.stdout.write(self.style.SUCCESS('Importação concluída!'))
