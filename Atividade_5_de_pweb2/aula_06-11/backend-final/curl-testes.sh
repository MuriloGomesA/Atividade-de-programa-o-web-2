BASE=http://localhost:3000/api
JAR=cookies.txt

curl -i -X POST $BASE/auth/register -H "Content-Type: application/json" -d '{"email":"prof@uncisal.edu.br","senha":"senha123"}'
curl -i -c $JAR -X POST $BASE/auth/login -H "Content-Type: application/json" -d '{"email":"prof@uncisal.edu.br","senha":"senha123"}'
curl -i -b $JAR -X POST $BASE/tarefas -H "Content-Type: application/json" -d '{"titulo":"Tarefa com anexo"}'
curl -i -b $JAR -X POST $BASE/tarefas/1/anexo -F "arquivo=@/caminho/para/imagem.png"
curl -s -b $JAR $BASE/tarefas
