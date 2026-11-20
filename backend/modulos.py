import os
import sqlite3
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_files = [f for f in os.listdir(BASE_DIR) if f.endswith('.db')]
DB_NAME = os.path.join(BASE_DIR, db_files[0]) if db_files else os.path.join(BASE_DIR, "BancodeDadosGrupo6AlexsanderPedroHenriqueMuriloLemosGabryelCerqueira.db")

def conectar():
    con = sqlite3.connect(DB_NAME)
    con.row_factory = sqlite3.Row
    return con

def criar_tabelas():
    con = conectar()
    cur = con.cursor()

    cur.execute('''
        CREATE TABLE IF NOT EXISTS prontuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_provisorio TEXT NOT NULL,
            especie TEXT NOT NULL,
            sexo TEXT NOT NULL,
            idade_estimada TEXT,
            porte_peso TEXT,
            pelagem TEXT,
            microchip TEXT,
            data_hora_resgate TEXT,
            endereco_resgate TEXT,
            motivo_recolhimento TEXT,
            responsavel_transporte TEXT,
            escore_corporal INTEGER,
            temperatura_retal REAL,
            presenca_parasitas TEXT,
            ferimentos_descricao TEXT,
            destinacao_imediata TEXT,
            status_sanitario TEXT,
            imagem_url TEXT,
            data_registro TEXT
        )
    ''')

    cur.execute('''
        CREATE TABLE IF NOT EXISTS animais (
            cod_animal INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_provisorio_animal TEXT NOT NULL,
            especie_animal TEXT NOT NULL,
            sexo_animal TEXT NOT NULL,
            idade_animal TEXT,
            peso_animal TEXT,
            cor_pelagem_animal TEXT,
            microchip_animal TEXT
        )
    ''')

    cur.execute('''
        CREATE TABLE IF NOT EXISTS resgates (
            cod_resgate INTEGER PRIMARY KEY AUTOINCREMENT,
            cod_animal INTEGER NOT NULL,
            data_horario_resgate TEXT NOT NULL,
            local_resgate TEXT,
            condicao_resgate TEXT,
            nome_resgatista_resgate TEXT,
            FOREIGN KEY (cod_animal) REFERENCES animais (cod_animal)
        )
    ''')

    cur.execute('''
        CREATE TABLE IF NOT EXISTS triagens (
            cod_triagem INTEGER PRIMARY KEY AUTOINCREMENT,
            cod_resgate INTEGER NOT NULL UNIQUE,
            escore_corporal_triagem INTEGER,
            temperatura_triagem REAL,
            ectoparasitas_triagem TEXT,
            lesoes_triagem TEXT,
            destino_triagem TEXT,
            FOREIGN KEY (cod_resgate) REFERENCES resgates (cod_resgate)
        )
    ''')

    con.commit()
    cur.close()
    con.close()

def popular_dados_iniciais():
    con = conectar()
    cur = con.cursor()
    cur.execute("SELECT COUNT(*) FROM prontuarios")
    total = cur.fetchone()[0]

    if total < 5:
        iniciais = [
            {
                "nome_provisorio": "Pipoca",
                "especie": "canino",
                "sexo": "macho",
                "idade_estimada": "adulto",
                "porte_peso": "Canino • Porte Médio",
                "pelagem": "Curta, caramelo e dourado",
                "microchip": "981098102938102",
                "data_hora_resgate": "2025-11-12T10:30",
                "endereco_resgate": "Jardim Morumbi (Via Pública)",
                "motivo_recolhimento": "abandono-rua",
                "responsavel_transporte": "Marcos Protetor",
                "escore_corporal": 3,
                "temperatura_retal": 38.5,
                "presenca_parasitas": "nenhum",
                "ferimentos_descricao": "Escoriações leves cicatrizadas",
                "destinacao_imediata": "Abrigo Central - Baia 04",
                "status_sanitario": "Apto para Adoção (100% Imunizado)",
                "imagem_url": "/assets/img/pipoca.jpg",
                "data_registro": "12/11/2025"
            },
            {
                "nome_provisorio": "Luna",
                "especie": "felino",
                "sexo": "femea",
                "idade_estimada": "jovem",
                "porte_peso": "Felino • Porte Pequeno",
                "pelagem": "Curta, branca com manchas pretas",
                "microchip": "",
                "data_hora_resgate": "2026-01-18T14:15",
                "endereco_resgate": "Vila Marcondes (Terreno baldio)",
                "motivo_recolhimento": "abandono-rua",
                "responsavel_transporte": "Dra. Camila Veterinária",
                "escore_corporal": 2,
                "temperatura_retal": 38.8,
                "presenca_parasitas": "pulgas-moderado",
                "ferimentos_descricao": "Desnutrição leve e ectoparasitas",
                "destinacao_imediata": "Recanto dos Felinos - Box 02",
                "status_sanitario": "Em Quarentena (Dia 14/21)",
                "imagem_url": "/assets/img/luna.jpg",
                "data_registro": "18/01/2026"
            },
            {
                "nome_provisorio": "Thor",
                "especie": "canino",
                "sexo": "macho",
                "idade_estimada": "adulto",
                "porte_peso": "Canino • Porte Grande",
                "pelagem": "Densa, preta e marrom",
                "microchip": "981098102938105",
                "data_hora_resgate": "2026-02-03T08:00",
                "endereco_resgate": "Rodovia Raposo Tavares km 560",
                "motivo_recolhimento": "atropelamento",
                "responsavel_transporte": "Equipe de Resgate Rápido",
                "escore_corporal": 3,
                "temperatura_retal": 39.1,
                "presenca_parasitas": "carrapatos-intenso",
                "ferimentos_descricao": "Fratura distal em membro anterior direito",
                "destinacao_imediata": "Hospital Veterinário Universitário",
                "status_sanitario": "Em Tratamento (Fratura distal cicatrizando)",
                "imagem_url": "/assets/img/thor.jpg",
                "data_registro": "03/02/2026"
            },
            {
                "nome_provisorio": "Mel",
                "especie": "canino",
                "sexo": "femea",
                "idade_estimada": "filhote",
                "porte_peso": "Canino • Filhote",
                "pelagem": "Ondulada, dourada clara",
                "microchip": "",
                "data_hora_resgate": "2026-02-20T16:45",
                "endereco_resgate": "Bairro Brasil Novo (Caixa de papelão)",
                "motivo_recolhimento": "ninhada-desprotegida",
                "responsavel_transporte": "Lar Temporário Planalto",
                "escore_corporal": 2,
                "temperatura_retal": 38.6,
                "presenca_parasitas": "nenhum",
                "ferimentos_descricao": "Sem ferimentos visíveis, verme tratado",
                "destinacao_imediata": "Lar Temporário Planalto",
                "status_sanitario": "Em Profilaxia (Vermifugação concluída)",
                "imagem_url": "/assets/img/mel.jpg",
                "data_registro": "20/02/2026"
            },
            {
                "nome_provisorio": "Frederico",
                "especie": "felino",
                "sexo": "macho",
                "idade_estimada": "adulto",
                "porte_peso": "Felino • Porte Adulto",
                "pelagem": "Curta, rajado cinza",
                "microchip": "981098102938109",
                "data_hora_resgate": "2026-03-02T11:20",
                "endereco_resgate": "Parque do Povo (Abandonado)",
                "motivo_recolhimento": "abandono-rua",
                "responsavel_transporte": "Pedro Henrique Voluntário",
                "escore_corporal": 4,
                "temperatura_retal": 38.4,
                "presenca_parasitas": "nenhum",
                "ferimentos_descricao": "Incisão cirúrgica de orquiectomia limpa",
                "destinacao_imediata": "Abrigo Central - Ambulatório",
                "status_sanitario": "Pós-Operatório (Castrado há 3 dias)",
                "imagem_url": "/assets/img/frederico.jpg",
                "data_registro": "02/03/2026"
            }
        ]

        cur.execute("SELECT nome_provisorio FROM prontuarios")
        nomes_existentes = {r[0] for r in cur.fetchall()}

        for item in iniciais:
            if item["nome_provisorio"] not in nomes_existentes:
                inserir(item)

    cur.close()
    con.close()

def inserir(dados):
    con = conectar()
    cur = con.cursor()

    nome_provisorio = dados.get("nome_provisorio") or dados.get("nome") or "Sem nome"
    especie = dados.get("especie", "canino")
    sexo = dados.get("sexo", "indeterminado")
    idade_estimada = dados.get("idade_estimada", "")
    porte_peso = dados.get("porte_peso") or dados.get("porte") or ""
    pelagem = dados.get("pelagem", "")
    microchip = dados.get("microchip", "")
    data_hora_resgate = dados.get("data_hora_resgate") or datetime.now().strftime("%Y-%m-%dT%H:%M")
    endereco_resgate = dados.get("endereco_resgate") or dados.get("local") or ""
    motivo_recolhimento = dados.get("motivo_recolhimento", "")
    responsavel_transporte = dados.get("responsavel_transporte") or dados.get("responsavel") or ""

    try:
        escore_corporal = int(dados.get("escore_corporal", 3)) if dados.get("escore_corporal") else 3
    except:
        escore_corporal = 3

    try:
        temperatura_retal = float(dados.get("temperatura_retal", 38.5)) if dados.get("temperatura_retal") else 38.5
    except:
        temperatura_retal = 38.5

    presenca_parasitas = dados.get("presenca_parasitas", "nenhum")
    ferimentos_descricao = dados.get("ferimentos_descricao", "")
    destinacao_imediata = dados.get("destinacao_imediata") or dados.get("destino") or "baia-quarentena-a"
    status_sanitario = dados.get("status_sanitario") or "Em Quarentena (Triagem Realizada)"
    imagem_url = dados.get("imagem_url", "")
    data_registro = dados.get("data_registro") or datetime.now().strftime("%d/%m/%Y")

    sql_insert_prontuario = '''
        INSERT INTO prontuarios (
            nome_provisorio, especie, sexo, idade_estimada, porte_peso,
            pelagem, microchip, data_hora_resgate, endereco_resgate,
            motivo_recolhimento, responsavel_transporte, escore_corporal,
            temperatura_retal, presenca_parasitas, ferimentos_descricao,
            destinacao_imediata, status_sanitario, imagem_url, data_registro
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    '''
    cur.execute(sql_insert_prontuario, (
        nome_provisorio, especie, sexo, idade_estimada, porte_peso,
        pelagem, microchip, data_hora_resgate, endereco_resgate,
        motivo_recolhimento, responsavel_transporte, escore_corporal,
        temperatura_retal, presenca_parasitas, ferimentos_descricao,
        destinacao_imediata, status_sanitario, imagem_url, data_registro
    ))
    novo_id = cur.lastrowid

    try:
        cur.execute('''
            INSERT INTO animais (nome_provisorio_animal, especie_animal, sexo_animal, idade_animal, peso_animal, cor_pelagem_animal, microchip_animal)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (nome_provisorio, especie, sexo, idade_estimada, porte_peso, pelagem, microchip if microchip else None))
        cod_animal = cur.lastrowid

        cur.execute('''
            INSERT INTO resgates (cod_animal, data_horario_resgate, local_resgate, condicao_resgate, nome_resgatista_resgate)
            VALUES (?, ?, ?, ?, ?)
        ''', (cod_animal, data_hora_resgate, endereco_resgate, motivo_recolhimento, responsavel_transporte))
        cod_resgate = cur.lastrowid

        cur.execute('''
            INSERT INTO triagens (cod_resgate, escore_corporal_triagem, temperatura_triagem, ectoparasitas_triagem, lesoes_triagem, destino_triagem)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (cod_resgate, escore_corporal, temperatura_retal, presenca_parasitas, ferimentos_descricao, destinacao_imediata))
    except:
        pass

    con.commit()
    cur.close()
    con.close()
    return novo_id

def apagar(id_registro):
    con = conectar()
    cur = con.cursor()

    cur.execute("SELECT * FROM prontuarios WHERE id = ?", (id_registro,))
    item = cur.fetchone()
    if not item:
        cur.close()
        con.close()
        return False

    cur.execute("DELETE FROM prontuarios WHERE id = ?", (id_registro,))

    try:
        nome = item["nome_provisorio"]
        cur.execute("SELECT cod_animal FROM animais WHERE nome_provisorio_animal = ?", (nome,))
        animais_rows = cur.fetchall()
        for a in animais_rows:
            cod_a = a["cod_animal"]
            cur.execute("SELECT cod_resgate FROM resgates WHERE cod_animal = ?", (cod_a,))
            resg = cur.fetchall()
            for r in resg:
                cur.execute("DELETE FROM triagens WHERE cod_resgate = ?", (r["cod_resgate"],))
            cur.execute("DELETE FROM resgates WHERE cod_animal = ?", (cod_a,))
            cur.execute("DELETE FROM animais WHERE cod_animal = ?", (cod_a,))
    except:
        pass

    con.commit()
    cur.close()
    con.close()
    return True

def consultar(ordem="DESC"):
    con = conectar()
    cur = con.cursor()
    direcao = "DESC" if str(ordem).upper() == "DESC" else "ASC"
    cur.execute(f"SELECT * FROM prontuarios ORDER BY id {direcao}")
    resultado = [dict(r) for r in cur.fetchall()]
    cur.close()
    con.close()
    return resultado

def consultar_por_id(id_registro):
    con = conectar()
    cur = con.cursor()
    cur.execute("SELECT * FROM prontuarios WHERE id = ?", (id_registro,))
    linha = cur.fetchone()
    resultado = dict(linha) if linha else None
    cur.close()
    con.close()
    return resultado

def consultarFiltro(filtro_sql):
    con = conectar()
    cur = con.cursor()
    cur.execute(f"SELECT * FROM prontuarios WHERE {filtro_sql} ORDER BY id DESC")
    resultado = [dict(r) for r in cur.fetchall()]
    cur.close()
    con.close()
    return resultado

def consultarFiltroTermo(termo="", especie="", status=""):
    con = conectar()
    cur = con.cursor()

    condicoes = []
    valores = []

    if termo:
        t = f"%{termo}%"
        condicoes.append("(nome_provisorio LIKE ? OR endereco_resgate LIKE ? OR responsavel_transporte LIKE ? OR microchip LIKE ?)")
        valores.extend([t, t, t, t])

    if especie:
        condicoes.append("especie LIKE ?")
        valores.append(f"%{especie}%")

    if status:
        condicoes.append("status_sanitario LIKE ?")
        valores.append(f"%{status}%")

    sql = "SELECT * FROM prontuarios"
    if condicoes:
        sql += " WHERE " + " AND ".join(condicoes)
    sql += " ORDER BY id DESC"

    cur.execute(sql, valores)
    resultado = [dict(r) for r in cur.fetchall()]
    cur.close()
    con.close()
    return resultado

def alterar(id_registro, dados):
    con = conectar()
    cur = con.cursor()

    cur.execute("SELECT * FROM prontuarios WHERE id = ?", (id_registro,))
    existente = cur.fetchone()
    if not existente:
        cur.close()
        con.close()
        return False

    campos = [
        "nome_provisorio", "especie", "sexo", "idade_estimada", "porte_peso",
        "pelagem", "microchip", "data_hora_resgate", "endereco_resgate",
        "motivo_recolhimento", "responsavel_transporte", "escore_corporal",
        "temperatura_retal", "presenca_parasitas", "ferimentos_descricao",
        "destinacao_imediata", "status_sanitario", "imagem_url"
    ]

    set_clauses = []
    valores = []

    for campo in campos:
        if campo in dados and dados[campo] is not None:
            set_clauses.append(f"{campo} = ?")
            valores.append(dados[campo])

    if not set_clauses:
        cur.close()
        con.close()
        return False

    valores.append(id_registro)
    sql_update = f"UPDATE prontuarios SET {', '.join(set_clauses)} WHERE id = ?"
    cur.execute(sql_update, valores)

    con.commit()
    cur.close()
    con.close()
    return True
