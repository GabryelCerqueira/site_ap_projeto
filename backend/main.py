import sys
import modulos

def exibir_menu():
    print("\n" + "=" * 60)
    print("      PATAS & VIDAS - SISTEMA DE RESGATES E TRIAGEM")
    print("=" * 60)
    print(" [1] - Inserir novo animal / resgate")
    print(" [2] - Consultar todos os registros cadastrados")
    print(" [3] - Consultar com filtro SQL (ex: especie LIKE '%canino%')")
    print(" [4] - Consultar registro por ID")
    print(" [5] - Alterar dados de um registro")
    print(" [6] - Apagar registro por ID")
    print(" [0] - Sair")
    print("=" * 60)

def menu_inserir():
    print("\n--- [1] CADASTRAR NOVO ANIMAL NO BANCO ---")
    nome = input("Nome provisório do animal: ").strip()
    if not nome:
        print("O nome do animal é obrigatório!")
        return

    print("Espécie: 1 - Canino | 2 - Felino | 3 - Outro")
    esp_opcao = input("Opção (padrão 1): ").strip()
    especie = "felino" if esp_opcao == "2" else ("outra" if esp_opcao == "3" else "canino")

    print("Sexo: 1 - Macho | 2 - Fêmea | 3 - Indeterminado")
    sexo_opcao = input("Opção (padrão 1): ").strip()
    sexo = "femea" if sexo_opcao == "2" else ("indeterminado" if sexo_opcao == "3" else "macho")

    idade = input("Idade estimada (ex: filhote, adulto, idoso): ").strip() or "adulto"
    porte = input("Porte / Peso (ex: Médio 12kg): ").strip() or "Médio"
    pelagem = input("Pelagem (ex: Curta, preta): ").strip() or "Curta"
    microchip = input("Microchip (opcional): ").strip()
    local = input("Local / Endereço do resgate: ").strip() or "Via Pública"
    motivo = input("Motivo (ex: abandono-rua, atropelamento): ").strip() or "abandono-rua"
    responsavel = input("Resgatista responsável: ").strip() or "Voluntário"

    try:
        temp = float(input("Temperatura retal °C (ex: 38.5): ").strip() or "38.5")
    except ValueError:
        temp = 38.5

    try:
        escore = int(input("Escore corporal (1 a 5, padrão 3): ").strip() or "3")
    except ValueError:
        escore = 3

    parasitas = input("Parasitas visíveis (nenhum/pulgas/carrapatos): ").strip() or "nenhum"
    ferimentos = input("Descrição de ferimentos/lesões: ").strip() or "Sem lesões aparentes"
    destino = input("Destinação (ex: Abrigo Central, Baia 01): ").strip() or "Baia Quarentena"
    status = input("Status sanitário (padrão: Em Quarentena): ").strip() or "Em Quarentena"

    dados = {
        "nome_provisorio": nome,
        "especie": especie,
        "sexo": sexo,
        "idade_estimada": idade,
        "porte_peso": porte,
        "pelagem": pelagem,
        "microchip": microchip,
        "endereco_resgate": local,
        "motivo_recolhimento": motivo,
        "responsavel_transporte": responsavel,
        "temperatura_retal": temp,
        "escore_corporal": escore,
        "presenca_parasitas": parasitas,
        "ferimentos_descricao": ferimentos,
        "destinacao_imediata": destino,
        "status_sanitario": status
    }

    novo_id = modulos.inserir(dados)
    print(f"\nRegistro #{novo_id} gravado com sucesso no banco SQLite!")

def menu_consultar():
    print("\n--- [2] CONSULTAR TODOS OS REGISTROS ---")
    registros = modulos.consultar()
    if not registros:
        print("Nenhum registro encontrado no banco de dados.")
        return

    print(f"Total de registros: {len(registros)}\n")
    print(f"{'ID':<6} | {'Nome':<15} | {'Espécie':<10} | {'Porte/Peso':<18} | {'Status Sanitário':<35} | {'Local Resgate'}")
    print("-" * 115)
    for r in registros:
        print(f"#{r['id']:<5} | {r['nome_provisorio']:<15} | {r['especie']:<10} | {str(r['porte_peso']):<18} | {str(r['status_sanitario']):<35} | {r['endereco_resgate']}")

def menu_consultar_filtro():
    print("\n--- [3] CONSULTAR COM FILTRO SQL ---")
    filtro = input("Digite a cláusula WHERE do filtro (ex: especie LIKE '%felino%'): ").strip()
    if not filtro:
        print("Filtro não informado.")
        return

    try:
        registros = modulos.consultarFiltro(filtro)
        if not registros:
            print("Nenhum registro encontrado para o filtro informado.")
            return

        print(f"\nEncontrados {len(registros)} registro(s):")
        for r in registros:
            print(f"#{r['id']} - {r['nome_provisorio']} ({r['especie']}, {r['porte_peso']}) | Temp: {r['temperatura_retal']}°C | Status: {r['status_sanitario']}")
    except Exception as err:
        print(f"Erro ao executar filtro SQL: {err}")

def menu_consultar_id():
    print("\n--- [4] CONSULTAR REGISTRO POR ID ---")
    try:
        id_reg = int(input("Informe o ID: ").strip())
        r = modulos.consultar_por_id(id_reg)
        if not r:
            print(f"Registro #{id_reg} não encontrado.")
            return

        print("\n" + "=" * 50)
        print(f"PRONTUÁRIO #{r['id']} - {r['nome_provisorio'].upper()}")
        print("=" * 50)
        for chave, valor in r.items():
            print(f"  {chave:<25}: {valor}")
        print("=" * 50)
    except ValueError:
        print("ID inválido. Digite um número inteiro.")

def menu_alterar():
    print("\n--- [5] ALTERAR DADOS DO REGISTRO ---")
    try:
        id_reg = int(input("Informe o ID a ser alterado: ").strip())
        r = modulos.consultar_por_id(id_reg)
        if not r:
            print(f"Registro #{id_reg} não encontrado.")
            return

        print(f"Alterando #{id_reg} ({r['nome_provisorio']}). Deixe em branco para manter o valor atual.")
        novo_nome = input(f"Nome provisório [{r['nome_provisorio']}]: ").strip()
        novo_status = input(f"Status sanitário [{r['status_sanitario']}]: ").strip()
        nova_temp = input(f"Temperatura retal [{r['temperatura_retal']}]: ").strip()
        novo_destino = input(f"Destinação [{r['destinacao_imediata']}]: ").strip()

        alteracoes = {}
        if novo_nome:
            alteracoes["nome_provisorio"] = novo_nome
        if novo_status:
            alteracoes["status_sanitario"] = novo_status
        if nova_temp:
            alteracoes["temperatura_retal"] = float(nova_temp)
        if novo_destino:
            alteracoes["destinacao_imediata"] = novo_destino

        if alteracoes:
            sucesso = modulos.alterar(id_reg, alteracoes)
            if sucesso:
                print(f"Registro #{id_reg} atualizado com sucesso!")
            else:
                print("Falha ao atualizar o registro.")
        else:
            print("Nenhuma alteração informada.")
    except Exception as err:
        print(f"Erro: {err}")

def menu_apagar():
    print("\n--- [6] APAGAR REGISTRO POR ID ---")
    try:
        id_reg = int(input("Informe o ID a ser apagado: ").strip())
        confirmacao = input(f"Tem certeza que deseja apagar o registro #{id_reg}? (S/N): ").strip().upper()
        if confirmacao == "S":
            sucesso = modulos.apagar(id_reg)
            if sucesso:
                print(f"Registro #{id_reg} apagado com sucesso do banco SQLite!")
            else:
                print(f"Registro #{id_reg} não encontrado.")
        else:
            print("Operação cancelada.")
    except ValueError:
        print("ID inválido.")

def main():
    modulos.criar_tabelas()
    modulos.popular_dados_iniciais()

    while True:
        exibir_menu()
        opcao = input("Escolha uma opção (0 a 6): ").strip()
        if opcao == "1":
            menu_inserir()
        elif opcao == "2":
            menu_consultar()
        elif opcao == "3":
            menu_consultar_filtro()
        elif opcao == "4":
            menu_consultar_id()
        elif opcao == "5":
            menu_alterar()
        elif opcao == "6":
            menu_apagar()
        elif opcao == "0":
            print("\nEncerrando o sistema.\n")
            break
        else:
            print("Opção inválida. Tente novamente.")

if __name__ == "__main__":
    main()
