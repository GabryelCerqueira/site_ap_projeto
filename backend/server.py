from flask import Flask, request, jsonify
from flask_cors import CORS
import modulos

app = Flask(__name__)
CORS(app)

modulos.criar_tabelas()
modulos.popular_dados_iniciais()

@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "status": "online",
        "sistema": "Patas & Vidas - Backend API",
        "banco": "SQLite3 (BancodeDadosGrupo6AlexsanderPedroHenriqueMuriloLemosGabryelCerqueira.db)",
        "endpoints": {
            "listar_todos": "GET /resgates",
            "consultar_id": "GET /resgates/<id>",
            "cadastrar": "POST /resgates",
            "atualizar": "PUT /resgates/<id>",
            "excluir": "DELETE /resgates/<id>",
            "filtro": "GET /resgates/filtro?q=<termo>&especie=<especie>"
        }
    })

@app.route("/resgates", methods=["GET"])
def listar_resgates():
    try:
        ordem = request.args.get("ordem", "DESC")
        dados = modulos.consultar(ordem=ordem)
        return jsonify(dados), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@app.route("/resgates/<int:id_registro>", methods=["GET"])
def obter_resgate(id_registro):
    try:
        registro = modulos.consultar_por_id(id_registro)
        if registro:
            return jsonify(registro), 200
        return jsonify({"erro": "Prontuário não encontrado"}), 404
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@app.route("/resgates", methods=["POST"])
def cadastrar_resgate():
    try:
        if request.is_json:
            dados = request.get_json()
        elif request.form:
            dados = request.form.to_dict()
        else:
            dados = request.args.to_dict()

        if not dados:
            return jsonify({"erro": "Nenhum dado recebido no formulário"}), 400

        novo_id = modulos.inserir(dados)
        return jsonify({
            "mensagem": "Prontuário gravado com sucesso no banco de dados!",
            "id": novo_id
        }), 201
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@app.route("/resgates/<int:id_registro>", methods=["DELETE"])
def excluir_resgate(id_registro):
    try:
        sucesso = modulos.apagar(id_registro)
        if sucesso:
            return jsonify({
                "mensagem": f"Prontuário #{id_registro} excluído com sucesso do banco de dados!",
                "id": id_registro
            }), 200
        return jsonify({"erro": "Prontuário não encontrado para exclusão"}), 404
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@app.route("/resgates/<int:id_registro>", methods=["PUT", "POST"])
def atualizar_resgate(id_registro):
    try:
        if request.is_json:
            dados = request.get_json()
        elif request.form:
            dados = request.form.to_dict()
        else:
            dados = request.args.to_dict()

        sucesso = modulos.alterar(id_registro, dados)
        if sucesso:
            return jsonify({
                "mensagem": f"Prontuário #{id_registro} atualizado com sucesso!",
                "id": id_registro
            }), 200
        return jsonify({"erro": "Prontuário não encontrado para alteração"}), 404
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@app.route("/resgates/filtro", methods=["GET"])
def filtrar_resgates():
    try:
        termo = request.args.get("q", "")
        especie = request.args.get("especie", "")
        status = request.args.get("status", "")
        resultados = modulos.consultarFiltroTermo(termo=termo, especie=especie, status=status)
        return jsonify(resultados), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@app.route("/consultar", methods=["GET"])
def rota_consultar_slide():
    dados = modulos.consultar()
    return jsonify(dados), 200

@app.route("/inserir", methods=["GET", "POST"])
def rota_inserir_slide():
    dados = request.get_json() if request.is_json else (request.form.to_dict() or request.args.to_dict())
    novo_id = modulos.inserir(dados)
    return jsonify({"mensagem": "Inserido com sucesso!", "id": novo_id}), 201

@app.route("/apagar", methods=["GET", "DELETE"])
def rota_apagar_slide():
    id_registro = request.args.get("id", type=int)
    if not id_registro:
        return jsonify({"erro": "Parâmetro 'id' é obrigatório"}), 400
    sucesso = modulos.apagar(id_registro)
    return jsonify({"sucesso": sucesso}), 200

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=8000, debug=True)
